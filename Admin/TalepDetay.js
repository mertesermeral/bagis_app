import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Linking,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const TalepDetay = ({ route }) => {
  const { talep } = route.params;
  const [kullanici, setKullanici] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (talep.kullaniciId) {
        try {
          const userDoc = await getDoc(doc(db, "users", talep.kullaniciId));
          if (userDoc.exists()) {
            setKullanici(userDoc.data());
          }
        } catch (err) {
          console.log("Kullanıcı bilgisi çekilemedi:", err);
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [talep.kullaniciId]);

  const handlePdfOpen = () => {
    if (talep.belgeURL) {
      Linking.openURL(talep.belgeURL);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Bağış Türü: {talep.bagisTuru}</Text>
      <Text style={styles.date}>Tarih: {new Date(talep.tarih).toLocaleDateString()}</Text>

      {loading ? (
        <ActivityIndicator size="small" color="#65558F" style={{ marginVertical: 10 }} />
      ) : (
        kullanici && (
          <View style={styles.userInfo}>
            <Image
              source={{ uri: kullanici.photoURL || 'https://via.placeholder.com/100' }}
              style={styles.userImage}
            />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.userTitle}>Başvuru Sahibi:</Text>
              <Text style={styles.userText}>
                Ad Soyad: {kullanici.firstName} {kullanici.lastName}
              </Text>
              <Text style={styles.userText}>Email: {kullanici.email}</Text>
              {kullanici.phone && (
                <Text style={styles.userText}>Telefon: {kullanici.phone}</Text>
              )}
            </View>
          </View>
        )
      )}

      {/* Talep detayları */}
      {talep.aciklama && <Text style={styles.label}>Açıklama: {talep.aciklama}</Text>}
      {talep.miktar && <Text style={styles.label}>Miktar: {talep.miktar} TL</Text>}
      {talep.tcNo && <Text style={styles.label}>TC No: {talep.tcNo}</Text>}
      {talep.adres && <Text style={styles.label}>Adres: {talep.adres}</Text>}
      {talep.gidaTuru && <Text style={styles.label}>Gıda Türü: {talep.gidaTuru}</Text>}
      {talep.gelirDurumu && <Text style={styles.label}>Gelir Durumu: {talep.gelirDurumu}</Text>}
      {talep.faturaTuru && <Text style={styles.label}>Fatura Türü: {talep.faturaTuru}</Text>}
      {talep.faturaTutari && <Text style={styles.label}>Fatura Tutarı: {talep.faturaTutari} TL</Text>}
      {talep.digerBaslik && <Text style={styles.label}>Başlık: {talep.digerBaslik}</Text>}
      {talep.digerAciklama && <Text style={styles.label}>Açıklama: {talep.digerAciklama}</Text>}

      {/* PDF varsa göster */}
      {talep.belgeURL && (
        <TouchableOpacity style={styles.pdfBox} onPress={handlePdfOpen}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.pdfIcon}>📄</Text>
            <Text style={styles.pdfName}>{talep.belgeAdi || 'PDF Belgesi'}</Text>
          </View>
          <Text style={styles.pdfButton}>Görüntüle</Text>
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
  userInfo: {
    flexDirection: "row",
    backgroundColor: "#F3EFFF",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  userImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#65558F",
  },
  userTitle: {
    fontWeight: "bold",
    marginBottom: 4,
    color: "#65558F",
  },
  userText: {
    fontSize: 14,
    color: "#333",
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
});

export default TalepDetay;
