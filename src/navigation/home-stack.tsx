import { createStackNavigator } from "@react-navigation/stack";
import Book from "../screens/Book"
import Feed from "~/screens/Feed";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import FullList from "~/screens/Feed/FullList";

const HomeStack = createStackNavigator();

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={styles.tabBarIcon} {...props} />;
}

const getTimeOfDay = () => {
  const hours = new Date().getHours()
  const morning = hours > 0 && hours < 12;
  const afternoon = hours > 11 && hours < 17;
  const evening = hours > 16 && hours < 24;
  if (morning) {
    return "Morning"
  }

  if (afternoon) {
    return "Afternoon"
  }

  if (evening) {
    return "Evening"
  }
}

const HomeStackComponent = () => {
  return (
      <HomeStack.Navigator>
        <HomeStack.Screen 
          options={{
            title: '',
            headerStyle: {
              backgroundColor: '#181A1A',
            },
            headerTitleStyle: {
              color: '#EAF4F4',
            },
            headerShadowVisible: false,
            tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
            headerRight: () => (
              <Pressable className="pb-2" onPress={() => navigation.navigate('Modal')}>
                {({ pressed }) => (
                  <Ionicons
                    name="person-outline"
                    size={24}
                    color="#EAF4F4"
                    style={[styles.headerRight, { opacity: pressed ? 0.5 : 1 }]}
                  />
                )}
              </Pressable>
            ),
            headerLeft: () => (
              <View className="w-full ml-2 flex flex-row pb-2">
                <View className="border-b border-b-primary">
                  <Text className="text-2xl text-light font-bold" style={{fontFamily: 'Metropolis-Black'}}>Good</Text>
                </View>
                <View>
                  <Text className="text-2xl text-light font-bold" style={{fontFamily: 'Metropolis-Black'}}>{" "}{getTimeOfDay()}</Text>
                </View>
              </View>            
            ),
          }}
          name="Feed" 
          component={Feed} />
        <HomeStack.Screen 
          name="BookDetails" 
          component={Book} 
          options={{
            headerShown: false, 
          }}
        />
        <HomeStack.Screen 
          name="FullList" 
          component={FullList} 
          options={{
            headerShown: false, 
          }}
        />
      </HomeStack.Navigator>
  )
}

const styles = StyleSheet.create({
  headerRight: {
    marginRight: 15,
  },
  tabBarIcon: {
    marginBottom: -3,
  },
});

export default HomeStackComponent