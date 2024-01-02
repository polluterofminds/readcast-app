import { ImageBackground, Text, TouchableOpacity, View } from 'react-native'
import * as WebBrowser from 'expo-web-browser';
import * as ed from '@noble/ed25519';
import { QRCode } from 'react-native-custom-qr-codes-expo';
import { useState } from 'react';
import 'react-native-get-random-values';
import { sha512 } from '@noble/hashes/sha512';
import SignIn from './SignIn';
ed.etc.sha512Sync = (...m) => sha512(ed.etc.concatBytes(...m));
ed.etc.sha512Async = (...m) => Promise.resolve(ed?.etc?.sha512Sync!(...m));

const Auth = () => {
  const [deepLink, setDeepLink] = useState("");
  const handleSignIn = async () => {
    const privateKey = ed.utils.randomPrivateKey();
    const publicKey = await ed.getPublicKey(privateKey);
    console.log({ privateKey, publicKey })
    console.log(ed.etc.bytesToHex(publicKey))
    const redirect = `exp://192.168.4.137:8081`
    // const fullAuthUrl = `https://app.neynar.com/login?client_id=50fb47d0-06a0-42d1-ad86-8858d6d79f73&redirect_uri=${redirect}`
    // await WebBrowser.openBrowserAsync(fullAuthUrl);
    console.log({
      publicKey: `0x${ed.etc.bytesToHex(publicKey)}`,
      name: "ReadCast"
    })
    const res = await fetch(`https://api.warpcast.com/v2/signer-requests`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        publicKey: `0x${ed.etc.bytesToHex(publicKey)}`,
        name: "ReadCast"
      })
    })
    const data = await res.json();
    console.log(data);
    // const { token, deepLinkUrl } = data.result;
    // setDeepLink(deepLinkUrl)
  }

  const DeepLinkQRCode = () => <QRCode value={deepLink} />
  return (
    <View className="bg-dark min-h-screen flex justify-center align-center items-center">
      {
        deepLink ?
          <DeepLinkQRCode /> :
          <SignIn handleSignIn={handleSignIn} />
      }
    </View>
  )
}

export default Auth;