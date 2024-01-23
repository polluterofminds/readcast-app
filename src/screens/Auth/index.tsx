import { ImageBackground, Text, TouchableOpacity, View, Linking, Image, ScrollView, SafeAreaView } from 'react-native'
// import QRCode from 'react-native-qrcode-svg';
import { useEffect, useState } from 'react';
import 'react-native-get-random-values';
import { sha512 } from '@noble/hashes/sha512';
import useWarpcastConnection from 'hooks/useWarpcast';
import Profile from './Profile';
import { useUser } from 'hooks/useUser';
import { useIsFocused } from '@react-navigation/native';
import Siwn from './Siwn';
import SignInWithEmail from './SignInWithEmail';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const Auth = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [signInWithEmail, setSignInWithEmail] = useState(false);
  const { connectWithWarpcast, connectWithEmail, connectedUserFid, deeplinkUrl, setConnectedUserFid, disconnectFromWarpcast } = useWarpcastConnection();
  const { userState, fetchUserData } = useUser();
  const isFocused = useIsFocused();
  useEffect(() => {
    if (connectedUserFid && userState.fid) {
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
    }
  }, [isFocused, connectedUserFid, userState]);
  const handleSignIn = async (email: string, password: string) => {
    // await connectWithWarpcast();
    await connectWithEmail(email, password);
  }

  const handleLogOut = async () => {
    setConnectedUserFid("");
    setAuthenticated(false);
    await disconnectFromWarpcast();
  }

  // const DeepLinkQRCode = () => <QRCode color={"black"} backgroundColor='white' value={deeplinkUrl} />
  return (
    <View className="bg-dark min-h-screen">
      {
        authenticated ?
          <View>
            <Profile handleLogOut={handleLogOut} userState={userState} />
          </View> :
          <SafeAreaView className="h-full flex justify-center align-center items-center">
            <KeyboardAwareScrollView className="py-10">
              <Image
                className="w-64 h-64 m-auto mb-10 rounded-full"
                source={require("../../../assets/ReadCastLogoSmall.png")}
              />
              <Text className="text-2xl text-light text-center" style={{ fontFamily: "Metropolis-Bold" }}>Welcome, to ReadCast!</Text>
              <Text className="text-md text-light text-center" style={{ fontFamily: "Metropolis-Regular" }}>Let's get you signed in.</Text>

              {
                signInWithEmail ?
                <SignInWithEmail setSignInWithEmail={setSignInWithEmail} handleSignIn={handleSignIn} /> : 
                <View>
                  <Siwn fetchUserData={fetchUserData} setConnectedUserFid={setConnectedUserFid} />
                  <View className="flex flex-row justify-center">
                  <TouchableOpacity onPress={() => setSignInWithEmail(true)}>
                    <Text className="text-md text-light" style={{fontFamily: "Metropolis-Bold"}}>Sign in with email</Text>
                  </TouchableOpacity>
                  </View>
                </View>
              }                
            </KeyboardAwareScrollView>
          </SafeAreaView>
      }
    </View>
  )
}

export default Auth;