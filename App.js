import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AdminLoginScreen from './screen/AdminLoginScreen';
import ManageDocumentScreen from './screen/ManageDocumentScreen';
import ManageUsersScreen from './screen/ManageUsersScreen';
import StallScreen from './screen/StallScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="AdminLogin" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
        <Stack.Screen name="ManageDocument" component={ManageDocumentScreen} />
        <Stack.Screen name="ManageUsers" component={ManageUsersScreen} />
        <Stack.Screen name="Stalls" component={StallScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}