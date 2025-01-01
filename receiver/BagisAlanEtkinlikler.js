import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const BagisAlanEtkinlikler = ({ navigation }) => {
  const events = [
    {
      id: 1,
      title: 'DORA Huzurevi Ataşehir Şubesi',
      organizer: 'Mert Eser Meral',
      image: require('../assets/indir.jpeg'), // Resim dosyasını uygun dizine ekleyin
    },
    {
      id: 2,
      title: 'Çevre Temizliği',
      organizer: 'Vedat Arslan',
      image: require('../assets/cevre.jpeg'), // Resim dosyasını uygun dizine ekleyin
    },
    {
      id: 3,
      title: 'Sokak Hayvanlarına Mama Dağıtımı',
      organizer: 'Kenan Saban',
      image: require('../assets/sokak.jpeg'), // Resim dosyasını uygun dizine ekleyin
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Üst Başlık */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Etkinlikler</Text>
      </View>

      {/* Üst Sekmeler */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => navigation.navigate('BagisAlanAnaMenu')}
        >
          <Text style={styles.tabText}>Yardım Ekranı</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => navigation.navigate('BagisAlanAcilDurumlar')}
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

      {/* Etkinlik Listesi */}
      <ScrollView style={styles.scrollContainer}>
        {events.map((event) => (
          <View key={event.id} style={styles.card}>
            <Image source={event.image} style={styles.eventImage} />
            <View style={styles.infoContainer}>
              <Text style={styles.title}>{event.title}</Text>
              <Text style={styles.organizer}>{event.organizer}</Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() =>
                  navigation.navigate('BagisAlanEtkinliklerDetay', {
                    eventId: event.id,
                    eventTitle: event.title,
                    eventOrganizer: event.organizer,
                    eventImage: event.image,
                  })
                }
              >
                <Text style={styles.buttonText}>Detaylar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

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
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#F8F8F8',
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  eventImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  organizer: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  button: {
    backgroundColor: '#333',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
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

export default BagisAlanEtkinlikler;
