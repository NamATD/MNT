import axiosClient from "@/utils";
import { create } from "zustand";

interface Project {
  _id: string;
  title: string;
  description: string;
  members: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
interface ProjectState {
  projects: Project[] | null;
  isLoading: boolean;
  isError: boolean;
  fetchProjects: () => Promise<Project[]>;
  createProject: (title: string, description: string) => Promise<Project>;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: null,
  isLoading: false,
  isError: false,

  fetchProjects: async (): Promise<Project[]> => {
    try {
      set({ isLoading: true, isError: false });

      const response = await axiosClient.get("/projects");
      set({ projects: response.data });
      return response.data;
    } catch (error) {
      set({ isError: true });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  createProject: async (title: string, description: string): Promise<Project> => {
    try {
      set({ isLoading: true, isError: false });
      const res = await axiosClient.post("/projects/create", { title, description });
      return res.data;
    } catch (error) {
      set({ isError: true });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));
