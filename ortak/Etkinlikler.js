//Bagis Alan Etkinlikler Sayfasi

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Image, Modal, TextInput, Button } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { db, storage } from '../firebase.js';
import { doc, getDoc, collection, addDoc, getDocs } from "firebase/firestore";
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import NavigationTabs from '../Navigator/Navigation';
import { auth } from '../firebase'; // 🔥 auth'u import etmeyi unutma!


const BagisAlanEtkinlikler = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [eventName, setEventName] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [image, setImage] = useState(null);
  const [events, setEvents] = useState([]);
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

    const fetchEvents = async () => {
      const querySnapshot = await getDocs(collection(db, "events"));
      const eventList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEvents(eventList);
    };
    fetchEvents();
    fetchUserRole();

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

  const handleAddEvent = async () => {
    if (!eventName || !organizer || !description || !date || !image) {
      alert("Lütfen tüm alanları doldurun!");
      return;
    }
    try {
      const response = await fetch(image);
      const blob = await response.blob();
      const storageRef = ref(storage, `event_images/${Date.now()}.jpg`);
      await uploadBytes(storageRef, blob);
      const imageUrl = await getDownloadURL(storageRef);

      await addDoc(collection(db, "events"), {
        eventName,
        organizer,
        description,
        date,
        imageUrl,
      });

      alert("Etkinlik başarıyla eklendi!");
      setModalVisible(false);
      setEventName('');
      setOrganizer('');
      setDescription('');
      setDate('');
      setImage(null);
    } catch (error) {
      alert("Bir hata oluştu, tekrar deneyin.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Etkinlikler</Text>
      </View>



      {/* Kullanıcı Rolüne Göre Üst Sekmeler */}
      {userRole === null ? (
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      ) : (
        <NavigationTabs role={userRole} activeTab="BagisAlanEtkinlikler" />
      )}


      <ScrollView style={styles.scrollContainer}>
        {events.map(event => (
          <View key={event.id} style={styles.card}>
            <Image source={{ uri: event.imageUrl }} style={styles.eventImage} />
            <View style={styles.infoContainer}>
              <Text style={styles.title}>{event.eventName}</Text>
              <Text style={styles.organizer}>Düzenleyen: {event.organizer}</Text>
              <Text style={styles.description}>{event.description}</Text>
              <Text style={styles.date}>Tarih: {event.date}</Text>
              <TouchableOpacity 
                style={styles.detailsButton} 
                onPress={() => navigation.navigate('BagisAlanEtkinliklerDetay', { event })}>
                <Text style={styles.detailsButtonText}>Detayları Gör</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('EtkinlikEkle')}>
        <Text style={styles.addButtonText}>+ Etkinlik Ekle</Text>
      </TouchableOpacity>


        {/* Alt Menü */}
              <View style={styles.footer}>
                <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('BagisAlanAnaMenu')}>
                  <Icon name="home" size={24} color="#65558F" />
                  <Text style={styles.footerButtonText}>Ana Menü</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('BagisAlanBagisDurumu')}>
                  <Icon name="donut-large" size={24} color="#65558F" />
                  <Text style={styles.footerButtonText}>Bağış Durumu</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('BagisAlanProfilim')}>
                  <Icon name="person" size={24} color="#65558F" />
                  <Text style={styles.footerButtonText}>Profilim</Text>
                </TouchableOpacity>
        
        </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#FEF7FF',
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#65558F',
  },
  addButton: { backgroundColor: '#65558F', padding: 15, margin: 10, borderRadius: 10, alignItems: 'center' },
  addButtonText: { color: '#FFF', fontWeight: 'bold' },
  scrollContainer: { padding: 10 },
  card: { flexDirection: 'row', padding: 10, borderBottomWidth: 1 },
  eventImage: { width: 80, height: 80, marginRight: 10 },
  infoContainer: { flex: 1 },
  title: { fontWeight: 'bold' },
  description: { color: '#555' },
  date: { color: '#888' },
  detailsButton: { backgroundColor: '#65558F', padding: 5, borderRadius: 5, marginTop: 5 },
  detailsButtonText: { color: '#FFF', textAlign: 'center' },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FEF7FF',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#65558F',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#65558F',
  },
  activeTabText: {
    color: '#65558F',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  rowText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    paddingLeft: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FEF7FF',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  footerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#65558F',
  },
  activeFooter: {
    borderBottomWidth: 2,
    borderBottomColor: '#65558F',
    paddingBottom: 4,
  },
  footerButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
  },
  footerButtonText: {
    fontSize: 12,
    color: '#65558F',
    marginTop: 4, // Add some spacing between the icon and text
  },
});

export default BagisAlanEtkinlikler;
