import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

interface SignInProps {
  handleSignIn: Function;
}

const SignIn = ({ handleSignIn }: SignInProps) => {
  return (
    <View>
      <Text className="text-2xl text-light" style={{fontFamily: "Metropolis-Bold"}}>Welcome, to ReadCast!</Text>
      <Text className="text-md text-light" style={{fontFamily: "Metropolis-Regular"}}>Let's get you signed in.</Text>
      <TouchableOpacity className="mt-4" onPress={() => handleSignIn()}>
          <Text className="text-light font-bold text-xl" style={{fontFamily: "Metropolis-Bold"}}>Sign in</Text>
      </TouchableOpacity>
    </View>
  )
}

export default SignIn