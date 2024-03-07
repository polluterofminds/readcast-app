import React from 'react'
import { View, Text, Image, TouchableOpacity, SafeAreaView } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { UserState } from 'contexts/UserContext';
import { BUILD_NUMBER } from 'config';
import { FONTS } from 'constants/fonts';
import { LinearGradient } from 'expo-linear-gradient';

interface ProfileProps {
  handleLogOut: Function;
  userState: UserState;
}
const Profile = ({ handleLogOut, userState }: ProfileProps) => {
  const navigation = useNavigation();
  return (
    <View>
      <TouchableOpacity className="h-28 flex items-center justify-center" onPress={() => navigation.goBack()}>
        <LinearGradient
          colors={['#CEFF41', '#EEFFBC']}
          style={{ flex: 1 }}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          className="w-full h-28"
        >
          <View className="mt-14 flex flex-row items-center bg-transparent rounded-full p-2">
            <FontAwesome name="chevron-left" size={28} color="#0E0E0E" />
            {/* <Text className="ml-4 text-xl text-dark" style={{ fontFamily: FONTS.Heavy }}>Home</Text> */}
          </View>
        </LinearGradient>
      </TouchableOpacity>
      <View className="px-4">
        <Text className="text-3xl font-bold text-dark my-6">Account</Text>
        {/* <View className="w-[30%] border-b-4 border-dark mb-6">
        </View> */}
        <View className="flex flex-row items-center">
          <Image
            source={{ uri: userState.pfp }}
            className="h-16 w-16 rounded-full"
          />
          <View className="ml-4">
            <Text className="text-2xl font-bold text-dark" style={{ fontFamily: FONTS.Heavy }}>
              {userState?.display_name}
            </Text>
            <Text className="text-lg text-dark" style={{ fontFamily: FONTS.Middle }}>
              {userState?.username ? `@${userState.username}` : userState.fid}
            </Text>
          </View>
        </View>
        <View className="mt-4">
          <Text className="text-lg text-dark" style={{ fontFamily: FONTS.Middle }}>
            {userState?.bio}
          </Text>
        </View>
        <View className="mt-6 w-full border-b border-darkest"></View>
        <TouchableOpacity onPress={() => handleLogOut()}>
          <View className="mt-6 flex flex-row items-center">
            <MaterialIcons name="logout" size={24} color="#0E0E0E" />
            <View className="flex flex-row items-center rounded-md bg-primary text-dark font-bold ml-2 px-2 py-1 text-lg">
              <Text className="bg-primary text-dark font-bold text-lg" style={{ fontFamily: FONTS.Heavy }}>Log out</Text>
            </View>            
          </View>
        </TouchableOpacity>
        <View className="mt-6">
          <Text className="text-dark text-xs" style={{ fontFamily: FONTS.Middle }}>Build: {BUILD_NUMBER}</Text>
        </View>
      </View>
    </View>

  )
}

export default Profile