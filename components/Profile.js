import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../AuthContext';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const Profile = ({ navigation }) => {
  const { user, role, userDetails, logout } = useAuth();
  const [profileImage, setProfileImage] = useState(userDetails?.photoURL || 'https://via.placeholder.com/100');

  useEffect(() => {
    if (userDetails?.photoURL) {
      setProfileImage(userDetails.photoURL);
    }
  }, [userDetails]);

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

  const uploadImageToFirebase = async (uri) => {
    try {
      // URI'yi blob'a çevir
      const response = await fetch(uri);
      const blob = await response.blob();

      // Storage referansı oluştur
      const storage = getStorage();
      const filename = `profileImages/${user.uid}/profile.jpg`;
      const storageRef = ref(storage, filename);

      // Storage'a yükle
      await uploadBytes(storageRef, blob);

      // Download URL al
      const downloadURL = await getDownloadURL(storageRef);

      // Firestore'da kullanıcı dokümanını güncelle
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        photoURL: downloadURL
      });

      return downloadURL;
    } catch (error) {
      console.error("Image upload error:", error);
      Alert.alert('Hata', 'Fotoğraf yüklenirken bir hata oluştu');
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
      if (downloadURL) {
        setProfileImage(downloadURL);
      }
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
      if (downloadURL) {
        setProfileImage(downloadURL);
      }
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      "Çıkış Yap",
      "Çıkış yapmak istediğinizden emin misiniz?",
      [
        {
          text: "İptal",
          style: "cancel"
        },
        {
          text: "Çıkış Yap",
          style: "destructive",
          onPress: async () => {
            try {
              const success = await logout();
              if (success) {
                navigation.replace('LoginScreen');
              }
            } catch (error) {
              console.error("Logout error:", error);
              Alert.alert('Hata', 'Çıkış yapılırken bir hata oluştu. Lütfen tekrar deneyin.');
            }
          }
        }
      ]
    );
  };

  const getDisplayName = () => {
    if (userDetails?.firstName && userDetails?.lastName) {
      return `${userDetails.firstName} ${userDetails.lastName}`;
    }
    return "İsim Bulunamadı";
  };

  const getRoleDisplay = () => {
    return role === 'donor' ? 'Bağışçı' : 'Bağış Alan';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.profileContainer}>
          <TouchableOpacity onPress={showImagePickerOptions}>
            <Image
              source={{ uri: profileImage }}
              style={styles.profileImage}
            />
            <View style={styles.editIconContainer}>
              <Icon name="edit" size={16} color="#fff" />
            </View>
          </TouchableOpacity>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{getDisplayName()}</Text>
            <Text style={styles.profileRole}>{getRoleDisplay()}</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.contentContainer}>
          <Text style={styles.sectionTitle}>AYARLAR</Text>
          <View style={styles.section}>
            <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('HesapAyarlari')}>
              <Icon name="settings" size={20} color="#333" />
              <Text style={styles.rowText}>Hesap Ayarları</Text>
              <Icon name="chevron-right" size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('Gizlilik')}>
              <Icon name="security" size={20} color="#333" />
              <Text style={styles.rowText}>Gizlilik ve Güvenlik</Text>
              <Icon name="chevron-right" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>GENEL</Text>
          <View style={styles.section}>
            <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('Yardim')}>
              <Icon name="help-outline" size={20} color="#333" />
              <Text style={styles.rowText}>YARDIM</Text>
              <Icon name="chevron-right" size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('Iletisim')}>
              <Icon name="mail-outline" size={20} color="#333" />
              <Text style={styles.rowText}>İLETİŞİM</Text>
              <Icon name="chevron-right" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Çıkış Yap</Text>
          </TouchableOpacity>
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 40, // Add more padding to move it down
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileInfo: {
    marginLeft: 16,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  profileRole: {
    fontSize: 14,
    color: '#888',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#65558F',
    marginTop: 20,
    marginBottom: 10,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  rowText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginLeft: 8,
  },
  logoutButton: {
    marginTop: 20,
    alignItems: 'center',
    backgroundColor: '#2c2c2c',
    paddingVertical: 12,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  editIconContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#65558F',
    borderRadius: 12,
    padding: 4,
    borderWidth: 2,
    borderColor: '#fff',
  },
});

export default Profile;