import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Linking,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView
} from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"; 

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
    navigation.navigate("OdemeEkrani", { talep });
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
        <Text style={styles.errorText}>Bağış talep detayları bulunamadı.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>{talepDetay.bagisTuru}</Text>
            <Text style={styles.date}>
              {new Date(talepDetay.tarih).toLocaleDateString("tr-TR")}
            </Text>
          </View>

          <View style={styles.content}>
            {talepDetay.aciklama && (
              <View style={styles.infoRow}>
                <Icon name="text" size={20} color="#65558F" />
                <Text style={styles.labelText}>Açıklama:</Text>
                <Text style={styles.valueText}>{talepDetay.aciklama}</Text>
              </View>
            )}

            {talepDetay.miktar && (
              <View style={styles.infoRow}>
                <Icon name="currency-try" size={20} color="#65558F" />
                <Text style={styles.labelText}>Miktar:</Text>
                <Text style={styles.valueText}>{talepDetay.miktar} TL</Text>
              </View>
            )}

            {talepDetay.adminTutar && (
              <View style={styles.adminTutarContainer}>
                <Icon name="cash-check" size={24} color="#2e7d32" />
                <Text style={styles.adminTutarText}>
                  Onaylanan Tutar: {talepDetay.adminTutar} TL
                </Text>
              </View>
            )}

            {talepDetay.belgeURL && (
              <TouchableOpacity style={styles.documentButton} onPress={handlePdfOpen}>
                <Icon name="file-document-outline" size={24} color="#65558F" />
                <Text style={styles.documentButtonText}>Belgeyi Görüntüle</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.infoCard}>
          <Icon name="information" size={24} color="#65558F" />
          <Text style={styles.infoText}>
            Bu bağışı yaparak bir ihtiyaç sahibine destek oluyorsunuz. 
            Teşekkür ederiz! 💙
          </Text>
        </View>

        {talepDetay.onay === "onaylandi" && (
          <TouchableOpacity style={styles.donateButton} onPress={handleBagisYap}>
            <Icon name="heart" size={24} color="#fff" />
            <Text style={styles.donateButtonText}>Bağış Yap</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#666",
    fontSize: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: "#666",
  },
  content: {
    gap: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  labelText: {
    fontSize: 15,
    color: "#444",
    fontWeight: "600",
    marginLeft: 8,
    marginRight: 4,
  },
  valueText: {
    flex: 1,
    fontSize: 15,
    color: "#333",
  },
  adminTutarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e8f5e9",
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  adminTutarText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "bold",
    color: "#2e7d32",
  },
  documentButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3e5f5",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  documentButtonText: {
    marginLeft: 8,
    fontSize: 15,
    color: "#65558F",
    fontWeight: "600",
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
  donateButton: {
    backgroundColor: "#2e7d32",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  donateButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
});


export default BagisciOzelBagisDetay;
