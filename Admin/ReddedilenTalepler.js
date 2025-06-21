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

const ReddedilenTalepler = ({ navigation }) => {
  const [reddedilenler, setReddedilenler] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReddedilenler = async () => {
      try {
        setLoading(true);
        // Sorguyu düzelttik
        const q = query(
          collection(db, "bagisBasvurulari"),
          where("onay", "==", "reddedildi")
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setReddedilenler(data);
      } catch (error) {
        console.error("Reddedilen talepler alınamadı:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReddedilenler();

    // Navigation listener ekleyelim ki sayfaya her dönüşte güncel verileri alalım
    const unsubscribe = navigation.addListener("focus", () => {
      fetchReddedilenler();
    });

    return unsubscribe;
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#c62828" />
      </View>
    );
  }

  if (reddedilenler.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: "#888" }}>Reddedilmiş bir talep bulunmuyor.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {reddedilenler.map((talep) => (
        <View key={talep.id} style={styles.card}>
          <Text style={styles.title}>{talep.bagisTuru}</Text>
          <Text style={styles.subtitle}>
            Tarih: {new Date(talep.tarih).toLocaleDateString("tr-TR")}
          </Text>
          {talep.redAciklamasi && (
            <Text style={styles.redReason}>
              Red Sebebi: {talep.redAciklamasi}
            </Text>
          )}
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
    backgroundColor: "#fff4f4",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 5,
    borderLeftColor: "#c62828",
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#b71c1c",
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  redReason: {
    fontSize: 13,
    color: "#b71c1c",
    fontStyle: "italic",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#c62828",
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ReddedilenTalepler;
