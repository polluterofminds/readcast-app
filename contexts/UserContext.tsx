import useWarpcastConnection from "hooks/useWarpcast";
import React, { useEffect, useState, createContext } from "react";
import { REACT_APP_API_URL } from "@env";
import useSecureStorage from "hooks/useSecureStorage";
import { StorageKeys } from "constants/storageKeys";

export interface UserState {
  username: string; 
  display_name: string; 
  fid: string;
  bio: string;
  pfp: string;
}

interface UserProviderProps {
  userState: UserState;
  logOut: Function;
  fetchUserData: Function;
  children: any;
}

export const UserStateContext = createContext({});

export const UserProvider = (
  props: UserProviderProps
): JSX.Element => {
  
  const initialState: UserState = {
   username: "", 
   display_name: "", 
   fid: "", 
   bio: "", 
   pfp: ""
  };

  const [userState, setState] = useState(initialState);
  const { connectedUserFid } = useWarpcastConnection();
  console.log({connectedUserFid})
  const { removeSecureValue } = useSecureStorage();

  const updateState = (newState: any) => {
    setState((prevState) => ({ ...prevState, ...newState }));
  };

  useEffect(() => {
    if(connectedUserFid && (!userState?.username || !userState.display_name)) {
      //  Fetch user data
      fetchUserData();
    }
  }, [connectedUserFid]);

  const fetchUserData = async () => {
    const res = await fetch(`${REACT_APP_API_URL}/users/${connectedUserFid}`)
    const data = await res.json();

    updateState(data);
  }

  const logOut = async () => {
    await removeSecureValue(StorageKeys.SIGNING_KEY);
    await removeSecureValue(StorageKeys.CONNECTED_FID);
    updateState({
      username: "", 
      display_name: "", 
      fid: "", 
      bio: "", 
      pfp: ""
     })
  }

  return (
    <UserStateContext.Provider value={{ userState, fetchUserData, logOut }}>
      {props.children}
    </UserStateContext.Provider>
  );
};