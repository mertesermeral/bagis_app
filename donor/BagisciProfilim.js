import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const BagisciProfilim = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
    
    
      <ScrollView style={styles.content}>
        <View style={styles.profileContainer}>
          <Image source={require('../assets/profil.png')} style={styles.profileImage} /> 
          <View>
            <Text style={styles.profileName}>Vedat Doğan</Text>
            <Text style={styles.profileRole}>Bağışçı</Text>
          </View>
        </View>

      
        <Text style={styles.sectionTitle}>AYARLAR</Text>
        {[
          { label: 'Hesap Ayarları', route: 'HesapAyarları' },
          { label: 'Gizlilik ve Güvenlik', route: 'GizlilikGüvenlik' },
        ].map((item, index) => (
          <TouchableOpacity key={index} style={styles.row} onPress={() => navigation.navigate(item.route)}>
            <Icon name="bookmark" size={24} color="#65558F" />
            <Text style={styles.rowText}>{item.label || ''}</Text>
            <Icon name="chevron-right" size={24} color="#333" />
          </TouchableOpacity>
        ))}

        
        <Text style={styles.sectionTitle}>GENEL</Text>
        {[
          { label: 'YARDIM', route: 'Yardim' },
          { label: 'LİSANSLAR', route: 'Lisanslar' },
          { label: 'YASAL BİLGİLENDİRME', route: 'YasalBilgilendirme' },
          { label: 'İLETİŞİM', route: 'Iletisim' },
        ].map((item, index) => (
          <TouchableOpacity key={index} style={styles.row} onPress={() => navigation.navigate(item.route)}>
            <Icon name="bookmark" size={24} color="#65558F" />
            <Text style={styles.rowText}>{item.label}</Text>
            <Icon name="chevron-right" size={24} color="#333" />
          </TouchableOpacity>
        ))}

        
        <TouchableOpacity style={styles.logoutButton} onPress={() => alert('Çıkış Yapıldı!')}>
          <Text style={styles.logoutButtonText}>Çıkış Yap</Text>
        </TouchableOpacity>
      </ScrollView>

      
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    header: {
      backgroundColor: '#FEF7FF',
      paddingVertical: 30,
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
    },
    headerText: {
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#65558F',
    },
    tabContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      backgroundColor: '#FEF7FF',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
    },
    tabButton: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 10,
    },
    activeTab: {
      borderBottomWidth: 2,
      borderBottomColor: '#65558F',
    },
    tabText: {
      fontSize: 14,
      fontWeight: '500',
      color: '#65558F',
    },
    activeTabText: {
      color: '#65558F',
      fontWeight: 'bold',
    },
    content: {
      flex: 1,
      padding: 16,
    },
    profileContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 24,
      marginTop:20,
    },
    profileImage: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginRight: 16,
    },
    profileName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
    },
    profileRole: {
      fontSize: 14,
      color: '#777',
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#65558F',
      marginBottom: 8,
      marginTop: 16,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
    },
    rowText: {
      fontSize: 14,
      flex: 1,
      color: '#333',
      marginLeft: 8,
    },
    logoutButton: {
      backgroundColor: '#333',
      paddingVertical: 12,
      marginTop: 24,
      borderRadius: 8,
      alignItems: 'center',
    },
    logoutButtonText: {
      fontSize: 16,
      color: '#fff',
      fontWeight: 'bold',
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      backgroundColor: '#FEF7FF',
      paddingVertical: 10,
      borderTopWidth: 1,
      borderTopColor: '#ddd',
    },
    footerButton: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 5,
    },
    footerButtonText: {
      fontSize: 12,
      color: '#65558F',
      marginTop: 8, // Adjust the vertical position
    },
  });
  

export default BagisciProfilim;
