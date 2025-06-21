import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Iletisim = () => {
  const iletisimBilgileri = {
    telefon: '+90 530 564 25 66',
    email: 'fonityapp@gmail.com',
    adres: 'Bilgisayar ve Bilişim Bilimleri Fakültesi Haşim Gürdamar Binası 54187 Serdivan / SAKARYA',
    
  };

  const handleCall = () => {
    Linking.openURL(`tel:${iletisimBilgileri.telefon}`);
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${iletisimBilgileri.email}`);
  };

  const handleLocation = () => {
    const address = encodeURIComponent(iletisimBilgileri.adres);
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${address}`;
    Linking.openURL(mapUrl);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.headerContainer}>
          <Icon name="support-agent" size={40} color="#65558F" />
          <Text style={styles.headerText}>Destek Ekibimiz</Text>
          <Text style={styles.subText}>Size yardımcı olmaktan mutluluk duyarız</Text>
        </View>

        <TouchableOpacity style={styles.contactItem} onPress={handleCall}>
          <Icon name="phone" size={24} color="#65558F" />
          <View style={styles.contactTextContainer}>
            <Text style={styles.contactLabel}>Telefon</Text>
            <Text style={styles.contactText}>{iletisimBilgileri.telefon}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.contactItem} onPress={handleEmail}>
          <Icon name="email" size={24} color="#65558F" />
          <View style={styles.contactTextContainer}>
            <Text style={styles.contactLabel}>E-posta</Text>
            <Text style={styles.contactText}>{iletisimBilgileri.email}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.contactItem} onPress={handleLocation}>
          <Icon name="location-on" size={24} color="#65558F" />
          <View style={styles.contactTextContainer}>
            <Text style={styles.contactLabel}>Adres</Text>
            <Text style={styles.contactText}>{iletisimBilgileri.adres}</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.workingHours}>
        <Text style={styles.workingHoursTitle}>Çalışma Saatleri</Text>
        <Text style={styles.workingHoursText}>Hafta içi: 09:00 - 18:00</Text>
        <Text style={styles.workingHoursText}>Cumartesi: 10:00 - 14:00</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  subText: {
    color: '#666',
    marginTop: 4,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  contactTextContainer: {
    marginLeft: 16,
  },
  contactLabel: {
    fontSize: 12,
    color: '#666',
  },
  contactText: {
    fontSize: 16,
    color: '#333',
    marginTop: 2,
  },
  workingHours: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 4,
  },
  workingHoursTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  workingHoursText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
});

export default Iletisim;
