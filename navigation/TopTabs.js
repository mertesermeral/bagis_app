import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import BagisciAnaMenu from "../donor/BagisciAnaMenu";
import BagisciOzelBagis from "../donor/BagisciOzelBagis";
import AcilDurumlar from "../AcilDurumlar/AcilDurumlar";
import Etkinlikler from "../Etkinlikler/Etkinlikler";
import BagisAlanAnaMenu from "../receiver/BagisAlanAnaMenu";
import Fonlar from "../Admin/Fonlar";
import BekleyenTalepler from "../Admin/BekleyenTalepler";
import OnaylananTalepler from "../Admin/OnaylananTalepler";
import ReddedilenTalepler from "../Admin/ReddedilenTalepler";

const Tab = createMaterialTopTabNavigator();

// **Bağışçı (donor) için navigation sekmeleri**
export const DonorTabs = () => (
  <Tab.Navigator 
    initialRouteName="AnaMenu"
    screenOptions={{ 
      tabBarLabelStyle: { fontSize: 14, paddingHorizontal: 5 }, 
      tabBarStyle: { backgroundColor: "#FEF7FF" },
      tabBarIndicatorStyle: { 
        backgroundColor: "#65558F",
        alignSelf: "center",
      }
    }}
  >
    <Tab.Screen 
      name="AnaMenu" 
      component={BagisciAnaMenu} 
      options={{ title: 'Nakdi Bağış' }}
    />
    <Tab.Screen name="Özel Bağış" component={BagisciOzelBagis} />
    <Tab.Screen name="Acil Durumlar" component={AcilDurumlar} />
    <Tab.Screen name="Etkinlikler" component={Etkinlikler} />
  </Tab.Navigator>
);

// **Bağış Alan (receiver) için navigation sekmeleri**
export const ReceiverTabs = () => (
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
    <Tab.Screen name="Etkinlikler" component={Etkinlikler} />
  </Tab.Navigator>
);

// **Admin için navigation sekmeleri**
export const AdminTabs = () => (
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