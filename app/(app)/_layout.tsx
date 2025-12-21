import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import React, { useRef } from 'react';
import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native';

export default function FinanceStackNavigator() {
    let headerShown = useRef(Platform.OS === 'web' ? true : false);

    let [fontsLoaded] = useFonts({
        'JetBrainsMono': require('../../assets/fonts/JetBrainsMono-Thin.ttf'),
        'JetBrainsMono-Bold': require('../../assets/fonts/JetBrainsMono-Bold.ttf'),
    });

    // const context = useContext(finContext);
    if (!fontsLoaded) {
        return (
            <View style={styles.screen}>
                <ActivityIndicator size={250} color='#2244FF80' />
            </View>
        );
    }

    return (
        <Stack >
            <Stack.Screen name="index" options={{ headerShown: false, title: 'Index' }} />
            <Stack.Screen name="category/create" options={{ title: 'Create Category', headerShown: headerShown.current }} />
            <Stack.Screen name="category/[categoryId]/index" options={{ title: 'Home', headerShown: headerShown.current }} />
            <Stack.Screen name="category/[categoryId]/edit" options={{ title: 'Edit Category', headerShown: headerShown.current }} />
            <Stack.Screen name="category/[categoryId]/transaction/create" options={{ title: 'Create Transaction', headerShown: headerShown.current }} />
            <Stack.Screen name="category/[categoryId]/transaction/[transactionId]/edit" options={{ title: 'Edit Transaction', headerShown: headerShown.current}} />
            <Stack.Screen name="templates/index" options={{ title: 'Templates', headerShown: headerShown.current }} />
            <Stack.Screen name="templates/create" options={{ title: 'Create Template', headerShown: headerShown.current }} />
            <Stack.Screen name="templates/[templateId]/index" options={{ title: 'Template Page', headerShown: headerShown.current }} />
            <Stack.Screen name="templates/[templateId]/transaction/create" options={{ title: 'Create Transaction', headerShown: headerShown.current }} />
            <Stack.Screen name="templates/[templateId]/transaction/[transactionId]/edit" options={{ title: 'Edit Transaction', headerShown: headerShown.current}} />
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