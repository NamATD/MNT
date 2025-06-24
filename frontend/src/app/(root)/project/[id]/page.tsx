"use client";
    
import React, { useEffect } from "react";
import TaskList from "../_components/TaskList";
import { useTaskStore } from "@/store/task.store";

export default function Project({ params }: { params: { id: string } }) {
  const { loading, tasks, getTasks } = useTaskStore();
  useEffect(() => {
    getTasks(params.id);
  }, [getTasks, params]);
  if (loading) {
    return <span className="loading loading-spinner loading-xl"></span>;
  }
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Tasks</h2>
      {tasks ? (
        <TaskList tasks={tasks} />
      ) : (
        <div role="alert" className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Error! Task failed successfully.</span>
        </div>
      )}
    </div>
  );
}
