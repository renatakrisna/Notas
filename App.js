import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from './screens/LoginScreen';
import { NotesScreen } from './screens/NotesScreen';
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { RegistroScreen } from './screens/RegistroLogin';


const firebaseConfig = {
  apiKey: "AIzaSyCGqrcaz1ZgijN0-0sXaBpnQKmHPkTHO1c",
  authDomain: "noteapp-ae5a1.firebaseapp.com",
  projectId: "noteapp-ae5a1",
  storageBucket: "noteapp-ae5a1.appspot.com",
  messagingSenderId: "443412674665",
  appId: "1:443412674665:web:ccf7137eca1cf873348af8",
  measurementId: "G-Z21RFG8XBR"
};

export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export const firestore = getFirestore(app)

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer >
      <Stack.Navigator initialRouteName="Login" screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Notes" component={NotesScreen} />
        <Stack.Screen name="Register" component={RegistroScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
