import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import{getAuth}from"firebase/auth";
import{getStorage,ref,uploadBytes,getDownloadURL,getBytes}from"firebase/storage";
import{getFirestore,collection,addDoc,getDocs,doc,getDoc,query,where,setDoc,deleteDoc}from"firebase/firestore";
const firebaseConfig = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_ADOMAIN,
  projectId: process.env.REACT_APP_PROYECID,
  storageBucket: process.env.REACT_APP_STORAGE,
  messagingSenderId: process.env.REACT_APP_SENDERID,
  appId: process.env.REACT_APP_APPID,
  measurementId: process.env.REACT_APP_MESUREID
};
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const almacen = getStorage(app);
export async function producExis(uid){
    const docrefe = doc(db,'Producto',uid);
    const ref = await getDoc(docrefe);
    return ref.exists();
}
export async function buscarProductoNombre(uid){
    const producto =[];
    const docrefe = collection(db,'Producto');
    const q = query(docrefe,where('codigo','==',uid));
    const qsc = await getDocs(q);
    qsc.forEach((doc) => {
        producto.push(doc.data());
    });
    return producto.length>0? producto : null;
}
export async function t(uid){
    /*Funcion de coneccion*/
}
export async function u(uid){
    /*Funcion de coneccion*/
}