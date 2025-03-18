import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./LoginScreen";
import RegisterScreen from "./RegisterScreen";
import BagisAlanAnaMenu from "./receiver/BagisAlanAnaMenu";
import BagisAlanEtkinlikler from "./Etkinlikler/Etkinlikler";
import EtkinlikEkle from './Etkinlikler/EtkinlikEkle';
import BagisAlanNakdiBagisTalebi from "./receiver/BagisAlanNakdiBagisTalebi";
import BagisAlanEgitimYardimTalebi from "./receiver/BagisAlanEgitimYardimTalebi";
import BagisAlanBagisDurumu from "./receiver/BagisAlanBagisDurumu";
import BagisAlanProfilim from "./receiver/BagisAlanProfilim";
import BagisAlanEtkinliklerDetay from "./Etkinlikler/EtkinliklerDetay";
import BagisciAnaMenu from "./donor/BagisciAnaMenu";
import BagisciOzelBagis from "./donor/BagisciOzelBagis";
import AcilDurumlar from "./AcilDurumlar/AcilDurumlar";
import BagisciEgitimYardimlari from "./donor/BagisciEgitimYardimlari";
import BagisciEgitimOdeme from "./donor/BagisciEgitimOdeme";
import BagisciBagislarim from "./donor/BagisciBagislarim";
import BagisciProfilim from "./donor/BagisciProfilim";
import AcilDurumTalebiOlustur from "./AcilDurumlar/AcilDurumTalebiOlustur";
import AcilDurumDetay from "./AcilDurumlar/AcilDurumDetay";
import BagisciOzelBagisDetay from "./donor/BagisciOzelBagisDetay";
import Navigation from "./Navigator/Navigation";




const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        {/* Login Screen */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            headerShown: false, // Eğer üstte başlık istemiyorsanız
          }}
        />

        {/* Register Screen */}
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{
             headerShown: false ,
          }}
        />
      <Stack.Screen name="BagisAlanAnaMenu" component={BagisAlanAnaMenu} />
      <Stack.Screen name="BagisAlanEtkinlikler" component={BagisAlanEtkinlikler}/>
      <Stack.Screen name="EtkinlikEkle" component={EtkinlikEkle} />
      <Stack.Screen name="BagisAlanNakdiBagisTalebi" component={BagisAlanNakdiBagisTalebi}/>
      <Stack.Screen name="BagisAlanEgitimYardimTalebi" component={BagisAlanEgitimYardimTalebi}/>
      <Stack.Screen name="BagisAlanBagisDurumu" component={BagisAlanBagisDurumu}/>
      <Stack.Screen name="BagisAlanProfilim" component={BagisAlanProfilim}/>
      <Stack.Screen name="BagisAlanEtkinliklerDetay" component={BagisAlanEtkinliklerDetay}/>
      <Stack.Screen name="BagisciAnaMenu" component={BagisciAnaMenu}/>
      <Stack.Screen name="BagisciOzelBagis" component={BagisciOzelBagis}/>
      <Stack.Screen name="AcilDurumlar" component={AcilDurumlar}/>
      <Stack.Screen name="AcilDurumTalebiOlustur" component={AcilDurumTalebiOlustur}/>
      <Stack.Screen name="AcilDurumDetay" component={AcilDurumDetay}/>
      <Stack.Screen name="BagisciEgitimYardimlari" component={BagisciEgitimYardimlari}/>
      <Stack.Screen name="BagisciEgitimOdeme" component={BagisciEgitimOdeme}/>
      <Stack.Screen name="BagisciBagislarim" component={BagisciBagislarim}/>
      <Stack.Screen name="BagisciProfilim" component={BagisciProfilim}/>
      <Stack.Screen name="BagisciOzelBagisDetay" component={BagisciOzelBagisDetay}/>
      <Stack.Screen name="Navigation" component={Navigation}/>
      

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
