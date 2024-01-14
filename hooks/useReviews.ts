//  @ts-ignore
import { REACT_APP_API_URL } from "@env"
import { Book, ReviewWithUser } from "types";
import useError from "./useError";
import { useState } from "react";
import useSecureStorage from "./useSecureStorage";
import { StorageKeys } from "constants/storageKeys";
import useWarpcastConnection from "./useWarpcast";

const useReviews = () => {
  const { submitError } = useError();
  const { connectedUserFid } = useWarpcastConnection();
  const { getSecureValue } = useSecureStorage();
  const [reviews, setReviews] = useState<ReviewWithUser[]>([]);
  const fetchReviews = async (book: Book) => {
    try {
      const res = await fetch(`${REACT_APP_API_URL}/books/reviews/${encodeURI(book.title)}`)

      const data = await res.json();
      setReviews(data);
    } catch (error) {  
      console.log("Review fetch error")    
      console.log(error);
      submitError(error);
    }
  }

  const castReview = async (text: string, book: Book, stars?: number) => {
    try {
      const signerString = await getSecureValue(StorageKeys.SIGNING_KEY);
      await fetch(`${REACT_APP_API_URL}/reviews`, {
        method: "POST", 
        headers: {
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${signerString}`
        }, 
        body: JSON.stringify({
          review: text, 
          book, 
          stars, 
          fid: connectedUserFid
        })
      })
      await fetchReviews(book);
    } catch (error) {
      console.log("Cast review error");
      console.log(error);
      //  @TODO handle errors in app
      throw error;
    }
  }

  return { fetchReviews, castReview, reviews }
};

export default useReviews;