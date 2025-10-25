import { authContext } from '@/contexts/AuthContext';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import React, { useContext } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export default function FinanceStackNavigator() {
    let [fontsLoaded] = useFonts({
        'JetBrainsMono': require('../../assets/fonts/JetBrainsMono-Thin.ttf'),
        'JetBrainsMono-Bold': require('../../assets/fonts/JetBrainsMono-Bold.ttf'),
    });
    const auth = useContext(authContext);
    
    // const context = useContext(finContext);
    if (!fontsLoaded) {
        return (
            <View style={styles.screen}>
                <ActivityIndicator size={250} color='#2244FF80' />
            </View>
        );
    }

    console.log('Auth token:', auth.token);
    if (!auth.token) {
        console.log('No auth token, redirecting to login');
        return (
            <Stack >
                <Stack.Screen name="(pages)/user/login" options={{ headerShown: false }} />
            </Stack >
        );
    }
    console.log('Auth token found, rendering app stack');

    return (
        <Stack >
            <Stack.Screen name="index" options={{ headerShown: false, title: 'Home' }} />
            {/* <Stack.Screen name="category/[categoryId]/index" options={{ title: 'Edit Category', headerShown: false }} /> */}
            {/* <Stack.Screen name="category/[categoryId]/create" options={{ title: 'Create Category', headerShown: false }} /> */}
            {/* <Stack.Screen name="[categoryId]/booking/create" options={{ title: 'Create Booking' }} /> */}
            {/* <Stack.Screen name="[categoryId]/booking/[bookingId]" options={{ title: 'Booking Details', headerShown: false }} /> */}
            {/* <Stack.Screen name="[categoryId]/booking/[bookingId]/edit" options={{ title: 'Edit Booking', headerShown: false }} /> */}
            {/* <Stack.Screen name="settings" options={{ title: 'Settings', headerShown: false, }} /> */}
            {/* <Stack.Screen name="templates" options={{ title: 'Templates', headerShown: false, }} /> */}
            {/* <Stack.Screen name="templates/create" options={{ title: 'Create Template', headerShown: false }} /> */}
            {/* <Stack.Screen name="templates/[templateId]" options={{ title: 'Edit Template', headerShown: false }} /> */}
            {/* <Stack.Screen name="templates/[templateId]/transaction/create" options={{ title: 'Create Transaction', headerShown: false }} /> */}
            {/* <Stack.Screen name="templates/[templateId]/transaction/[transactionId]/edit" options={{ title: 'Edit Transaction', headerShown: false }} /> */}
            <Stack.Screen name="+not-found" />
        </Stack>
    );
}
const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: 'black',
        color: 'white',
        justifyContent: 'center',
    }
})