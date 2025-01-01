import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const BagisAlanAnaMenu = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Üst Başlık */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Yardım Ekranı</Text>
      </View>

      {/* Üst Sekmeler */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, styles.activeTab]}
          onPress={() => navigation.navigate('BagisAlanAnaMenu')}
        >
          <Text style={[styles.tabText, styles.activeTabText]}>Yardım Ekranı</Text>
        </TouchableOpacity>


        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => navigation.navigate('BagisAlanAcilDurumlar')}
        >
          <Text style={styles.tabText}>Acil Durumlar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => navigation.navigate('BagisAlanEtkinlikler')}
        >
          <Text style={styles.tabText}>Etkinlikler</Text>
        </TouchableOpacity>
      </View>

      {/* Orta Butonlar */}
      <View style={styles.buttonContainer}>
        {[
          { label: 'Eğitim Yardım Talebi', route: 'BagisAlanEgitimYardimTalebi' },
          { label: 'Sosyal Yardım Talebi', route: 'OzelBagis' },
          { label: 'Fatura Yardım Talebi', route: 'AcilDurum' },
          { label: 'Genel Bağış Talebi', route: 'BagisAlanNakdiBagisTalebi' },
          { label: 'Gıda Bağış Talebi', route: 'OzelBagis' },
          { label: 'Kira Bağış Talebi', route: 'AcilDurum' },
          
        ].map((button, index) => (
          <TouchableOpacity
            key={index}
            style={styles.row}
            onPress={() => navigation.navigate(button.route)}
          >
            <Text style={styles.rowText}>{button.label}</Text>
            <Icon name="chevron-right" size={24} color="#333" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Alt Menü */}
            <View style={styles.footer}>
                         <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('BagisAlanAnaMenu')}>
                           <Icon name="home" size={24} color="#65558F" style={styles.iconCentered} />
                           <Text style={styles.footerButtonText}>Ana Menü</Text>
                         </TouchableOpacity>
                         <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('BagisAlanBagisDurumu')}>
                           <Icon name="donut-large" size={24} color="#65558F" style={styles.iconCentered} />
                           <Text style={styles.footerButtonText}>Bağış Durumu</Text>
                         </TouchableOpacity>
                         <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('BagisAlanProfilim')}>
                           <Icon name="person" size={24} color="#65558F" style={styles.iconCentered} />
                           <Text style={styles.footerButtonText}>Profilim</Text>
                         </TouchableOpacity>
             </View>
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
  buttonContainer: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  rowText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    paddingLeft: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  footerButton: {
    alignItems: 'center',
  },
  footerButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  footerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#65558F',
  },
  activeFooter: {
    borderBottomWidth: 2,
    borderBottomColor: '#65558F',
    paddingBottom: 4,
  },
});

export default BagisAlanAnaMenu;
