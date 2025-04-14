// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB4OL5u9dJMi0VwBIqNht1mdju5Pz4m5qk",
  authDomain: "thecreative-8d8e7.firebaseapp.com",
  projectId: "thecreative-8d8e7",
  storageBucket: "thecreative-8d8e7.firebasestorage.app",
  messagingSenderId: "864394497070",
  appId: "1:864394497070:web:c91a678b9c141f026463bf",
  measurementId: "G-N7HH8BTZRK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const messaging = getMessaging(app);

export { messaging, getToken, onMessage };