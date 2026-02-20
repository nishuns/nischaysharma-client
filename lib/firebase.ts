import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBGUNoHnOg0v7rxt57hX2Dewjfx40VtYqY",
  authDomain: "taughtcode-2381a.firebaseapp.com",
  databaseURL: "https://taughtcode-2381a-default-rtdb.firebaseio.com",
  projectId: "taughtcode-2381a",
  storageBucket: "taughtcode-2381a.firebasestorage.app",
  messagingSenderId: "908921073039",
  appId: "1:908921073039:web:80a68c611391822446affa",
  measurementId: "G-D77QRXC5XL"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);

// Initialize Analytics conditionally (it only works in the browser)
let analytics;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, auth, db, analytics };
