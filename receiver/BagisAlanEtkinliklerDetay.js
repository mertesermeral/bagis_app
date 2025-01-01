import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const BagisAlanEtkinliklerDetay = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Header */}
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

      {/* Content */}
      <View style={styles.content}>
      <Image
        source={require('../assets/indir.jpeg')} // Local image
        style={styles.eventImage}
         resizeMode="cover"
        />

        <Text style={styles.eventTitle}>Dora Huzurevi Ataşehir Şubesi</Text>
        <Text style={styles.eventAuthor}>Mert Eser Meral</Text>
        <Text style={styles.eventDescription}>
          Huzurevi ziyareti etkinliği kapsamında, yaşlılarımızla sohbet edebilir, onların
          anılarını dinleyebilir ve birlikte güzel vakit geçirebilirsiniz. Bu etkinlik,
          yalnızca bir ziyaret değil, aynı zamanda sevgi ve dayanışmayı hissettirmek için
          harika bir fırsat. Siz de bu anlamlı etkinliğe katılarak huzurevindeki
          büyüklerimizin gönüllerine dokunabilir, onlara unutamayacakları bir gün
          yaşatabilirsiniz.
        </Text>
        <Text style={styles.eventDetails}>
          Etkinlik Tarihi ve Saati: 12 Ocak / 14.00{'\n'}
          Yer: Dora Huzurevi Ataşehir Şubesi
        </Text>
        <Text style={styles.eventFooter}>
          Hep birlikte bir fark yaratmak için sizi de aramızda görmekten mutluluk duyarız!
        </Text>
      </View>

      {/* Footer Navigation */}
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
    color: '#333',
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
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#FEF7FF',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
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
  inactiveTab: {
    color: '#888',
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
  content: {
    flex: 1,
    padding: 16,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#65558F',
  },
  eventImage: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    marginBottom: 16,
    overflow: 'hidden',
  },
  
  eventTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  eventAuthor: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#888',
    marginBottom: 16,
  },
  eventDescription: {
    fontSize: 14,
    color: '#333',
    marginBottom: 16,
    lineHeight: 20,
  },
  eventDetails: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  eventFooter: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
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

export default BagisAlanEtkinliklerDetay;
