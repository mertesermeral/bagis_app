//Bagis Alan Detay Ekranı

import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const BagisAlanEtkinliklerDetay = ({ route, navigation }) => {
  if (!route || !route.params || !route.params.event) {
    return <Text>Hata: Etkinlik bilgisi bulunamadı.</Text>;
  }

  const { event } = route.params;
  
  return (
    <View style={styles.container}>
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
          <Text style={styles.tabText}>Acil Durumlarr</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, styles.activeTab]}
          onPress={() => navigation.navigate('BagisAlanEtkinlikler')}
        >
          <Text style={[styles.tabText, styles.activeTabText]}>Etkinlikler</Text>
        </TouchableOpacity>
      </View>

      {/* İçerik */}
      <View style={styles.content}>
        {event.imageUrl ? (
          <Image source={{ uri: event.imageUrl }} style={styles.image} />
        ) : (
          <Text style={styles.noImageText}>Görsel bulunamadı</Text>
        )}
        <Text style={styles.title}>{event.eventName}</Text>
        <Text style={styles.organizer}>Düzenleyen: {event.organizer}</Text>
        <Text style={styles.description}>{event.description}</Text>
        <Text style={styles.date}>Tarih: {event.date}</Text>
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
    </View>
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
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
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
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#65558F',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#65558F',
  },
  content: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    marginBottom: 16,
  },
  noImageText: {
    fontSize: 14,
    color: '#888',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  organizer: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#888',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
    lineHeight: 20,
  },
  date: {
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
  iconCentered: {
    marginBottom: 4,
  },
});

export default BagisAlanEtkinliklerDetay;
