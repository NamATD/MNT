import { create } from "zustand";
import axiosClient from "@/utils";

interface User {
  _id: string;
  username: string;
  role: string;
}

interface Project {
  _id: string;
  title: string;
  description: string;
  members: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface UserState {
  user: User | null;
  projects: Project[] | null;
  fetchUser: () => Promise<void>;
  getProjects: (userId: string) => Promise<Project[]>;
  login: (username: string, password: string) => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  projects: null,

  fetchUser: async () => {
    const response = await axiosClient.get("/user/me");
    const userData = response.data;

    set({ user: userData });
  },

  getProjects: async (userId: string): Promise<Project[]> => {
    const userProjects = await axiosClient.post("/projects", { userId });
    console.log("user project: ", userProjects);
    set({ projects: userProjects.data });

    return userProjects.data;
  },

  login: async (username: string, password: string): Promise<void> => {
    try {
      await axiosClient.post("/auth/login", { username, password });
      await get().fetchUser();
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  },
}));
