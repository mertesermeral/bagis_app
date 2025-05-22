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
          showsVerticalScrollIndicator={true}
          bounces={true}
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
    backgroundColor: "#f5f5f5",
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: "#65558F",
  },
  fonAdi: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a237e",
    marginBottom: 8,
  },
  tutar: {
    fontSize: 16,
    color: "#2e7d32",
    marginTop: 8,
    fontWeight: "bold",
  },
  tarih: {
    fontSize: 14,
    color: "#666",
    marginTop: 6,
    fontStyle: "italic",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  noData: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginTop: 20,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    elevation: 2,
  },
  listContainer: {
    padding: 20,
    paddingBottom: 20,
    flexGrow: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 40,
    marginBottom: 20,
    textAlign: "center",
    color: "#1a237e",
  },
});

export default BagisciBagislarim;
