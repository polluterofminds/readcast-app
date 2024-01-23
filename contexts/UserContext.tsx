import React, { useEffect, useState, createContext } from "react";
//  @ts-ignore
import { REACT_APP_API_URL } from "../config";
import { StorageKeys } from "constants/storageKeys";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from 'expo-constants'
// const apiUrl = Constants?.expoConfig?.hostUri
// ? `http://${Constants?.expoConfig?.hostUri?.split(`:`)?.shift()?.concat(`:3000`)}`
// : REACT_APP_API_URL
const apiUrl = REACT_APP_API_URL;

export interface UserState {
  username: string; 
  display_name: string; 
  fid: string;
  bio: string;
  pfp: string;
}

interface UserProviderProps {
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
        const res = await fetch(`${apiUrl}/users/${userFid}`)
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