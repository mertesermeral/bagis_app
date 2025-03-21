import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const BagisciNakdiBagis = ({ navigation }) => {
  const donations = [
    {
      id: 1,
      category: 'EĞİTİM YARDIMLARI',
      title: 'Üniversite Eğitimi Yardımı',
      options: ['Burs Yardımı', 'Kitap Yardımı'],
    },
    {
      id: 2,
      category: 'EĞİTİM YARDIMLARI',
      title: 'Lise Eğitimi Yardımı',
      options: ['Burs Yardımı', 'Kitap Yardımı'],
    },
    {
      id: 3,
      category: 'EĞİTİM YARDIMLARI',
      title: 'Doktora ve Yüksek Lisans Yardımı',
      options: ['Burs Yardımı', 'Kitap Yardımı'],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        {donations.map((donation) => (
          <View key={donation.id} style={styles.card}>
            <Text style={styles.categoryText}>{donation.category}</Text>
            <Text style={styles.cardTitle}>{donation.title}</Text>
            <View style={styles.divider} />
            {donation.options.map((option, index) => (
  <TouchableOpacity
    key={index}
    style={styles.optionRow}
    onPress={() => {
      if (option === 'Burs Yardımı') {
        navigation.navigate('BagisciEgitimOdeme'); // Replace 'BagisciEgitimOdeme' with the actual route name
      }
    }}
  >
    <Icon name="star" size={20} color="#65558F" />
    <Text style={styles.optionText}>{option}</Text>
  </TouchableOpacity>
))}

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
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#65558F',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 8,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 8,
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

export default BagisciNakdiBagis;
