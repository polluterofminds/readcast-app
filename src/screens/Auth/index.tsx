import { ImageBackground, Text, TouchableOpacity, View, Linking, Image } from 'react-native'
import { REACT_APP_API_URL, REACT_APP_ENVIRONMENT } from "@env"
import QRCode from 'react-native-qrcode-svg';
import { useEffect, useState } from 'react';
import 'react-native-get-random-values';
import { sha512 } from '@noble/hashes/sha512';
import useWarpcastConnection from 'hooks/useWarpcast';
import Profile from './Profile';
import { useUser } from 'hooks/useUser';

const Auth = () => {
  const { connectWithWarpcast, connectedUserFid, deeplinkUrl } = useWarpcastConnection();
  const { userState } = useUser();
  const handleSignIn = async () => {
    await connectWithWarpcast();
  }

  const DeepLinkQRCode = () => <QRCode color={"black"} backgroundColor='white' value={deeplinkUrl} />
  return (
    <View className="bg-dark min-h-screen">
      {
        userState.fid !== "" ?
          <View>
            <Profile />
          </View> :
          <View className="h-full flex justify-center align-center items-center">
            <View>
              <Image
                className="w-64 h-64 m-auto mb-10 rounded-full"
                source={require("../../../assets/ReadCastLogoSmall.png")}
              />
              <Text className="text-2xl text-light text-center" style={{ fontFamily: "Metropolis-Bold" }}>Welcome, to ReadCast!</Text>
              <Text className="text-md text-light text-center" style={{ fontFamily: "Metropolis-Regular" }}>Let's get you signed in.</Text>
              {
                !deeplinkUrl &&
                <TouchableOpacity className="mt-4 bg-primary px-4 py-2 rounded-md" onPress={() => handleSignIn()}>
                  <Text className="text-dark font-bold text-xl text-center" style={{ fontFamily: "Metropolis-Bold" }}>Get started</Text>
                </TouchableOpacity>
              }
            </View>
            {
              deeplinkUrl ?
                <View className="flex items-center mt-4">
                  {
                    REACT_APP_ENVIRONMENT === "simulator" ? <DeepLinkQRCode /> :
                      <TouchableOpacity onPress={() => Linking.openURL(deeplinkUrl)} className="mt-4 bg-primary px-4 py-2 rounded-md" >
                        <Text className="text-dark font-bold text-xl text-center" style={{ fontFamily: "Metropolis-Bold" }}>Sign in with Warpcast</Text>
                      </TouchableOpacity>
                  }
                </View> :
                null
            }
          </View>
      }
    </View>
  )
}

export default Auth;