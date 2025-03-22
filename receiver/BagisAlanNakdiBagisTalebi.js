import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';
import { AntDesign } from '@expo/vector-icons';
import { db, storage } from '../firebase.js';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const BagisTalepFormu = () => {
  const [bagisTuru, setBagisTuru] = useState('');
  const [egitimSeviyesi, setEgitimSeviyesi] = useState('');
  const [tcNo, setTcNo] = useState('');
  const [miktar, setMiktar] = useState('');
  const [aciklama, setAciklama] = useState('');
  const [faturaTuru, setFaturaTuru] = useState('');
  const [sehir, setSehir] = useState('');
  const [aboneNo, setAboneNo] = useState('');
  const [faturaTutari, setFaturaTutari] = useState('');
  const [gidaTuru, setGidaTuru] = useState('');
  const [ozelGidaTalebi, setOzelGidaTalebi] = useState('');
  const [haneSayisi, setHaneSayisi] = useState('');
  const [gelirDurumu, setGelirDurumu] = useState('');
  const [adres, setAdres] = useState('');
  const [kiraTutari, setKiraTutari] = useState('');
  const [digerBaslik, setDigerBaslik] = useState('');
  const [digerAciklama, setDigerAciklama] = useState('');
  const [digerMiktar, setDigerMiktar] = useState('');
  const [belge, setBelge] = useState(null);
  const [belgeURL, setBelgeURL] = useState('');

  const egitimSeviyeleri = ['Üniversite Öğrencisi', 'Lise Öğrencisi', 'İlkokul Öğrencisi'];
  const faturaTurleri = ['Elektrik', 'Su', 'Doğalgaz'];
  const sehirler = ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Diğer'];
  const gidaTurleri = ['Gıda Paketi', 'Alışveriş Kartı'];
  const gelirDurumlari = ['Düzenli Gelir Var', 'Düzenli Gelir Yok'];
  const gidaPaketiIcerigi = [
    "Pirinç", "Un", "Yağ", "Şeker", "Tuz", "Makarna", "Bakliyat", "Çay", "Süt", "Konserve Gıdalar"
  ];

  const handleBelgeSec = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });

      if (result?.assets && result.assets.length > 0) {
        setBelge(result.assets[0]);
      } else {
        Alert.alert("Uyarı", "Herhangi bir belge seçilmedi.");
      }
    } catch (err) {
      console.error("Belge seçme hatası:", err);
    }
  };

  const uploadPDFToFirebase = async (file) => {
    if (!file) return null;

    const response = await fetch(file.uri);
    const blob = await response.blob();
    const fileRef = ref(storage, `belgeler/${file.name}`);

    await uploadBytes(fileRef, blob);
    return await getDownloadURL(fileRef);
  };

  const handleSubmit = async () => {
    if (bagisTuru === '') {
      Alert.alert("Eksik Bilgi", "Lütfen bağış türünü seçin.");
      return;
    }
  
    let basvuruData = {
      bagisTuru,
      belgeAdi: belge.name,
      belgeURL: await uploadPDFToFirebase(belge),
      tarih: new Date().toISOString(),
    };
  
    if (bagisTuru === 'Eğitim Yardım Talebi') {
      if (
        egitimSeviyesi === '' ||
        tcNo.length !== 11 ||
        isNaN(tcNo) ||
        miktar === '' ||
        isNaN(miktar) ||
        aciklama.trim() === '' ||
        !belge
      ) {
        Alert.alert("Eksik veya Hatalı Bilgi", "Lütfen tüm alanları doğru şekilde doldurun.");
        return;
      }
  
      basvuruData = {
        ...basvuruData,
        egitimSeviyesi,
        tcNo,
        miktar: parseFloat(miktar),
        aciklama,
      };
    }
  
    if (bagisTuru === 'Fatura Yardımı Talebi') {
      if (
        faturaTuru === '' ||
        sehir === '' ||
        aboneNo.trim() === '' ||
        faturaTutari.trim() === '' ||
        isNaN(faturaTutari) ||
        !belge
      ) {
        Alert.alert("Eksik veya Hatalı Bilgi", "Lütfen tüm alanları doğru şekilde doldurun.");
        return;
      }
  
      basvuruData = {
        ...basvuruData,
        faturaTuru,
        sehir,
        aboneNo,
        faturaTutari: parseFloat(faturaTutari),
      };
    }

    if (bagisTuru === 'Gıda Yardımı Talebi') {
      if (
        gidaTuru === '' ||
        haneSayisi.trim() === '' ||
        isNaN(haneSayisi) ||
        gelirDurumu === '' ||
        adres.trim() === '' ||
        !belge
      ) {
        Alert.alert("Eksik veya Hatalı Bilgi", "Lütfen tüm alanları doğru şekilde doldurun.");
        return;
      }

      basvuruData = {
        ...basvuruData,
        gidaTuru,
        haneSayisi: parseInt(haneSayisi),
        gelirDurumu,
        adres,
        ozelGidaTalebi,
      };
    }
    if (bagisTuru === 'Kira Yardımı Talebi') {
      if (
        sehir === '' ||
        adres.trim() === '' ||
        haneSayisi.trim() === '' ||
        isNaN(haneSayisi) ||
        gelirDurumu === '' ||
        kiraTutari.trim() === '' ||
        isNaN(kiraTutari) ||
        !belge
      ) {
        Alert.alert("Eksik veya Hatalı Bilgi", "Lütfen tüm alanları doğru şekilde doldurun.");
        return;
      }

      basvuruData = {
        ...basvuruData,
        sehir,
        adres,
        haneSayisi: parseInt(haneSayisi),
        gelirDurumu,
        kiraTutari: parseFloat(kiraTutari),
        belgeAdi: belge?.name || '',
        belgeURL: await uploadPDFToFirebase(belge),
      };
    }

    if (bagisTuru === 'Diğer') {
      if (digerBaslik.trim() === '' || digerAciklama.trim() === '') {
        Alert.alert("Eksik Bilgi", "Lütfen başlık ve açıklama alanlarını doldurun.");
        return;
      }
    
      const belgeURL = belge ? await uploadPDFToFirebase(belge) : '';
    
      basvuruData = {
        ...basvuruData,
        digerBaslik,
        digerAciklama,
        digerMiktar: digerMiktar ? parseFloat(digerMiktar) : '',
        belgeAdi: belge?.name || '',
        belgeURL,
      };
    }
  
    try {
      await addDoc(collection(db, 'bagisBasvurulari'), basvuruData);

      Alert.alert("Başarılı", "Başvurunuz başarıyla gönderildi!");
      
      setBagisTuru('');
      setEgitimSeviyesi('');
      setTcNo('');
      setMiktar('');
      setAciklama('');
      setFaturaTuru('');
      setSehir('');
      setAboneNo('');
      setFaturaTutari('');
      setGidaTuru('');
      setHaneSayisi('');
      setGelirDurumu('');
      setOzelGidaTalebi('');
      setAdres('');
      setKiraTutari('');
      setBelge(null);
      setBelgeURL('');

    } catch (e) {
      console.error("Kayıt hatası:", e);
      Alert.alert("Hata", "Başvuru sırasında bir sorun oluştu.");
    }
  };
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
    <Text style={styles.label}>Bağış Türü</Text>
    <View style={styles.pickerWrapper}>
      <Picker selectedValue={bagisTuru} onValueChange={(value) => setBagisTuru(value)}>
        <Picker.Item label="Seçiniz..." value="" />
        <Picker.Item label="Eğitim Yardım Talebi" value="Eğitim Yardım Talebi" />
        <Picker.Item label="Fatura Yardımı Talebi" value="Fatura Yardımı Talebi" />
        <Picker.Item label="Gıda Yardımı Talebi" value="Gıda Yardımı Talebi" />
        <Picker.Item label="Kira Yardımı Talebi" value="Kira Yardımı Talebi" />
        <Picker.Item label="Diğer (Spesifik Talep)" value="Diğer" />

      </Picker>
    </View>

      {bagisTuru === 'Eğitim Yardım Talebi' && (
        <>
          <Text style={styles.label}>Eğitim Seviyesi</Text>
          <View style={styles.pickerWrapper}>
            <Picker selectedValue={egitimSeviyesi} onValueChange={(value) => setEgitimSeviyesi(value)}>
              <Picker.Item label="Seçiniz..." value="" />
              {egitimSeviyeleri.map((seviye) => (
                <Picker.Item key={seviye} label={seviye} value={seviye} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>TC Kimlik Numarası</Text>
          <TextInput
            style={styles.input}
            value={tcNo}
            onChangeText={(text) => setTcNo(text.replace(/[^0-9]/g, ''))}
            keyboardType="number-pad"
            maxLength={11}
            placeholder="11 haneli TC Kimlik No"
          />

          <Text style={styles.label}>Talep Edilen Miktar (TL)</Text>
          <TextInput
            style={styles.input}
            value={miktar}
            onChangeText={(text) => setMiktar(text.replace(/[^0-9]/g, ''))}
            keyboardType="number-pad"
            placeholder="Örn: 1000"
          />

          <Text style={styles.label}>Talep Açıklaması</Text>
          <TextInput
            style={[styles.input, { height: 100 }]}
            value={aciklama}
            onChangeText={setAciklama}
            placeholder="Talep açıklamanızı girin"
            multiline
          />

          <Text style={styles.label}>Öğrenci Belgesi (PDF)</Text>
          <TouchableOpacity style={styles.belgeButton} onPress={handleBelgeSec}>
            <Text style={styles.belgeButtonText}>Belge Seç</Text>
          </TouchableOpacity>

          {belge && (
            <View style={styles.belgeOnay}>
              <AntDesign name="file1" size={24} color="#65558F" />
              <Text style={styles.belgeAdi}>{belge.name}</Text>
            </View>
          )}

        </>
      )}

      {bagisTuru === 'Fatura Yardımı Talebi' && (
            <>
            <Text style={styles.label}>Fatura Türü</Text>
          <View style={styles.pickerWrapper}>
            <Picker selectedValue={faturaTuru} onValueChange={(value) => setFaturaTuru(value)}>
              <Picker.Item label="Seçiniz..." value="" />
              {faturaTurleri.map((tur) => <Picker.Item key={tur} label={tur} value={tur} />)}
            </Picker>
          </View>

          <Text style={styles.label}>Şehir</Text>
          <View style={styles.pickerWrapper}>
            <Picker selectedValue={sehir} onValueChange={(value) => setSehir(value)}>
              <Picker.Item label="Seçiniz..." value="" />
              {sehirler.map((s) => <Picker.Item key={s} label={s} value={s} />)}
            </Picker>
          </View>
  
            <Text style={styles.label}>Abone No</Text>
            <TextInput style={styles.input} value={aboneNo} onChangeText={setAboneNo} keyboardType="numeric" />
  
            <Text style={styles.label}>Fatura Tutarı (TL)</Text>
            <TextInput style={styles.input} value={faturaTutari} onChangeText={setFaturaTutari} keyboardType="numeric" />
  
            <Text style={styles.label}>Fatura Belgesi (PDF)</Text>
            <TouchableOpacity style={styles.belgeButton} onPress={handleBelgeSec}>
              <Text style={styles.belgeButtonText}>Belge Seç</Text>
            </TouchableOpacity>
  
            {belge && (
              <View style={styles.belgeOnay}>
                <AntDesign name="file1" size={24} color="#65558F" />
                <Text style={styles.belgeAdi}>{belge.name}</Text>
              </View>
            )}
          </>
      )}
      
      {bagisTuru === 'Gıda Yardımı Talebi' && (
        <>
          <Text style={styles.label}>Gıda Türü</Text>
          <View style={styles.pickerWrapper}>
            <Picker selectedValue={gidaTuru} onValueChange={(value) => setGidaTuru(value)}>
              <Picker.Item label="Seçiniz..." value="" />
              {gidaTurleri.map((tur) => <Picker.Item key={tur} label={tur} value={tur} />)}
            </Picker>
          </View>

          <Text style={styles.label}>Hane Sayısı</Text>
          <TextInput style={styles.input} value={haneSayisi} onChangeText={setHaneSayisi} keyboardType="numeric" />

          <Text style={styles.label}>Gelir Durumu</Text>
          <View style={styles.pickerWrapper}>
            <Picker selectedValue={gelirDurumu} onValueChange={(value) => setGelirDurumu(value)}>
              <Picker.Item label="Seçiniz..." value="" />
              {gelirDurumlari.map((gelir) => <Picker.Item key={gelir} label={gelir} value={gelir} />)}
            </Picker>
          </View>

          <Text style={styles.label}>Adres</Text>
          <TextInput style={styles.input} value={adres} onChangeText={setAdres} placeholder="Adresinizi girin" />

          {gidaTuru === 'Gıda Paketi' && (
            <>
              <Text style={styles.label}>Gıda Paketi İçeriği</Text>
              <View style={styles.icerikListesi}>
                {gidaPaketiIcerigi.map((urun, index) => (
                  <Text key={index} style={styles.icerikItem}>• {urun}</Text>
                ))}
              </View>

              <Text style={styles.label}>Özel Gıda Talebi (Opsiyonel)</Text>
              <TextInput 
                style={styles.input} 
                value={ozelGidaTalebi} 
                onChangeText={setOzelGidaTalebi} 
                placeholder="Özel ihtiyacınız varsa yazın"
              />
            </>
          )}
          <Text style={styles.label}>Gıda Yardımı Belgesi (PDF)</Text>
          <TouchableOpacity style={styles.belgeButton} onPress={handleBelgeSec}>
            <Text style={styles.belgeButtonText}>Belge Seç</Text>
          </TouchableOpacity>

          {belge && (
            <View style={styles.belgeOnay}>
              <AntDesign name="file1" size={24} color="#65558F" />
              <Text style={styles.belgeAdi}>{belge.name}</Text>
            </View>
          )}
        </>
      )}

      {bagisTuru === 'Kira Yardımı Talebi' && (
        <>

          <Text style={styles.label}>Şehir</Text>
          <View style={styles.pickerWrapper}>
          <Picker selectedValue={sehir} onValueChange={setSehir}>
            <Picker.Item label="Seçiniz..." value="" />
            {sehirler.map((s) => <Picker.Item key={s} label={s} value={s} />)}
          </Picker>
          </View>


          <Text style={styles.label}>Adres</Text>
          <TextInput style={styles.input} value={adres} onChangeText={setAdres} placeholder="Adresinizi girin" />

          <Text style={styles.label}>Hane Sayısı</Text>
          <TextInput style={styles.input} value={haneSayisi} onChangeText={setHaneSayisi} keyboardType="numeric" />

          <Text style={styles.label}>Gelir Durumu</Text>
          <View style={styles.pickerWrapper}>
          <Picker selectedValue={gelirDurumu} onValueChange={setGelirDurumu}>
            <Picker.Item label="Seçiniz..." value="" />
            {gelirDurumlari.map((gelir) => <Picker.Item key={gelir} label={gelir} value={gelir} />)}
          </Picker>
          </View>

          <Text style={styles.label}>Kira Tutarı (TL)</Text>
          <TextInput style={styles.input} value={kiraTutari} onChangeText={setKiraTutari} keyboardType="numeric" />

          <Text style={styles.label}>Kira Kontratı Belgesi (PDF)</Text>
          <TouchableOpacity style={styles.belgeButton} onPress={handleBelgeSec}>
            <Text style={styles.belgeButtonText}>Belge Seç</Text>
          </TouchableOpacity>

          {belge && (
            <View style={styles.belgeOnay}>
              <AntDesign name="file1" size={24} color="#65558F" />
              <Text style={styles.belgeAdi}>{belge.name}</Text>
            </View>
          )}
        </>
      )}
      
      {bagisTuru === 'Diğer' && (
        <>
          <Text style={styles.label}>Talep Başlığı</Text>
          <TextInput style={styles.input} value={digerBaslik} onChangeText={setDigerBaslik} placeholder="Örn: Medikal cihaz yardımı" />
      
          <Text style={styles.label}>Talep Açıklaması</Text>
          <TextInput
            style={[styles.input, { height: 100 }]}
            value={digerAciklama}
            onChangeText={setDigerAciklama}
            multiline
            placeholder="Detaylı olarak talebinizi yazınız"
          />
      
          <Text style={styles.label}>Gereken Miktar (TL) (Opsiyonel)</Text>
          <TextInput style={styles.input} value={digerMiktar} onChangeText={setDigerMiktar} keyboardType="numeric" placeholder="Örn: 1500" />
      
          <Text style={styles.label}>İlgili Belge (PDF) (Varsa)</Text>
          <TouchableOpacity style={styles.belgeButton} onPress={handleBelgeSec}>
            <Text style={styles.belgeButtonText}>Belge Seç</Text>
          </TouchableOpacity>
      
          {belge && (
            <View style={styles.belgeOnay}>
              <AntDesign name="file1" size={24} color="#65558F" />
              <Text style={styles.belgeAdi}>{belge.name}</Text>
            </View>
          )}
        </>
      )}  
      
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Başvuruyu Gönder</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  pickerWrapper: {
    width: '100%',
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
  },
  belgeButton: {
    backgroundColor: '#65558F',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  belgeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  belgeOnay: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  belgeAdi: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#2e7d32',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
    width: '100%',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default BagisTalepFormu;
