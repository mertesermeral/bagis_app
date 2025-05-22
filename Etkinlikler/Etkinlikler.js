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
        { events && events.length > 0 ? (
          events.map(event => (
            <View key={event.id} style={styles.card}>
              <Image source={{ uri: event.imageUrl }} style={styles.eventImage} />
              <View style={styles.infoContainer}>
                <Text style={styles.title}>{event.eventName}</Text>
                <Text style={styles.organizer}>Düzenleyen: {event.organizer}</Text>
                <Text style={styles.description}>{event.description}</Text>
                <Text style={styles.date}>Tarih: {event.date}</Text>
                <TouchableOpacity 
                  style={styles.detailsButton} 
                  onPress={() => navigation.navigate('EtkinliklerDetay', { event })}>
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
        <Text style={styles.addButtonText}>+ Etkinlik Ekle</Text>
      </TouchableOpacity>



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
  loadingText: {
    textAlign: 'center',
    padding: 20,
    color: '#65558F',
  },
  noEventText: {
    textAlign: 'center',
    padding: 20,
    color: '#666',
  },
});

export default BagisAlanEtkinlikler;
