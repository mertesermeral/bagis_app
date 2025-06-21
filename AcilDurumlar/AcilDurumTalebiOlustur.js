import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Alert, Image, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { db, storage, auth } from '../firebase';
import { collection, addDoc, getDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import MaskInput from 'react-native-mask-input';
import { useAuth } from '../AuthContext'; // Changed from '../AuthProvider' to '../AuthContext'

const BagisciAcilDurumTalebiOlustur = ({ navigation }) => {
  const { role } = useAuth();
  const [name, setName] = useState(role === 'admin' ? 'Fonity' : '');
  const [phone, setPhone] = useState('');
  const [requestTitle, setRequestTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [requestType, setRequestType] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [disasterLocation, setDisasterLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            // Admin kontrolü ve otomatik Fonity ismi
            const fullName = role === 'admin' ? 'Fonity' : `${userData.firstName} ${userData.lastName}`;
            setName(fullName);
          }
        }
      } catch (error) {
        console.error("Kullanıcı bilgileri alınamadı:", error);
      }
    };

    fetchUserData();
  }, [role]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const user = auth.currentUser;

    if (!user) {
      Alert.alert("Hata", "Lütfen giriş yapın.");
      setIsSubmitting(false);
      return;
    }

    // Admin kontrolü ve otomatik Fonity ismi
    const submissionName = role === 'admin' ? 'Fonity' : name;

    // Temel alan kontrolü - admin için isim kontrolü kaldırıldı
    if ((role !== 'admin' && !name) || !phone || !requestTitle || !description || !requestType) {
      Alert.alert("Hata", "Lütfen tüm zorunlu alanları doldurun!");
      setIsSubmitting(false);
      return;
    }

    // Talep türüne göre özel kontroller
    if (requestType === 'Afet' && !disasterLocation) {
      Alert.alert("Hata", "Lütfen afet bölgesi konumunu girin!");
      setIsSubmitting(false);
      return;
    }

    if (requestType !== 'Diğer' && !additionalInfo) {
      Alert.alert("Hata", "Lütfen ek bilgi alanını doldurun!");
      setIsSubmitting(false);
      return;
    }

    try {
      let imageUrl = null;
      if (image) {
        const response = await fetch(image);
        const blob = await response.blob();
        const storageRef = ref(storage, `emergency_images/${Date.now()}.jpg`);
        await uploadBytes(storageRef, blob);
        imageUrl = await getDownloadURL(storageRef);
      }

      const docRef = await addDoc(collection(db, "emergencies"), {
        userId: user.uid,
        name: submissionName, // Değiştirilmiş isim kullanılıyor
        isAdmin: role === 'admin', // Admin bilgisi ekleniyor
        phone,
        requestTitle,
        description,
        requestType,
        additionalInfo,
        disasterLocation,
        imageUrl,
        timestamp: new Date(),
      });

      Alert.alert("Başarılı", "Acil durum talebiniz eklendi!");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Hata", "Bir hata oluştu, tekrar deneyin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const turkishPhoneMask = [
    '(',
    /\d/,
    /\d/,
    /\d/,
    ')',
    ' ',
    /\d/,
    /\d/,
    /\d/,
    ' ',
    /\d/,
    /\d/,
    ' ',
    /\d/,
    /\d/
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Acil Durum Talebi Oluştur</Text>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Ad Soyad alanını sadece admin değilse göster */}
        {role !== 'admin' && (
          <>
            <Text style={styles.label}>Ad Soyad</Text>
            <TextInput 
              style={[styles.input, { backgroundColor: '#f5f5f5' }]} 
              value={name} 
              editable={false}
            />
          </>
        )}
        
        <Text style={styles.label}>İletişim Numarası</Text>
        <MaskInput
          style={styles.input}
          placeholder="(5XX) XXX XX XX"
          keyboardType="numeric"
          value={phone}
          onChangeText={(masked, unmasked) => setPhone(masked)}
          mask={turkishPhoneMask}
        />

       <Text style={styles.label}>Talep Adı</Text>
        <TextInput style={styles.input} placeholder="Talep Adı" value={requestTitle} onChangeText={setRequestTitle} /> 

        <Text style={styles.label}>Talep Türü</Text>
        <Picker
          selectedValue={requestType}
          style={styles.picker}
          onValueChange={(itemValue) => setRequestType(itemValue)}>
          <Picker.Item label="Seçiniz" value="" />
          <Picker.Item label="Acil Kan Bağışı" value="Acil Kan Bağışı" />
          <Picker.Item label="Afet Yardımı" value="Afet" />
          <Picker.Item label="Hayati İlaç" value="Hayati İlaç" />
          <Picker.Item label="Diğer" value="Diğer" />
        </Picker>

        {requestType && requestType !== 'Diğer' && (
          <>
            <Text style={styles.label}>Ek Bilgi</Text>
            <TextInput
              style={styles.input}
              placeholder={
                requestType === 'Acil Kan Bağışı' ? 'İhtiyaç duyulan kan grubu' :
                requestType === 'Afet' ? 'Gerekli malzemeleri yazın' :
                'İlacın adını yazın'
              }
              value={additionalInfo}
              onChangeText={setAdditionalInfo}
            />
          </>
        )}

        {requestType === 'Afet' && (
          <>
            <Text style={styles.label}>Afet Bölgesi Konumu</Text>
            <TextInput
              style={styles.input}
              placeholder="Afet bölgesinin konumunu girin"
              value={disasterLocation}
              onChangeText={setDisasterLocation}
            />
          </>
        )}

        <Text style={styles.label}>Talep Açıklaması</Text>
        <TextInput style={styles.input} placeholder="Talep Açıklaması" value={description} onChangeText={setDescription} multiline />

        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          <Text style={styles.imagePickerText}>Fotoğraf Seç</Text>
        </TouchableOpacity>
        {image && <Image source={{ uri: image }} style={styles.imagePreview} />}

        <TouchableOpacity 
          style={[styles.submitButton, isSubmitting && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Talep Oluştur</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', padding: 20 },
  header: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginTop: 30, marginBottom: 20, color: '#6A1B9A' },
  content: { flexGrow: 1, paddingBottom: 30 },
  label: { fontSize: 16, fontWeight: 'bold', color: '#65558F', marginBottom: 5 },
  input: { height: 50, borderWidth: 1, borderColor: '#65558F', backgroundColor: '#FFF', borderRadius: 12, paddingHorizontal: 15, marginBottom: 15, fontSize: 14 },
  picker: { height: 50, backgroundColor: '#FFF', borderRadius: 12, marginBottom: 15 },
  imagePicker: { backgroundColor: '#65558F', padding: 15, borderRadius: 12, alignItems: 'center', marginBottom: 15 },
  imagePickerText: { color: '#FFF', fontWeight: 'bold' },
  imagePreview: { width: '100%', height: 200, resizeMode: 'cover', borderRadius: 12, marginBottom: 15 },
  submitButton: { backgroundColor: '#65558F', padding: 15, borderRadius: 12, alignItems: 'center' },
  disabledButton: { backgroundColor: '#ccc' },
  submitButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
});

export default BagisciAcilDurumTalebiOlustur;
