import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const OnaylananTalepler = ({ navigation }) => {
  const [onaylananlar, setOnaylananlar] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOnaylananlar = async () => {
      try {
        const q = query(
          collection(db, "bagisBasvurulari"),
          where("onay", "==", true)
        );
        const snapshot = await getDocs(q);

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOnaylananlar(data);
      } catch (error) {
        console.error("Veri çekme hatası:", error);
      }
      setLoading(false);
    };

    fetchOnaylananlar();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#65558F" />
      </View>
    );
  }

  if (onaylananlar.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: "#555" }}>Henüz onaylanmış bir talep yok.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {onaylananlar.map((talep) => (
        <View key={talep.id} style={styles.card}>
          <Text style={styles.title}>{talep.bagisTuru}</Text>
          <Text style={styles.subtitle}>
            Tarih: {new Date(talep.tarih).toLocaleDateString()}
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("TalepDetay", { talep })}
          >
            <Text style={styles.buttonText}>Detayları Gör</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  button: {
    backgroundColor: "#65558F",
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default OnaylananTalepler;
