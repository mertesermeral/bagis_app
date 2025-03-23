import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Alert, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { db, storage, auth } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import MaskInput from 'react-native-mask-input';

const BagisciAcilDurumTalebiOlustur = ({ navigation }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [requestTitle, setRequestTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [requestType, setRequestType] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [disasterLocation, setDisasterLocation] = useState('');

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
    const user = auth.currentUser;

    if (!user) {
      Alert.alert("Hata", "Lütfen giriş yapın.");
      return;
    }

    // Temel alan kontrolü
    if (!name || !phone || !requestTitle || !description || !requestType) {
      Alert.alert("Hata", "Lütfen zorunlu alanları doldurun: Ad Soyad, İletişim Numarası, Talep Adı, Açıklama ve Talep Türü!");
      return;
    }

    // Talep türüne göre özel kontroller
    if (requestType === 'Afet' && !disasterLocation) {
      Alert.alert("Hata", "Lütfen afet bölgesi konumunu girin!");
      return;
    }

    if (requestType !== 'Diğer' && !additionalInfo) {
      Alert.alert("Hata", "Lütfen ek bilgi alanını doldurun!");
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

      await addDoc(collection(db, "emergencies"), {
        userId: user.uid, // Kullanıcı kimliğini kaydet
        name,
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
        <Text style={styles.label}>Ad Soyad</Text>
        <TextInput style={styles.input} placeholder="Ad Soyad" value={name} onChangeText={setName} />

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

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Talep Oluştur</Text>
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
  submitButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
});

export default BagisciAcilDurumTalebiOlustur;
