import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCdM_LK5RV0Yn94xvQ4ZrPKZK1tGdxPBa4",
  authDomain: "findcreators-a9ec2.firebaseapp.com",
  projectId: "findcreators-a9ec2",
  storageBucket: "findcreators-a9ec2.firebasestorage.app",
  messagingSenderId: "450258334833",
  appId: "1:450258334833:web:65392f9faea58ddee2d7d0",
  measurementId: "G-",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
