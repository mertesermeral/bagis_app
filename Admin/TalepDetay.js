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
  Alert,
  TextInput 
} from "react-native";
import { doc, updateDoc, getDoc  } from "firebase/firestore";
import { db } from "../firebase";

const TalepDetay = ({ route, navigation }) => {
  const { talep } = route.params;
  const [kullanici, setKullanici] = useState(null);
  const [loading, setLoading] = useState(true);
  const [redModalVisible, setRedModalVisible] = useState(false);
  const [redSebep, setRedSebep] = useState("");
  const [adminTutar, setAdminTutar] = useState(talep.adminTutar ? talep.adminTutar.toString() : "");

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

  const handleOnayla = async () => {
    if (!adminTutar || isNaN(adminTutar)) {
      Alert.alert("Hata", "Lütfen geçerli bir tutar girin.");
      return;
    }

    try {
      const talepRef = doc(db, "bagisBasvurulari", talep.id);
      await updateDoc(talepRef, {
        onay: "onaylandi",
        adminTutar: parseFloat(adminTutar)
      });
      Alert.alert("Başarılı", "Talep başarıyla onaylandı.");
      navigation.goBack();
    } catch (error) {
      console.error("Onaylama hatası:", error);
      Alert.alert("Hata", "Talep onaylanamadı.");
    }
  };

  const handleReddet = async () => {
    if (!redSebep.trim()) {
      Alert.alert("Hata", "Lütfen red sebebini girin.");
      return;
    }

    try {
      const talepRef = doc(db, "bagisBasvurulari", talep.id);
      await updateDoc(talepRef, {
        onay: "reddedildi",
        redAciklamasi: redSebep.trim(),
      });
      Alert.alert("Reddedildi", "Talep başarıyla reddedildi.");
      setRedModalVisible(false);
      navigation.goBack();
    } catch (error) {
      console.error("Red hatası:", error);
      Alert.alert("Hata", "Talep reddedilirken bir hata oluştu.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Bağış Türü: {talep.bagisTuru}</Text>
      <Text style={styles.date}>Tarih: {new Date(talep.tarih).toLocaleDateString('tr-TR')}</Text>

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
                Ad Soyad: {kullanici.firstName || ''} {kullanici.lastName || ''}
              </Text>
              <Text style={styles.userText}>Email: {kullanici.email || '-'}</Text>
              <Text style={styles.userText}>Telefon: {kullanici.phone || '-'}</Text>
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

      {/* Admin fiyat girişi */}
      {talep.onay === "beklemede" && (
        <>
          <Text style={[styles.label, { marginTop: 16 }]}>Tutar Belirle (₺)</Text>
          <TextInput
            style={styles.input}
            value={adminTutar}
            onChangeText={setAdminTutar}
            placeholder="Örn: 250"
            keyboardType="numeric"
          />
        </>
      )}

      {talep.belgeURL && (
        <TouchableOpacity style={styles.pdfBox} onPress={handlePdfOpen}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.pdfIcon}>📄</Text>
            <Text style={styles.pdfName}>{talep.belgeAdi || 'PDF Belgesi'}</Text>
          </View>
          <Text style={styles.pdfButton}>Görüntüle</Text>
        </TouchableOpacity>
      )}

      {redModalVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Red Sebebi</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Neden reddediyorsunuz?"
              value={redSebep}
              onChangeText={setRedSebep}
              multiline
            />
            <TouchableOpacity style={styles.modalButton} onPress={handleReddet}>
              <Text style={styles.modalButtonText}>Gönder</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setRedModalVisible(false)}>
              <Text style={styles.modalCancel}>İptal</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {talep.onay === "beklemede" && (
        <>
          <TouchableOpacity style={styles.onayButton} onPress={handleOnayla}>
            <Text style={styles.onayButtonText}>Onayla</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.redButton} onPress={() => setRedModalVisible(true)}>
            <Text style={styles.redButtonText}>Reddet</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 4 },
  date: { fontSize: 14, color: "#666", marginBottom: 10 },
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
  userTitle: { fontWeight: "bold", marginBottom: 4, color: "#65558F" },
  userText: { fontSize: 14, color: "#333" },
  label: { marginTop: 6, fontSize: 15, color: "#444" },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginTop: 6,
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
  pdfIcon: { fontSize: 18, marginRight: 8 },
  pdfName: { fontSize: 15, color: "#333" },
  pdfButton: { color: "#65558F", fontWeight: "bold" },
  onayButton: {
    backgroundColor: '#2e7d32',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  onayButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  redButton: {
    backgroundColor: '#c62828',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  redButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "85%",
    elevation: 10,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  modalInput: {
    height: 80,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    textAlignVertical: "top",
  },
  modalButton: {
    backgroundColor: "#c62828",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 8,
  },
  modalButtonText: { color: "#fff", fontWeight: "bold" },
  modalCancel: { textAlign: "center", color: "#65558F" },
});

export default TalepDetay;
