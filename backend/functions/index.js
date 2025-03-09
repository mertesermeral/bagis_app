const functions = require("firebase-functions");
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const xml2js = require("xml2js");
const cors = require("cors");

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
exports.api = functions.https.onRequest(app);
