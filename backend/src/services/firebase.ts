import dotenv from "dotenv";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

dotenv.config();

// Check if Firebase environment variables are set
const requiredEnvVars = [
  'FIREBASE_API_KEY', 
  'FIREBASE_AUTH_DOMAIN', 
  'FIREBASE_PROJECT_ID',
  'FIREBASE_STORAGE_BUCKET',
  'FIREBASE_MESSAGING_SENDER_ID',
  'FIREBASE_APP_ID',
  'FIREBASE_MEASUREMENT_ID'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('Missing Firebase environment variables:', missingVars);
  console.error('Please create a .env file in the backend directory with the following variables:');
  console.error('FIREBASE_API_KEY=your_firebase_api_key');
  console.error('FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com');
  console.error('FIREBASE_PROJECT_ID=your_project_id');
  console.error('FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app');
  console.error('FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id');
  console.error('FIREBASE_APP_ID=your_app_id');
  console.error('FIREBASE_MEASUREMENT_ID=your_measurement_id');
  process.exit(1);
}

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;