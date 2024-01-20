import React, { useEffect, useState, createContext } from "react";
//  @ts-ignore
import { REACT_APP_API_URL } from "@env";
import useSecureStorage from "hooks/useSecureStorage";
import { StorageKeys } from "constants/storageKeys";
import { Library } from "types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from 'expo-constants'
const apiUrl = Constants?.expoConfig?.hostUri
? `http://${Constants?.expoConfig?.hostUri?.split(`:`)?.shift()?.concat(`:3000`)}`
: REACT_APP_API_URL



interface LibraryProviderProps {
  libraryState: Library;
  fetchLibraryData: Function;
  children: any;
}

export const LibraryStateContext = createContext({});

export const LibraryProvider = (
  props: LibraryProviderProps
): JSX.Element => {
  
  const initialState: Library = {
    tbr: [], 
    inProgress: [], 
    completed: []
  }

  const [libraryState, setState] = useState(initialState);
  const { getSecureValue } = useSecureStorage();

  const updateState = (newState: any) => {
    setState((prevState) => ({ ...prevState, ...newState }));
  };

  useEffect(() => {
    fetchLibraryData();
  }, []);

  const fetchLibraryData = async () => {
    try {
      const signer = await getSecureValue(StorageKeys.SIGNING_KEY);      
      if(signer) {
        const res = await fetch(`${apiUrl}/books/library`, {
          headers: {
            'Authorization': `Bearer ${signer}`
          }
        })
        if(res.status === 401) {
          throw new Error("Unauthorized")
        }
        const data = await res.json();
        updateState(data);
        return data;
      }     
    } catch (error: any) {
      console.log("Library fetch error:")
      console.log(error);
    }    
  }

  return (
    <LibraryStateContext.Provider value={{ libraryState, fetchLibraryData }}>
      {props.children}
    </LibraryStateContext.Provider>
  );
};