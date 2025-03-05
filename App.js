import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./LoginScreen";
import RegisterScreen from "./RegisterScreen";
import BagisAlanAnaMenu from "./receiver/BagisAlanAnaMenu";
import BagisAlanAcilDurumlar from "./receiver/BagisAlanAcilDurumlar";
import BagisAlanEtkinlikler from "./ortak/Etkinlikler";
import EtkinlikEkle from './ortak/EtkinlikEkle';
import BagisAlanNakdiBagisTalebi from "./receiver/BagisAlanNakdiBagisTalebi";
import BagisAlanEgitimYardimTalebi from "./receiver/BagisAlanEgitimYardimTalebi";
import BagisAlanBagisDurumu from "./receiver/BagisAlanBagisDurumu";
import BagisAlanProfilim from "./receiver/BagisAlanProfilim";
import BagisAlanEtkinliklerDetay from "./ortak/EtkinliklerDetay";
import BagisciAnaMenu from "./donor/BagisciAnaMenu";
import BagisciOzelBagis from "./donor/BagisciOzelBagis";
import BagisciAcilDurumlar from "./donor/BagisciAcilDurumlar";
import BagisciEgitimYardimlari from "./donor/BagisciEgitimYardimlari";
import BagisciEgitimOdeme from "./donor/BagisciEgitimOdeme";
import BagisciBagislarim from "./donor/BagisciBagislarim";
import BagisciProfilim from "./donor/BagisciProfilim";
import BagisciAcilDurumTalebiOlustur from "./donor/BagisciAcilDurumTalebiOlustur";
import BagisciAcilDurumDetay from "./donor/BagisciAcilDurumDetay";
import BagisciOzelBagisDetay from "./donor/BagisciOzelBagisDetay";





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
      <Stack.Screen name="BagisAlanAcilDurumlar" component={BagisAlanAcilDurumlar} />
      <Stack.Screen name="BagisAlanEtkinlikler" component={BagisAlanEtkinlikler}/>
      <Stack.Screen name="EtkinlikEkle" component={EtkinlikEkle} />
      <Stack.Screen name="BagisAlanNakdiBagisTalebi" component={BagisAlanNakdiBagisTalebi}/>
      <Stack.Screen name="BagisAlanEgitimYardimTalebi" component={BagisAlanEgitimYardimTalebi}/>
      <Stack.Screen name="BagisAlanBagisDurumu" component={BagisAlanBagisDurumu}/>
      <Stack.Screen name="BagisAlanProfilim" component={BagisAlanProfilim}/>
      <Stack.Screen name="BagisAlanEtkinliklerDetay" component={BagisAlanEtkinliklerDetay}/>
      <Stack.Screen name="BagisciAnaMenu" component={BagisciAnaMenu}/>
      <Stack.Screen name="BagisciOzelBagis" component={BagisciOzelBagis}/>
      <Stack.Screen name="BagisciAcilDurumlar" component={BagisciAcilDurumlar}/>
      <Stack.Screen name="BagisciAcilDurumTalebiOlustur" component={BagisciAcilDurumTalebiOlustur}/>
      <Stack.Screen name="BagisciAcilDurumDetay" component={BagisciAcilDurumDetay}/>
      <Stack.Screen name="BagisciEgitimYardimlari" component={BagisciEgitimYardimlari}/>
      <Stack.Screen name="BagisciEgitimOdeme" component={BagisciEgitimOdeme}/>
      <Stack.Screen name="BagisciBagislarim" component={BagisciBagislarim}/>
      <Stack.Screen name="BagisciProfilim" component={BagisciProfilim}/>
      <Stack.Screen name="BagisciOzelBagisDetay" component={BagisciOzelBagisDetay}/>

      

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
