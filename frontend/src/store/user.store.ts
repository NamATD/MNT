import { create } from "zustand";
import axiosClient from "@/utils";

interface User {
  _id: string;
  username: string;
  role: string;
}
interface UserState {
  user: User | null;
  isLoading: boolean;
  isError: boolean;
  fetchUser: () => Promise<User>;
  login: (username: string, password: string) => Promise<User | null>;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  isLoading: false,
  isError: false,

  fetchUser: async (): Promise<User> => {
    const response = await axiosClient.get("/user/me");
    const userData = response.data;

    set({ user: userData });
    return userData;
  },

  login: async (username: string, password: string): Promise<User | null> => {
    try {
      set({ isLoading: true, isError: false });
      await axiosClient.post("/auth/login", { username, password });

      return await get().fetchUser();
    } catch (error) {
      console.error("Login failed:", error);
      set({ isError: true });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));
