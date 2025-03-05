import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const BagisciBagislarim = ({ navigation }) => {
  const donations = [
    {
      id: 1,
      title: 'Eğitim Bağışı',
      amount: '1000₺',
      image: require('../assets/egitim.jpg'), // Replace with your image path
    },
    {
      id: 2,
      title: 'Fatura Yardımı',
      amount: '1500₺',
      image: require('../assets/fatura.jpg'), // Replace with your image path
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Üst Başlık */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Vedat Doğan</Text>
      </View>

      {/* Üst Sekmeler */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => navigation.navigate('BagisciAnaMenu')}
        >
          <Text style={styles.tabText}>Nakdi Bağış</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => navigation.navigate('BagisciOzelBagis')}
        >
          <Text style={styles.tabText}>Özel Bağış</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => navigation.navigate('BagisciAcilDurumlar')}
        >
          <Text style={styles.tabText}>Acil Durumlar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, styles.activeTab]}
          onPress={() => navigation.navigate('BagisAlanEtkinlikler')}
        >
          <Text style={[styles.tabText, styles.activeTabText]}>Etkinlikler</Text>
        </TouchableOpacity>
      </View>

      {/* Bağışlarım Listesi */}
      <ScrollView style={styles.content}>
        {donations.map((donation) => (
          <View key={donation.id} style={styles.card}>
            <Image source={donation.image} style={styles.cardImage} />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{donation.title}</Text>
              <Text style={styles.cardAmount}>{donation.amount}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Alt Menü */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('BagisciAnaMenu')}>
          <Icon name="home" size={24} color="#65558F" />
          <Text style={styles.footerButtonText}>Ana Menü</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('BagisciBagislarim')}>
          <Icon name="donut-large" size={24} color="#65558F" />
          <Text style={styles.footerButtonText}>Bağışlarım</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('BagisciProfilim')}>
          <Icon name="person" size={24} color="#65558F" />
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
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cardImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  cardAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#65558F',
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
    marginTop: 4,
  },
});

export default BagisciBagislarim;
