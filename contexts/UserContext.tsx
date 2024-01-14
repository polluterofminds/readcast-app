import React, { useEffect, useState, createContext } from "react";
//  @ts-ignore
import { REACT_APP_API_URL } from "@env";
import { StorageKeys } from "constants/storageKeys";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

  const updateState = (newState: any) => {
    setState((prevState) => ({ ...prevState, ...newState }));
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const userFid = await AsyncStorage.getItem(StorageKeys.CONNECTED_FID);
      if(userFid) {
        const res = await fetch(`${REACT_APP_API_URL}/users/${userFid}`)
        const data = await res.json();
        updateState(data);
      }    
    } catch (error) {
      console.log("User data error: ");
      console.log(error);
    } 
  }

  const logOut = async () => {
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