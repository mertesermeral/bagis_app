import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const BagisAlanProfilim = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.profileContainer}>
          <Image
            source={{ uri: 'https://via.placeholder.com/100' }} // Replace with actual profile image URL
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Beyza Ulas</Text>
            <Text style={styles.profileRole}>Bağış Alan</Text>
          </View>
        </View>

        {/* Content */}
        <ScrollView contentContainerStyle={styles.contentContainer}>
          {/* Ayarlar Section */}
          <Text style={styles.sectionTitle}>AYARLAR</Text>
          <View style={styles.section}>
            <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('HesapAyarları')}>
              <Icon name="bookmark-border" size={20} color="#333" />
              <Text style={styles.rowText}>Hesap Ayarları</Text>
              <Icon name="chevron-right" size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('Gizlilik')}>
              <Icon name="bookmark-border" size={20} color="#333" />
              <Text style={styles.rowText}>Gizlilik ve Güvenlik</Text>
              <Icon name="chevron-right" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Genel Section */}
          <Text style={styles.sectionTitle}>GENEL</Text>
          <View style={styles.section}>
            <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('Yardım')}>
              <Icon name="bookmark-border" size={20} color="#333" />
              <Text style={styles.rowText}>YARDIM</Text>
              <Icon name="chevron-right" size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('Lisanslar')}>
              <Icon name="bookmark-border" size={20} color="#333" />
              <Text style={styles.rowText}>LİSANSLAR</Text>
              <Icon name="chevron-right" size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('YasalBilgilendirme')}>
              <Icon name="bookmark-border" size={20} color="#333" />
              <Text style={styles.rowText}>YASAL BİLGİLENDİRME</Text>
              <Icon name="chevron-right" size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('Iletisim')}>
              <Icon name="bookmark-border" size={20} color="#333" />
              <Text style={styles.rowText}>İLETİŞİM</Text>
              <Icon name="chevron-right" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.navigate('Logout')}>
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FEF7FF',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  footerButton: {
    alignItems: 'center',
  },
  footerButtonText: {
    fontSize: 12,
    color: '#65558F',
    marginTop: 4,
  },
});

export default BagisAlanProfilim;
