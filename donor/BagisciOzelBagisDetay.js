import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Linking,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"; // İkon ekledim!

const BagisciOzelBagisDetay = ({ route, navigation }) => {
  const { talep } = route.params;
  const [loading, setLoading] = useState(true);
  const [talepDetay, setTalepDetay] = useState(null);

  useEffect(() => {
    const fetchTalepDetay = async () => {
      if (!talep.id) {
        console.error("Talep ID eksik!");
        return;
      }

      try {
        const talepRef = doc(db, "bagisBasvurulari", talep.id);
        const talepSnapshot = await getDoc(talepRef);

        if (talepSnapshot.exists()) {
          setTalepDetay(talepSnapshot.data());
        } else {
          console.warn("Talep bulunamadı!");
        }
      } catch (error) {
        console.error("Talep detayları çekilirken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTalepDetay();
  }, [talep.id]);

  const handlePdfOpen = () => {
    if (talepDetay?.belgeURL) {
      Linking.openURL(talepDetay.belgeURL);
    }
  };

  const handleBagisYap = () => {
    Alert.alert(
      "Bağış Yap",
      "Bu bağışı yapmak istediğinizden emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        { text: "Evet", onPress: () => navigation.navigate("OdemeEkrani", { talep }) }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#65558F" />
      </View>
    );
  }

  if (!talepDetay) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: "#555" }}>Bağış talep detayları bulunamadı.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <Text style={styles.title}>Bağış Türü: {talepDetay.bagisTuru}</Text>
      <Text style={styles.date}>Tarih: {new Date(talepDetay.tarih).toLocaleDateString("tr-TR")}</Text>

      {/* Talep Detayları */}
      {talepDetay.aciklama && <Text style={styles.label}>Açıklama: {talepDetay.aciklama}</Text>}
      {talepDetay.miktar && <Text style={styles.label}>Miktar: {talepDetay.miktar} TL</Text>}
      {talepDetay.gidaTuru && <Text style={styles.label}>Gıda Türü: {talepDetay.gidaTuru}</Text>}
      {talepDetay.faturaTuru && <Text style={styles.label}>Fatura Türü: {talepDetay.faturaTuru}</Text>}
      {talepDetay.faturaTutari && <Text style={styles.label}>Fatura Tutarı: {talepDetay.faturaTutari} TL</Text>}
      {talepDetay.digerBaslik && <Text style={styles.label}>Başlık: {talepDetay.digerBaslik}</Text>}
      {talepDetay.digerAciklama && <Text style={styles.label}>Açıklama: {talepDetay.digerAciklama}</Text>}

      {/* PDF Belgesi */}
      {talepDetay.belgeURL && (
        <TouchableOpacity style={styles.pdfBox} onPress={handlePdfOpen}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.pdfIcon}>📄</Text>
            <Text style={styles.pdfName}>{talepDetay.belgeAdi || "PDF Belgesi"}</Text>
          </View>
          <Text style={styles.pdfButton}>Görüntüle</Text>
        </TouchableOpacity>
      )}

       {/* Bilgilendirme Metni */}
       <Text style={styles.infoText}>
        Bu bağışı yaparak bir ihtiyaç sahibine destek oluyorsunuz. Teşekkür ederiz! 💙
      </Text>

       {/* Bağış Yap Butonu */}
       {talepDetay.onay === "onaylandi" && (
        <TouchableOpacity style={styles.donateButton} onPress={handleBagisYap}>
          <Text style={styles.donateButtonText}>Bağış Yap</Text>
        </TouchableOpacity>
      )}

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  label: {
    marginTop: 6,
    fontSize: 15,
    color: "#444",
  },
  pdfBox: {
    marginTop: 16,
    backgroundColor: "#EFEAFF",
    borderWidth: 1,
    borderColor: "#65558F",
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pdfIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  pdfName: {
    fontSize: 15,
    color: "#333",
  },
  pdfButton: {
    color: "#65558F",
    fontWeight: "bold",
  },
  donateButton: {
    backgroundColor: "#2e7d32",
    padding: 14,
    borderRadius: 8,
    marginTop: 30, 
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  donateButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  infoText: {
    textAlign: "center",
    fontSize: 14,
    color: "#333",
    marginTop: 20,
    marginBottom: 10,
    fontStyle: "italic",
  },
});

export default BagisciOzelBagisDetay;
