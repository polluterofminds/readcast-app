import React, { useEffect, useState } from "react";
import Constants from "expo-constants";


//  @ts-ignore
import { REACT_APP_API_URL } from "@env";

const useApi = () => {
  const [apiUrl, setApiUrl] = useState("")
  useEffect(() => {
    const uri = Constants?.expoConfig?.hostUri
      ? `http://${Constants?.expoConfig?.hostUri?.split(`:`)?.shift()?.concat(`:3000`)}`
      : REACT_APP_API_URL;
    setApiUrl(uri);
  }, []);

  console.log({apiUrl})

  return { apiUrl }
};

export default useApi;