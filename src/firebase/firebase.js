// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAfMRrz0ykMEtM7JEr8MFQ-DlNPIIYspUY",
  authDomain: "homaspuntoventa.firebaseapp.com",
  projectId: "homaspuntoventa",
  storageBucket: "homaspuntoventa.appspot.com",
  messagingSenderId: "90169124139",
  appId: "1:90169124139:web:6c22f7082679da084cd16e",
  measurementId: "G-KBB687T0E8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;