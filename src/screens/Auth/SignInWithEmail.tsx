import { FONTS } from 'constants/fonts';
import React, { useState } from 'react'
import { View, TextInput, Text, TouchableOpacity, KeyboardAvoidingView } from 'react-native'

interface SignInWithEmailProps {
  handleSignIn: (email: string, password: string) => Promise<void>;
  setSignInWithEmail: Function;
}

const SignInWithEmail = ({ handleSignIn, setSignInWithEmail }: SignInWithEmailProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <View>
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <TextInput
        placeholderTextColor={'#dfebeb'}
        autoFocus
        autoComplete='off'
        style={{ fontFamily: FONTS.Middle }}
        className="mt-6 w-full border border-primary h-16 rounded-md px-2 text-light"
        onChangeText={(value: string) => setEmail(value)}
        value={email}
        placeholder='Email'        
      />
      </KeyboardAvoidingView>
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <TextInput
        placeholderTextColor={'#dfebeb'}
        autoFocus
        autoComplete='off'        
        style={{ fontFamily: FONTS.Middle }}
        className="mt-6 w-full border border-primary h-16 rounded-md px-2 text-light"
        onChangeText={(value: string) => setPassword(value)}
        value={password}
        secureTextEntry={true}
        placeholder='Password'
      />
</KeyboardAvoidingView>
      <View className="mt-6 flex flex-row justify-end items-center">
        <TouchableOpacity onPress={() => setSignInWithEmail()}>
          <Text className="text-center text-light" style={{ fontFamily: FONTS.Heavy }}>Go back</Text>
        </TouchableOpacity>
        <View className="ml-4">
          <TouchableOpacity onPress={() => handleSignIn(email, password)} disabled={!email || !password} className={(!email || !password) ? "w-44 rounded-md px-4 py-2 bg-lightest" : "bg-primary w-44 rounded-md px-4 py-2"}>
            <Text className="text-center text-dark" style={{ fontFamily: FONTS.Heavy }}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default SignInWithEmail