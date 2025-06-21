import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Image, Alert, ScrollView, Platform, ActivityIndicator
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { db, storage, auth } from '../firebase';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth } from "firebase/auth";

const EtkinlikEkle = ({ navigation }) => {
  const [eventName, setEventName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [time, setTime] = useState(new Date());
  const [location, setLocation] = useState('');
  const [coords, setCoords] = useState(null);
  const [image, setImage] = useState(null);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    const getInitialCoords = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        setCoords(loc.coords);
      }
    };
    getInitialCoords();
  }, []);

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

  const handleLocationChange = async (text) => {
    setLocation(text);
    if (text.length < 3) {
      setLocationSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(text)}${
          coords ? `&lat=${coords.latitude}&lon=${coords.longitude}` : ''
        }`,
        {
          headers: {
            'User-Agent': 'ReactNativeApp/1.0 (youremail@example.com)',
          },
        }
      );
      const data = await response.json();
      setLocationSuggestions(data);
    } catch (err) {
      console.error('Adres alınamadı:', err);
      setLocationSuggestions([]);
    }
  };

  const handleSelectLocation = (item) => {
    setLocation(item.display_name);
    setLocationSuggestions([]);
  };

  const handleUseCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('İzin Gerekli', 'Konum izni verilmedi');
        return;
      }

      const locationObj = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = locationObj.coords;
      setCoords({ latitude, longitude });

      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
        {
          headers: {
            'User-Agent': 'ReactNativeApp/1.0 (youremail@example.com)',
          },
        }
      );

      const data = await response.json();
      if (data.display_name) {
        setLocation(data.display_name);
        setLocationSuggestions([]);
      } else {
        Alert.alert('Hata', 'Adres alınamadı');
      }
    } catch (error) {
      console.error('Konum alınamadı:', error);
      Alert.alert('Hata', 'Konum alınırken bir hata oluştu');
    }
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const newDate = selectedDate;
      newDate.setHours(time.getHours(), time.getMinutes());
      setDate(newDate);
      setShowTimePicker(true); // Show time picker after date selection
    }
  };

  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const newDate = date;
      newDate.setHours(selectedTime.getHours(), selectedTime.getMinutes());
      setTime(selectedTime);
      setDate(newDate);
    }
  };

  const formatDateTime = (date) => {
    return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}.${date.getFullYear()} ${date
      .getHours()
      .toString()
      .padStart(2, '0')}.${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const handleAddEvent = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (!eventName || !description || !date || !location) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun.");
      setIsSubmitting(false);
      return;
    }

    try {
      let imageUrl = null;
      if (image) {
        const response = await fetch(image);
        const blob = await response.blob();
        const storageRef = ref(storage, `event_images/${Date.now()}.jpg`);
        await uploadBytes(storageRef, blob);
        imageUrl = await getDownloadURL(storageRef);
      }

      const auth = getAuth();
      const user = auth.currentUser;
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const isAdmin = userDoc.data()?.role === 'admin';

      const docRef = await addDoc(collection(db, "events"), {
        eventName,
        description,
        date: formatDateTime(date),
        location,
        imageUrl,
        organizerId: user.uid,
        isAdmin,
        organizer: isAdmin ? "Fonity" : null,
        timestamp: new Date(),
      });

      Alert.alert("Başarılı", "Etkinlik başarıyla eklendi!");
      navigation.goBack();
    } catch (error) {
      console.error("Error adding event:", error);
      Alert.alert("Hata", "Etkinlik eklenirken bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Yeni Etkinlik Ekle</Text>
      <TextInput
        style={styles.input}
        placeholder="Etkinlik Başlığı"
        value={eventName}
        onChangeText={setEventName}
      />
      <TextInput
        style={styles.input}
        placeholder="Etkinlik Açıklaması"
        value={description}
        onChangeText={setDescription}
      />
      
      <View style={styles.dateTimeContainer}>
        <TouchableOpacity 
          style={[styles.input, styles.dateTimeInput]} 
          onPress={() => setShowDatePicker(true)}
        >
          <Text>{formatDateTime(date)}</Text>
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onDateChange}
          minimumDate={new Date()}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={onTimeChange}
        />
      )}
      
      <TextInput
        style={styles.input}
        placeholder="Etkinlik Konumu"
        value={location}
        onChangeText={handleLocationChange}
      />
      <TouchableOpacity style={styles.locationButton} onPress={handleUseCurrentLocation}>
        <Text style={styles.locationButtonText}>Mevcut Konumumu Kullan</Text>
      </TouchableOpacity>

      {locationSuggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          {locationSuggestions.map((item) => (
            <TouchableOpacity key={item.place_id} onPress={() => handleSelectLocation(item)}>
              <Text style={styles.suggestionItem}>{item.display_name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        <Text style={styles.imagePickerText}>Fotoğraf Seç</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={styles.imagePreview} />}
      <TouchableOpacity 
        style={[styles.addButton, isSubmitting && styles.disabledButton]} 
        onPress={handleAddEvent}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.addButtonText}>Etkinliği Kaydet</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#65558F' },
  input: {
    height: 50, borderWidth: 1, borderColor: '#ccc', borderRadius: 10,
    paddingHorizontal: 15, marginBottom: 10
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    height: 50,
    width: '100%',
  },
  dateTimeInput: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
  },
  suggestionsContainer: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  locationButton: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  locationButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
   imagePicker: {
    backgroundColor: '#65558F',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10
  },
  imagePickerText: { color: '#FFF', fontWeight: 'bold' },
  imagePreview: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 10
  },
  addButton: {
    backgroundColor: '#65558F',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center'
  },
  disabledButton: {
    backgroundColor: '#aaa',
  },
  addButtonText: { color: '#FFF', fontWeight: 'bold' },
});

export default EtkinlikEkle;

