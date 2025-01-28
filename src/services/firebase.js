import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBgsuM8Of_nuu6f-zO8DeF2NiV_7pgvTHs",
  authDomain: "app-gestiones-4d8bc.firebaseapp.com",
  projectId: "app-gestiones-4d8bc",
  storageBucket: "app-gestiones-4d8bc.firebasestorage.app",
  messagingSenderId: "748007932123",
  appId: "1:748007932123:web:efd9fe216f3168ed520cfe"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google: ", error);
    throw error;
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out: ", error);
    throw error;
  }
};

export { auth };