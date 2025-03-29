import React, { useEffect, useState } from "react";
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
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const screenWidth = Dimensions.get("window").width;

const BagisciFonDetay = ({ route, navigation }) => {
  const { fon } = route.params;
  const [digerFonlar, setDigerFonlar] = useState([]);
  const progress = Math.min(fon.mevcutMiktar / fon.hedefMiktar, 1);


  useEffect(() => {
    const fetchFonlar = async () => {
      const querySnapshot = await getDocs(collection(db, "fonlar"));
      const fetchedFonlar = querySnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((item) => item.id !== fon.id); // Aynı fonu tekrar gösterme
      setDigerFonlar(fetchedFonlar);
    };

    fetchFonlar();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{ uri: fon.resimURL || "https://via.placeholder.com/150" }}
        style={styles.image}
      />
      <Text style={styles.title}>{fon.ad}</Text>
      <Text style={styles.description}>{fon.aciklama}</Text>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>🎯 Hedef: {fon.hedefMiktar} TL</Text>
        <Text style={styles.infoText}>💰 Toplanan: {fon.mevcutMiktar} TL</Text>
      </View>

      {/* ✅ İlerleme Çubuğu */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
      </View>
      <Text style={styles.progressText}>%{Math.floor(progress * 100)} tamamlandı</Text>


      <TouchableOpacity
        style={styles.donateButton}
        onPress={() => navigation.navigate("OdemeEkrani", { fon })}
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
                    navigation.goBack();
                    setTimeout(() => {
                      navigation.navigate("BagisciFonDetay", { fon: item });
                    }, 100);
                  }}
                  
              >
                <Image source={{ uri: item.resimURL }} style={styles.otherImage} />
                <Text style={styles.otherTitle}>{item.ad}</Text>
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
  },
  otherImage: {
    width: 130,
    height: 90,
    borderRadius: 8,
  },
  otherTitle: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 5,
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
  
});

export default BagisciFonDetay;
