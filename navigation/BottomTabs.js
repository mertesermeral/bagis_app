import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BagisciBagislarim from '../donor/BagisciBagislarim';
import BagisAlanBagisDurumu from '../receiver/BagisAlanBagisDurumu';
import Profile from '../components/Profile';

const Tab = createBottomTabNavigator();

export const AdminBottomTabs = ({ MainComponent }) => (
  <Tab.Navigator
    screenOptions={{
      tabBarStyle: { backgroundColor: '#FEF7FF' },
      tabBarActiveTintColor: '#65558F',
      tabBarInactiveTintColor: '#999999',
    }}
  >
    <Tab.Screen
      name="AdminMainTabs"
      component={MainComponent}
      options={{
        headerShown: false,
        tabBarLabel: 'Yönetim',
        tabBarIcon: ({ color }) => (
          <Icon name="admin-panel-settings" size={24} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
);

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
      component={Profile}
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
      component={Profile}
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
