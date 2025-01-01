import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./LoginScreen";
import RegisterScreen from "./RegisterScreen";
import BagisAlanAnaMenu from "./receiver/BagisAlanAnaMenu";
import BagisAlanAcilDurumlar from "./receiver/BagisAlanAcilDurumlar";
import BagisAlanEtkinlikler from "./receiver/BagisAlanEtkinlikler";
import BagisAlanNakdiBagisTalebi from "./receiver/BagisAlanNakdiBagisTalebi";
import BagisAlanEgitimYardimTalebi from "./receiver/BagisAlanEgitimYardimTalebi";
import BagisAlanBagisDurumu from "./receiver/BagisAlanBagisDurumu";
import BagisAlanProfilim from "./receiver/BagisAlanProfilim";
import BagisAlanEtkinliklerDetay from "./receiver/BagisAlanEtkinliklerDetay";
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
      <Stack.Screen name="BagisAlanNakdiBagisTalebi" component={BagisAlanNakdiBagisTalebi}/>
      <Stack.Screen name="BagisAlanEgitimYardimTalebi" component={BagisAlanEgitimYardimTalebi}/>
      <Stack.Screen name="BagisAlanBagisDurumu" component={BagisAlanBagisDurumu}/>
      <Stack.Screen name="BagisAlanProfilim" component={BagisAlanProfilim}/>
      <Stack.Screen name="BagisAlanEtkinliklerDetay" component={BagisAlanEtkinliklerDetay}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
