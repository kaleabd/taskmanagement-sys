import { create } from 'zustand';

interface AuthState {
  isAuthorized: boolean;
  notAuthorized: boolean;
  username: string;
  setUserName: (value: string) => void;
  setAuth: (value: boolean) => void;
};


export const useAuthStore = create<AuthState>((set) => ({
    isAuthorized: false,
    notAuthorized:false,
    setAuth: (value: boolean) => set(() => ({ isAuthorized: value })),
    username: "",
    setUserName: (value: string) => set(() => ({ username: value })),
    
}));
