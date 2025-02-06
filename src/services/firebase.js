import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Función para obtener el token actual
export const getCurrentToken = async () => {
  const user = auth.currentUser;
  if (user) {
    try {
      const token = await user.getIdToken(true);
      return token;
    } catch (error) {
      console.error('Error getting current token:', error);
      return null;
    }
  }
  return null;
};

export const signInWithGoogle = async () => {
  try {
    // Configurar opciones específicas para el popup
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account',
      display: 'popup'
    });

    const result = await signInWithPopup(auth, provider);
    const token = await result.user.getIdToken();
    localStorage.setItem('firebase_token', token);
    
    return {
      uid: result.user.uid,
      email: result.user.email,
      displayName: result.user.displayName,
      photoURL: result.user.photoURL
    };
  } catch (error) {
    if (error.code === 'auth/popup-closed-by-user') {
      // El usuario cerró el popup, no es necesario mostrar error
      throw new Error('Inicio de sesión cancelado');
    }
    console.error("Error signing in with Google: ", error);
    throw error;
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
    localStorage.removeItem('firebase_token');
  } catch (error) {
    console.error("Error signing out: ", error);
    throw error;
  }
};

// Función para verificar y renovar el token periódicamente
export const setupTokenRefresh = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const token = await user.getIdToken(true);
        localStorage.setItem('firebase_token', token);
        if (callback) callback(token);
      } catch (error) {
        console.error('Error refreshing token:', error);
        if (callback) callback(null);
      }
    } else {
      localStorage.removeItem('firebase_token');
      if (callback) callback(null);
    }
  });
};

export { auth };