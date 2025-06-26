import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, ScrollView, Alert, Linking } from 'react-native';
import { db, auth, storage } from '../firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

const BagisciAcilDurumDetay = ({ route, navigation }) => {
  const { emergency } = route.params;
  const user = auth.currentUser; // Giriş yapan kullanıcı bilgilerini al

  const handleDelete = async () => {
    if (!user || user.uid !== emergency.userId) {
      Alert.alert("Yetkisiz İşlem", "Bu talebi sadece oluşturan kişi kapatabilir.");
      return;
    }

    Alert.alert(
      "Talebi Kapat",
      "Bu talebi kapatmak istediğinize emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Evet",
          onPress: async () => {
            try {
              // Önce Firestore'dan dökümanı sil
              await deleteDoc(doc(db, "emergencies", emergency.id));
              
              // Eğer fotoğraf varsa, Storage'dan da sil
              if (emergency.imageUrl) {
                const imageRef = ref(storage, emergency.imageUrl);
                try {
                  await deleteObject(imageRef);
                } catch (error) {
                  console.log("Fotoğraf silinirken hata:", error);
                }
              }
              
              Alert.alert("Başarılı", "Talep başarıyla kapatıldı.");
              navigation.goBack();
            } catch (error) {
              Alert.alert("Hata", "Talep kapatılırken bir hata oluştu. Tekrar deneyin.");
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      
      
            

      <ScrollView contentContainerStyle={styles.content}>
        <Image source={{ uri: emergency.imageUrl }} style={styles.image} />
        <Text style={styles.label}>Talep Eden:</Text>
        <Text style={styles.text}>{emergency.name}</Text>

        <Text style={styles.label}>İletişim Numarası:</Text>
        <Text style={styles.text}>{emergency.phone}</Text>

        <Text style={styles.label}>Talep Türü:</Text>
        <Text style={styles.text}>{emergency.requestType}</Text>

        {emergency.requestType !== 'Diğer' && (
          <>
            <Text style={styles.label}>Ek Bilgi:</Text>
            <Text style={styles.text}>{emergency.additionalInfo}</Text>
          </>
        )}

        {emergency.requestType === 'Afet' && (
          <>
            <Text style={styles.label}>Afet Bölgesi Konumu:</Text>
            <TouchableOpacity 
              onPress={() => {
                const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(emergency.disasterLocation)}`;
                Linking.openURL(mapUrl);
              }}
            >
              <Text style={[styles.text, styles.locationText]}>
                📍 {emergency.disasterLocation}
              </Text>
            </TouchableOpacity>
          </>
        )}

        <Text style={styles.label}>Talep Açıklaması:</Text>
        <Text style={styles.text}>{emergency.description}</Text>

        {user && user.uid === emergency.userId && (
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>Talebi Kapat</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

     
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  tabContainer: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#FEF7FF', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  tabButton: { flex: 1, alignItems: 'center', paddingVertical: 10 },
  activeTab: { borderBottomWidth: 2, borderBottomColor: '#65558F' },
  headerText: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: '#65558F' },
  tabText: { fontSize: 14, fontWeight: '500', color: '#65558F' },
  activeTabText: { color: '#65558F', fontWeight: 'bold' },

  headerContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EDE7F6', paddingVertical: 30, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#CCC' },
  backIcon: { marginRight: 10 },
  header: { backgroundColor: '#FEF7FF', paddingVertical: 30, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  content: { flexGrow: 1, padding: 20 },
  image: { width: '100%', height: 250, borderRadius: 12, marginBottom: 20, resizeMode: 'cover' },
  label: { fontSize: 16, fontWeight: 'bold', color: '#65558F', marginBottom: 5 },
  text: { fontSize: 14, color: '#333', marginBottom: 15 },
  deleteButton: { backgroundColor: '#D32F2F', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  deleteButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  footer: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#FEF7FF', paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#ddd' },
  footerButton: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 5 },
  footerButtonText: { fontSize: 12, color: '#65558F', marginTop: 4 },
  locationText: {
    textDecorationLine: 'underline',
    color: '#65558F'
  },
});

export default BagisciAcilDurumDetay;
