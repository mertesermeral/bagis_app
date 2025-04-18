import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const BagisciBagisDetay = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Üst Başlık */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Vedat Doğan</Text>
      </View>

       {/* Üst Sekmeler */}
       <NavigationTabs role="donor" activeTab="BagisciAnaMenu" />


      {/* Bağış Detayı */}
      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Üniversite Öğrencilerine Burs Yardımı</Text>
          <Text style={styles.amountText}>₺1500 / aylık</Text>
          <Text style={styles.supportText}>
            • Kitap ve materyal ihtiyaçları{'\n'}
            • Konaklama masrafları{'\n'}
            • Yemek giderleri{'\n'}
            • Ulaşım harcamaları desteklenmektedir
          </Text>
          <Text style={styles.description}>
            Her genç, hayallerine ulaşabilmek için eğitim hayatında fırsat eşitliğine ihtiyaç duyar. Üniversite öğrencileri, daha iyi bir gelecek kurma yolunda önemli bir mücadele veriyor. Ancak, birçok öğrenci eğitim masraflarını karşılamakta zorlanıyor.
            {'\n\n'}
            Siz de burs desteğinizle bir öğrencinin eğitim hayatını kolaylaştırabilir, onların hayallerine bir adım daha yaklaşmasına yardımcı olabilirsiniz.
            {'\n\n'}
            Bağışlarınız, öğrencilerin sadece finansal sorunlarını çözmekle kalmayacak, aynı zamanda onlara ilham verecek ve motivasyonlarını artıracaktır.
          </Text>
          <TouchableOpacity style={styles.donateButton} onPress={() => alert('Bağış Yapıldı!')}>
            <Text style={styles.donateButtonText}>Bağış Yap</Text>
          </TouchableOpacity>
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
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  amountText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#65558F',
    marginBottom: 8,
  },
  supportText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: '#777',
    lineHeight: 20,
    marginBottom: 16,
  },
  donateButton: {
    backgroundColor: '#333',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  donateButtonText: {
    fontSize: 16,
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

export default BagisciBagisDetay;
