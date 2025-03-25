import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import * as ImagePicker from "expo-image-picker";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const FonGuncelle = ({ route, navigation }) => {
  const { fonId } = route.params; // ✅ Sadece fonId alıyoruz
  const [loading, setLoading] = useState(true);
  const [fon, setFon] = useState(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchFon = async () => {
      try {
        if (!fonId) {
          Alert.alert("Hata", "Fon ID eksik!");
          navigation.goBack();
          return;
        }

        const fonRef = doc(db, "fonlar", fonId);
        const fonDoc = await getDoc(fonRef);

        if (!fonDoc.exists()) {
          Alert.alert("Hata", "Fon bulunamadı!");
          navigation.goBack();
          return;
        }

        const fonData = fonDoc.data();
        setFon({
          ad: fonData.ad || "",
          aciklama: fonData.aciklama || "",
          hedefMiktar: fonData.hedefMiktar ? fonData.hedefMiktar.toString() : "0",
          mevcutMiktar: fonData.mevcutMiktar ? fonData.mevcutMiktar.toString() : "0",
          resimURL: fonData.resimURL || "",
        });

      } catch (error) {
        console.error("Fon yükleme hatası:", error);
        Alert.alert("Hata", "Veri çekilirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchFon();
  }, [fonId]);

  const handleInputChange = (field, value) => {
    setFon((prev) => ({ ...prev, [field]: value }));
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.uri);
    }
  };

  const uploadImage = async () => {
    if (!image) return fon.resimURL;

    const response = await fetch(image);
    const blob = await response.blob();
    const storage = getStorage();
    const imageRef = ref(storage, `fonlar/${fonId}.jpg`);

    await uploadBytes(imageRef, blob);
    return await getDownloadURL(imageRef);
  };

  const handleGuncelle = async () => {
    if (!fon.ad || !fon.aciklama || !fon.hedefMiktar) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun.");
      return;
    }

    setLoading(true);
    try {
      const imageUrl = await uploadImage();
      const fonRef = doc(db, "fonlar", fonId);

      await updateDoc(fonRef, {
        ad: fon.ad,
        aciklama: fon.aciklama,
        hedefMiktar: parseInt(fon.hedefMiktar, 10),
        mevcutMiktar: parseInt(fon.mevcutMiktar, 10) || 0,
        resimURL: imageUrl,
      });

      Alert.alert("Başarılı", "Fon başarıyla güncellendi.");
      navigation.goBack();
    } catch (error) {
      console.error("Güncelleme hatası:", error);
      Alert.alert("Hata", "Fon güncellenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#65558F" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Fon Güncelle</Text>

      {fon ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Fon Adı"
            value={fon.ad}
            onChangeText={(text) => handleInputChange("ad", text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Açıklama"
            value={fon.aciklama}
            onChangeText={(text) => handleInputChange("aciklama", text)}
            multiline
          />
          <TextInput
            style={styles.input}
            placeholder="Hedef Miktar"
            value={fon.hedefMiktar}
            onChangeText={(text) => handleInputChange("hedefMiktar", text)}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Mevcut Miktar"
            value={fon.mevcutMiktar}
            onChangeText={(text) => handleInputChange("mevcutMiktar", text)}
            keyboardType="numeric"
          />

          <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
            <Text style={styles.imagePickerText}>📷 Resim Seç</Text>
          </TouchableOpacity>

          {image || fon.resimURL ? (
            <Image source={{ uri: image || fon.resimURL }} style={styles.image} />
          ) : null}

          <TouchableOpacity style={styles.updateButton} onPress={handleGuncelle}>
            <Text style={styles.updateButtonText}>Güncelle</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.errorText}>Veri yüklenemedi!</Text>
      )}
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
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#65558F",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    fontSize: 16,
  },
  imagePicker: {
    backgroundColor: "#EFEAFF",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 12,
  },
  imagePickerText: {
    fontSize: 16,
    color: "#65558F",
    fontWeight: "bold",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  updateButton: {
    backgroundColor: "#2e7d32",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  updateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
});

export default FonGuncelle;
