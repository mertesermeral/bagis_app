import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const BagisciAcilDurumDetay = ({ navigation }) => {
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
          style={[styles.tabButton, styles.activeTab]}
          onPress={() => navigation.navigate('BagisciAcilDurumlar')}
        >
          <Text style={[styles.tabText, styles.activeTabText]}>Acil Durumlar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => navigation.navigate('BagisAlanEtkinlikler')}
        >
          <Text style={styles.tabText}>Etkinlikler</Text>
        </TouchableOpacity>
      </View>

      {/* Detay İçerik */}
      <ScrollView style={styles.content}>
        <View style={styles.detailContainer}>
          <Image source={require('../assets/sokak.jpeg')} style={styles.image} /> {/* Replace with actual image path */}
          <Text style={styles.name}>Ahmet Bazlı</Text>
          <Text style={styles.bloodType}>A Rh+</Text>
          <Text style={styles.description}>
            Merhaba, ben Ahmet Bazlı. A Rh+ kan grubuna acil ihtiyacımız var. İstanbul Haseki Hastanesi'nde yatmakta olan bir yakınım için kan bağışına ihtiyaç duyuyoruz. Kan bağışı, hayat kurtarabilecek kadar önemlidir ve sizin desteğinizle bu zor günleri aşabiliriz.
            {'\n\n'}
            Eğer A Rh+ kan grubuna sahipseniz veya çevrenizde bu kan grubuna sahip birini tanıyorsanız, lütfen benimle iletişime geçin. Hastanede tüm süreçler düzenli ve hızlı bir şekilde ilerliyor, sizin yardımlarınız sayesinde bir can kurtulabilir.
            {'\n\n'}
            Şimdiden ilginiz ve duyarlılığınız için çok teşekkür ederim.
            {'\n\n'}
            İletişim: 05348475842
          </Text>
        </View>
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
  detailContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  bloodType: {
    fontSize: 16,
    color: '#65558F',
    marginBottom: 16,
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

export default BagisciAcilDurumDetay;
