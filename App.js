import React from "react";
import { Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useAuth, AuthProvider } from "./AuthContext";  
import LoginScreen from "./LoginScreen";
import RegisterScreen from "./RegisterScreen";
import EtkinlikEkle from './Etkinlikler/EtkinlikEkle';
import BagisAlanNakdiBagisTalebi from "./receiver/BagisAlanNakdiBagisTalebi";
import BagisAlanEgitimYardimTalebi from "./receiver/BagisAlanEgitimYardimTalebi";
import BagisAlanBagisDurumu from "./receiver/BagisAlanBagisDurumu";
import EtkinliklerDetay from "./Etkinlikler/EtkinliklerDetay";
import BagisciEgitimYardimlari from "./donor/BagisciEgitimYardimlari";
import BagisciEgitimOdeme from "./donor/BagisciEgitimOdeme";
import BagisciBagislarim from "./donor/BagisciBagislarim";
import AcilDurumTalebiOlustur from "./AcilDurumlar/AcilDurumTalebiOlustur";
import AcilDurumDetay from "./AcilDurumlar/AcilDurumDetay";
import BagisciOzelBagisDetay from "./donor/BagisciOzelBagisDetay";
import { DonorBottomTabs, ReceiverBottomTabs } from './navigation/BottomTabs';
import { AdminBottomTabs } from './navigation/BottomTabs'; 
import { DonorTabs, ReceiverTabs, AdminTabs } from './navigation/TopTabs'; // Yeni import
import Profile from "./components/Profile";
import HesapAyarlari from './components/HesapAyarlari';

const Stack = createStackNavigator();

// Wrapper bileşenleri
const DonorTabsWrapper = (props) => (
  <DonorBottomTabs MainComponent={DonorTabs} {...props} />
);

const ReceiverTabsWrapper = (props) => (
  <ReceiverBottomTabs MainComponent={ReceiverTabs} {...props} />
);

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
      <Stack.Screen name="EtkinliklerDetay" component={EtkinliklerDetay} />
      <Stack.Screen name="BagisciEgitimYardimlari" component={BagisciEgitimYardimlari} />
      <Stack.Screen name="BagisciEgitimOdeme" component={BagisciEgitimOdeme} />
      <Stack.Screen name="BagisciBagislarim" component={BagisciBagislarim} />
      <Stack.Screen name="AcilDurumTalebiOlustur" component={AcilDurumTalebiOlustur} options={{ presentation: 'modal' }} />
      <Stack.Screen name="AcilDurumDetay" component={AcilDurumDetay} options={{ presentation: 'modal' }} />
      <Stack.Screen name="BagisciOzelBagisDetay" component={BagisciOzelBagisDetay} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="HesapAyarlari" component={HesapAyarlari} />
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
