import { authContext } from '@/contexts/AuthContext';
import { Stack } from 'expo-router';
import React, { useContext } from 'react';

export default function FinanceStackNavigator() {

    const auth = useContext(authContext);

    return (
        <Stack>
            <Stack.Protected guard={!!auth.token}>
                <Stack.Screen name="(app)"  options={{ headerShown: false }}/>
            </Stack.Protected>

            <Stack.Protected guard={!auth.token}>
                <Stack.Screen name="login" options={{ headerShown: false }} />
            </Stack.Protected>
        </Stack>
    );
}