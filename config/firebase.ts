// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {initializeAuth, getReactNativePersistence} from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAjtVsgxNk8k7W--aW-bWBFyiWfk_WZy90",
  authDomain: "expence-tracker-dc485.firebaseapp.com",
  projectId: "expence-tracker-dc485",
  storageBucket: "expence-tracker-dc485.firebasestorage.app",
  messagingSenderId: "911598665488",
  appId: "1:911598665488:web:7d778964ea08350f6bef95"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

//db
export const firestore = getFirestore(app);