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
            <Stack.Screen name="[categoryId]/booking/create" options={{ title: 'Create Booking' }} />
            <Stack.Screen name="[categoryId]/booking/[bookingId]" options={{ title: 'Booking Details', headerShown: false }} />
            <Stack.Screen name="[categoryId]/booking/[bookingId]/edit" options={{ title: 'Edit Booking', headerShown: false }} />
            <Stack.Screen name="category/[categoryId]/create" options={{ title: 'Create Category', headerShown: false }} />
            <Stack.Screen name="category/[categoryId]" options={{ title: 'Edit Category', headerShown: false }} />
            <Stack.Screen name="settings" options={{ title: 'Settings', headerShown: false, }} />
            <Stack.Screen name="templates" options={{ title: 'Templates', headerShown: false, }} />
            <Stack.Screen name="templates/create" options={{ title: 'Create Template', headerShown: false }} />
            <Stack.Screen name="templates/[templateId]" options={{ title: 'Edit Template', headerShown: false }} />
            <Stack.Screen name="templates/[templateId]/transaction/create" options={{ title: 'Create Transaction', headerShown: false }} />
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