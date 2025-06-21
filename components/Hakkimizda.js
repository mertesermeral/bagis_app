import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';

const Hakkimizda = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image 
          source={require("../assets/logo.png")}
          style={styles.logo}
        />
        <Text style={styles.appName}>Fonity</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Hakkımızda</Text>
        <Text style={styles.description}>
          Fonity, ihtiyaç sahipleri ile yardımseverler arasında güvenilir bir köprü kurarak
          yardımlaşmayı kolaylaştırmayı amaçlayan bir platformdur.
        </Text>

        <Text style={styles.subtitle}>Misyonumuz</Text>
        <Text style={styles.text}>
          Modern teknoloji ile geleneksel yardımlaşma kültürünü birleştirerek, 
          ihtiyaç sahiplerine hızlı ve etkili bir şekilde ulaşmayı hedefliyoruz.
        </Text>

        <Text style={styles.subtitle}>Vizyonumuz</Text>
        <Text style={styles.text}>
          Türkiye'nin en güvenilir ve yaygın kullanılan yardımlaşma platformu olmak ve
          toplumsal dayanışmayı güçlendirmektir.
        </Text>

        <Text style={styles.subtitle}>Değerlerimiz</Text>
        <Text style={styles.text}>• Güvenilirlik{"\n"}• Şeffaflık{"\n"}• Erişilebilirlik{"\n"}• Hızlı Çözüm</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  logoContainer: {
    alignItems: 'center',
    padding: 20,
    marginTop: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#65558F',
    marginBottom: 5,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#65558F',
    marginTop: 20,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
});

export default Hakkimizda;
