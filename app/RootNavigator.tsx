import { authContext } from '@/contexts/AuthContext';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import React, { useContext, useRef } from 'react';
import { ActivityIndicator, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Login from './login';

export default function FinanceStackNavigator() {
    const auth = useContext(authContext);
    const validToken = auth.token != null && auth.token !== undefined && auth.token !== '' && auth.token !== 'null' && auth.token !== 'undefined';

    let headerShown = useRef(Platform.OS === 'web' ? true : true);

    let [fontsLoaded] = useFonts({
        'JetBrainsMono': require('../assets/fonts/JetBrainsMono-Thin.ttf'),
        'JetBrainsMono-Bold': require('../assets/fonts/JetBrainsMono-Bold.ttf'),
    });

    // const context = useContext(finContext);
    if (!fontsLoaded) {
        return (
            <SafeAreaView style={styles.screen}>
                <ActivityIndicator size={250} color='#2244FF80' />
            </SafeAreaView>
        );
    }

    if (!validToken) {
        return <Login />
    }

    return (
        <Stack >
            <Stack.Screen name="(app)/index" options={{ headerShown: true, title: 'Budgify' }} />
            <Stack.Screen name="(app)/category/create" options={{ title: 'Create Category', headerShown: headerShown.current }} />
            <Stack.Screen name="(app)/category/[categoryId]/index" options={{ title: 'Home', headerShown: headerShown.current }} />
            <Stack.Screen name="(app)/category/[categoryId]/edit" options={{ title: 'Edit Category', headerShown: headerShown.current }} />
            <Stack.Screen name="(app)/category/[categoryId]/transaction/create" options={{ title: 'Create Transaction', headerShown: headerShown.current }} />
            <Stack.Screen name="(app)/category/[categoryId]/transaction/[transactionId]/edit" options={{ title: 'Edit Transaction', headerShown: headerShown.current }} />
            <Stack.Screen name="(app)/templates/index" options={{ title: 'Templates', headerShown: headerShown.current }} />
            <Stack.Screen name="(app)/templates/create" options={{ title: 'Create Template', headerShown: headerShown.current }} />
            <Stack.Screen name="(app)/templates/[templateId]/index" options={{ title: 'Template Page', headerShown: headerShown.current }} />
            <Stack.Screen name="(app)/templates/[templateId]/transaction/create" options={{ title: 'Create Transaction', headerShown: headerShown.current }} />
            <Stack.Screen name="(app)/templates/[templateId]/transaction/[transactionId]/edit" options={{ title: 'Edit Transaction', headerShown: headerShown.current }} />
            <Stack.Screen name="(app)/+not-found" />
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