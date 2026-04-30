import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "hotel-inclusivo-base-de-datos.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: "hotel-inclusivo-base-de-datos.firebasestorage.app",
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

if (!firebaseConfig.apiKey || firebaseConfig.apiKey === 'tu_api_key') {
  console.error('❌ ERROR: No se detectan las llaves de Firebase. Por favor, reinicia tu servidor (npm run dev).');
} else {
  console.log('✅ Firebase configurado con la cuenta:', firebaseConfig.projectId);
}

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
