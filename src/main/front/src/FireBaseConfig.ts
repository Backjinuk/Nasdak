// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyArE8K4qMTnlwxI9w3Phil3Ci0FV4DJW7k",
    authDomain: "nasdak-80b1b.firebaseapp.com",
    projectId: "nasdak-80b1b",
    storageBucket: "nasdak-80b1b.appspot.com",
    messagingSenderId: "797215824418",
    appId: "1:797215824418:web:dc03a42d6c609cd616487b",
    measurementId: "G-52E0F8CTZP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);