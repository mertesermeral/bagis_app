import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigation } from "@react-navigation/native";

const BagisciOzelBagis = () => {
  const [onaylananTalepler, setOnaylananTalepler] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchOnaylananTalepler = async () => {
      try {
        const q = query(
          collection(db, "bagisBasvurulari"),
          where("onay", "==", "onaylandi")
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((item) => item.status !== "tamamlandi"); // 👈 client-side filtre
        
        setOnaylananTalepler(data);
      } catch (error) {
        console.error("Veri çekme hatası:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOnaylananTalepler();
  }, []); // Burada dependencies boş çünkü sadece ilk renderda çalışması gerekiyor.

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#65558F" />
      </View>
    );
  }

  if (onaylananTalepler.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: "#555" }}>Henüz bağış yapılabilecek bir talep yok.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {onaylananTalepler.map((talep) => (
        <View key={talep.id} style={styles.card}>
          <Text style={styles.title}>{talep.bagisTuru}</Text>
          <Text style={styles.subtitle}>Tarih: {new Date(talep.tarih).toLocaleDateString()}</Text>

          {/* Talep Detayları Gör Butonu */}
          <TouchableOpacity
            style={styles.detailButton}
            onPress={() => navigation.navigate("BagisciOzelBagisDetay", { talep })}
          >
            <Text style={styles.buttonText}>Detayları Gör</Text>
          </TouchableOpacity>

          {/* Yeni eklenen Bağış Yap Butonu */}
          <TouchableOpacity
            style={styles.donateButton}
            onPress={() => navigation.navigate("OdemeEkrani", { talep })}
          >
            <Text style={styles.buttonText}>Bağış Yap</Text>
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
  detailButton: {
    backgroundColor: "#65558F",
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 6,
  },
  donateButton: {
    backgroundColor: "#2e7d32",
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default BagisciOzelBagis;
