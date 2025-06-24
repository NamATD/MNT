import { create } from "zustand";
import axiosClient from "@/utils";
import { use } from "react";

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
  login: (username: string, password: string) => Promise<User>;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  projects: null,

  login: async (username: string, password: string): Promise<User> => {
    try {
      const response = await axiosClient.post("/user/login", { username, password });
      const userData = response.data;

      set({ user: userData });

      const userProjects = await axiosClient.post("/projects", { userId: userData._id });
      console.log("user project: ", userProjects);
      set({ projects: userProjects.data });

      return userData;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  },
}));
