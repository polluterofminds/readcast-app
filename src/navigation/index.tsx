import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Linking from "expo-linking";
import BottomTabNavigator from './tab-navigator';
import Modal from '../screens/Auth';
import { Text } from 'react-native';


export type RootStackParamList = {
  TabNavigator: undefined;
  Modal: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const prefix = Linking.createURL("/");

const linking = {
  prefixes: [prefix],
  config: {
    screens: {
      Feed: "Feed"
    },
  },
};

export default function RootStack() {
  return (
    <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
      <Stack.Navigator initialRouteName="TabNavigator">
        <Stack.Screen
          name="TabNavigator"
          component={BottomTabNavigator}
          options={{ headerShown: false }}
        />       
      </Stack.Navigator>
    </NavigationContainer>
  );
}
