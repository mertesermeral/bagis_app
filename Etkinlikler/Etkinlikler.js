import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Image, RefreshControl } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { db } from '../firebase.js';
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

import { useAuth } from '../AuthContext';

const BagisAlanEtkinlikler = ({ navigation }) => {
  const { role } = useAuth(); // Hook'u en üstte çağır
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchEvents().then(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    fetchEvents();

    // Ekrana her dönüşte verileri yenile
    const unsubscribe = navigation.addListener('focus', () => {
      fetchEvents();
    });

    return unsubscribe;
  }, [navigation]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "events"));
      const eventList = await Promise.all(querySnapshot.docs.map(async (docSnap) => {
        const eventData = docSnap.data();
        if (!eventData.organizer && eventData.organizerId) {
          const userDocRef = doc(db, 'users', eventData.organizerId);
          const userDocSnap = await getDoc(userDocRef);
          const userData = userDocSnap.data();
          if (userData) {
            eventData.organizer = `${userData.firstName} ${userData.lastName}`;
          }
        }
        return { id: docSnap.id, ...eventData };
      }));
      setEvents(eventList || []);
    } catch (error) {
      console.error("Etkinlikler alınırken hata oluştu:", error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Etkinlikler</Text>
      <ScrollView 
        style={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#65558F"]}
            tintColor="#65558F"
          />
        }
      >
        {events && events.length > 0 ? (
          events.map(event => (
            <View key={event.id} style={styles.card}>
              <Image source={{ uri: event.imageUrl }} style={styles.eventImage} />
              <View style={styles.cardContent}>
                <View style={styles.titleContainer}>
                  <Text style={styles.title}>{event.eventName}</Text>
                </View>
                <Text style={styles.organizer}>👤 {event.organizer}</Text>
                <Text style={styles.description} numberOfLines={2}>{event.description}</Text>
                <View style={styles.detailsRow}>
                  <Text style={styles.date}>📅 {event.date}</Text>
                  <Text style={styles.location}>📍 {event.location}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.detailsButton} 
                  onPress={() => navigation.navigate('EtkinliklerDetay', { event })}>
                  <Icon name="arrow-forward" size={18} color="#fff" />
                  <Text style={styles.detailsButtonText}>Detayları Gör</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noEventText}>Henüz etkinlik bulunmamaktadır.</Text>
        )}
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('EtkinlikEkle')}>
        <Icon name="add" size={24} color="#fff" />
        <Text style={styles.addButtonText}>Etkinlik Ekle</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a237e',
    textAlign: 'center',
    marginVertical: 16,
  },
  scrollContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  eventImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 16,
  },
  titleContainer: {
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  organizer: {
    fontSize: 14,
    color: '#65558F',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  date: {
    fontSize: 13,
    color: '#555',
  },
  location: {
    fontSize: 13,
    color: '#555',
  },
  detailsButton: {
    backgroundColor: '#65558F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  detailsButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#65558F',
    borderRadius: 30,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  noEventText: {
    textAlign: 'center',
    padding: 20,
    color: '#666',
    fontSize: 16,
  },
});

export default BagisAlanEtkinlikler;
 
