import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthProvider } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import RootNavigator from './RootNavigator';
import theme from './theme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AuthProvider>
          <SafeAreaView style={{ flex: 1, backgroundColor: colorScheme === 'dark' ? theme.colors.background : '#fff'}}>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
            <GestureHandlerRootView>
              <RootNavigator />
            </GestureHandlerRootView>
            <StatusBar style="auto" />
          </SafeAreaView>
        </AuthProvider>
    </ThemeProvider>
  );
}
