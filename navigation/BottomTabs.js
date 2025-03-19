import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Text } from 'react-native';
import BagisciBagislarim from '../donor/BagisciBagislarim';
import BagisciProfilim from '../donor/BagisciProfilim';
import BagisAlanBagisDurumu from '../receiver/BagisAlanBagisDurumu';
import BagisAlanProfilim from '../receiver/BagisAlanProfilim';

const Tab = createBottomTabNavigator();

// Bağışçı Bottom Tabs
export const DonorBottomTabs = ({ MainComponent }) => (
  <Tab.Navigator
    screenOptions={{
      tabBarStyle: { backgroundColor: '#FEF7FF' },
      tabBarActiveTintColor: '#65558F',
      tabBarInactiveTintColor: '#999999',
    }}
  >
    <Tab.Screen
      name="MainContent"
      component={MainComponent}
      options={{
        headerShown: false,
        tabBarLabel: 'Ana Menü',
        tabBarIcon: ({ color }) => (
          <Icon name="home" size={24} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="BagisciBagislarim"
      options={{
        title: 'Bağışlarım',
        tabBarIcon: ({ color }) => (
          <Icon name="donut-large" size={24} color={color} />
        ),
      }}
      component={BagisciBagislarim}
    />
    <Tab.Screen
      name="BagisciProfilim"
      options={{
        title: 'Profilim',
        tabBarIcon: ({ color }) => (
          <Icon name="person" size={24} color={color} />
        ),
      }}
      component={BagisciProfilim}
    />
  </Tab.Navigator>
);

// Bağış Alan Bottom Tabs
export const ReceiverBottomTabs = ({ MainComponent }) => (
  <Tab.Navigator
    screenOptions={{
      tabBarStyle: { backgroundColor: '#FEF7FF' },
      tabBarActiveTintColor: '#65558F',
      tabBarInactiveTintColor: '#999999',
      headerShown: false,
      tabBarShowIcon: true,
      tabBarLabelStyle: { fontSize: 12 }
    }}
  >
    <Tab.Screen
      name="MainContent"
      component={MainComponent}
      options={{
        headerShown: false,
        tabBarLabel: 'Ana Menü',
        tabBarIcon: ({ color }) => (
          <Icon name="home" size={24} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="BagisAlanBagisDurumu"
      component={BagisAlanBagisDurumu}
      options={{
        headerShown: false,
        title: 'Bağış Durumu',
        tabBarIcon: ({ color }) => (
          <Icon name="donut-large" size={24} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="BagisAlanProfilim"
      component={BagisAlanProfilim}
      options={{
        headerShown: false,
        title: 'Profilim',
        tabBarIcon: ({ color }) => (
          <Icon name="person" size={24} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
);
