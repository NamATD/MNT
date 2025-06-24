"use client";

import { useUserStore } from "@/store/user.store";
import { useRouter } from "next/navigation";
import Header from "./_components/Header";
import { useEffect } from "react";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  return (
    <>
      <Header />
      {children}
    </>
  );
}
