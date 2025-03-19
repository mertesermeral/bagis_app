import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const BagisAlanOzelBagis = ({ navigation }) => {
  const donations = [
    {
      id: 1,
      title: 'Köy Okulu İçin Kitap ve Kırtasiye Desteği',
      donor: 'Zeynep Karaca',
      image: require('../assets/egitim.jpg'), // Replace with your image path
    },
    {
      id: 2,
      title: 'Kışlık Giyisi Desteği',
      donor: 'Fatma Koç',
      image: require('../assets/kislik.jpg'), // Replace with your image path
    },
    {
      id: 3,
      title: 'Tedavi Masrafları İçin Destek',
      donor: 'Mehmet Ulus',
      image: require('../assets/tedavi.jpg'), // Replace with your image path
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Üst Başlık */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Vedat Doğan</Text>
      </View>

      {/* Bağışlar Listesi */}
      <ScrollView style={styles.content}>
        {donations.map((donation) => (
          <View key={donation.id} style={styles.card}>
            <Image source={donation.image} style={styles.cardImage} />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{donation.title}</Text>
              <Text style={styles.cardSubtitle}>{donation.donor}</Text>
              <TouchableOpacity
                style={styles.detailButton}
                onPress={() => navigation.navigate('BagisciOzelBagisDetay', { id: donation.id })}
              >
                <Text style={styles.detailButtonText}>Detay</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
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
  card: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    overflow: 'hidden',
  },
  cardImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  cardContent: {
    flex: 1,
    padding: 8,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#555',
    marginVertical: 4,
  },
  detailButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#65558F',
    borderRadius: 4,
  },
  detailButtonText: {
    fontSize: 14,
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
    marginTop: 4,
  },
});

export default BagisAlanOzelBagis;
