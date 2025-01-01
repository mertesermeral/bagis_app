import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';


const BagisAlanEgitimYardimTalebi = ({navigation}) => {
  const [isAccepted, setIsAccepted] = useState(false);
  const [name, setName] = useState('');
  const [helpType, setHelpType] = useState('');
  const [studentDocument, setStudentDocument] = useState(null);

  const handleFileUpload = () => {
    alert('Belge yükleme özelliği henüz entegre edilmedi.');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Eğitim Yardım Talebi</Text>
      </View>

      {/* Form */}
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Adınızı Giriniz</Text>
          <TextInput
            style={styles.input}
            placeholder="Adınızı Giriniz"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Yardım Seçiniz</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={helpType}
              onValueChange={(itemValue) => setHelpType(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Lütfen Seçiniz" value="" />
              <Picker.Item label="Üniversite Öğrencisi Yardım Talebi" value="Burs Yardımı" />
              <Picker.Item label="Lise Öğrencisi Yardım Talebi" value="Barınma Yardımı" />
              <Picker.Item
                label="Doktora ve Yüksek Lisans Öğrencisi Yardım Talebi"
                value="Eğitim Materyalleri"
              />
            </Picker>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Öğrenci Belgenizi Yükleyin</Text>
          <TouchableOpacity style={styles.uploadButton} onPress={handleFileUpload}>
            <Text style={styles.uploadButtonText}>Belge Yükle</Text>
          </TouchableOpacity>
          {studentDocument && <Text style={styles.fileName}>{studentDocument}</Text>}
        </View>

        {/* Checkbox Section */}
        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            style={[styles.checkbox, isAccepted && styles.checkedCheckbox]}
            onPress={() => setIsAccepted(!isAccepted)}
          />
          <Text style={styles.checkboxText}>
            I accept the terms{' '}
            <Text style={styles.linkText} onPress={() => alert('T&Cs')}>
              Read our T&Cs
            </Text>
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton,
            isAccepted ? styles.enabledButton : styles.disabledButton,
          ]}
          disabled={!isAccepted}
        >
          <Text style={styles.submitButtonText}>Talep Oluştur</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
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
                          <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Profilim')}>
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
  formContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#000',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  uploadButton: {
    backgroundColor: '#65558F',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  fileName: {
    marginTop: 10,
    fontSize: 14,
    color: '#555',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 4,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  checkedCheckbox: {
    backgroundColor: '#65558F',
  },
  checkboxText: {
    fontSize: 14,
    color: '#333',
  },
  linkText: {
    color: '#65558F',
    textDecorationLine: 'underline',
  },
  submitButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  enabledButton: {
    backgroundColor: '#65558F',
  },
  disabledButton: {
    backgroundColor: '#2c2c2c',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
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
  activeFooter: {
    borderBottomWidth: 2,
    borderBottomColor: '#65558F',
    paddingBottom: 4,
  },
});

export default BagisAlanEgitimYardimTalebi;
