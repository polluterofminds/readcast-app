import { NeynarSigninButton, ISuccessMessage, Variant, Theme } from "@neynar/react-native-signin";
//  @ts-ignore
import { REACT_APP_NEYNAR_API_KEY, REACT_APP_NEYNAR_CLIENT_ID } from "@env";
import { View } from "react-native";
import useSecureStorage from "hooks/useSecureStorage";
import { StorageKeys } from "constants/storageKeys";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Siwn = ({ setConnectedUserFid, fetchUserData }: { setConnectedUserFid: Function, fetchUserData: Function}) => {
  const { saveSecureValue } = useSecureStorage();
  const handleSignin = async (data: ISuccessMessage) => {
    console.log(`User with fid -> ${data.fid} can use signer -> ${data.signer_uuid} to interact with farcaster`)
    if(data.fid && data.signer_uuid) {
      await saveSecureValue(StorageKeys.SIGNING_KEY, data.signer_uuid);
      await AsyncStorage.setItem(StorageKeys.CONNECTED_FID, String(data.fid));
      await AsyncStorage.setItem(StorageKeys.IS_CONNECTED, "true");
      setConnectedUserFid(data.fid);
      fetchUserData();
    }
  };

  const handleError = (err: any) => {
    console.log(err)
  }

  return (
    <View>
    <NeynarSigninButton apiKey={REACT_APP_NEYNAR_API_KEY}
      clientId={REACT_APP_NEYNAR_CLIENT_ID}
      successCallback={handleSignin}
      errorCallback={handleError} 
      variant={Variant.FARCASTER} 
      logoSize="40" // Only for variant not for customLogoUrl
      paddingHorizontal={20}
      paddingVertical={0}
      borderRadius={8}
      width={300}
      height={48}
      color="black"
      fontSize={20}
      theme={Theme.DARK}
      text="Sign in with Neynar"
      
      fontWeight="300"
      buttonStyles={{
        // buttonStyles will override all the buttonStyles above
        marginTop: 20,
      }}
      textStyles={{
        // textStyles will override all the textStyles above
        color: "#181A1A",
        fontFamily: "Metropolis-Bold"
      }}
      backgroundColor="#92bcb0"
    />
    </View>
  );
};
export default Siwn;