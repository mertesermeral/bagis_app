import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../AuthContext';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { deleteUser } from 'firebase/auth';

const HesapAyarlari = ({ navigation }) => {
  const { user, userDetails, updateUserDetails } = useAuth();
  const [firstName, setFirstName] = useState(userDetails?.firstName || '');
  const [lastName, setLastName] = useState(userDetails?.lastName || '');
  const [phone, setPhone] = useState(userDetails?.phone || '');
  const [email, setEmail] = useState(userDetails?.email || '');
  const [tcNo, setTcNo] = useState(userDetails?.tcNo || '');
  const [profileImage, setProfileImage] = useState('https://via.placeholder.com/100');

  useEffect(() => {
    const fetchProfileImage = async () => {
      if (user) {
        try {
          const storage = getStorage();
          const imageRef = ref(storage, `profileImages/${user.uid}/profile.jpg`);
          const url = await getDownloadURL(imageRef);
          setProfileImage(url);
        } catch (error) {
          setProfileImage('https://via.placeholder.com/100');
        }
      }
    };

    fetchProfileImage();
  }, [user]);

  useEffect(() => {
    if (userDetails?.photoURL) {
      setProfileImage(userDetails.photoURL);
    } else {
      setProfileImage('https://via.placeholder.com/100');
    }
  }, [userDetails]);

  const formatPhoneNumber = (text) => {
    const cleaned = text.replace(/\D/g, '');
    let formatted = cleaned;
    if (cleaned.length > 0) {
      formatted = `(${cleaned.slice(0, 3)}`;
      if (cleaned.length > 3) {
        formatted += `) ${cleaned.slice(3, 6)}`;
      }
      if (cleaned.length > 6) {
        formatted += ` ${cleaned.slice(6, 8)}`;
      }
      if (cleaned.length > 8) {
        formatted += ` ${cleaned.slice(8, 10)}`;
      }
    }
    return formatted;
  };

  const handlePhoneChange = (text) => {
    const formatted = formatPhoneNumber(text);
    setPhone(formatted);
  };

  const showImagePickerOptions = () => {
    Alert.alert(
      "Profil Fotoğrafı",
      "Lütfen bir seçenek belirleyin",
      [
        {
          text: "İptal",
          style: "cancel"
        },
        {
          text: "Fotoğraf Çek",
          onPress: () => pickFromCamera()
        },
        {
          text: "Galeriden Seç",
          onPress: () => pickFromGallery()
        }
      ]
    );
  };

  const deleteExistingProfileImage = async () => {
    if (userDetails?.photoURL && userDetails.photoURL !== 'https://via.placeholder.com/100') {
      try {
        const storage = getStorage();
        const imageRef = ref(storage, `profileImages/${user.uid}/profile.jpg`);
        await deleteObject(imageRef);
      } catch (error) {
        console.error("Error deleting old image:", error);
      }
    }
  };

  const uploadImageToFirebase = async (uri) => {
    try {
      // Önce eski fotoğrafı sil
      await deleteExistingProfileImage();

      const response = await fetch(uri);
      const blob = await response.blob();
      const storage = getStorage();
      const filename = `profileImages/${user.uid}/profile.jpg`;
      const storageRef = ref(storage, filename);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error("Image upload error:", error);
      return null;
    }
  };

  const pickFromCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Üzgünüz', 'Kamera erişim izni gerekiyor');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const downloadURL = await uploadImageToFirebase(result.assets[0].uri);
      if (downloadURL) setProfileImage(downloadURL);
    }
  };

  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Üzgünüz', 'Galeriye erişim izni gerekiyor');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const downloadURL = await uploadImageToFirebase(result.assets[0].uri);
      if (downloadURL) setProfileImage(downloadURL);
    }
  };

  const handleSave = async () => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const updateData = {
        firstName,
        lastName,
        phone,
        email,
      };
      
      if (profileImage !== 'https://via.placeholder.com/100') {
        updateData.photoURL = profileImage;
      } else {
        // Eğer varsayılan fotoğraf kullanılıyorsa, eski fotoğrafı sil ve photoURL'i güncelle
        await deleteExistingProfileImage();
        updateData.photoURL = 'https://via.placeholder.com/100';
      }

      await updateDoc(userRef, updateData);
      await updateUserDetails();
      Alert.alert('Başarılı', 'Bilgileriniz güncellendi!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Hata', 'Bilgiler güncellenirken bir hata oluştu');
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Hesap Silme",
      "Hesabınızı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.",
      [
        {
          text: "İptal",
          style: "cancel"
        },
        {
          text: "Hesabı Sil",
          onPress: confirmDeleteAccount,
          style: "destructive"
        }
      ]
    );
  };

  const confirmDeleteAccount = async () => {
    try {
      // Delete profile image
      await deleteExistingProfileImage();
      
      // Delete user document from Firestore
      const userRef = doc(db, 'users', user.uid);
      await deleteDoc(userRef);
      
      // Delete Firebase Auth user
      await deleteUser(user);
      
      Alert.alert("Başarılı", "Hesabınız başarıyla silindi.");
      // Reset the navigation stack to prevent going back
      navigation.reset({
        index: 0,
        routes: [{ name: 'LoginScreen' }],
      });
    } catch (error) {
      console.error('Error deleting account:', error);
      Alert.alert(
        "Hata",
        "Hesap silinirken bir hata oluştu. Lütfen daha sonra tekrar deneyin."
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={showImagePickerOptions}>
            <Image
              source={{ uri: profileImage }}
              style={styles.profileImage}
            />
            <View style={styles.editIconContainer}>
              <Text style={styles.editIconText}>Düzenle</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>TC Kimlik Numarası</Text>
          <TextInput
            style={[styles.input, styles.readOnlyInput]}
            value={tcNo}
            editable={false}
            selectTextOnFocus={false}
          />

          <Text style={styles.label}>Ad</Text>
          <TextInput
            style={[styles.input, styles.readOnlyInput]}
            value={firstName}
            editable={false}
            selectTextOnFocus={false}
          />

          <Text style={styles.label}>Soyad</Text>
          <TextInput
            style={[styles.input, styles.readOnlyInput]}
            value={lastName}
            editable={false}
            selectTextOnFocus={false}
          />

          <Text style={styles.label}>Telefon</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={handlePhoneChange}
            placeholder="(5XX) XXX XX XX"
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>E-posta</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="E-posta adresiniz"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Kaydet</Text>
          </TouchableOpacity>

          <View style={styles.divider} />
          
          <View style={styles.dangerZone}>
            <View style={styles.dangerTitleContainer}>
              <Ionicons name="warning" size={40} color="#DC3545" style={styles.warningIcon} />
            </View>
            <Text style={styles.dangerDescription}>
              Hesabınızı silmek geri alınamaz bir işlemdir. Tüm verileriniz kalıcı olarak silinecektir.
            </Text>
            <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
              <Text style={styles.deleteButtonText}>Hesabı Sil</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editIconContainer: {
    position: 'absolute',
    right: -10,
    bottom: 0,
    backgroundColor: '#65558F',
    padding: 5,
    borderRadius: 15,
  },
  editIconText: {
    color: '#fff',
    fontSize: 12,
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#65558F',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  readOnlyInput: {
    backgroundColor: '#f5f5f5',
    color: '#666',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 25,
  },
  dangerZone: {
    backgroundColor: '#FFF5F5',
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFE5E5',
  },
  dangerTitleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    width: '100%',
  },
  warningIcon: {
    textAlign: 'center',
  },
  dangerDescription: {
    color: '#666',
    fontSize: 14,
    marginBottom: 15,
    lineHeight: 20,
  },
  deleteButton: {
    backgroundColor: '#DC3545',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HesapAyarlari;
