import { create } from 'zustand';
import { auth, signInWithGoogle } from '../services/firebase';

const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  error: null,

  setUser: (user) => set({ user, loading: false }),
  clearUser: () => set({ user: null, loading: false }),

  login: async () => {
    try {
      set({ loading: true, error: null });
      const user = await signInWithGoogle();
      
      if (!user.email?.endsWith('@horusautomation.com')) {
        throw new Error('Solo se permiten correos de @horusautomation.com');
      }
      
      set({ user, loading: false });
      return user;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await auth.signOut();
      set({ user: null, loading: false });
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  checkAuth: () => {
    return new Promise((resolve) => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        set({ user, loading: false });
        unsubscribe();
        resolve(user);
      });
    });
  }
}));

export default useAuthStore;