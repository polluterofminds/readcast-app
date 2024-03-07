import FontAwesome from '@expo/vector-icons/FontAwesome';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Search from '../screens/Search';
import HomeStackComponent from './home-stack';
import Library from '~/screens/Library';
import { Ionicons } from '@expo/vector-icons';
import { FONTS } from 'constants/fonts';
import { LinearGradient } from 'expo-linear-gradient';

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
        tabBarActiveTintColor: '#0E0E0E',
        tabBarStyle: {
          backgroundColor: '#fff',
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
          headerBackground: () => (            
            <LinearGradient
              colors={['#CEFF41', '#EEFFBC']}
              style={{ flex: 1 }}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              className="border border-b-dark py-4"
            />
          ),            
          headerTitleStyle: {
            color: '#EAF4F4',
          },
          headerLeft: () => (
            <View className="w-full p-4 flex flex-row h-20 items-center mt-2 mb-2">
              <TouchableOpacity onPress={() => navigation.goBack()}><TabBarIcon name="chevron-left" color="#0E0E0E" /></TouchableOpacity>
              {/* <View className="ml-4">
                <Text className="text-3xl font-bold text-dark" style={{fontFamily: FONTS.Heavy}}>Library</Text>
              </View> */}
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
          headerBackground: () => (            
            <LinearGradient
              colors={['#CEFF41', '#EEFFBC']}
              style={{ flex: 1 }}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              className="border border-b-dark py-4"
            />
          ),       
          headerTitleStyle: {
            color: '#EAF4F4',
          },
          headerLeft: () => (
            <View className="w-full p-4 flex flex-row pb-2 h-20 mt-4">
              <TouchableOpacity onPress={() => navigation.goBack()}><TabBarIcon name="chevron-left" color="#0E0E0E" /></TouchableOpacity>
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
