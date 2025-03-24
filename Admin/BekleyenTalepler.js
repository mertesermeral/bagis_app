import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

const BekleyenTalepler = () => {
  const navigation = useNavigation(); // ⬅️ her zaman ilk hooklardan biri olmalı
  const [talepler, setTalepler] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      const fetchTalepler = async () => {
        try {
          setLoading(true);
          const q = query(collection(db, "bagisBasvurulari"), where("onay", "==", "beklemede"));
          const querySnapshot = await getDocs(q);
          const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setTalepler(data);
        } catch (err) {
          console.error("Bekleyen talepler alınırken hata:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchTalepler();

      return () => {}; // cleanup boş
    }, [])
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.tur}>{item.bagisTuru}</Text>
      <Text style={styles.tarih}>Tarih: {new Date(item.tarih).toLocaleDateString()}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("TalepDetay", { talep: item })}
      >
        <Text style={styles.buttonText}>Detayları Görüntüle</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#65558F" />
      </View>
    );
  }

  return (
    <FlatList
      data={talepler}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={{ padding: 16 }}
      ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>Bekleyen talep bulunmamaktadır.</Text>}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  tur: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  tarih: {
    fontSize: 14,
    color: "#777",
    marginBottom: 8,
  },
  button: {
    backgroundColor: "#65558F",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default BekleyenTalepler;
