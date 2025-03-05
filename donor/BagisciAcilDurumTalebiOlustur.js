import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'react-native-image-picker';

const BagisciAcilDurumTalebiOlustur = ({ navigation }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handlePhotoSelect = () => {
    ImagePicker.launchImageLibrary(
      {
        mediaType: 'photo',
      },
      (response) => {
        if (!response.didCancel && response.assets) {
          setSelectedImage(response.assets[0].uri);
        }
      }
    );
  };

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

      {/* Form */}
      <ScrollView style={styles.content}>
        <View style={styles.form}>
          <Text style={styles.label}>Ad Soyad</Text>
          <TextInput style={styles.input} placeholder="Zorunlu Alan" />

          <Text style={styles.label}>Talep Adını Giriniz</Text>
          <TextInput style={styles.input} placeholder="Zorunlu Alan" />

          <Text style={styles.label}>Talebi Detaylı Bir Şekilde Açıklayınız</Text>
          <TextInput style={styles.input} placeholder="Zorunlu Alan" />

          <Text style={styles.label}>Fotoğraf Yükleyiniz</Text>
          <TouchableOpacity style={styles.photoButton} onPress={handlePhotoSelect}>
            <Text style={styles.photoButtonText}>Fotoğraf Seç</Text>
          </TouchableOpacity>
          {selectedImage && <Text style={styles.selectedImageText}>Seçilen Fotoğraf: {selectedImage}</Text>}

          <TouchableOpacity style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Talep Oluştur</Text>
          </TouchableOpacity>
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
  form: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#65558F',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    fontSize: 14,
  },
  photoButton: {
    backgroundColor: '#65558F',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  photoButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  selectedImageText: {
    fontSize: 12,
    color: '#777',
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: '#333',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
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
    marginTop: 8,
  },
});

export default BagisciAcilDurumTalebiOlustur;
