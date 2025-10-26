import { authContext } from '@/contexts/AuthContext';
import { Stack } from 'expo-router';
import React, { useContext } from 'react';

export default function FinanceStackNavigator() {

    const auth = useContext(authContext);
    const validToken = auth.token != null && auth.token !== undefined && auth.token !== '' && auth.token !== 'null' && auth.token !== 'undefined';

    return (
        <Stack>
            <Stack.Protected guard={validToken}>
                <Stack.Screen name="(app)"  options={{ headerShown: false }}/>
            </Stack.Protected>

            <Stack.Protected guard={!validToken}>
                <Stack.Screen name="login" options={{ headerShown: false }} />
            </Stack.Protected>
        </Stack>
    );
}