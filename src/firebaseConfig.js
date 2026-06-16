// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import 'firebase/database';
import 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA9jv0o5usSe-ZzNyIoYyIZ9PI_Yj2R8nY",
  authDomain: "nextbook-c69c0.firebaseapp.com",
  projectId: "nextbook-c69c0",
  storageBucket: "nextbook-c69c0.firebasestorage.app",
  messagingSenderId: "860378848409",
  appId: "1:860378848409:web:c244031c19712b3f11ec08"
};

// Initialize Firebase
let firebase;
 
if(getApps().length === 0){
    firebase = initializeApp(firebaseConfig);
} else {
    firebase = getApp();
}


export default firebase;