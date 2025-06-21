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
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

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


      Alert.alert("Başarılı", "Talep onaylandı.");
      navigation.goBack();
    } catch (error) {
      console.error("Onaylama hatası:", error);
      Alert.alert("Hata", "İşlem sırasında bir hata oluştu.");
    }
  };

  const handleReddet = async () => {
    try {
      if (!redSebep.trim()) {
        Alert.alert("Hata", "Lütfen red sebebini girin.");
        return;
      }

      const talepRef = doc(db, "bagisBasvurulari", talep.id);
      await updateDoc(talepRef, {
        onay: "reddedildi",
        redAciklamasi: redSebep.trim()
      });


      setRedModalVisible(false); // Modal'ı kapat
      Alert.alert("Başarılı", "Talep reddedildi.");
      navigation.goBack();
    } catch (error) {
      console.error("Red hatası:", error);
      Alert.alert("Hata", "Talep reddedilirken bir hata oluştu.");
    }
  };

  const handleTamamla = async () => {
    try {
      const talepRef = doc(db, "bagisBasvurulari", talep.id);
      await updateDoc(talepRef, {
        status: 'tamamlandi',
      });
      Alert.alert("Başarılı", "Talep tamamlandı olarak işaretlendi.");
      navigation.goBack();
    } catch (error) {
      console.error("Tamamlama hatası:", error);
      Alert.alert("Hata", "İşlem sırasında bir hata oluştu.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>{talep.bagisTuru}</Text>
          <Text style={styles.date}>
            📅 {new Date(talep.tarih).toLocaleDateString('tr-TR')}
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#65558F" />
        ) : (
          kullanici && (
            <View style={styles.userCard}>
              <Image
                source={{ uri: kullanici.photoURL || 'https://via.placeholder.com/100' }}
                style={styles.userImage}
              />
              <View style={styles.userInfo}>
                <Text style={styles.userName}>
                  {kullanici.firstName} {kullanici.lastName}
                </Text>
                <Text style={styles.userDetail}>📧 {kullanici.email || '-'}</Text>
                <Text style={styles.userDetail}>📱 {kullanici.phone || '-'}</Text>
              </View>
            </View>
          )
        )}

        <View style={styles.detailsContainer}>
          {talep.aciklama && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Açıklama</Text>
              <Text style={styles.detailValue}>{talep.aciklama}</Text>
            </View>
          )}
          {talep.miktar && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Miktar</Text>
              <Text style={styles.detailValue}>{talep.miktar} TL</Text>
            </View>
          )}
          {talep.tcNo && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>TC No</Text>
              <Text style={styles.detailValue}>{talep.tcNo}</Text>
            </View>
          )}
          {talep.adres && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Adres</Text>
              <Text style={styles.detailValue}>{talep.adres}</Text>
            </View>
          )}
          {talep.gidaTuru && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Gıda Türü</Text>
              <Text style={styles.detailValue}>{talep.gidaTuru}</Text>
            </View>
          )}
          {talep.gelirDurumu && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Gelir Durumu</Text>
              <Text style={styles.detailValue}>{talep.gelirDurumu}</Text>
            </View>
          )}
          {talep.faturaTuru && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Fatura Türü</Text>
              <Text style={styles.detailValue}>{talep.faturaTuru}</Text>
            </View>
          )}
          {talep.faturaTutari && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Fatura Tutarı</Text>
              <Text style={styles.detailValue}>{talep.faturaTutari} TL</Text>
            </View>
          )}
          {talep.digerBaslik && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Başlık</Text>
              <Text style={styles.detailValue}>{talep.digerBaslik}</Text>
            </View>
          )}
          {talep.digerAciklama && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Açıklama</Text>
              <Text style={styles.detailValue}>{talep.digerAciklama}</Text>
            </View>
          )}
        </View>

        {talep.onay === "beklemede" && (
          <>
            <View style={styles.adminInputContainer}>
              <Text style={styles.inputLabel}>Onay Tutarı (TL)</Text>
              <TextInput
                style={styles.input}
                value={adminTutar}
                onChangeText={setAdminTutar}
                placeholder="Örn: 250"
                keyboardType="numeric"
              />
            </View>

            {redModalVisible ? (
              <View style={styles.redModalContainer}>
                <Text style={styles.inputLabel}>Red Sebebi</Text>
                <TextInput
                  style={[styles.input, { height: 80 }]}
                  value={redSebep}
                  onChangeText={setRedSebep}
                  placeholder="Red sebebini yazın"
                  multiline
                />
                <View style={styles.redModalButtons}>
                  <TouchableOpacity 
                    style={styles.cancelButton}
                    onPress={() => {
                      setRedModalVisible(false);
                      setRedSebep('');
                    }}
                  >
                    <Text style={[styles.buttonText, { color: '#666' }]}>İptal</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.confirmButton}
                    onPress={handleReddet}
                  >
                    <Text style={styles.buttonText}>Reddet</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.approveButton} onPress={handleOnayla}>
                  <Text style={styles.buttonText}>Onayla</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.rejectButton} 
                  onPress={() => setRedModalVisible(true)}
                >
                  <Text style={styles.buttonText}>Reddet</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}

        {talep.belgeURL && (
          <TouchableOpacity style={styles.documentButton} onPress={handlePdfOpen}>
            <Icon name="file-document-outline" size={24} color="#65558F" />
            <Text style={styles.documentButtonText}>Belgeyi Görüntüle</Text>
          </TouchableOpacity>
        )}

        {talep.onay === "onaylandi" && !talep.status && (
          <TouchableOpacity style={styles.completeButton} onPress={handleTamamla}>
            <Text style={styles.buttonText}>Bağışı Tamamla</Text>
          </TouchableOpacity>
        )}

        {talep.status === "tamamlandi" && (
          <View style={styles.completedBadge}>
            <Text style={styles.completedText}>✅ Bağış Tamamlandı</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 16,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  userCard: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  userImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#65558F',
  },
  userInfo: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  detailsContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  detailRow: {
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#65558F',
    fontWeight: '600',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 15,
    color: '#333',
  },
  adminInputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#65558F',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  documentButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3e5f5",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 16,
  },
  documentButtonText: {
    marginLeft: 8,
    fontSize: 15,
    color: "#65558F",
    fontWeight: "600",
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  approveButton: {
    flex: 1,
    backgroundColor: '#2e7d32',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  rejectButton: {
    flex: 1,
    backgroundColor: '#c62828',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  completeButton: {
    backgroundColor: '#1b5e20',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  completedBadge: {
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  completedText: {
    color: '#1b5e20',
    fontSize: 15,
    fontWeight: 'bold',
  },
  redModalContainer: {
    backgroundColor: '#fff4f4',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  redModalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 12,
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#c62828',
    padding: 10,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
});



export default TalepDetay;
