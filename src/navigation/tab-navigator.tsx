import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Feed from '../screens/Feed';
import Two from '../screens/two';
import { createStackNavigator } from '@react-navigation/stack';
import HomeStackComponent from './home-stack';

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

// const getTimeOfDay = () => {
//   const hours = new Date().getHours()
//   const morning = hours > 0 && hours < 12;
//   const afternoon = hours > 11 && hours < 17;
//   const evening = hours > 16 && hours < 24;
//   if (morning) {
//     return "Morning"
//   }

//   if (afternoon) {
//     return "Afternoon"
//   }

//   if (evening) {
//     return "Evening"
//   }
// }

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
        // options={{
        //   title: '',
        //   headerStyle: {
        //     backgroundColor: '#181A1A',
        //   },
        //   headerTitleStyle: {
        //     color: '#EAF4F4',
        //   },
        //   headerShadowVisible: false,
        //   tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        //   headerRight: () => (
        //     <Pressable className="pb-2" onPress={() => navigation.navigate('Modal')}>
        //       {({ pressed }) => (
        //         <Ionicons
        //           name="person-outline"
        //           size={24}
        //           color="#EAF4F4"
        //           style={[styles.headerRight, { opacity: pressed ? 0.5 : 1 }]}
        //         />
        //       )}
        //     </Pressable>
        //   ),
        //   headerLeft: () => (
        //     <View className="w-full ml-2 flex flex-row pb-2">
        //       <View className="border-b border-b-primary">
        //         <Text className="text-2xl text-light font-bold" style={{fontFamily: 'Metropolis-Black'}}>Good</Text>
        //       </View>
        //       <View>
        //         <Text className="text-2xl text-light font-bold" style={{fontFamily: 'Metropolis-Black'}}>{" "}{getTimeOfDay()}</Text>
        //       </View>
        //     </View>            
        //   ),
        // }}
      />
      <Tab.Screen
        name="Library"
        component={Two}
        options={{
          title: '',
          tabBarIcon: ({ color }) => <TabBarIcon name="book" color={color} />,
        }}
      />
      <Tab.Screen
        name="Search"
        component={Two}
        options={{
          title: '',
          tabBarIcon: ({ color }) => <TabBarIcon name="search" color={color} />,
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
