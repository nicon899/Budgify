import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import React, { useContext } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import 'react-native-reanimated';
import { finContext } from '../contexts/FinContext';

export default function FinanceStackNavigator() {
    let [fontsLoaded] = useFonts({
        'JetBrainsMono': require('../assets/fonts/JetBrainsMono-Thin.ttf'),
        'JetBrainsMono-Bold': require('../assets/fonts/JetBrainsMono-Bold.ttf'),
    });

    const context = useContext(finContext);
    console.log('FinanceStackNavigator context:', context.isLoading);
    if (context.isLoading || !fontsLoaded) {
        return (
            <View style={styles.screen}>
                <ActivityIndicator size={250} color='#2244FF80' />
            </View>
        );
    }

    return (
        <Stack>
            <Stack.Screen name="index" options={{ title: 'Home', headerShown: false, }} />
            {/* <Stack.Screen name="CreateBooking" options={{ title: 'Create Booking' }} /> */}
            <Stack.Screen name="booking/[bookingId]" options={{ title: 'Booking Details', headerShown: false }} />
            <Stack.Screen name="booking/[bookingId]/edit" options={{ title: 'Edit Category' }} />
            {/* <Stack.Screen name="Settings" options={{ title: 'Settings' }} /> */}
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