import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { getAuth } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";

const BagisciBagislarim = () => {
  const [bagislar, setBagislar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBagislar = useCallback(async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    try {
      const q = query(
        collection(db, "bagislar"),
        where("kullaniciId", "==", user.uid)
      );
      const querySnapshot = await getDocs(q);
      const data = await Promise.all(
        querySnapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();

          if (data.talepId) {
            try {
              const talepRef = doc(db, "bagisBasvurulari", data.talepId);
              const talepSnap = await getDoc(talepRef);
              const talepData = talepSnap.exists() ? talepSnap.data() : {};
              return {
                id: docSnap.id,
                fonAdi: talepData.bagisTuru || "Özel Bağış",
                ...data,
              };
            } catch (error) {
              console.warn("Talep verisi alınamadı", error);
              return {
                id: docSnap.id,
                fonAdi: "Özel Bağış",
                ...data,
              };
            }
          }

          return {
            id: docSnap.id,
            fonAdi: data.fonAdi || "Fon Bağışı",
            ...data,
          };
        })
      );
      setBagislar(data);
    } catch (error) {
      console.error("Bağışlar alınırken hata: ", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchBagislar();
  }, [fetchBagislar]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchBagislar();
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.fonAdi}>{item.fonAdi}</Text>
      <Text style={styles.tutar}>Tutar: {item.tutar} TL</Text>
      <Text style={styles.tarih}>
        Tarih: {new Date(item.tarih?.seconds * 1000).toLocaleString()}
      </Text>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#65558F" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Bağışlarım</Text>
      {bagislar.length === 0 ? (
        <Text style={styles.noData}>Hiç bağış yapmadınız.</Text>
      ) : (
        <FlatList
          data={bagislar}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#333",
  },
  card: {
    backgroundColor: "#f2f2f2",
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  fonAdi: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  tutar: {
    fontSize: 16,
    color: "#444",
    marginTop: 4,
  },
  tarih: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noData: {
    fontSize: 16,
    textAlign: "center",
    color: "#777",
    marginTop: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
});

export default BagisciBagislarim;
