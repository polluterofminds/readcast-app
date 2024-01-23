import React, { useEffect, useState, createContext } from "react";
//  @ts-ignore
import { REACT_APP_API_URL } from "../config";
import useSecureStorage from "hooks/useSecureStorage";
import { StorageKeys } from "constants/storageKeys";
import { Book, Library, LibraryWithBook } from "types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from 'expo-constants'
import useToast from "hooks/useToast";
import { useUser } from "hooks/useUser";
// const apiUrl = Constants?.expoConfig?.hostUri
// ? `http://${Constants?.expoConfig?.hostUri?.split(`:`)?.shift()?.concat(`:3000`)}`
// : REACT_APP_API_URL
const apiUrl = REACT_APP_API_URL;



interface LibraryProviderProps {
  children: any;
}

interface BookDetails {
  status: string;
  date_completed?: Date;
  book_type?: string;
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
  const { setToastMessage } = useToast();
  const { userState } = useUser();

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

  const addToLibrary = async (book: Book, details: BookDetails) => {
    if(!userState.fid) {
      setToastMessage("info", "You need to be signed in to do this")
      return;
    }
    const signerUUID = await getSecureValue(StorageKeys.SIGNING_KEY)
    setToastMessage("info", "Adding to library...");
    try {
      await fetch(`${apiUrl}/books/library`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${signerUUID}`
        },
        body: JSON.stringify({
          book,
          fid: userState.fid,
          details: {
            status: details.status,
            bookFormat: details?.book_type,
            dateCompleted: details?.date_completed
          }
        })
      })
      await fetchLibraryData()
    } catch (error) {
      console.log("Add to library error");
      console.log(error);
    }
  }

  const updateLibraryStatus = async (newStatus: string, libraryBook: LibraryWithBook, book: Book, details?: BookDetails) => {
    if(!userState.fid) {
      setToastMessage("info", "You need to be signed in to do this")
      return;
    }
    const signerUUID = await getSecureValue(StorageKeys.SIGNING_KEY)
    setToastMessage("info", "Updating library...");
    try {
      await fetch(`${apiUrl}/books/library/${libraryBook?.id}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${signerUUID}`
        },
        body: JSON.stringify({
          book,
          fid: userState.fid,
          details: {
            status: newStatus,
            bookFormat: details?.book_type,
            dateCompleted: details?.date_completed
          }
        })
      })
      setToastMessage("success", "Updated!");
    } catch (error) {
      console.log("Update library error")
      console.log(error);
    }
  }

  return (
    <LibraryStateContext.Provider value={{ libraryState, fetchLibraryData, addToLibrary, updateLibraryStatus }}>
      {props.children}
    </LibraryStateContext.Provider>
  );
};