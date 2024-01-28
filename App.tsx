import RootStack from './src/navigation';
import { useFonts } from "expo-font";
import ErrorBoundary from 'react-native-error-boundary';
import { Text, TouchableOpacity, View } from 'react-native';
import RNRestart from 'react-native-restart';
import useError from 'hooks/useError';
import 'text-encoding-polyfill';
import { UserProvider } from 'contexts/UserContext';
import FlashMessage, { hideMessage, showMessage } from "react-native-flash-message";
import { LibraryProvider } from 'contexts/LibraryContext';
import { MenuProvider } from 'react-native-popup-menu';
// import 'expo-dev-client';
import * as Updates from 'expo-updates';
import { useEffect } from 'react';

export default function App() {
  const { submitError } = useError();
  const [fontsLoaded, fontError] = useFonts({
    'Metropolis-Black': require('./assets/fonts/Metropolis-Black.otf'),
    'Metropolis-Light': require('./assets/fonts/Metropolis-Light.otf'),
    'Metropolis-Bold': require('./assets/fonts/Metropolis-Bold.otf'),
    'Metropolis-BlackItalic': require('./assets/fonts/Metropolis-BlackItalic.otf'),
    'Metropolis-LightItalic': require('./assets/fonts/Metropolis-LightItalic.otf'),
    'Metropolis-Medium': require('./assets/fonts/Metropolis-Medium.otf'),
    'Metropolis-Regular': require('./assets/fonts/Metropolis-Regular.otf'),
  });

  useEffect(() => {
    checkForUpdates();
  }, []);

  const checkForUpdates = async () => {
    try {
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        showMessage({
          type: "info", 
          message: "A new update is available, click to install",
          autoHide: false,
          onPress: async () => {
            await Updates.fetchUpdateAsync();
            await Updates.reloadAsync();
            hideMessage();
          }
        })        
      }
    } catch (error) {
      // You can also add an alert() to see the error message in case of an error when fetching updates.
      console.log("Error fetching updates");
      console.log(error);
    }
  }

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const onError = async (e: any) => {
    submitError(e);
  }

  const FallbackComponent = () => {
    return (
      <View>
        <Text>Oops, something went wrong, click the button to try again.</Text>
        <TouchableOpacity onPress={() => RNRestart.Restart()}>Try again</TouchableOpacity>
      </View>
    )
  }


  return (
    <ErrorBoundary FallbackComponent={FallbackComponent} onError={onError}>
      <FlashMessage 
        position="bottom" 
        floating={true}
      />
      <MenuProvider>
        <UserProvider>
          <LibraryProvider>
            <RootStack />
          </LibraryProvider>
        </UserProvider>
      </MenuProvider>
    </ErrorBoundary>
  );
}
