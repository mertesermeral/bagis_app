import React, { useState, useEffect } from "react";
import { Text, View, Alert } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useAuth, AuthProvider } from "./AuthContext";  
import LoginScreen from "./LoginScreen";
import RegisterScreen from "./RegisterScreen";
import EtkinlikEkle from './Etkinlikler/EtkinlikEkle';
import BagisAlanNakdiBagisTalebi from "./receiver/BagisAlanNakdiBagisTalebi";
import BagisAlanBagisDurumu from "./receiver/BagisAlanBagisDurumu";
import EtkinliklerDetay from "./Etkinlikler/EtkinliklerDetay";
import BagisciBagislarim from "./donor/BagisciBagislarim";
import AcilDurumTalebiOlustur from "./AcilDurumlar/AcilDurumTalebiOlustur";
import AcilDurumDetay from "./AcilDurumlar/AcilDurumDetay";
import BagisciOzelBagisDetay from "./donor/BagisciOzelBagisDetay";
import { DonorBottomTabs, ReceiverBottomTabs } from './navigation/BottomTabs';
import { AdminBottomTabs } from './navigation/BottomTabs'; 
import { DonorTabs, ReceiverTabs, AdminTabs } from './navigation/TopTabs'; // Yeni import
import Profile from "./components/Profile";
import HesapAyarlari from './components/HesapAyarlari';
import FonDetay from "./Admin/FonDetay";
import FonGuncelle from "./Admin/FonGuncelle";
import YeniFonEkle from "./Admin/YeniFonEkle";
import TalepDetay from "./Admin/TalepDetay";
import OdemeEkrani from "./donor/OdemeEkrani";
import BagisciFonDetay from "./donor/BagisciFonDetay";
import Iletisim from "./components/Iletisim"; // Yeni import
import Hakkimizda from './components/Hakkimizda';



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

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#fff' }
      }}
      initialRouteName={role ? 
        (role === "donor" ? "DonorTabs" : 
         role === "receiver" ? "ReceiverTabs" : 
         role === "admin" ? "AdminTabs" : "LoginScreen") 
        : "LoginScreen"}
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
      <Stack.Screen name="BagisAlanBagisDurumu" component={BagisAlanBagisDurumu} />
      <Stack.Screen name="EtkinliklerDetay" component={EtkinliklerDetay} />
      <Stack.Screen 
        name="BagisciBagislarim" 
        component={BagisciBagislarim} 
        options={{ headerShown: false }}
      />
      <Stack.Screen name="AcilDurumTalebiOlustur" component={AcilDurumTalebiOlustur} options={{ presentation: 'modal' }} />
      <Stack.Screen name="AcilDurumDetay" component={AcilDurumDetay} options={{ presentation: 'modal' }} />
      <Stack.Screen name="BagisciOzelBagisDetay" component={BagisciOzelBagisDetay} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="HesapAyarlari" component={HesapAyarlari} />
      <Stack.Screen name="Hakkimizda" component={Hakkimizda} />
      <Stack.Screen name="Iletisim" component={Iletisim} />
      <Stack.Screen name="TalepDetay" component={TalepDetay} />
      <Stack.Screen name="YeniFonEkle" component={YeniFonEkle} />
      <Stack.Screen name="FonDetay" component={FonDetay} />
      <Stack.Screen name="FonGuncelle" component={FonGuncelle} />
      <Stack.Screen name="OdemeEkrani" component={OdemeEkrani} />
      <Stack.Screen name="BagisciFonDetay" component={BagisciFonDetay} />

    </Stack.Navigator>
  );
};

const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Bir hata oluştu. Lütfen uygulamayı yeniden başlatın.</Text>
      </View>
    );
  }

  return children;
};

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <NavigationContainer>
          <MainApp />
        </NavigationContainer>
      </AuthProvider>
    </ErrorBoundary>
  );
}