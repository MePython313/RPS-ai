// Firebase (browser CDN version)
import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAh9XECfwspwTm8usBeeu00Cf624hueYlQ",
  authDomain: "rpc-backend-9eb70.firebaseapp.com",
  projectId: "rpc-backend-9eb70",
  storageBucket: "rpc-backend-9eb70.firebasestorage.app",
  messagingSenderId: "713681920973",
  appId: "1:713681920973:web:82db8826bb0e101edd1a84",
  measurementId: "G-9N857MTVYF"
};

// init app
const app = initializeApp(firebaseConfig);

// database
const db = getFirestore(app);

// send analytics
export async function uploadAnalytics(data) {
    try {
        await addDoc(
            collection(db, "analytics"),
            data
        );

        console.log("🔥 sent to Firebase:", data);

    } catch (e) {
        console.error("Firebase error:", e);
    }
}
