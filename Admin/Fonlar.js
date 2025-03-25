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

const Fonlar = () => {
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

  // ✅ useFocusEffect ile sayfa açıldığında verileri çek
  useFocusEffect(
    useCallback(() => {
      fetchFonlar();
    }, [fetchFonlar])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Fonlar</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#65558F" />
      ) : (
        <FlatList
          data={fonlar}
          keyExtractor={(item) => item.id}
          numColumns={2} // ✅ Grid düzeni
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate("FonDetay", { fon: item })}
            >
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
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContainer}
        />
      )}

      {/* Yeni Fon Ekle Butonu */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("YeniFonEkle")}
      >
        <Icon name="plus" size={24} color="#fff" />
        <Text style={styles.addButtonText}>Yeni Fon Ekle</Text>
      </TouchableOpacity>
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
  addButton: {
    backgroundColor: "#65558F",
    padding: 14,
    borderRadius: 8,
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Fonlar;
