const functions = require('firebase-functions');
const iyzipay = require('iyzipay');
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const xml2js = require("xml2js");
const cors = require("cors");

// Firebase config
const config = functions.config();

// 📦 Iyzico setup
const iyzi = new iyzipay({
  apiKey: config.payment.api_key,
  secretKey: config.payment.secret_key,
  uri: config.payment.base_url
});

// 💳 Iyzico ödeme fonksiyonu
exports.iyzicoOdeme = functions
    .runWith({
  timeoutSeconds: 30,
  memory: "256MB",
  serviceAccount: "bagis-app@appspot.gserviceaccount.com"  // Burası yeni
    })
  .https.onRequest((req, res) => {
    if (req.method !== 'POST') {
      return res.status(405).send('Sadece POST istekleri desteklenir');
    }

    const {
      price,
      cardNumber,
      expireMonth,
      expireYear,
      cvc,
      cardHolderName
    } = req.body;

    const request = {
      locale: 'tr',
      conversationId: '123456789',
      price: price,
      paidPrice: price,
      currency: 'TRY',
      installment: '1',
      basketId: 'B67832',
      paymentChannel: 'WEB',
      paymentGroup: 'PRODUCT',
      paymentCard: {
        cardHolderName,
        cardNumber,
        expireMonth,
        expireYear,
        cvc,
        registerCard: '0'
      },
      buyer: {
        id: 'BY789',
        name: 'Ad',
        surname: 'Soyad',
        gsmNumber: '+905350000000',
        email: 'email@ornek.com',
        identityNumber: '74300864791',
        lastLoginDate: '2020-10-05 12:43:35',
        registrationDate: '2013-04-21 15:12:09',
        registrationAddress: 'Adres bilgisi',
        ip: '85.34.78.112',
        city: 'Istanbul',
        country: 'Turkey',
        zipCode: '34732'
      },
      shippingAddress: {
        contactName: 'Ad Soyad',
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Kargo adresi',
        zipCode: '34742'
      },
      billingAddress: {
        contactName: 'Ad Soyad',
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Fatura adresi',
        zipCode: '34742'
      },
      basketItems: [
        {
          id: 'BI101',
          name: 'Test Ürünü',
          category1: 'Elektronik',
          itemType: 'PHYSICAL',
          price: price
        }
      ]
    };

    iyzi.payment.create(request, (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json(result);
    });
  });




const app = express();
app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT || 8080; // Cloud Run için PORT ayarı

const KPS_URL = "https://tckimlik.nvi.gov.tr/Service/KPSPublic.asmx";

app.post("/validate-tc", async (req, res) => {
  const { tcNo, firstName, lastName, birthYear } = req.body;

  if (!tcNo || !firstName || !birthYear) {
    return res.status(400).json({ success: false, message: "Eksik bilgiler." });
  }

  const upperFirstName = firstName.toUpperCase("tr");
  const upperLastName = lastName.toUpperCase("tr");

  const soapRequest = `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                   xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                   xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <TCKimlikNoDogrula xmlns="http://tckimlik.nvi.gov.tr/WS">
          <TCKimlikNo>${tcNo}</TCKimlikNo>
          <Ad>${upperFirstName}</Ad>
          <Soyad>${upperLastName}</Soyad>
          <DogumYili>${birthYear}</DogumYili>
        </TCKimlikNoDogrula>
      </soap:Body>
    </soap:Envelope>`;

  try {
    console.log("SOAP isteği gönderiliyor...");

    const { data } = await axios.post(KPS_URL, soapRequest, {
      headers: {
        "Content-Type": "text/xml; charset=utf-8",
        "SOAPAction": "http://tckimlik.nvi.gov.tr/WS/TCKimlikNoDogrula",
      },
    });

    console.log("SOAP yanıtı alındı:", data);

    const parser = new xml2js.Parser();
    parser.parseString(data, (err, result) => {
      if (err) {
        console.error("XML Parse Hatası:", err);
        return res.status(500).json({ success: false, message: "XML parse hatası." });
      }
      try {
        const isValid =
          result["soap:Envelope"]["soap:Body"][0]["TCKimlikNoDogrulaResponse"][0]["TCKimlikNoDogrulaResult"][0] ===
          "true";
        console.log("Doğrulama Sonucu:", isValid);
        return res.json({ success: isValid });
      } catch (parseError) {
        console.error("Yanıt İşleme Hatası:", parseError);
        return res.status(500).json({ success: false, message: "Yanıt işleme hatası." });
      }
    });
  } catch (error) {
    console.error("Kimlik doğrulama servisi hatası:", error);
    return res.status(500).json({
      success: false,
      message: "Kimlik doğrulama servisi hatası.",
      error: error.message,
    });
  }
});


// **🔥 Firebase Cloud Functions için API'yi dışa aç**
exports.api = functions
  .runWith({
    timeoutSeconds: 30,
    memory: "256MB",
    serviceAccount: "bagis-app@appspot.gserviceaccount.com"
  })
  .https.onRequest(app);
