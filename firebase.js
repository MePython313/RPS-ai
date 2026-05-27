// Firebase imports

import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// YOUR FIREBASE CONFIG

const firebaseConfig = {

    apiKey: "PASTE_API_KEY",

    authDomain: "PASTE_AUTH_DOMAIN",

    projectId: "PASTE_PROJECT_ID",

    storageBucket: "PASTE_STORAGE_BUCKET",

    messagingSenderId: "PASTE_SENDER_ID",

    appId: "PASTE_APP_ID"
};

// Initialize Firebase

const app =
    initializeApp(firebaseConfig);

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
