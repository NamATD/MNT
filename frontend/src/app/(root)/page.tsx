"use client";

import { useProjectStore } from "@/store/project.store";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function Home() {
  const router = useRouter();
  const { isLoading, projects, fetchProjects } = useProjectStore();

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleProjectClick = (projectId: string) => {
    router.push(`/project/${projectId}`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Your Projects</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="flex flex-col gap-4 border p-4 rounded-lg">
              <div className="skeleton h-8 w-3/4"></div>
              <div className="skeleton h-4 w-full"></div>
              <div className="skeleton h-4 w-full"></div>
              <div className="skeleton h-4 w-28"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Projects</h1>
        <button className="btn btn-primary" onClick={() => router.push("/project/create")}>
          Create New Project
        </button>
      </div>

      {projects && projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project._id}
              className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleProjectClick(project._id)}>
              <div className="card-body">
                <h2 className="card-title text-xl font-bold">{project.title}</h2>
                <p className="text-gray-600 line-clamp-2 mb-2">{project.description}</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {project.members.length > 0 && (
                    <div className="avatar-group -space-x-2">
                      {project.members.slice(0, 3).map((member, index) => (
                        <div key={index} className="avatar border-2 border-base-100">
                          <div className="w-8 bg-neutral text-neutral-content rounded-full">
                            <span className="text-xs">{member.substring(0, 2).toUpperCase()}</span>
                          </div>
                        </div>
                      ))}
                      {project.members.length > 3 && (
                        <div className="avatar border-2 border-base-100 placeholder">
                          <div className="w-8 bg-neutral text-neutral-content rounded-full">
                            <span className="text-xs">+{project.members.length - 3}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="card-actions justify-between items-center text-xs text-gray-500">
                  <span>Created: {new Date(project.createdAt).toLocaleDateString()}</span>
                  <span>Updated: {new Date(project.updatedAt).toLocaleDateString()}</span>
                </div>
                <div className="card-actions justify-end mt-4">
                  <Link href={`/project/${project._id}`} className="btn btn-sm btn-outline" onClick={(e) => e.stopPropagation()}>
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-12 border rounded-lg bg-base-200">
          <h3 className="text-xl font-semibold mb-2">No Projects Found</h3>
          <p className="text-gray-500 mb-6">You don&apos;t have any projects yet. Create your first project to get started.</p>
          <button className="btn btn-primary" onClick={() => router.push("/project/create")}>
            Create Your First Project
          </button>
        </div>
      )}
    </div>
  );
}

export default Home;
