import { createStackNavigator } from "@react-navigation/stack";
import Book from "../screens/Book"
import Feed from "~/screens/Feed";
import { Image, Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import FullList from "~/screens/Feed/FullList";
import { useNavigation } from "@react-navigation/native";
import Auth from "~/screens/Auth";
import { useUser } from "hooks/useUser";
import Review from "~/screens/Review";

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
  const { userState } = useUser();
  const navigation = useNavigation()
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
          
          headerRight: () => (
            <TouchableOpacity className="pb-2" onPress={() => navigation.navigate('Auth')}>
              {
                userState.pfp !== "" ?
                  <View>
                    <Image
                      source={{uri: userState?.pfp }}
                      className="h-10 w-10 rounded-full mr-2"
                    />
                  </View> :
                  <Ionicons
                    name="person-outline"
                    size={24}
                    color="#EAF4F4"                    
                  />
              }
            </TouchableOpacity>
          ),
          headerLeft: () => (
            <View className="w-full ml-2 flex flex-row pb-2">
              <View className="border-b border-b-primary">
                <Text className="text-2xl text-light font-bold" style={{ fontFamily: 'Metropolis-Black' }}>Good</Text>
              </View>
              <View>
                <Text className="text-2xl text-light font-bold" style={{ fontFamily: 'Metropolis-Black' }}>{" "}{getTimeOfDay()}</Text>
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
        name="Review"
        component={Review}
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
      <HomeStack.Screen
        name="Auth"
        component={Auth}
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