import FontAwesome from '@expo/vector-icons/FontAwesome';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Search from '../screens/Search';
import HomeStackComponent from './home-stack';
import Library from '~/screens/Library';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
// const HomeStack = createStackNavigator();

interface TabLayoutProps {
  navigation: any
}

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={styles.tabBarIcon} {...props} />;
}

export default function TabLayout({ navigation }: TabLayoutProps) {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#EAF4F4',
        tabBarStyle: {
          backgroundColor: '#181A1A',
          paddingTop: 10
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackComponent}
        options={{
          title: "",
          headerShown: false,
          tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={28} color={color} />
        }}
      />
      <Tab.Screen
        name="Library"
        component={Library}
        options={{
          title: '',
          headerShadowVisible: false,
          tabBarIcon: ({ color }) => <Ionicons name="library" size={28} color={color} />,
          headerStyle: {
            backgroundColor: '#181A1A',
          },
          headerTitleStyle: {
            color: '#EAF4F4',
          },
          headerLeft: () => (
            <View className="w-full p-4 flex flex-row h-20 items-center mt-2">
              <TouchableOpacity onPress={() => navigation.goBack()}><TabBarIcon name="chevron-left" color="#EAF4F4" /></TouchableOpacity>
              <View className="ml-4">
                <Text className="text-3xl font-bold text-light" style={{fontFamily: "Metropolis-Bold"}}>Library</Text>
                <View className="border-b-4 border-primary"></View>
              </View>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          title: '',
          headerShadowVisible: false,
          tabBarIcon: ({ color }) => <Ionicons name="search-outline" size={28} color={color} />,
          headerStyle: {
            backgroundColor: '#181A1A',
          },
          headerTitleStyle: {
            color: '#EAF4F4',
          },
          headerLeft: () => (
            <View className="w-full p-4 flex flex-row pb-2 h-12 mt-4">
              <TouchableOpacity onPress={() => navigation.goBack()}><TabBarIcon name="chevron-left" color="#EAF4F4" /></TouchableOpacity>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  headerRight: {
    marginRight: 15,
  },
  tabBarIcon: {
    marginBottom: -3,
  },
});
