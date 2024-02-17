import React, { useEffect, useState } from "react";


//  @ts-ignore
import { REACT_APP_API_URL } from "../config";

const useApi = () => {
  const [apiUrl, setApiUrl] = useState("")
  useEffect(() => {
    const uri = REACT_APP_API_URL
    setApiUrl(uri);
  }, []);

  return { apiUrl }
};

export default useApi;