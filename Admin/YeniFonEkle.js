import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator
} from "react-native";
import { collection, addDoc } from "firebase/firestore";
import { db, storage } from "../firebase";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const YeniFonEkle = ({ navigation }) => {
  // ⛔ Hooks hatasını önlemek için tüm Hook'ları en üstte tanımlıyoruz!
  const [ad, setAd] = useState("");
  const [aciklama, setAciklama] = useState("");
  const [hedefMiktar, setHedefMiktar] = useState("");
  const [resim, setResim] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resimYukleniyor, setResimYukleniyor] = useState(false);

  // 📸 Resim Seçme Fonksiyonu
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setResim(result.assets[0].uri);
    }
  };

  // 📤 Resmi Firebase Storage'a Yükle
  const uploadImage = async () => {
    if (!resim) return null;
    setResimYukleniyor(true);

    try {
      const response = await fetch(resim);
      const blob = await response.blob();
      const fileRef = ref(storage, `fonResimleri/${Date.now()}`);
      await uploadBytes(fileRef, blob);
      return await getDownloadURL(fileRef);
    } catch (error) {
      console.error("Resim yükleme hatası:", error);
      Alert.alert("Hata", "Resim yüklenirken bir hata oluştu.");
      return null;
    } finally {
      setResimYukleniyor(false);
    }
  };

  // 🆕 Yeni Fon Ekleme İşlemi
  const handleFonEkle = async () => {
    if (!ad.trim() || !aciklama.trim() || !hedefMiktar.trim()) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun.");
      return;
    }

    setLoading(true);
    const resimURL = await uploadImage();

    try {
      await addDoc(collection(db, "fonlar"), {
        ad,
        aciklama,
        hedefMiktar: parseFloat(hedefMiktar),
        mevcutMiktar: 0,
        resimURL: resimURL || "", // Resim yüklenmediyse boş bırak
      });

      Alert.alert("Başarılı", "Yeni fon başarıyla eklendi.");
      navigation.goBack();
    } catch (error) {
      console.error("Fon ekleme hatası:", error);
      Alert.alert("Hata", "Fon eklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Yeni Fon Ekle</Text>

      <TextInput
        style={styles.input}
        placeholder="Fon Adı"
        value={ad}
        onChangeText={setAd}
      />

      <TextInput
        style={styles.input}
        placeholder="Açıklama"
        value={aciklama}
        onChangeText={setAciklama}
        multiline
      />

      <TextInput
        style={styles.input}
        placeholder="Hedef Miktar (TL)"
        value={hedefMiktar}
        onChangeText={setHedefMiktar}
        keyboardType="numeric"
      />

      {/* 📸 Resim Seçme Butonu */}
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        <Text style={styles.imagePickerText}>
          {resim ? "Resmi Değiştir" : "Resim Seç"}
        </Text>
      </TouchableOpacity>

      {/* Seçilen Resmi Göster */}
      {resim && <Image source={{ uri: resim }} style={styles.previewImage} />}

      {/* 🆕 Fon Ekle Butonu */}
      <TouchableOpacity style={styles.addButton} onPress={handleFonEkle} disabled={loading || resimYukleniyor}>
        {loading || resimYukleniyor ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.addButtonText}>Fonu Ekle</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
    fontSize: 16,
  },
  imagePicker: {
    backgroundColor: "#65558F",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  imagePickerText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  previewImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: "#2e7d32",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default YeniFonEkle;
