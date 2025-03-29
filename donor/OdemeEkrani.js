import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import axios from 'axios';
import { collection, addDoc,doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../firebase"; // Firestore bağlantısı
import { getAuth } from "firebase/auth"; 

export default function OdemeEkrani({ route }) {
  const { fon, talep } = route.params || {}; // ✅ Fon verisini al

  const [price, setPrice] = useState(talep?.adminTutar?.toString() || '');
  const [cardNumber, setCardNumber] = useState('');
  const [expireMonth, setExpireMonth] = useState('');
  const [expireYear, setExpireYear] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');


  const handlePayment = async () => {
    if (!price || !cardNumber || !expireMonth || !expireYear || !cvc || !cardHolderName) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }

    try {
      const response = await axios.post(
        'https://us-central1-bagis-app.cloudfunctions.net/iyzicoOdeme',
         {
          price,
          cardNumber,
          expireMonth,
          expireYear,
          cvc,
          cardHolderName,
          firstName,
          lastName
          
        }
      );
      
      // 🔄 Başarılı ise veritabanında ilgili fonun mevcut miktarını artır
      if (fon?.id) {
        await updateDoc(doc(db, "fonlar", fon.id), {
          mevcutMiktar: increment(Number(price))
        });
      }
      
      
      // 🆕 Bağışı "bagislar" koleksiyonuna ekle
      const auth = getAuth();
      const user = auth.currentUser;
      
      await addDoc(collection(db, "bagislar"), {
        kullaniciId: user.uid,
        fonId: fon?.id || null,
        fonAdi: fon?.ad || (talep?.bagisTuru || "Özel Bağış"),
        talepId: talep?.id || null, // 🔹 özel bağışlar için!
        tutar: Number(price),
        tarih: new Date(),
      });
      
      if (talep?.id) {
        await updateDoc(doc(db, "bagisBasvurulari", talep.id), {
          status: "tamamlandi"
        });
      }      
      
      
      Alert.alert('Başarılı', 'Bağışınız için teşekkür ederiz!');
    } catch (error) {
      console.error(error);
      Alert.alert('Hata', 'Ödeme sırasında bir hata oluştu.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Tutar (₺)</Text>
      <TextInput
         style={[styles.input, talep?.adminTutar && { backgroundColor: "#eee" }]}
         value={price}
         onChangeText={setPrice}
         keyboardType="numeric"
         editable={!talep?.adminTutar} // AdminTutar varsa düzenlenemez
      />

        <Text style={styles.label}>Kart Numarası</Text>
        <TextInput
          style={styles.input}
          value={cardNumber}
          onChangeText={setCardNumber}
          keyboardType="number-pad"
        />

        <Text style={styles.label}>Son Kullanma Ayı (MM)</Text>
        <TextInput
          style={styles.input}
          value={expireMonth}
          onChangeText={setExpireMonth}
          keyboardType="number-pad"
          maxLength={2}
        />

        <Text style={styles.label}>Son Kullanma Yılı (YYYY)</Text>
        <TextInput
          style={styles.input}
          value={expireYear}
          onChangeText={setExpireYear}
          keyboardType="number-pad"
          maxLength={4}
        />

        <Text style={styles.label}>CVC</Text>
        <TextInput
          style={styles.input}
          value={cvc}
          onChangeText={setCvc}
          keyboardType="number-pad"
          maxLength={3}
        />
        <Text style={styles.label}>Kart Üzerindeki İsim</Text>
        <TextInput
          style={styles.input}
          value={cardHolderName}
          onChangeText={setCardHolderName}
        />
        <Text style={styles.label}>Ad</Text>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
        />

        <Text style={styles.label}>Soyad</Text>
        <TextInput
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
        />

        <Button title="Ödeme Yap" onPress={handlePayment} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    marginTop: 10,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginTop: 5,
    fontSize: 16,
  },
});
