import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAwP4gllGuO5pCmUwycUKebgIASVtEv9oc",
  authDomain: "uploadingfile-c6f8a.firebaseapp.com",
  projectId: "uploadingfile-c6f8a",
  storageBucket: "uploadingfile-c6f8a.appspot.com",
  messagingSenderId: "954733888777",
  appId: "1:954733888777:web:80128edbb394e4ec29bfd8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)


