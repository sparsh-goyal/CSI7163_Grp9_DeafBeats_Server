import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  // generate and insert your own firebase config for authentication
  apiKey: 
  authDomain: 
  projectId: 
  storageBucket: 
  messagingSenderId: 
  appId: 
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)


