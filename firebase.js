import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-analytics.js";
const firebaseConfig = {
    apiKey: "AIzaSyAh9XECfwspwTm8usBeeu00Cf624hueYlQ",
    authDomain: "rpc-backend-9eb70.firebaseapp.com",
    projectId: "rpc-backend-9eb70",
    storageBucket: "rpc-backend-9eb70.firebasestorage.app",
    messagingSenderId: "713681920973",
    appId: "1:713681920973:web:82db8826bb0e101edd1a84",
    measurementId: "G-9N857MTVYF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore

const db =
    getFirestore(app);

// Upload analytics function

export async function uploadAnalytics(data) {

    try {

        const docRef =
            await addDoc(

                collection(
                    db,
                    "analytics"
                ),

                data
            );

        console.log(
            "Analytics uploaded:",
            docRef.id
        );
    }

    catch (error) {

        console.error(
            "Upload failed:",
            error
        );
    }
}
