import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState, Linking } from "react-native";
//  @ts-ignore
import { REACT_APP_API_URL } from "../config";
import useSecureStorage from "./useSecureStorage";
import { StorageKeys } from "../constants/storageKeys";
import { useUser } from "./useUser";
// const apiUrl = Constants?.expoConfig?.hostUri
//   ? `http://${Constants?.expoConfig?.hostUri?.split(`:`)?.shift()?.concat(`:3000`)}`
//   : REACT_APP_API_URL
const apiUrl = REACT_APP_API_URL;

interface UseWarpcastConnection {
  connectedUserFid: string;
  warpcastConnected: boolean;
  isPolling: boolean;
  connectWithWarpcast: () => Promise<void>;
  disconnectFromWarpcast: () => Promise<void>;
  deeplinkUrl: string;
  setConnectedUserFid: Function;
  connectWithEmail: (email: string, password: string) => Promise<void>;
}

interface SignedKeyRequestResult {
  token: string;
  deeplinkUrl: string;
  key: string;
  requestFid: number;
  state: string;
  userFid: number;
}

export default function useWarpcastConnection(): UseWarpcastConnection {
  const [connectedUserFid, setConnectedUserFid] = useState<string>("");
  const [isPolling, setIsPolling] = useState<boolean>(false);
  const [warpcastConnected, setWarpcastConnected] = useState<boolean>(false);
  const [pollingToken, setPollingToken] = useState<string | null>(null);
  const [deeplinkUrl, setDeeplinkUrl] = useState("");

  const { fetchUserData, logOut } = useUser();

  const { getSecureValue,
    saveSecureValue,
    removeSecureValue } = useSecureStorage();

  const checkConnectionStatus = useCallback(async () => {
    try {
      const isConnected = await AsyncStorage.getItem(StorageKeys.IS_CONNECTED);
      if (isConnected === "true") {
        const userFid = await AsyncStorage.getItem(StorageKeys.CONNECTED_FID);
        setWarpcastConnected(true);
        setConnectedUserFid(userFid || "");
      } else {
        //  Check for pending key
        const pendingKey = await getSecureValue(StorageKeys.PENDING_KEY);
        if (pendingKey) {
          poll(pendingKey);
        }
      }
    } catch (error) {
      console.log("Check connection status error");
      console.log(error);
    }
  }, []);

  useEffect(() => {
    checkConnectionStatus();
  }, [checkConnectionStatus]);

  useEffect(() => {
    if (pollingToken) {
      setIsPolling(true);
      poll(pollingToken);
    }
    const handleAppStateChange = async (nextAppState: any) => {
      if (nextAppState === "active" && pollingToken) {
        setIsPolling(true);
        await poll(pollingToken);
      }
    };
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );
    return () => {
      subscription?.remove();
    };
  }, [pollingToken]);

  const poll = async (token: string) => {
    console.log("Polling...")
    setIsPolling(true);
    let attempts = 0;
    const maxAttempts = 10;
    let poll = true
    while (true) {
      try {
        await new Promise((r) => setTimeout(r, 5000));

        const keyPoll = await fetch(`${apiUrl}/users/signer-status?token=${token}`)

        const data = await keyPoll.json();

        if (data.status === "approved") {
          console.log("Signed Key Request completed:");
          setWarpcastConnected(true);
          setIsPolling(false);
          setPollingToken("");
          const pendingKey = await getSecureValue(StorageKeys.PENDING_KEY);
          await saveSecureValue(StorageKeys.SIGNING_KEY, pendingKey!);
          await removeSecureValue(StorageKeys.PENDING_KEY);
          setConnectedUserFid(String(data.fid));
          await AsyncStorage.setItem(StorageKeys.CONNECTED_FID, String(data.fid));
          await AsyncStorage.setItem(StorageKeys.IS_CONNECTED, "true");

          await fetchUserData();
          break;
        }
      } catch (error) {
        console.log("Polling error")
        console.log(error);
      }
    }
    setIsPolling(false);
  };

  const disconnectFromWarpcast = useCallback(async () => {
    try {
      setIsPolling(false);
      setPollingToken(null);
      setWarpcastConnected(false);
      setConnectedUserFid("");
      await AsyncStorage.setItem(StorageKeys.IS_CONNECTED, "false");
      await AsyncStorage.removeItem(StorageKeys.CONNECTED_FID);
      await removeSecureValue(StorageKeys.SIGNING_KEY);
      logOut();
    } catch (error) {
      console.log("Disconnect error");
      console.log(error);
    }
  }, []);

  const connectWithWarpcast = async () => {
    try {
      const res = await fetch(`${apiUrl}/users/sign-in`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await res.json();

      if (data.signer_approval_url) {
        setPollingToken(data.signer_uuid);
        await saveSecureValue(StorageKeys.PENDING_KEY, data.signer_uuid);
        setDeeplinkUrl(data.signer_approval_url);
      }
    } catch (error) {
      console.log("Connect with warpcast error")
      console.log(error);
    }
  };

  const connectWithEmail = async (email: string, password: string) => {
    try {
      const res = await fetch(`${apiUrl}/users/sign-in/email`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email, password
        })
      })

      if (!res.ok) {
        throw new Error("Unable to log in");
      }

      const data = await res.json();
      setWarpcastConnected(true);
      setIsPolling(false);
      setPollingToken("");
      await saveSecureValue(StorageKeys.SIGNING_KEY, data.signer_uuid);
      setConnectedUserFid(String(data.fid));
      await AsyncStorage.setItem(StorageKeys.CONNECTED_FID, String(data.fid));
      await AsyncStorage.setItem(StorageKeys.IS_CONNECTED, "true");

      await fetchUserData();
    } catch (error) {
      throw error;
    }
  }

  return {
    connectedUserFid,
    warpcastConnected,
    isPolling,
    connectWithWarpcast,
    disconnectFromWarpcast,
    deeplinkUrl,
    setConnectedUserFid, 
    connectWithEmail
  };
}