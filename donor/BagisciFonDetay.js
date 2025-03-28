import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
} from "react-native";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { useFocusEffect } from '@react-navigation/native';
import { db } from "../firebase";

const screenWidth = Dimensions.get("window").width;

const BagisciFonDetay = ({ route, navigation }) => {
  const [aktifFon, setAktifFon] = useState(route.params.fon);
  const [digerFonlar, setDigerFonlar] = useState([]);

  const progress = useMemo(() => {
    return Math.min(aktifFon.mevcutMiktar / aktifFon.hedefMiktar, 1);
  }, [aktifFon]);

  const fetchFonlar = async () => {
    const querySnapshot = await getDocs(collection(db, "fonlar"));
    const fetchedFonlar = querySnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((item) => item.id !== aktifFon.id);
    setDigerFonlar(fetchedFonlar);
  };

  const fetchUpdatedFon = async () => {
    const docRef = doc(db, "fonlar", aktifFon.id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setAktifFon({ id: docSnap.id, ...docSnap.data() });
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchFonlar();
      fetchUpdatedFon();
    }, [aktifFon.id])
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{ uri: aktifFon.resimURL || "https://via.placeholder.com/150" }}
        style={styles.image}
      />
      <Text style={styles.title}>{aktifFon.ad}</Text>
      <Text style={styles.description}>{aktifFon.aciklama}</Text>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>🎯 Hedef: {aktifFon.hedefMiktar} TL</Text>
        <Text style={styles.infoText}>💰 Toplanan: {aktifFon.mevcutMiktar} TL</Text>
      </View>

      {/* ✅ İlerleme Çubuğu */}
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
      </View>
      <Text style={styles.progressText}>%{Math.floor(progress * 100)} tamamlandı</Text>

      <TouchableOpacity
        style={styles.donateButton}
        onPress={() => navigation.navigate("OdemeEkrani", { fon: aktifFon })}
      >
        <Text style={styles.buttonText}>Bağış Yap</Text>
      </TouchableOpacity>

      {digerFonlar.length > 0 && (
        <>
          <Text style={styles.otherHeader}>Diğer Fonlar</Text>
          <FlatList
            data={digerFonlar}
            horizontal
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.otherList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.otherCard}
                onPress={() => {
                  navigation.push("BagisciFonDetay", { fon: item });
                }}
              >
                <Image source={{ uri: item.resimURL }} style={styles.otherImage} />
                <Text style={styles.otherTitle}>{item.ad}</Text>
                <Text style={styles.otherButton}>Detay</Text>
              </TouchableOpacity>
            )}
          />
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
    paddingBottom: 60,
    backgroundColor: "#fff",
  },
  image: {
    width: screenWidth - 40,
    height: 220,
    borderRadius: 12,
    marginBottom: 20,
    marginTop: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#333",
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 14,
  },
  infoBox: {
    marginVertical: 10,
    alignItems: "center",
  },
  infoText: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
    color: "#444",
  },
  progressBarContainer: {
    width: '100%',
    height: 16,
    backgroundColor: '#eee',
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 10,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4caf50',
  },
  progressText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  donateButton: {
    backgroundColor: "#2e7d32",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginVertical: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  otherHeader: {
    fontSize: 18,
    fontWeight: "600",
    alignSelf: "flex-start",
    marginVertical: 10,
    color: "#333",
  },
  otherList: {
    paddingLeft: 5,
  },
  otherCard: {
    width: 140,
    marginRight: 10,
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  otherImage: {
    width: 130,
    height: 90,
    borderRadius: 8,
    marginBottom: 5,
  },
  otherTitle: {
    fontSize: 14,
    textAlign: "center",
    fontWeight: "600",
    color: "#333",
  },
  otherButton: {
    marginTop: 4,
    fontSize: 12,
    color: "#2e7d32",
    fontWeight: "bold",
  },
});

export default BagisciFonDetay;
