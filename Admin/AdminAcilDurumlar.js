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
import { collection, query, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { useFocusEffect } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";

const AdminAcilDurumlar = ({ navigation }) => {
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEmergencies = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "emergencies"));
      const emergencyList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEmergencies(emergencyList);
    } catch (error) {
      console.error("Error fetching emergencies:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchEmergencies();
    }, [])
  );

  const handleDeleteEmergency = async (emergency) => {
    Alert.alert(
      "Acil Durum Talebini Sil",
      "Bu talebi silmek istediğinize emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Sil",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "emergencies", emergency.id));
              Alert.alert("Başarılı", "Talep silindi");
              fetchEmergencies();
            } catch (error) {
              console.error("Error deleting emergency:", error);
              Alert.alert("Hata", "Talep silinirken bir hata oluştu");
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
        <Text style={styles.headerTitle}>Acil Durum Talepleri</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate("AcilDurumTalebiOlustur")}
        >
          <Icon name="add" size={24} color="#FFF" />
          <Text style={styles.addButtonText}>Yeni Acil Durum</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {emergencies.map((emergency) => (
          <View key={emergency.id} style={styles.emergencyCard}>
            {emergency.imageUrl && (
              <Image source={{ uri: emergency.imageUrl }} style={styles.emergencyImage} />
            )}
            <View style={styles.emergencyInfo}>
              <View style={styles.typeContainer}>
                <Icon name="warning" size={20} color="#d32f2f" />
                <Text style={styles.emergencyType}>{emergency.requestType}</Text>
              </View>
              
              <Text style={styles.emergencyTitle}>{emergency.requestTitle}</Text>
              <Text style={styles.requesterName}>{emergency.name}</Text>
              <Text style={styles.description} numberOfLines={2}>
                {emergency.description}
              </Text>

              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={styles.detailButton}
                  onPress={() => navigation.navigate("AcilDurumDetay", { emergency })}
                >
                  <Icon name="info" size={20} color="#FFF" />
                  <Text style={styles.buttonText}>Detaylar</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => handleDeleteEmergency(emergency)}
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
    marginBottom: 8,
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
  emergencyCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 3,
  },
  emergencyImage: {
    width: "100%",
    height: 150,
  },
  emergencyInfo: {
    padding: 16,
  },
  typeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  emergencyType: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#d32f2f",
    marginLeft: 4,
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  requesterName: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
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

export default AdminAcilDurumlar;
