"use client";

import React from "react";

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  progress: number;
  dueDate: Date;
  tags: string[];
}

interface TaskListProps {
  tasks: Task[];
}

const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  return (
    <div className="space-y-4 w-full">
      {tasks.map((task) => (
        <div
          key={task._id}
          className="w-full p-4 border rounded-xl shadow-sm hover:shadow-md transition flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white">
          <div className="flex flex-col space-y-1 sm:w-2/3">
            <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {task.tags.map((tag) => (
                <span key={tag} className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 sm:mt-0 sm:text-right space-y-1">
            <div className="text-sm text-gray-500">Due: {new Date(task.dueDate).toLocaleDateString()}</div>
            <div className="text-xs font-medium text-green-600 capitalize">{task.status}</div>
            <div className="w-full bg-gray-200 h-2 rounded overflow-hidden mt-1">
              <div className="bg-green-500 h-2" style={{ width: `${task.progress}%` }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
