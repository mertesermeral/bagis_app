import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';

const BagisAlanBagisDurumu = ({navigation}) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      {/* Üst Başlık */}
           <View style={styles.header}>
             <Text style={styles.headerText}>Bağış Durumu Ekranı</Text>
           </View>
     
      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Eğitim Bağışı */}
        <View style={styles.card}>
          <Image
            source={{ uri: 'https://via.placeholder.com/150' }} // Resmi buradan değiştirin
            style={styles.cardImage}
          />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Eğitim Bağışı Talebi</Text>
            <Text style={styles.cardAmount}>1000₺</Text>
            <Text style={styles.cardStatus}>Bağış İşlemi Tamamlandı</Text>
          </View>
        </View>

        {/* Gıda Bağışı */}
        <View style={styles.card}>
          <Image
            source={{ uri: 'https://via.placeholder.com/150' }} // Resmi buradan değiştirin
            style={styles.cardImage}
          />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Gıda Bağışı Talebi</Text>
            <Text style={styles.cardAmount}>900₺</Text>
            <Text style={styles.cardStatus}>Talep Bekliyor...</Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer Navigation */}
      <View style={styles.footer}>
              <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('BagisAlanAnaMenu')}>
                <Icon name="home" size={24} color="#65558F" style={styles.iconCentered} />
                <Text style={styles.footerButtonText}>Ana Menü</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('BagisDurumu')}>
                <Icon name="donut-large" size={24} color="#65558F" style={styles.iconCentered} />
                <Text style={styles.footerButtonText}>Bağış Durumu</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('BagisAlanProfilim')}>
                <Icon name="person" size={24} color="#65558F" style={styles.iconCentered} />
                <Text style={styles.footerButtonText}>Profilim</Text>
              </TouchableOpacity>
            </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
    backgroundColor: '#FEF7FF',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#65558F',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  contentContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 150,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 4,
  },
  cardStatus: {
    fontSize: 14,
    color: '#888',
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
});

export default BagisAlanBagisDurumu;
