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
const uploadImageToStorageURL = async (imageUrl, folderName) => {
  try {
    // Obtener la imagen desde la URL
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch image from URL');
    }

    const imageBlob = await response.blob();

    // Generar un nombre único para el archivo en el almacenamiento
    const fileName = `${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    // Subir la imagen al almacenamiento
    const storageRef = ref(storage, `${folderName}/${fileName}`);
    await uploadBytes(storageRef, imageBlob);

    // Obtener la URL de descarga de la imagen cargada
    const downloadURL = await getDownloadURL(storageRef);

    return downloadURL;
  } catch (error) {
    console.error('Error al subir imagen desde URL:', error);
    // Manejar el error según sea necesario
    return null;
  }
};

export { uploadImageToStorage,uploadImageToStorageURL };
export default appPVH;