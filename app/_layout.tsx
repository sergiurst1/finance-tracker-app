import { AuthProvider } from "@/contexts/authContext";
import { Stack } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const StackLayout = () => {
    return (
        <Stack screenOptions={{headerShown: false}}></Stack>
    );
};

export default function RootLayout() {
    return (
        <AuthProvider>
            <StackLayout></StackLayout>
        </AuthProvider>
    );
}

const styles = StyleSheet.create({});