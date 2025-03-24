import React from "react";
import { Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { useAuth, AuthProvider } from "./AuthContext";  
import LoginScreen from "./LoginScreen";
import RegisterScreen from "./RegisterScreen";
import BagisAlanAnaMenu from "./receiver/BagisAlanAnaMenu";
import BagisAlanEtkinlikler from "./Etkinlikler/Etkinlikler";
import EtkinlikEkle from './Etkinlikler/EtkinlikEkle';
import BagisAlanNakdiBagisTalebi from "./receiver/BagisAlanNakdiBagisTalebi";
import BagisAlanEgitimYardimTalebi from "./receiver/BagisAlanEgitimYardimTalebi";
import BagisAlanBagisDurumu from "./receiver/BagisAlanBagisDurumu";
import BagisAlanEtkinliklerDetay from "./Etkinlikler/EtkinliklerDetay";
import BagisciAnaMenu from "./donor/BagisciAnaMenu";
import BagisciOzelBagis from "./donor/BagisciOzelBagis";
import AcilDurumlar from "./AcilDurumlar/AcilDurumlar";
import BagisciEgitimYardimlari from "./donor/BagisciEgitimYardimlari";
import BagisciEgitimOdeme from "./donor/BagisciEgitimOdeme";
import BagisciBagislarim from "./donor/BagisciBagislarim";
import AcilDurumTalebiOlustur from "./AcilDurumlar/AcilDurumTalebiOlustur";
import AcilDurumDetay from "./AcilDurumlar/AcilDurumDetay";
import BagisciOzelBagisDetay from "./donor/BagisciOzelBagisDetay";
import { DonorBottomTabs, ReceiverBottomTabs } from './navigation/BottomTabs';
import { AdminBottomTabs } from './navigation/BottomTabs'; 
import AdminPanel from "./Admin/AdminPanel";
import Fonlar from "./Admin/Fonlar";
import BekleyenTalepler from "./Admin/BekleyenTalepler";
import TalepDetay from "./Admin/TalepDetay";
import OnaylananTalepler from "./Admin/OnaylananTalepler";
import ReddedilenTalepler from "./Admin/ReddedilenTalepler";
import Profile from "./components/Profile";
import HesapAyarlari from './components/HesapAyarlari';

const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

// **Bağışçı (donor) için navigation sekmeleri**
const DonorTabs = () => (
  <Tab.Navigator 
    initialRouteName="AnaMenu"
    screenOptions={{ 
      tabBarLabelStyle: { fontSize: 14 }, 
      tabBarStyle: { backgroundColor: "#FEF7FF" } 
    }}
  >
    <Tab.Screen 
      name="AnaMenu" 
      component={BagisciAnaMenu} 
      options={{ title: 'Nakdi Bağış' }}
    />
    <Tab.Screen name="Özel Bağış" component={BagisciOzelBagis} />
    <Tab.Screen name="Acil Durumlar" component={AcilDurumlar} />
    <Tab.Screen name="Etkinlikler" component={BagisAlanEtkinlikler} />
  </Tab.Navigator>
);

// **Bağış Alan (receiver) için navigation sekmeleri**
const ReceiverTabs = () => (
  <Tab.Navigator 
    initialRouteName="AnaMenu"
    screenOptions={{ 
      tabBarLabelStyle: { fontSize: 14 }, 
      tabBarStyle: { backgroundColor: "#FEF7FF" },
      tabBarIndicatorStyle: { backgroundColor: "#65558F" }
    }}
  >
    <Tab.Screen 
      name="AnaMenu" 
      component={BagisAlanAnaMenu} 
      options={{ title: 'Yardım Ekranı' }}
    />
    <Tab.Screen name="Acil Durumlar" component={AcilDurumlar} />
    <Tab.Screen name="Etkinlikler" component={BagisAlanEtkinlikler} />
  </Tab.Navigator>
);

const AdminTabs = () => (
  <Tab.Navigator
    initialRouteName="Fonlar"
    screenOptions={{
      tabBarLabelStyle: { fontSize: 14 },
      tabBarStyle: { backgroundColor: "#FEF7FF" },
      tabBarIndicatorStyle: { backgroundColor: "#65558F" },
    }}
  >
    <Tab.Screen name="Fonlar" component={Fonlar} />
    <Tab.Screen name="Bekleyen Talepler" component={BekleyenTalepler} />
    <Tab.Screen name="Onaylanan Talepler" component={OnaylananTalepler} />
    <Tab.Screen name="ReddedilenTalepler" component={ReddedilenTalepler} />
  </Tab.Navigator>
);

// Wrapper bileşenleri
const DonorTabsWrapper = (props) => (
  <DonorBottomTabs MainComponent={DonorTabs} {...props} />
);

const ReceiverTabsWrapper = (props) => (
  <ReceiverBottomTabs MainComponent={ReceiverTabs} {...props} />
);
// Admin wrapper
const AdminTabsWrapper = (props) => (
  <AdminBottomTabs MainComponent={AdminTabs} {...props} />
);


const MainApp = () => {
  const { role, loading } = useAuth();

  if (loading) {
    return <Text style={{ textAlign: "center", marginTop: 20 }}>Yükleniyor...</Text>;
  }
  // Rol bazlı ilk yönlendirme
  let initialScreen = "LoginScreen";
  if (role === "donor") initialScreen = "DonorTabs";
  else if (role === "receiver") initialScreen = "ReceiverTabs";
  else if (role === "admin") initialScreen = "AdminTabs"; // <-- admin panel yönlendirme


  return (
    <Stack.Navigator 
      screenOptions={{ headerShown: false }}
      initialRouteName={initialScreen}
      >
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />

      {/* Bottom tab'li ana ekranlar */}
      <Stack.Screen 
        name="DonorTabs" 
        component={DonorTabsWrapper}
      />
      <Stack.Screen 
        name="ReceiverTabs" 
        component={ReceiverTabsWrapper}
        options={{ headerShown: false }}
      />
       <Stack.Screen name="AdminTabs" component={AdminTabsWrapper} />

      {/* Diğer ekranlar (modal olarak açılacak) */}
      <Stack.Screen name="EtkinlikEkle" component={EtkinlikEkle} options={{ presentation: 'modal' }} />
      <Stack.Screen name="BagisAlanNakdiBagisTalebi" component={BagisAlanNakdiBagisTalebi} />
      <Stack.Screen name="BagisAlanEgitimYardimTalebi" component={BagisAlanEgitimYardimTalebi} />
      <Stack.Screen name="BagisAlanBagisDurumu" component={BagisAlanBagisDurumu} />
      <Stack.Screen name="BagisAlanEtkinliklerDetay" component={BagisAlanEtkinliklerDetay} />
      <Stack.Screen name="BagisciEgitimYardimlari" component={BagisciEgitimYardimlari} />
      <Stack.Screen name="BagisciEgitimOdeme" component={BagisciEgitimOdeme} />
      <Stack.Screen name="BagisciBagislarim" component={BagisciBagislarim} />
      <Stack.Screen name="AcilDurumTalebiOlustur" component={AcilDurumTalebiOlustur} options={{ presentation: 'modal' }} />
      <Stack.Screen name="AcilDurumDetay" component={AcilDurumDetay} options={{ presentation: 'modal' }} />
      <Stack.Screen name="BagisciOzelBagisDetay" component={BagisciOzelBagisDetay} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="TalepDetay" component={TalepDetay} />
      <Stack.Screen name="OnaylananTalepler" component={OnaylananTalepler} />

      <Stack.Screen 
        name="HesapAyarlari" 
        component={HesapAyarlari}
        options={{ 
          headerShown: true,
          title: 'Hesap Ayarları',
          headerTintColor: '#65558F'
        }} 
      />
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <MainApp />  
      </NavigationContainer>
    </AuthProvider>
  );
}
