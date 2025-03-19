import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

// **Bağış Alan (Receiver) Sayfaları**
import BagisAlanAnaMenu from "./receiver/BagisAlanAnaMenu";
import BagisAlanEtkinlikler from "./Etkinlikler/Etkinlikler";
import EtkinlikEkle from "./Etkinlikler/EtkinlikEkle";
import BagisAlanNakdiBagisTalebi from "./receiver/BagisAlanNakdiBagisTalebi";
import BagisAlanEgitimYardimTalebi from "./receiver/BagisAlanEgitimYardimTalebi";
import BagisAlanBagisDurumu from "./receiver/BagisAlanBagisDurumu";
import BagisAlanProfilim from "./receiver/BagisAlanProfilim";
import BagisAlanEtkinliklerDetay from "./Etkinlikler/EtkinliklerDetay";

// **Bağışçı (Donor) Sayfaları**
import BagisciAnaMenu from "./donor/BagisciAnaMenu";
import BagisciOzelBagis from "./donor/BagisciOzelBagis";
import BagisciBagislarim from "./donor/BagisciBagislarim";
import BagisciProfilim from "./donor/BagisciProfilim";
import BagisciEgitimYardimlari from "./donor/BagisciEgitimYardimlari";
import BagisciEgitimOdeme from "./donor/BagisciEgitimOdeme";
import BagisciOzelBagisDetay from "./donor/BagisciOzelBagisDetay";

// **Acil Durum Sayfaları**
import AcilDurumTalebiOlustur from "./AcilDurumlar/AcilDurumTalebiOlustur";
import AcilDurumDetay from "./AcilDurumlar/AcilDurumDetay";

// **Giriş Sayfaları**
import LoginScreen from "./LoginScreen";
import RegisterScreen from "./RegisterScreen";


// 📌 **Ortak Etkinlikler ve Acil Durumlar Sayfalarını Dahil Et**
import OrtakEtkinlikler from "./Etkinlikler/Etkinlikler"; 
import OrtakAcilDurumlar from "./AcilDurumlar/AcilDurumlar";


// **Stack ve Tab Navigator oluşturma**
const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

// **Bağış Alan (Receiver) Üst Sekme Navigasyonu**
const ReceiverTabNavigator = ({ userRole }) => (
  <Tab.Navigator
    screenOptions={{
      tabBarStyle: { backgroundColor: "#65558F" },
      tabBarActiveTintColor: "#fff",
      tabBarInactiveTintColor: "#ddd",
      tabBarIndicatorStyle: { backgroundColor: "#fff" },
    }}
  >
    <Tab.Screen name="Yardım Ekranı" component={BagisAlanAnaMenu} />
    <Tab.Screen name="Etkinlikler">
      {props => <OrtakEtkinlikler {...props} userRole={userRole} />}
    </Tab.Screen>
    <Tab.Screen name="Acil Durumlar">
      {props => <OrtakAcilDurumlar {...props} userRole={userRole} />}
    </Tab.Screen>
  </Tab.Navigator>
);

// **Bağışçı (Donor) Üst Sekme Navigasyonu**
const DonorTabNavigator = ({ userRole }) => (
  <Tab.Navigator
    screenOptions={{
      tabBarStyle: { backgroundColor: "#65558F" },
      tabBarActiveTintColor: "#fff",
      tabBarInactiveTintColor: "#ddd",
      tabBarIndicatorStyle: { backgroundColor: "#fff" },
    }}
  >
    <Tab.Screen name="Nakdi Bağış" component={BagisciAnaMenu} />
    <Tab.Screen name="Özel Bağış" component={BagisciOzelBagis} />
    <Tab.Screen name="Etkinlikler">
      {props => <OrtakEtkinlikler {...props} userRole={userRole} />}
    </Tab.Screen>
    <Tab.Screen name="Acil Durumlar">
      {props => <OrtakAcilDurumlar {...props} userRole={userRole} />}
    </Tab.Screen>
  </Tab.Navigator>
);


// **MainTabs Ekranı**
const MainTabs = ({ route }) => {
  return route.params?.userRole === "donor" ? (
    <DonorTabNavigator userRole={route.params?.userRole} />
  ) : (
    <ReceiverTabNavigator userRole={route.params?.userRole} />
  );
};
const App = () => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists() && docSnap.data().role) {
            setUserRole(docSnap.data().role);
          } else {
            console.error("Kullanıcı Firestore'da bulunamadı veya rol eksik.");
          }
        } catch (error) {
          console.error("Kullanıcı rolü alınırken hata oluştu:", error);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!userRole ? (
          <>
            <Stack.Screen name="Login">
              {(props) => <LoginScreen {...props} setUserRole={setUserRole} />}
            </Stack.Screen>
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <Stack.Screen name="MainTabs" component={MainTabs} initialParams={{ userRole }} />
        )}

        {/* **Tüm Diğer Sayfalar** */}
        <Stack.Screen name="EtkinlikEkle" component={EtkinlikEkle} />
        <Stack.Screen name="BagisAlanNakdiBagisTalebi" component={BagisAlanNakdiBagisTalebi} />
        <Stack.Screen name="BagisAlanEgitimYardimTalebi" component={BagisAlanEgitimYardimTalebi} />
        <Stack.Screen name="BagisAlanBagisDurumu" component={BagisAlanBagisDurumu} />
        <Stack.Screen name="BagisAlanProfilim" component={BagisAlanProfilim} />
        <Stack.Screen name="BagisAlanEtkinliklerDetay" component={BagisAlanEtkinliklerDetay} />
        <Stack.Screen name="BagisciEgitimYardimlari" component={BagisciEgitimYardimlari} />
        <Stack.Screen name="BagisciProfilim" component={BagisciProfilim} />
        <Stack.Screen name="BagisciBagislarim" component={BagisciBagislarim} />
        <Stack.Screen name="BagisciEgitimOdeme" component={BagisciEgitimOdeme} />
        <Stack.Screen name="BagisciOzelBagisDetay" component={BagisciOzelBagisDetay} />
        <Stack.Screen name="AcilDurumTalebiOlustur" component={AcilDurumTalebiOlustur} />
        <Stack.Screen name="AcilDurumDetay" component={AcilDurumDetay} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
