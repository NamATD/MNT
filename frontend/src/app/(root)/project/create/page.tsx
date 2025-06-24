"use client";

import { useUserStore } from "@/store/user.store";
import axiosClient from "@/utils";
import React, { useState } from "react";

export default function CreateProjectPage() {
  const [form, setForm] = useState<{ title?: string; description?: string }>({});
  const { user, getProjects } = useUserStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!form.title || !form.description) {
        alert("Fill all fields!");
        return;
      }
      if (!user) {
        return;
      }
      console.log("submit");

      const res = await axiosClient.post("/projects/create", { userId: user._id, title: form.title, description: form.description });

      if (!res) {
        alert("Created fail");
        return;
      }
      console.log("create response: ", res);
      getProjects(user._id);
      setForm({ title: "", description: "" });
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please check your credentials.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  return (
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
    </div>
  );
}
