"use client";

import { useState, useEffect, useRef } from "react";
import React from "react";
import { useRouter, useParams } from "next/navigation";
import { connectSocket, joinProjectRoom, sendMessage, onNewMessage } from "@/services/socket";
import router from "next/router";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

interface Task {
  _id: string;
  title: string;
  description: string;
  assignedTo: {
    _id: string;
    username: string;
  };
  createdBy: {
    _id: string;
    username: string;
  };
  progress: number;
  file?: string;
  projectId?: string;
}

// Định nghĩa kiểu cho params
interface RouteParams {
  id: string;
}

export default function TaskDetails() {
  const [task, setTask] = useState<Task | null>(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const params = useParams();
  const taskId = params.id as string; // Lấy taskId trực tiếp từ params

  // --- Chat state ---
  const [messages, setMessages] = useState<{ userId: string; message: string; timestamp: string }[]>([]);
  const [chatInput, setChatInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "anonymous" : "anonymous";
  const [projectId, setProjectId] = useState<string>("");

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    // Fetch task details
    const fetchTask = async () => {
      try {
        const response = await fetch(`${baseUrl}/tasks/${taskId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch task");
        }

        const data = await response.json();
        setTask(data);
        setProgress(data.progress);
        setProjectId(data.projectId || "");
      } catch (error) {
        console.error("Error fetching task:", error);
        setError("Failed to load task details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId, router]);

  // --- Chat socket effect ---
  useEffect(() => {
    if (!projectId) return;
    const socket = connectSocket(userId);
    joinProjectRoom(projectId, userId);

    onNewMessage((data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket?.disconnect();
    };
  }, [projectId, userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (chatInput.trim() && projectId) {
      sendMessage(projectId, userId, chatInput);
      setChatInput("");
    }
  };

  const handleProgressUpdate = async () => {
    if (!task) return;

    setUpdateLoading(true);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${baseUrl}/tasks/${taskId}/progress`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ progress }),
      });

      if (!response.ok) {
        throw new Error("Failed to update progress");
      }

      const updatedTask = await response.json();
      setTask(updatedTask);
      alert("Progress updated successfully");
    } catch (error) {
      console.error("Error updating progress:", error);
      alert("Failed to update progress. Please try again.");
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-center">
        <p>Loading task details...</p>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Error</h1>
          <p className="text-red-600">{error || "Task not found"}</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            Back to Tasks
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">{task.title}</h1>
          <div>
            <button
              onClick={() => router.push("/dashboard")}
              className="text-blue-600 hover:text-blue-800 mr-4"
            >
              Back to Tasks
            </button>
            <button
              onClick={() => router.push(`/dashboard/${task._id}/edit`)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Edit Task
            </button>
          </div>
        </div>

        <div className="mb-6 p-4 bg-gray-50 rounded border border-gray-200">
          <h2 className="text-lg font-semibold mb-2">Description</h2>
          <p className="whitespace-pre-line">{task.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">Task Details</h2>
            <ul className="space-y-2">
              <li>
                <span className="font-medium">Assigned to:</span> {task.assignedTo?.username}
              </li>
              <li>
                <span className="font-medium">Created by:</span> {task.createdBy?.username}
              </li>
              {task.projectId && (
                <li>
                  <span className="font-medium">Project ID:</span> {task.projectId}
                </li>
              )}
              {task.file && (
                <li>
                  <span className="font-medium">Attachment:</span>{" "}
                  <a
                    href={`${baseUrl}/uploads/${task.file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View File
                  </a>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Progress</h2>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${task.progress}%` }}
              ></div>
            </div>
            <div className="flex items-center">
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => setProgress(parseInt(e.target.value))}
                className="w-full mr-4"
              />
              <span className="text-sm font-medium">{progress}%</span>
            </div>
            <button
              onClick={handleProgressUpdate}
              disabled={updateLoading || progress === task.progress}
              className={`mt-2 px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition ${
                updateLoading || progress === task.progress
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {updateLoading ? "Updating..." : "Update Progress"}
            </button>
          </div>
        </div>

        {/* --- Chat UI --- */}
        <div className="mt-8 max-w-xl mx-auto bg-white rounded shadow p-4">
          <h2 className="text-lg font-bold mb-2">Project Chat</h2>
          <div className="h-60 overflow-y-auto border rounded p-2 mb-2 bg-gray-50">
            {messages.map((msg, idx) => (
              <div key={idx} className="mb-1">
                <span className="font-semibold text-blue-700">{msg.userId}:</span>{" "}
                <span>{msg.message}</span>
                <span className="text-xs text-gray-400 ml-2">
                  {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : ""}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 border rounded px-2 py-1"
              placeholder="Type a message..."
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}