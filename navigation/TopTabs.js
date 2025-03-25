import React from "react";
import { View, StyleSheet} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
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
// **Bağışçı (Donor) için navigation sekmeleri**
export const DonorTabs = () => (
  <View style={styles.container}>
    {/* Navigation Bar */}
    <Tab.Navigator
      initialRouteName="AnaMenu"
      screenOptions={{
        tabBarStyle: styles.tabBarStyle,
        tabBarActiveTintColor: "#65558F",
        tabBarInactiveTintColor: "#999999",
        tabBarLabelStyle: styles.tabBarLabelStyle,
      }}
    >
      <Tab.Screen
        name="AnaMenu"
        component={BagisciAnaMenu}
        options={{
          tabBarLabel: "Nakdi Bağış",
          tabBarIcon: ({ color }) => <Icon name="home" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Özel Bağış"
        component={BagisciOzelBagis}
        options={{
          tabBarLabel: "Özel Bağış",
          tabBarIcon: ({ color }) => <Icon name="volunteer-activism" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Acil Durumlar"
        component={AcilDurumlar}
        options={{
          tabBarLabel: "Acil Durum",
          tabBarIcon: ({ color }) => <Icon name="warning" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Etkinlikler"
        component={Etkinlikler}
        options={{
          tabBarLabel: "Etkinlikler",
          tabBarIcon: ({ color }) => <Icon name="event" size={24} color={color} />,
        }}
      />
    </Tab.Navigator>
  </View>
);

// **Bağış Alan (Receiver) için navigation sekmeleri**
export const ReceiverTabs = () => (
  <View style={styles.container}>
    <Tab.Navigator
      initialRouteName="AnaMenu"
      screenOptions={{
        tabBarStyle: styles.tabBarStyle,
        tabBarActiveTintColor: "#65558F",
        tabBarInactiveTintColor: "#999999",
        tabBarLabelStyle: styles.tabBarLabelStyle,
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="AnaMenu"
        component={BagisAlanAnaMenu}
        options={{
          tabBarLabel: "Ana Menü",
          tabBarIcon: ({ color }) => <Icon name="home" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Acil Durumlar"
        component={AcilDurumlar}
        options={{
          tabBarLabel: "Acil Durum",
          tabBarIcon: ({ color }) => <Icon name="priority-high" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Etkinlikler"
        component={Etkinlikler}
        options={{
          tabBarLabel: "Etkinlikler",
          tabBarIcon: ({ color }) => <Icon name="event" size={24} color={color} />,
        }}
      />
    </Tab.Navigator>
  </View>
);

// **Admin için navigation sekmeleri**
export const AdminTabs = () => (
  <View style={styles.container}>
    <Tab.Navigator
      initialRouteName="Fonlar"
      screenOptions={{
        tabBarStyle: styles.tabBarStyle,
        tabBarActiveTintColor: "#65558F",
        tabBarInactiveTintColor: "#999999",
        tabBarLabelStyle: styles.tabBarLabelStyle,
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Fonlar"
        component={Fonlar}
        options={{
          tabBarLabel: "Fonlar",
          tabBarIcon: ({ color }) => <Icon name="account-balance" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Bekleyen Talepler"
        component={BekleyenTalepler}
        options={{
          tabBarLabel: "Bekleyen",
          tabBarIcon: ({ color }) => <Icon name="hourglass-empty" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Onaylanan Talepler"
        component={OnaylananTalepler}
        options={{
          tabBarLabel: "Onaylanan",
          tabBarIcon: ({ color }) => <Icon name="check-circle" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Reddedilen Talepler"
        component={ReddedilenTalepler}
        options={{
          tabBarLabel: "Reddedilen",
          tabBarIcon: ({ color }) => <Icon name="cancel" size={24} color={color} />,
        }}
      />
    </Tab.Navigator>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBarStyle: {
    backgroundColor: "#FEF7FF",
    height: 70,  // 60'tan 70'e yükselttim
    elevation: 4, // Gölge ekledim
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  tabBarLabelStyle: {
    fontSize: 12,
    fontWeight: "bold",
  },
});
