import React, { useEffect, useState, createContext } from "react";
//  @ts-ignore
import { REACT_APP_API_URL } from "@env";
import useSecureStorage from "hooks/useSecureStorage";
import { StorageKeys } from "constants/storageKeys";
import { Library } from "types";
import AsyncStorage from "@react-native-async-storage/async-storage";



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
    console.log("Fetching...")
    const signer = await getSecureValue(StorageKeys.SIGNING_KEY);
    console.log({signer});
    if(signer) {
      const res = await fetch(`${REACT_APP_API_URL}/books/library`, {
        headers: {
          'Authorization': `Bearer ${signer}`
        }
      })
      const data = await res.json();

      console.log(data)
  
      updateState(data);
      return data;
    }    
  }

  return (
    <LibraryStateContext.Provider value={{ libraryState, fetchLibraryData }}>
      {props.children}
    </LibraryStateContext.Provider>
  );
};