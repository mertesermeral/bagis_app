import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigation } from "@react-navigation/native";
import * as Progress from "react-native-progress";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const FonDetay = ({ route }) => {
  const { fon } = route.params;
  const navigation = useNavigation();
  const [fonDetay, setFonDetay] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFonDetay = async () => {
      try {
        const fonRef = doc(db, "fonlar", fon.id);
        const fonDoc = await getDoc(fonRef);

        if (fonDoc.exists()) {
          setFonDetay({ id: fonDoc.id, ...fonDoc.data() });
        } else {
          Alert.alert("Hata", "Fon bulunamadı!");
          navigation.goBack();
        }
      } catch (error) {
        console.error("Fon detayları alınırken hata:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFonDetay();
  }, [fon.id]);

  const handleFonSil = async () => {
    Alert.alert("Fon Sil", "Bu fonu silmek istediğinizden emin misiniz?", [
      { text: "İptal", style: "cancel" },
      {
        text: "Sil",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteDoc(doc(db, "fonlar", fon.id));
            Alert.alert("Başarılı", "Fon başarıyla silindi.");
            navigation.goBack();
          } catch (error) {
            console.error("Fon silinirken hata:", error);
            Alert.alert("Hata", "Fon silinirken bir hata oluştu.");
          }
        },
      },
    ]);
  };

  const handleBagisYap = () => {
    navigation.navigate("OdemeEkrani", { fon });
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#65558F" />
      </View>
    );
  }

  if (!fonDetay) {
    return (
      <View style={styles.centered}>
        <Text>Fon bilgisi bulunamadı.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Fon Görseli */}
      <Image
        source={{ uri: fonDetay.resimURL || "https://via.placeholder.com/300" }}
        style={styles.image}
      />

      {/* Fon Adı */}
      <Text style={styles.title}>{fonDetay.ad}</Text>

      {/* Açıklama */}
      <Text style={styles.description}>{fonDetay.aciklama}</Text>

      {/* Bağış Durumu */}
      <Text style={styles.miktar}>🎯 Hedef: {fonDetay.hedefMiktar} TL</Text>
      <Text style={styles.miktar}>💰 Mevcut: {fonDetay.mevcutMiktar} TL</Text>

      {/* Bağış Progress Bar */}
      <Progress.Bar
        progress={fonDetay.mevcutMiktar / fonDetay.hedefMiktar}
        width={300}
        height={12}
        color="#2e7d32"
        borderRadius={10}
      />

      {/* Admin için Güncelle ve Sil Butonları */}
      <View style={styles.adminButtons}>
        <TouchableOpacity
          style={[styles.adminButton, { backgroundColor: "#ffa726" }]}
          onPress={() => navigation.navigate("FonGuncelle", { fonId: fonDetay.id })}
          >
          <Icon name="pencil" size={20} color="#fff" />
          <Text style={styles.adminButtonText}>Güncelle</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.adminButton, { backgroundColor: "#d32f2f" }]}
          onPress={handleFonSil}
        >
          <Icon name="trash-can" size={20} color="#fff" />
          <Text style={styles.adminButtonText}>Sil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
  description: {
    fontSize: 14,
    textAlign: "center",
    color: "#666",
    marginBottom: 10,
  },
  miktar: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#444",
    marginBottom: 4,
  },
  donateButton: {
    flexDirection: "row",
    backgroundColor: "#2e7d32",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  donateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  adminButtons: {
    flexDirection: "row",
    marginTop: 20,
  },
  adminButton: {
    flexDirection: "row",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
  },
  adminButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 5,
  },
});

export default FonDetay;
