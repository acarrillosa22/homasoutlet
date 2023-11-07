// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const configPVH = {
  apiKey : process.env.REACT_APP_APIKEYPVH,
  authDomain: process.env.REACT_APP_ADOMAINPVH,
  projectId: process.env.REACT_APP_PROYECIDPVH,
  storageBucket: process.env.REACT_APP_STORAGEPVH,
  messagingSenderId: process.env.REACT_APP_SENDERIDPVH,
  appId: process.env.REACT_APP_APPIDPVH,
  measurementId: process.env.REACT_APP_MESUREIDPVH
};
// Initialize Firebase
const appPVH = initializeApp(configPVH);
const analyticsPVH = getAnalytics(appPVH);

export default appPVH;