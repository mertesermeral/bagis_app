import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';

const BagisAlanBagisDurumu = () => {
  const [talepler, setTalepler] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTalepler = async () => {
      try {
        const user = getAuth().currentUser;
        if (!user) return;

        const q = query(
          collection(db, "bagisBasvurulari"),
          where("kullaniciId", "==", user.uid)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTalepler(data);
      } catch (error) {
        console.error("Veri çekme hatası:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTalepler();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#65558F" />
      </View>
    );
  }

  if (talepler.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: '#555' }}>Herhangi bir talep bulunamadı.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {talepler.map((talep) => (
        <View key={talep.id} style={styles.card}>
          <Text style={styles.tur}>{talep.bagisTuru}</Text>
          <Text style={styles.tarih}>
            Talep Tarihi: {new Date(talep.tarih).toLocaleDateString('tr-TR')}
          </Text>
          <Text style={[styles.durum, getDurumStyle(talep.onay)]}>
            Durum: {talep.status === 'tamamlandi' ? 'Tamamlandı' : talep.onay}
          </Text>

          {talep.onay === 'reddedildi' && talep.redAciklamasi && (
            <Text style={styles.redNedeni}>
              ❌ Red Sebebi: {talep.redAciklamasi}
            </Text>
          )}

          {talep.status === 'tamamlandi' && (
            <Text style={styles.tamamlandiInfo}>
              ✅ Bağışınız tamamlandı. En kısa zamanda sizinle iletişime geçilecektir.
            </Text>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

const getDurumStyle = (durum) => {
  switch (durum) {
    case 'onaylandi':
      return { color: 'green', fontWeight: 'bold' };
    case 'reddedildi':
      return { color: 'red', fontWeight: 'bold' };
    default:
      return { color: '#FFA500', fontWeight: 'bold' }; // beklemede
  }
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  tur: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  tarih: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
  },
  durum: {
    fontSize: 14,
    marginBottom: 6,
  },
  redNedeni: {
    fontSize: 13,
    color: '#B71C1C',
    backgroundColor: '#FFEBEE',
    padding: 8,
    borderRadius: 6,
  },
  tamamlandiInfo: {
    marginTop: 8,
    fontSize: 13,
    color: '#2e7d32',
    fontStyle: 'italic',
  },
});

export default BagisAlanBagisDurumu;
