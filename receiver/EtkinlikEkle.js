import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

const EtkinlikEkle = ({ navigation }) => {
  const [etkinlikAdi, setEtkinlikAdi] = useState('');
  const [duzenleyen, setDuzenleyen] = useState('');
  const [aciklama, setAciklama] = useState('');
  const [tarih, setTarih] = useState('');
  const [imageUri, setImageUri] = useState(null);

  const selectImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, response => {
      if (!response.didCancel) {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  const handleSubmit = async () => {
    if (!etkinlikAdi || !duzenleyen || !aciklama || !tarih) {
      alert("Tüm alanları doldurun!");
      return;
    }

    let imageUrl = "";
    if (imageUri) {
      const imageRef = storage().ref(`etkinlikler/${Date.now()}.jpg`);
      await imageRef.putFile(imageUri);
      imageUrl = await imageRef.getDownloadURL();
    }

    await firestore().collection('etkinlikler').add({
      etkinlikAdi,
      duzenleyen,
      aciklama,
      tarih,
      imageUrl
    });

    alert("Etkinlik eklendi!");
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Etkinlik Adı:</Text>
      <TextInput style={styles.input} value={etkinlikAdi} onChangeText={setEtkinlikAdi} />

      <Text style={styles.label}>Düzenleyen:</Text>
      <TextInput style={styles.input} value={duzenleyen} onChangeText={setDuzenleyen} />

      <Text style={styles.label}>Açıklama:</Text>
      <TextInput style={styles.input} value={aciklama} onChangeText={setAciklama} multiline />

      <Text style={styles.label}>Tarih:</Text>
      <TextInput style={styles.input} value={tarih} onChangeText={setTarih} />

      <TouchableOpacity style={styles.imagePicker} onPress={selectImage}>
        <Text style={styles.imagePickerText}>Fotoğraf Seç</Text>
      </TouchableOpacity>
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Etkinlik Ekle</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  label: { fontSize: 16, fontWeight: 'bold', marginTop: 10 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 5, marginTop: 5 },
  imagePicker: { backgroundColor: '#65558F', padding: 10, borderRadius: 5, marginTop: 10, alignItems: 'center' },
  imagePickerText: { color: '#fff', fontWeight: 'bold' },
  image: { width: 100, height: 100, borderRadius: 10, marginTop: 10 },
  submitButton: { backgroundColor: '#28A745', padding: 12, borderRadius: 5, alignItems: 'center', marginTop: 20 },
  submitButtonText: { color: '#fff', fontWeight: 'bold' }
});

export default EtkinlikEkle;
