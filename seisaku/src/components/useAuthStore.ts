// src/store/useAuthStore.ts
import { create } from "zustand";
import type { User } from "@supabase/auth-js";

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
