import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { db, storage } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const EtkinlikEkle = ({ navigation }) => {
  const [eventName, setEventName] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState(null);

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

  const handleAddEvent = async () => {
    if (!eventName || !organizer || !description || !date || !location || !image) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun!');
      return;
    }
    try {
      const response = await fetch(image);
      const blob = await response.blob();
      const storageRef = ref(storage, `event_images/${Date.now()}.jpg`);
      await uploadBytes(storageRef, blob);
      const imageUrl = await getDownloadURL(storageRef);

      await addDoc(collection(db, 'events'), {
        eventName,
        organizer,
        description,
        date,
        location,
        imageUrl,
      });

      Alert.alert('Başarılı', 'Etkinlik başarıyla eklendi!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Hata', 'Bir hata oluştu, tekrar deneyin.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Yeni Etkinlik Ekle</Text>
      <TextInput
        style={styles.input}
        placeholder='Etkinlik Başlığı'
        value={eventName}
        onChangeText={setEventName}
      />
      <TextInput
        style={styles.input}
        placeholder='Düzenleyen Adı Soyadı'
        value={organizer}
        onChangeText={setOrganizer}
      />
      <TextInput
        style={styles.input}
        placeholder='Etkinlik Açıklaması'
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder='Etkinlik Tarihi (GG.AA.YYYY)'
        value={date}
        onChangeText={setDate}
      />
      <TextInput
        style={styles.input}
        placeholder='Etkinlik Konumu'
        value={location}
        onChangeText={setLocation}
      />
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        <Text style={styles.imagePickerText}>Fotoğraf Seç</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={styles.imagePreview} />}
      <TouchableOpacity style={styles.addButton} onPress={handleAddEvent}>
        <Text style={styles.addButtonText}>Etkinliği Kaydet</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#65558F',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  imagePicker: {
    backgroundColor: '#65558F',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  imagePickerText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#65558F',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default EtkinlikEkle;
