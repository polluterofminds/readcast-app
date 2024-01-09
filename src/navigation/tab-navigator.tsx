import FontAwesome from '@expo/vector-icons/FontAwesome';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Search from '../screens/Search';
import HomeStackComponent from './home-stack';
import Library from '~/screens/Library';

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
          backgroundColor: '#181A1A'
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackComponent}
        options={{
          title: "",
          headerShown: false, 
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />
        }}
      />
      <Tab.Screen
        name="Library"
        component={Library}
        options={{
          title: '',
          headerStyle: {
            backgroundColor: '#181A1A',
          },
          headerTitleStyle: {
            color: '#EAF4F4',
          },
          headerShadowVisible: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="book" color={color} />,
        }}
      />
      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          title: '',
          headerShadowVisible: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="search" color={color} />,
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
