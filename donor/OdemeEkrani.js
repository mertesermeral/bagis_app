import React from 'react';
import { View, Button, Alert } from 'react-native';
import axios from 'axios';

export default function OdemeEkrani() {
  const handlePayment = async () => {
    try {
      const response = await axios.post(
        'https://us-central1-bagis-app.cloudfunctions.net/iyzicoOdeme',
        {
          price: '10',
          cardNumber: '5528790000000008', // test kartı
          expireMonth: '12',
          expireYear: '2030',
          cvc: '123',
          cardHolderName: 'John Doe'
        }
      );
      Alert.alert('Başarılı', JSON.stringify(response.data));
    } catch (error) {
      console.error(error);
      Alert.alert('Hata', 'Ödeme sırasında bir hata oluştu.');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Ödeme Yap" onPress={handlePayment} />
    </View>
  );
}
