import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const OzelBagisDetay = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.detailContainer}>
          <Image source={require('../assets/egitim.jpg')} style={styles.image} /> {/* Görsel yolu */}
          <Text style={styles.title}>Köy Okulu İçin Kitap ve Kırtasiye Desteği</Text>
          <Text style={styles.person}>Zeynep Karaca</Text>
          <Text style={styles.description}>
            Merhaba, ben Zeynep Karaca. Bir köy öğretmeniyim ve öğrencilerimin eğitim materyallerine ulaşmasında zorluk yaşıyoruz.
            Kitap, defter, kalem gibi temel kırtasiye ihtiyaçlarını karşılamak için bağışlarınıza ihtiyacımız var.
            Çocuklarımızın geleceği için yapacağınız her destek çok kıymetli. Şimdiden teşekkür ederiz.
            {'\n\n'}
            İletişim: 054585854582
          </Text>
        </View>
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
  detailContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  person: {
    fontSize: 16,
    color: '#65558F',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#777',
    lineHeight: 22,
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
    marginTop: 8,
  },
});

export default OzelBagisDetay;
