import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { FinProvider } from '../contexts/FinContext';

import { useColorScheme } from '@/hooks/useColorScheme';
import FinanceStackNavigator from './FinanceStackNavigator';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <FinProvider>
       <FinanceStackNavigator />
        <StatusBar style="auto" />
      </FinProvider>
    </ThemeProvider>
  );
}
