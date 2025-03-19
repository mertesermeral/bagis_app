import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, SafeAreaView } from 'react-native';

const BagisAlanBagisDurumu = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          {/* Eğitim Bağışı */}
          <View style={styles.card}>
            <Image
              source={require('../assets/egitim.jpg')}
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
              source={require('../assets/gida.jpg')}
              style={styles.cardImage}
            />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Eğitim Bağışı Talebi</Text>
              <Text style={styles.cardAmount}>1000₺</Text>
              <Text style={styles.cardStatus}>Bağış İşlemi Tamamlandı</Text>
            </View>
          </View>
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
  }
});

export default BagisAlanBagisDurumu;
