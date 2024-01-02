import React, { useEffect } from "react";
import {
  Exceptionless,
} from "@exceptionless/react";

const useError = () => {
  useEffect(() => {
    // startExceptionless();
  }, []);

  const startExceptionless = async () => {
    try {
      await Exceptionless.startup((c) => {
        c.apiKey = "9IR1gAhnkp2dev8DZXUI6tMm5rBx2ZNqQZGiMsnU";
        c.useDebugLogger();
  
        c.defaultTags.push("ReadCast", "React Native");
      }); 
    } catch (error) {
      console.log(error);
    }    
  };

  const submitMessage = (message: string) => {
    Exceptionless.submitLog(message);
  };

  const submitError = (error: any) => {
    Exceptionless.submitException(error);
  }



  return { submitMessage, submitError }
};

export default useError;