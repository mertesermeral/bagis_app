import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";

const OdemeEkrani = ({ route }) => {
  const navigation = useNavigation();
  const { fon } = route.params; // Bağış yapılacak fon bilgisi
  const [loading, setLoading] = useState(false);
  const [kartBilgileri, setKartBilgileri] = useState({
    cardHolderName: "",
    cardNumber: "",
    expireMonth: "",
    expireYear: "",
    cvc: "",
  });

  const handleOdemeYap = async () => {
    if (!kartBilgileri.cardHolderName || !kartBilgileri.cardNumber || !kartBilgileri.expireMonth || !kartBilgileri.expireYear || !kartBilgileri.cvc) {
      Alert.alert("Hata", "Lütfen tüm kart bilgilerini doldurun!");
      return;
    }

    setLoading(true);

    const odemeBilgisi = {
        locale: "tr",
        conversationId: "123456789",
        price: fon?.hedefMiktar || 100, 
        paidPrice: fon?.hedefMiktar || 100, 
        currency: "TRY",
        installment: "1",
        basketId: "B67832",
        paymentGroup: "PRODUCT",
        callbackUrl: "https://example.com/odeme-sonucu", 
        paymentCard: {
          cardHolderName: kartBilgileri.cardHolderName,
          cardNumber: kartBilgileri.cardNumber,
          expireMonth: kartBilgileri.expireMonth,
          expireYear: kartBilgileri.expireYear,
          cvc: kartBilgileri.cvc,
          registerCard: "0",
        },
        buyer: {
          id: "BY789",
          name: "Mehmet",
          surname: "Yılmaz",
          gsmNumber: "+905555555555",
          email: "mehmet@example.com",
          identityNumber: "74300864791",
          registrationAddress: "İstanbul, Türkiye",
          city: "İstanbul",
          country: "Türkiye",
          ip: "85.34.78.112",
        },
        billingAddress: {
          contactName: "Mehmet Yılmaz",
          city: "İstanbul",
          country: "Türkiye",
          address: "Örnek Mah. Örnek Sok. No:5",
          zipCode: "34000",
        },
        basketItems: [
          {
            id: "BI101",
            name: "Bağış",
            category1: "Bağış",
            itemType: "VIRTUAL",
            price: fon?.hedefMiktar || 100,
          },
        ],
      };
      

    try {
      console.log("🔵 Ödeme gönderiliyor:", JSON.stringify(odemeBilgisi, null, 2));

      const response = await fetch("https://api.iyzipay.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(odemeBilgisi),
      });

      const textResponse = await response.text(); // Önce text olarak al
      console.log("🔵 Raw API Response:", textResponse);

      if (!response.ok) {
        console.error("🔴 HTTP Hatası:", response.status);
        throw new Error(`Sunucu Hatası: ${response.status}`);
      }

      // JSON parse etmeye çalış
      try {
        const data = JSON.parse(textResponse);
        console.log("🟢 Ödeme sonucu:", data);

        if (data.success) {
          Alert.alert("Başarılı", "Ödeme işlemi başarıyla tamamlandı!");
          navigation.goBack(); // Kullanıcıyı önceki ekrana yönlendir
        } else {
          Alert.alert("Hata", `Ödeme başarısız: ${data.errorMessage || "Bilinmeyen hata"}`);
        }
      } catch (jsonError) {
        console.error("🔴 JSON Parse Hatası:", jsonError);
        Alert.alert("Hata", "Sunucudan geçersiz yanıt alındı!");
      }
    } catch (error) {
      console.error("🔴 Ödeme hatası:", error);
      Alert.alert("Sunucu Hatası", "Ödeme işlemi gerçekleştirilemedi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ödeme Bilgileri</Text>

      <TextInput
        style={styles.input}
        placeholder="Kart Sahibinin Adı"
        value={kartBilgileri.cardHolderName}
        onChangeText={(text) => setKartBilgileri({ ...kartBilgileri, cardHolderName: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Kart Numarası"
        keyboardType="numeric"
        value={kartBilgileri.cardNumber}
        onChangeText={(text) => setKartBilgileri({ ...kartBilgileri, cardNumber: text })}
      />
      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.smallInput]}
          placeholder="Ay (MM)"
          keyboardType="numeric"
          value={kartBilgileri.expireMonth}
          onChangeText={(text) => setKartBilgileri({ ...kartBilgileri, expireMonth: text })}
        />
        <TextInput
          style={[styles.input, styles.smallInput]}
          placeholder="Yıl (YYYY)"
          keyboardType="numeric"
          value={kartBilgileri.expireYear}
          onChangeText={(text) => setKartBilgileri({ ...kartBilgileri, expireYear: text })}
        />
      </View>
      <TextInput
        style={styles.input}
        placeholder="CVC"
        keyboardType="numeric"
        value={kartBilgileri.cvc}
        onChangeText={(text) => setKartBilgileri({ ...kartBilgileri, cvc: text })}
      />

      <TouchableOpacity style={styles.paymentButton} onPress={handleOdemeYap} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Ödeme Yap</Text>}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  smallInput: {
    width: "48%",
  },
  paymentButton: {
    backgroundColor: "#65558F",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default OdemeEkrani;
