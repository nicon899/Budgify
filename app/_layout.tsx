import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FinProvider } from '../contexts/FinContext';

import { useColorScheme } from '@/hooks/useColorScheme';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import FinanceStackNavigator from './FinanceStackNavigator';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <FinProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: colorScheme === 'dark' ? '#000' : '#fff' }}>
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
          <GestureHandlerRootView>
            <FinanceStackNavigator />
          </GestureHandlerRootView>
          <StatusBar style="auto" />
        </SafeAreaView>
      </FinProvider>
    </ThemeProvider>
  );
}
