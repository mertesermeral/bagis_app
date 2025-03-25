import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useFocusEffect } from "@react-navigation/native";

const Fonlar = ({ navigation }) => {
  const [fonlar, setFonlar] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 useCallback ile fetchFonlar fonksiyonunu oluştur
  const fetchFonlar = useCallback(async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "fonlar"));
      const fonListesi = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setFonlar(fonListesi);
    } catch (error) {
      console.error("Fonlar alınırken hata oluştu:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔥 useEffect yerine useFocusEffect kullanarak sayfa açıldığında verileri güncelle
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
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.fonAdi}>{item.ad}</Text>
              <Text style={styles.fonAciklama}>{item.aciklama}</Text>
              <Text style={styles.miktar}>Hedef: {item.hedefMiktar} TL</Text>
              <Text style={styles.miktar}>Mevcut: {item.mevcutMiktar} TL</Text>
            </View>
          )}
        />
      )}

      {/* Yeni Fon Ekle Sayfasına Giden Buton */}
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
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  fonAdi: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  fonAciklama: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  miktar: {
    fontSize: 14,
    color: "#444",
  },
  addButton: {
    backgroundColor: "#65558F",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});

export default Fonlar;
