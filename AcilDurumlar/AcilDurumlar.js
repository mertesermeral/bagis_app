import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Image } from 'react-native';
import { db } from '../firebase';
import { doc, getDoc, collection, addDoc, getDocs } from "firebase/firestore";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { auth } from '../firebase'; // 🔥 auth'u import etmeyi unutma!

const BagisciAcilDurumlar = ({ navigation }) => {
  const [emergencies, setEmergencies] = useState([]);
  const [userRole, setUserRole] = useState(null);
  
  useEffect(() => {

    const fetchUserRole = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setUserRole(userDoc.data().role);
          } else {
            setUserRole("receiver"); // Varsayılan değer
          }
        }
      } catch (error) {
        console.error("Kullanıcı rolü alınırken hata oluştu:", error);
        setUserRole("receiver"); // Hata durumunda varsayılan olarak receiver ata
      }
    };

    const fetchEmergencies = async () => {
      const querySnapshot = await getDocs(collection(db, 'emergencies'));
      const emergencyList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEmergencies(emergencyList);
    };
    fetchEmergencies();
    fetchUserRole();

  }, []);

  return (
    <SafeAreaView style={styles.container}>
      
     

      <ScrollView style={styles.content}>
        {emergencies.map((emergency) => (
          <View key={emergency.id} style={styles.card}>
            <Image source={{ uri: emergency.imageUrl }} style={styles.cardImage} />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{emergency.requestTitle}</Text>
              <Text style={styles.cardSubtitle}>{emergency.name}</Text>
              <Text style={styles.cardDetail}>{emergency.description}</Text>
              <TouchableOpacity 
                style={styles.detailButton} 
                onPress={() => navigation.navigate('AcilDurumDetay', { emergency })}>
                <Text style={styles.detailButtonText}>Detayları Gör</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.createRequestButton} onPress={() => navigation.navigate('AcilDurumTalebiOlustur')}>
        <Text style={styles.createRequestButtonText}>Acil Durum Talebi Oluştur</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('BagisciAnaMenu')}>
          <Icon name="home" size={24} color="#65558F" />
          <Text style={styles.footerButtonText}>Ana Menü</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('BagisciBagislarim')}>
          <Icon name="donut-large" size={24} color="#65558F" />
          <Text style={styles.footerButtonText}>Bağışlarım</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('BagisciProfilim')}>
          <Icon name="person" size={24} color="#65558F" />
          <Text style={styles.footerButtonText}>Profilim</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { backgroundColor: '#FEF7FF', paddingVertical: 30, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  headerText: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: '#65558F' },
  tabContainer: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#FEF7FF', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  tabButton: { flex: 1, alignItems: 'center', paddingVertical: 10 },
  activeTab: { borderBottomWidth: 2, borderBottomColor: '#65558F' },
  tabText: { fontSize: 14, fontWeight: '500', color: '#65558F' },
  activeTabText: { color: '#65558F', fontWeight: 'bold' },
  content: { flex: 1, padding: 16 },
  card: { flexDirection: 'row', marginBottom: 16, backgroundColor: '#fff', borderRadius: 8, elevation: 2, padding: 10 },
  cardImage: { width: 50, height: 50, borderRadius: 25, marginRight: 16 },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  cardSubtitle: { fontSize: 14, color: '#555', marginVertical: 4 },
  cardDetail: { fontSize: 12, color: '#777', marginBottom: 8 },
  detailButton: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#65558F', borderRadius: 6, marginTop: 5 },
  detailButtonText: { fontSize: 14, color: '#FFF', fontWeight: 'bold' },
  createRequestButton: { margin: 16, padding: 16, backgroundColor: '#333', borderRadius: 8, alignItems: 'center' },
  createRequestButtonText: { fontSize: 16, color: '#fff', fontWeight: 'bold' },
  footer: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#FEF7FF', paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#ddd' },
  footerButton: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 5 },
  footerButtonText: { fontSize: 12, color: '#65558F', marginTop: 4 },
});

export default BagisciAcilDurumlar;