import 'react-native-gesture-handler';
import RootStack from './src/navigation';
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useCallback } from 'react';
import { View } from 'react-native';

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    'Metropolis-Black': require('./assets/fonts/Metropolis-Black.otf'),
    'Metropolis-Light': require('./assets/fonts/Metropolis-Light.otf'),
    'Metropolis-Bold': require('./assets/fonts/Metropolis-Bold.otf'),
    'Metropolis-BlackItalic': require('./assets/fonts/Metropolis-BlackItalic.otf'),
    'Metropolis-LightItalic': require('./assets/fonts/Metropolis-LightItalic.otf'),
    'Metropolis-Medium': require('./assets/fonts/Metropolis-Medium.otf'),
    'Metropolis-Regular': require('./assets/fonts/Metropolis-Regular.otf'),
  });
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (<RootStack />);
}
