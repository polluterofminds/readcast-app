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
import Library from "~/screens/Library";
import { FONTS } from "constants/fonts";
import { LinearGradient } from 'expo-linear-gradient';


const HomeStack = createStackNavigator();

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
          headerBackground: () => (            
            <LinearGradient
              colors={['#CEFF41', '#EEFFBC']}
              style={{ flex: 1 }}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              className="border border-b-dark"
            />
          ),            
          headerShadowVisible: false,
          headerRight: () => (
            <TouchableOpacity className="pb-4" onPress={() => navigation.navigate('Auth')}>
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
              <View className="">
                <Text className="text-3xl text-dark font-black tracking-tighter" style={{ fontFamily: FONTS.Super }}>Good</Text>
              </View>
              <View>
                <Text className="text-3xl text-dark font-black tracking-tighter" style={{ fontFamily: FONTS.Super }}>{" "}{getTimeOfDay()}</Text>
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
  }
});

export default HomeStackComponent