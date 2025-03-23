import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../AuthContext';

const Profile = ({ navigation }) => {
  const { user, role, userDetails, logout } = useAuth();
  const [profileImage, setProfileImage] = useState('https://via.placeholder.com/100');

  useEffect(() => {
    const loadProfileImage = async () => {
      if (userDetails?.photoURL) {
        try {
          // URL'nin hala geçerli olup olmadığını kontrol et
          const response = await fetch(userDetails.photoURL);
          if (response.ok) {
            setProfileImage(userDetails.photoURL);
          } else {
            setProfileImage('https://via.placeholder.com/100');
          }
        } catch (error) {
          setProfileImage('https://via.placeholder.com/100');
        }
      } else {
        setProfileImage('https://via.placeholder.com/100');
      }
    };

    loadProfileImage();
  }, [userDetails]);

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
          <Image
            source={{ uri: profileImage }}
            style={styles.profileImage}
          />
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
});

export default Profile;