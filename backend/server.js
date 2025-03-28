const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const iyzipay = require('iyzipay');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const iyzi = new iyzipay({
  apiKey: process.env.PAYMENT_API_KEY,
  secretKey: process.env.PAYMENT_SECRET_KEY,
  uri: process.env.PAYMENT_BASE_URL
});

app.post('/api/odeme', (req, res) => {
  const { price, cardNumber, expireMonth, expireYear, cvc, cardHolderName } = req.body;

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

app.listen(3000, () => console.log('Sunucu 3000 portunda çalışıyor...'));
