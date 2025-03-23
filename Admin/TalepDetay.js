import React from "react";
import { View, Text, ScrollView, StyleSheet, Linking, TouchableOpacity } from "react-native";

const TalepDetay = ({ route }) => {
  const { talep } = route.params;

  const handlePdfOpen = () => {
    if (talep.belgeURL) {
      Linking.openURL(talep.belgeURL);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Bağış Türü: {talep.bagisTuru}</Text>
      <Text>Tarih: {new Date(talep.tarih).toLocaleDateString()}</Text>

      {talep.aciklama && <Text style={styles.label}>Açıklama: {talep.aciklama}</Text>}
      {talep.miktar && <Text style={styles.label}>Miktar: {talep.miktar} TL</Text>}
      {talep.egitimSeviyesi && <Text style={styles.label}>Eğitim Seviyesi: {talep.egitimSeviyesi}</Text>}
      {talep.tcNo && <Text style={styles.label}>TC No: {talep.tcNo}</Text>}
      {talep.adres && <Text style={styles.label}>Adres: {talep.adres}</Text>}
      {talep.gidaTuru && <Text style={styles.label}>Gıda Türü: {talep.gidaTuru}</Text>}
      {talep.gelirDurumu && <Text style={styles.label}>Gelir Durumu: {talep.gelirDurumu}</Text>}
      {talep.faturaTuru && <Text style={styles.label}>Fatura Türü: {talep.faturaTuru}</Text>}
      {talep.faturaTutari && <Text style={styles.label}>Fatura Tutarı: {talep.faturaTutari}</Text>}
      {talep.digerBaslik && <Text style={styles.label}>Başlık: {talep.digerBaslik}</Text>}
      {talep.digerAciklama && <Text style={styles.label}>Açıklama: {talep.digerAciklama}</Text>}

      {/* PDF varsa göster */}
      {talep.belgeURL && (
        <TouchableOpacity style={styles.pdfButton} onPress={handlePdfOpen}>
          <Text style={styles.pdfButtonText}>PDF'yi Görüntüle</Text>
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
    marginBottom: 10,
  },
  label: {
    marginTop: 6,
    fontSize: 15,
  },
  pdfButton: {
    marginTop: 20,
    backgroundColor: "#65558F",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  pdfButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default TalepDetay;
