// import { useEffect, useState } from "react"
// import useWarpcastConnection from "./useWarpcast";
// import { StorageKeys } from "constants/storageKeys";
// import useSecureStorage from "./useSecureStorage";
// import { Signer } from "@fcrn/crypto";
// import { REACT_APP_API_URL } from "@env";

// export default function useAuth() {
//   const [userData, setUserData] = useState(null);
//   const [publicSigner, setPublicSigner] = useState("");
//   const [signer, setSigner] = useState<any>(null);

//   const {
//     connectedUserFid,
//     warpcastConnected,
//     isPolling,
//     connectWithWarpcast,
//     disconnectFromWarpcast,
//   } = useWarpcastConnection();

//   const { getSecureValue } = useSecureStorage();

//   useEffect(() => {
//     const fetchUserData = async () => {
//       // const storedUsername = await getSecureValue(StorageKeys.USERNAME);
//       const storedFid = await getSecureValue(StorageKeys.FID);
//       console.log(storedFid)
//       if(storedFid) {
//         fetchData(storedFid);
//       }      
//     };

//     fetchUserData();
//   }, []);

//   const fetchData = async (fid: string) => {
//     try {
//       const privateKeyString = await getSecureValue(StorageKeys.SIGNING_KEY);
//       if(privateKeyString) {
//         const privateKey = Signer.stringToUint8Array(privateKeyString);
//         const signerKey = new Signer.Key(privateKey);
//         setSigner(signerKey);
//         const publicKey = signerKey.getPublicKey();
//         setPublicSigner(publicKey || "no connected user");
//         if(signerKey) {
//           const res = await fetch(`${REACT_APP_API_URL}/users/${fid}`, {
//             headers: {
//               'Content-Type': 'application/json', 
//               'Authorization': `Bearer ${privateKeyString}`
//             }
//           })
//           const data = await res.json();
//           setUserData(data);
//         }
//       }      
//     } catch (error) {
//       console.log("No connected user: ", error);
//     }
//   };

//   return {
//     signer, 
//     publicSigner, 
//     connectedUserFid, 
//     userData
//   }
// }