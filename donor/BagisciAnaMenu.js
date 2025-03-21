import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const BagisciAnaMenu = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Orta Liste */}
      <View style={styles.buttonContainer}>
        {[
          { label: 'Eğitim Yardımları', route: 'BagisciEgitimYardimlari' },
          { label: 'Sosyal Yardımlar', route: 'SosyalYardimlar' },
          { label: 'Fatura Yardımı', route: 'FaturaYardimi' },
          { label: 'Genel Bağışlar', route: 'GenelBagislar' },
          { label: 'Gıda Bağışı', route: 'GidaBagisi' },
          { label: 'Kira Bağışı', route: 'KiraBagisi' },
        ].map((button, index) => (
          <TouchableOpacity
            key={index}
            style={styles.row}
            onPress={() => navigation.navigate(button.route)}
          >
            <Text style={styles.rowText}>{button.label}</Text>
            <Icon name="chevron-right" size={24} color="#333" />
          </TouchableOpacity>
        ))}
      </View>

      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  rowText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    paddingLeft: 8,
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

export default BagisciAnaMenu;