"use client";

import { useProjectStore } from "@/store/project.store";
import React, { useState } from "react";
import toast from "react-hot-toast";

export default function CreateProjectPage() {
  const [form, setForm] = useState<{ title?: string; description?: string }>({});
  const { isLoading, isError, createProject, fetchProjects } = useProjectStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!form.title || !form.description) {
        toast.error("Fill all fields!");
        return;
      }

      const res = createProject(form.title, form.description);

      if (!res) {
        toast.error("Failed to create project");
        return;
      }

      toast.success("Created a project");
      fetchProjects();
      setForm({ title: "", description: "" });
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed. Please check your credentials.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  return isLoading ? (
    <span className="loading loading-spinner loading-xl" />
  ) : (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center text-black">Create Project</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="title">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={form.title || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="Enter title"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="Enter description"
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200">
            Create
          </button>
        </form>
      </div>
      {isError && (
        <div role="alert" className="alert alert-error alert-soft">
          <span>Failed to create project.</span>
        </div>
      )}
    </div>
  );
}
