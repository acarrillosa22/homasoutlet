// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { ref, uploadBytes, getDownloadURL,getStorage } from "firebase/storage";
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
const storage = getStorage(appPVH);
const uploadImageToStorage = async (file, folderName) => {
  const storageRef = ref(storage, `${folderName}/${file.name}`);
  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
};
export { uploadImageToStorage };
export default appPVH;