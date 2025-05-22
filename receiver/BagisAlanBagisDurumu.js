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
    <View style={styles.mainContainer}>
      <Text style={styles.header}>Bağış Taleplerim</Text>
      <ScrollView 
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={true}
        bounces={true}
      >
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
    </View>
  );
};

const getDurumStyle = (durum) => {
  switch (durum) {
    case 'onaylandi':
      return { color: '#2e7d32', fontWeight: 'bold' };
    case 'reddedildi':
      return { color: '#d32f2f', fontWeight: 'bold' };
    default:
      return { color: '#ed6c02', fontWeight: 'bold' };
  }
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    padding: 16,
    flexGrow: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#65558F',
  },
  tur: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a237e',
    marginBottom: 8,
  },
  tarih: {
    fontSize: 15,
    color: '#666',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  durum: {
    fontSize: 16,
    marginBottom: 10,
    backgroundColor: '#f8f8f8',
    padding: 8,
    borderRadius: 8,
  },
  redNedeni: {
    fontSize: 14,
    color: '#d32f2f',
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#d32f2f',
  },
  tamamlandiInfo: {
    marginTop: 10,
    fontSize: 14,
    color: '#2e7d32',
    backgroundColor: '#e8f5e9',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#2e7d32',
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 40, // Increased from 20
    marginBottom: 20,
    textAlign: "center",
    color: "#1a237e",
  },
});

export default BagisAlanBagisDurumu;
