
require("dotenv").config(); // .env dosyasını kullanmak için
console.log("API Key:", process.env.PAYMENT_API_KEY);
console.log("Secret Key:", process.env.PAYMENT_SECRET_KEY);
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const iyzipay = require("iyzipay");
const { db } = require("./firebaseAdmin"); // 🔥 Backend için Firebase bağlantısı


const app = express();
app.use(cors());
app.use(bodyParser.json());

// 🔑 Iyzico API Anahtarlarını Kullan
const iyzipayInstance = new iyzipay({
    apiKey: process.env.PAYMENT_API_KEY, 
    secretKey: process.env.PAYMENT_SECRET_KEY, 
  uri: "https://sandbox-api.iyzipay.com", // Test için sandbox kullanıyoruz
});

// 🚀 Sunucunun Çalışıp Çalışmadığını Test Etmek İçin
app.get("/", (req, res) => {
  res.send("Iyzico Ödeme API Çalışıyor!");
});

// 📌 **Ödeme Oluşturma Endpoint**
app.post("/odeme", async (req, res) => {
    try {
      const { ad, soyad, email, fiyat, telefon, paymentCard } = req.body; 
  
      const paymentRequest = {
        locale: "tr",
        conversationId: "123456789",
        price: fiyat,
        paidPrice: fiyat,
        currency: "TRY",
        installment: "1",
        basketId: "B67832",
        paymentGroup: "PRODUCT",
        callbackUrl: "https://example.com/odeme-sonucu",
        paymentCard: paymentCard, 
        buyer: {
          id: "BY789",
          name: ad,
          surname: soyad,
          gsmNumber: telefon,
          email: email,
          identityNumber: "74300864791",
          registrationAddress: "İstanbul, Türkiye",
          city: "İstanbul",
          country: "Türkiye",
          ip: "85.34.78.112",
        },
        billingAddress: { // ✅ Yeni eklenen kısım
          contactName: `${ad} ${soyad}`,
          city: "İstanbul",
          country: "Türkiye",
          address: "Örnek Mah. Örnek Sok. No:5",
          zipCode: "34000"
        },
        basketItems: [
          {
            id: "BI101",
            name: "Bağış",
            category1: "Bağış",
            itemType: "VIRTUAL",
            price: fiyat,
          },
        ],
      };
  
      iyzipayInstance.payment.create(paymentRequest, async function (err, result) {
        if (err) {
          return res.status(400).json({ success: false, error: err });
        }
  
        // 📌 Ödeme başarılıysa Firebase'e kaydet
        if (result.status === "success") {
            const paymentRef = db.collection("odemeKayitlari").doc(result.paymentId);
          await paymentRef.set({
            ad: ad,
            soyad: soyad,
            email: email,
            telefon: telefon,
            fiyat: fiyat,
            tarih: new Date(),
            transactionId: result.paymentId,
            iyziCommissionFee: result.iyziCommissionFee || null, // 🔥 Eğer undefined ise null yap
            merchantPayoutAmount: result.merchantPayoutAmount || null, // 🔥 Eğer undefined ise null yap
            cardType: result.cardType || null, 
            cardAssociation: result.cardAssociation || null, 
            lastFourDigits: result.lastFourDigits || null, 
            status: "success",
          });
  
          console.log("Ödeme başarıyla kaydedildi:", result.paymentId);
        }
  
        res.status(200).json({ success: true, data: result });
      });
    } catch (error) {
      console.error("Ödeme hatası:", error);
      res.status(500).json({ success: false, message: "Sunucu hatası", error });
    }
  });

  

// **Sunucuyu Çalıştır**
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server ${PORT} portunda çalışıyor...`));
