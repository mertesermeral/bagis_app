import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigation } from "@react-navigation/native";

const BagisAlanAnaMenu = () => {
  const navigation = useNavigation();
  const [fonlar, setFonlar] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFonlar = async () => {
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
    };

    fetchFonlar();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Hoş Geldin Mesajı */}
        <View style={styles.header}>
          <Image
            source={require("../assets/indir.png")}
            style={styles.headerImage}
          />
          <Text style={styles.welcomeText}>
            Yardım almak için bağış taleplerinizi oluşturun!
          </Text>
        </View>

        {/* Nakdi Bağış Butonu */}
        <TouchableOpacity
          style={styles.donationButton}
          onPress={() => navigation.navigate("BagisAlanNakdiBagisTalebi")}
        >
          <Text style={styles.donationButtonText}>💰 Bağış Talebi Oluştur</Text>
        </TouchableOpacity>

        {/* Öne Çıkan Fonlar Başlık */}
        <Text style={styles.fonHeader}>Öne Çıkan Fonlar</Text>

        {/* Öne Çıkan Fonlar */}
        {loading ? (
          <ActivityIndicator size="small" color="#65558F" />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.fonContainer}>
            {fonlar.slice(0, 3).map((fon) => (
              <View key={fon.id} style={styles.fonCard}>
                <Image
                  source={{ uri: fon.resimURL || "https://via.placeholder.com/150" }}
                  style={styles.fonImage}
                />
                <Text style={styles.fonTitle}>{fon.ad}</Text>
                <Text style={styles.fonAmount}>Mevcut: {fon.mevcutMiktar} TL</Text>
                <TouchableOpacity
                  style={styles.fonButton}
                  onPress={() => navigation.navigate("FonDetay", { fon })}
                >
                  <Text style={styles.fonButtonText}>Bağış Talep Et</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    alignItems: "center",
    padding: 20,
  },
  headerImage: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#65558F",
    textAlign: "center",
  },
  donationButton: {
    backgroundColor: "#65558F",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 10,
  },
  donationButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  fonHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 16,
    marginTop: 40, 
    marginBottom: 10,
    color: "#333",
  },
  fonContainer: {
    paddingLeft: 16,
  },
  fonCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 10,
    width: 150,
    alignItems: "center",
  },
  fonImage: {
    width: "100%",
    height: 70,
    borderRadius: 6,
  },
  fonTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 6,
  },
  fonAmount: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  fonButton: {
    backgroundColor: "#65558F",
    padding: 6,
    borderRadius: 6,
    marginTop: 6,
  },
  fonButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default BagisAlanAnaMenu;
