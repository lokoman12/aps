import * as React from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import СourseScreen from './src/screens/home/СourseScreen';
import Weather from './src/screens/account/Weather';

import Map from './src/screens/map/Map';
import NoteScreen from './src/screens/catalog/Note';
import Welcome from './src/screens/welcome/Welcome';
import WelcomeScreen from './src/screens/welcome/WelcomePage';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={Welcome} options={{ headerShown: false }} />
        <Stack.Screen name="Main" component={MainTabNavigator} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function MainTabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Главаная"
        component={WelcomeScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Курс валют"
        component={СourseScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="usd" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Заметки"
        component={NoteScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="sticky-note" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="карта"
        component={Map}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="map" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Погода"
        component={Weather}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="sun-o" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default App;
