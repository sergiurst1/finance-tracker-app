# 💰 Expense Tracker App

A professional, full-stack personal finance management application built with **React Native (Expo)** and **Firebase**. This app provides a seamless experience for tracking income and expenses, managing multiple wallets, and visualizing financial data through interactive charts.

[![GitHub license](https://img.shields.io/github/license/sergiurst1/finance-tracker-app)](https://github.com/sergiurst1/finance-tracker-app/blob/main/LICENSE)
[![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![Firebase](https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase)](https://firebase.google.com/)

---

## 📸 Preview

| Home Screen | Statistics (Charts) | Search Transactions |
| :---: | :---: | :---: |
| ![Home](https://via.placeholder.com/200x400?text=Home+Screen) | ![Stats](https://via.placeholder.com/200x400?text=Charts) | ![Search](https://via.placeholder.com/200x400?text=Search) |

---

## 🚀 Key Features

### 💵 Comprehensive Transaction Tracking
*   **CRUD Operations**: Effortlessly add, view, update, and delete income or expense entries.
*   **Receipt Uploads**: Attach and view images of receipts using Firebase Storage and Cloudinary integration.
*   **Dynamic Balance**: Automatically calculates total balance across all your registered wallets.

### 📊 Advanced Data Visualization
*   **Interactive Bar Charts**: Powered by `react-native-gifted-charts`, featuring paired bars for Income vs. Expenses.
*   **Timeframe Filtering**: Toggle views between **Weekly**, **Monthly**, and **Yearly** statistics.
*   **Firestore Aggregation**: High-performance data fetching and formatting logic.

### 🔍 Search & Discovery
*   **Instant Local Search**: Filter through your entire transaction history in real-time.
*   **Multi-Field Matching**: Search by category, description, or type (Income/Expense).

### 💳 Wallet & Profile Management
*   **Multiple Wallets**: Create distinct accounts for "Cash," "Savings," "Freelance," etc.
*   **Profile Customization**: Update display names and profile avatars directly from the app.
*   **Secure Auth**: Powered by Firebase Authentication.

---

## 🛠️ Tech Stack

*   **Frontend**: React Native (Expo SDK 50+)
*   **Navigation**: Expo Router (File-based routing)
*   **Backend**: Firebase Firestore (Database) & Auth
*   **Charts**: React-Native-Gifted-Charts
*   **Icons**: Phosphor React Native
*   **Styling**: Custom responsive scaling utilities for Cross-Platform compatibility (iOS/Android).

---

## 📦 Installation & Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/sergiurst1/finance-tracker-app.git
   cd finance-tracker-app
   ```
2. **Firebase Configuration**
   Create a project in the Firebase Console.
   Enable Firestore and Email/Password Authentication.
   Create a file at src/config/firebase.ts (or your preferred config location) and add your web configuration:
   ```bash
   import { initializeApp } from "firebase/app";
   import { getFirestore } from "firebase/firestore";
   import { initializeAuth, getReactNativePersistence } from "firebase/auth";
   import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
   
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   
   const app = initializeApp(firebaseConfig);
   export const db = getFirestore(app);
   export const auth = initializeAuth(app, {
     persistence: getReactNativePersistence(ReactNativeAsyncStorage)
   });
   ```
3. **Run the Projec**
   ```bash
   npx expo start
   ```
