import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert
} from "react-native";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

const YeniFonEkle = ({ navigation }) => {
  const [fonAdi, setFonAdi] = useState("");
  const [fonAciklama, setFonAciklama] = useState("");
  const [hedefMiktar, setHedefMiktar] = useState("");

  const handleYeniFonEkle = async () => {
    if (!fonAdi.trim() || !fonAciklama.trim() || !hedefMiktar.trim()) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun.");
      return;
    }

    const yeniFon = {
      ad: fonAdi,
      aciklama: fonAciklama,
      hedefMiktar: parseFloat(hedefMiktar),
      mevcutMiktar: 0
    };

    try {
      await addDoc(collection(db, "fonlar"), yeniFon);
      Alert.alert("Başarılı", "Yeni fon eklendi!");
      navigation.goBack(); // 🏠 Fonlar.js sayfasına geri dön
    } catch (error) {
      console.error("Yeni fon eklenirken hata oluştu:", error);
      Alert.alert("Hata", "Fon eklenemedi.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Yeni Fon Ekle</Text>

      <TextInput
        style={styles.input}
        placeholder="Fon Adı"
        value={fonAdi}
        onChangeText={setFonAdi}
      />
      <TextInput
        style={styles.input}
        placeholder="Açıklama"
        value={fonAciklama}
        onChangeText={setFonAciklama}
      />
      <TextInput
        style={styles.input}
        placeholder="Hedef Miktar (TL)"
        keyboardType="numeric"
        value={hedefMiktar}
        onChangeText={setHedefMiktar}
      />

      <TouchableOpacity style={styles.button} onPress={handleYeniFonEkle}>
        <Text style={styles.buttonText}>Fon Ekle</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.cancelButton}>
        <Text style={styles.cancelButtonText}>İptal</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#65558F",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    marginTop: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#65558F",
    fontSize: 16,
  },
});

export default YeniFonEkle;
