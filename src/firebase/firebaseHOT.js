import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
const configHOT = {
    apiKey : process.env.REACT_APP_APIKEYHOT,
    authDomain: process.env.REACT_APP_ADOMAINHOT,
    projectId: process.env.REACT_APP_PROYECIDHOT,
    storageBucket: process.env.REACT_APP_STORAGEHOT,
    messagingSenderId: process.env.REACT_APP_SENDERIDHOT,
    appId: process.env.REACT_APP_APPIDPVH,
    measurementId: process.env.REACT_APP_MESUREIDHOT
  };
const appHOT = initializeApp(configHOT,'homasoutlet-e9ecc');
export default appHOT;