import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

const BagisciAnaMenu = () => {
  const [fonlar, setFonlar] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  // ✅ useCallback ile veri çekme fonksiyonu
  const fetchFonlar = useCallback(async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "fonlar"));
      const fonListesi = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFonlar(fonListesi);
    } catch (error) {
      console.error("Fonlar alınırken hata oluştu:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ useFocusEffect içinde async fonksiyonu iç içe tanımlayarak hatayı engelle
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        await fetchFonlar();
      };
      fetchData();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Bağış Fonları</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#65558F" />
      ) : (
        <FlatList
          data={fonlar}
          keyExtractor={(item) => item.id}
          numColumns={2} // ✅ Grid düzeni
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image
                source={{
                  uri: item.resimURL || "https://via.placeholder.com/150",
                }}
                style={styles.image}
              />
              <Text style={styles.fonAdi}>{item.ad}</Text>
              <Text style={styles.fonAciklama}>{item.aciklama}</Text>
              <Text style={styles.fonMiktar}>🎯 Hedef: {item.hedefMiktar} TL</Text>
              <Text style={styles.fonMevcut}>💰 Mevcut: {item.mevcutMiktar} TL</Text>

              {/* Bağış Yap Butonu */}
              <TouchableOpacity
                style={styles.donateButton}
                onPress={() => navigation.navigate("BagisciFonDetay", { fon: item })}
              >
                <Icon name="cash" size={18} color="#fff" />
                <Text style={styles.donateButtonText}>Detayları Gör</Text>
              </TouchableOpacity>
            </View>
          )}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    textAlign: "center",
  },
  listContainer: {
    paddingBottom: 80,
  },
  card: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 12,
    margin: 8,
    alignItems: "center",
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  fonAdi: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  fonAciklama: {
    fontSize: 13,
    color: "#555",
    textAlign: "center",
    marginBottom: 6,
  },
  fonMiktar: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#65558F",
  },
  fonMevcut: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#2e7d32",
  },
  donateButton: {
    backgroundColor: "#2e7d32",
    padding: 8,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: 8,
  },
  donateButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 6,
  },
});

export default BagisciAnaMenu;
