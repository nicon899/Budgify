import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FinProvider } from '../contexts/FinContext';

import { AppDatabaseProvider } from '@/components/AppDatabaseProvider';
import { useColorScheme } from '@/hooks/useColorScheme';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import FinanceStackNavigator from './FinanceStackNavigator';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AppDatabaseProvider>
        <FinProvider>
          <SafeAreaView style={{ flex: 1, backgroundColor: colorScheme === 'dark' ? '#000' : '#fff' }}>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
            <GestureHandlerRootView>
              <FinanceStackNavigator />
            </GestureHandlerRootView>
            <StatusBar style="auto" />
          </SafeAreaView>
        </FinProvider>
      </AppDatabaseProvider>
    </ThemeProvider>
  );
}
