import React from 'react'
import { View, Text, Image, TouchableOpacity, SafeAreaView } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { UserState } from 'contexts/UserContext';
import { BUILD_NUMBER } from 'config';

interface ProfileProps {
  handleLogOut: Function;
  userState: UserState;
}
const Profile = ({ handleLogOut, userState }: ProfileProps) => {
  const navigation = useNavigation();
  return (
    <SafeAreaView>
      <View className="px-4">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View className="flex flex-row items-center bg-dark rounded-full p-2">
            <FontAwesome name="chevron-left" size={20} color="#EAF4F4" />
            <Text className="ml-4 text-xl text-light" style={{ fontFamily: "Metropolis-Bold" }}>Home</Text>
          </View>
        </TouchableOpacity>

        <Text className="text-3xl font-bold text-light mt-6">Account</Text>
        <View className="w-[30%] border-b-4 border-primary mb-6">
        </View>
        <View className="flex flex-row items-center">
          <Image
            source={{ uri: userState.pfp }}
            className="h-16 w-16 rounded-full"
          />
          <View className="ml-4">
            <Text className="text-2xl font-bold text-light" style={{ fontFamily: "Metropolis-Bold" }}>
              {userState?.display_name}
            </Text>
            <Text className="text-lg text-light" style={{ fontFamily: "Metropolis-Regular" }}>
              {userState?.username ? `@${userState.username}` : userState.fid}
            </Text>
          </View>
        </View>
        <View className="mt-4">
          <Text className="text-lg text-light" style={{ fontFamily: "Metropolis-Regular" }}>
            {userState?.bio}
          </Text>
        </View>
        <View className="mt-6 w-full border-b border-lightest"></View>
        <TouchableOpacity onPress={() => handleLogOut()}>
          <View className="mt-6 flex flex-row items-center">
            <MaterialIcons name="logout" size={24} color="#92bcb0" />
            <Text className="bg-contrast p-2 rounded-md text-light font-bold ml-2 text-lg" style={{ fontFamily: "Metropolis-Bold" }}>Log out</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View className="mt-6">
        <Text className="text-light text-xs" style={{fontFamily: "Metropolis-Regular"}}>Build: {BUILD_NUMBER}</Text>
      </View>
    </SafeAreaView>
  )
}

export default Profile