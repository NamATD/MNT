"use client";

import { useUserStore } from "@/store/user.store";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

function Header() {
  const router = useRouter();
  const { projects } = useUserStore();

  const GoToProject = (id: string) => {
    router.push(`/project/${id}`);
  };
  return (
    <div className="flex justify-end items-center gap-10 ">
      <div>
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-secondary m-1">
            Your Projects ⬇️
          </div>
          <ul tabIndex={0} className="dropdown-content menu bg-black z-1 w-52 p-2 shadow-sm gap-2">
            {(projects ?? []).length > 0 ? (
              (projects ?? []).map((project) => (
                <li key={project._id}>
                  <button className="btn btn-soft btn-accent w-full" onClick={() => GoToProject(project._id)}>
                    {project.title}
                  </button>
                </li>
              ))
            ) : (
              <>
                <h2 className="text-black">No project</h2>
              </>
            )}
          </ul>
        </div>
      </div>
      <div>
        <button className="btn btn-primary" onClick={() => router.push("/project/create")}>
          Create Project
        </button>
      </div>
      <div className="avatar">
        <div className="w-16 rounded-full relative">
          <Image
            src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp"
            alt="Profile Avatar"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}

export default Header;
