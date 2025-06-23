import { create } from "zustand";

export interface User {
  id: string;
  email: string;
  name: string;
}

export type SyokuzaiKanri = {
  name: string;
  expiry_date: string; // ISO日付文字列
  remark?: string | null;
  created_at?: string;
  user_id: string;
};
/*export interface Ingredient {
  id: string;
  name: string;
  remark: string;
  expiryDate: string;
  createdAt: string;
  userId: string;
}*/

export interface Recipe {
  id: string;
  name: string;
  ingredients: string[];
  instructions: string[];
  imageUrl?: string;
  isFavorite: boolean;
}

type UserState = {
  userId: string | null; // ← number から string に修正
  setUserId: (id: string | null) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (status: boolean) => void;
};

export const useUserStore = create<UserState>((set) => ({
  userId: null,
  setUserId: (id) => set({ userId: id }),
  isLoggedIn: false,
  setIsLoggedIn: (status) => set({ isLoggedIn: status }),
}));

