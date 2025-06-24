import axiosClient from "@/utils";
import { create } from "zustand";

interface Task {
  _id: string;
  title: string;
  description: string;
  assignedTo: string[];
  projectId: string;
  status: string;
  progress: number;
  dueDate: Date;
  tags: string[];
}

interface TaskState {
  tasks: Task[] | null;
  loading: boolean;
  getTasks: (projectId: string) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: null,
  loading: false,

  getTasks: async (projectId: string) => {
    try {
      set({ loading: true });
      const response = await axiosClient.get(`/tasks/project/${projectId}`);
      const tasks = response.data;

      set({ tasks });
      set({ loading: false });
    } catch (error) {
      console.log("Failed to fetch tasks: ", error);
      throw new Error();
    }
  },
}));
