"use client";

import { useUserStore } from "@/store/user.store";
import { useRouter } from "next/navigation";
import React from "react";
import Header from "./_components/Header";

function Home() {
  const router = useRouter();
  const { user } = useUserStore();

  if (!user) {
    router.push("/login");
  }

  return (
    <div>
      <Header />
    </div>
  );
}

export default Home;
