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
  getProjects: (userId: string) => Promise<Project[]>;
  login: (username: string, password: string) => Promise<User>;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  projects: null,

  getProjects: async (userId: string): Promise<Project[]> => {
    const userProjects = await axiosClient.post("/projects", { userId });
    console.log("user project: ", userProjects);
    set({ projects: userProjects.data });

    return userProjects.data;
  },

  login: async (username: string, password: string): Promise<User> => {
    try {
      const response = await axiosClient.post("/user/login", { username, password });
      const userData = response.data;

      set({ user: userData });

      get().getProjects(userData._id);

      return userData;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  },
}));
