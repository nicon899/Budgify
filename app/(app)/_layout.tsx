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

    if (!auth.token) {
        return (
            <Stack >
                <Stack.Screen name="(pages)/user/login" options={{ headerShown: false }} />
            </Stack >
        );
    }

    return (
        <Stack >
            <Stack.Screen name="index" options={{ headerShown: false, title: 'Index' }} />
            <Stack.Screen name="category/create" options={{ title: 'Create Category', headerShown: false }} />
            <Stack.Screen name="category/[categoryId]/index" options={{ title: 'Home' }} />
            <Stack.Screen name="category/[categoryId]/edit" options={{ title: 'Edit Category' }} />
            <Stack.Screen name="category/[categoryId]/transaction/create" options={{ title: 'Create Transaction' }} />
            <Stack.Screen name="category/[categoryId]/transaction/[transactionId]/edit" options={{ title: 'Edit Transaction' }} />
            <Stack.Screen name="templates/index" options={{ title: 'Templates' }} />
            <Stack.Screen name="templates/create" options={{ title: 'Create Template', headerShown: false }} />
            <Stack.Screen name="templates/[templateId]/index" options={{ title: 'Template Page' }} />
            <Stack.Screen name="templates/[templateId]/transaction/create" options={{ title: 'Create Transaction', headerShown: false }} />
            <Stack.Screen name="templates/[templateId]/transaction/[transactionId]/edit" options={{ title: 'Edit Transaction'}} />
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