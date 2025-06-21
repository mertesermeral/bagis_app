import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { collection, query, getDocs, deleteDoc, doc, getDoc } from "firebase/firestore"; 
import { db, storage } from "../firebase";
import { ref, deleteObject } from "firebase/storage";
import { useFocusEffect } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";

const AdminEtkinlikler = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "events"));
      const eventList = await Promise.all(
        querySnapshot.docs.map(async (docSnapshot) => {
          const eventData = docSnapshot.data();
          if (eventData.organizerId) {
            if (eventData.isAdmin) {
              eventData.organizer = "Fonity";
            } else {
              const userDocRef = doc(db, 'users', eventData.organizerId);
              const userDocSnap = await getDoc(userDocRef);
              if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                eventData.organizer = `${userData.firstName} ${userData.lastName}`;
              }
            }
          }
          return { id: docSnapshot.id, ...eventData };
        })
      );
      setEvents(eventList);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchEvents();
    }, [])
  );

  const handleDeleteEvent = async (event) => {
    Alert.alert(
      "Etkinliği Sil",
      "Bu etkinliği silmek istediğinize emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Sil",
          style: "destructive",
          onPress: async () => {
            try {
              if (event.imageUrl) {
                const imageRef = ref(storage, event.imageUrl);
                await deleteObject(imageRef);
              }
              await deleteDoc(doc(db, "events", event.id));
              Alert.alert("Başarılı", "Etkinlik silindi");
              fetchEvents();
            } catch (error) {
              console.error("Error deleting event:", error);
              Alert.alert("Hata", "Etkinlik silinirken bir hata oluştu");
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#65558F" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Etkinlik Yönetimi</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate("EtkinlikEkle")}
        >
          <Icon name="add" size={24} color="#FFF" />
          <Text style={styles.addButtonText}>Yeni Etkinlik</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {events.map((event) => (
          <View key={event.id} style={styles.eventCard}>
            <Image source={{ uri: event.imageUrl }} style={styles.eventImage} />
            <View style={styles.eventInfo}>
              <Text style={styles.eventTitle}>{event.eventName}</Text>
              
              <View style={styles.organizerInfo}>
                <Icon name="person" size={20} color="#65558F" />
                <Text style={styles.organizerText}>
                  {event.organizer || 'Bilinmeyen'}
                </Text>
              </View>

              <Text style={styles.eventDate}>📅 {event.date}</Text>
              <Text style={styles.eventLocation}>📍 {event.location}</Text>
              
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={styles.detailButton}
                  onPress={() => navigation.navigate("EtkinliklerDetay", { event })}
                >
                  <Icon name="info" size={20} color="#FFF" />
                  <Text style={styles.buttonText}>Detaylar</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => handleDeleteEvent(event)}
                >
                  <Icon name="delete" size={20} color="#FFF" />
                  <Text style={styles.buttonText}>Sil</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: 40, // Add top padding
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    marginBottom: 8, // Add some space after header
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#65558F",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#65558F",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#FFF",
    marginLeft: 4,
    fontWeight: "bold",
  },
  content: {
    padding: 16,
  },
  eventCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 3,
  },
  eventImage: {
    width: "100%",
    height: 200,
  },
  eventInfo: {
    padding: 16,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  eventDate: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  organizerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  organizerText: {
    fontSize: 14,
    color: '#65558F',
    marginLeft: 4,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  detailButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#65558F",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#d32f2f",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  buttonText: {
    color: "#FFF",
    marginLeft: 4,
    fontWeight: "bold",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AdminEtkinlikler;
