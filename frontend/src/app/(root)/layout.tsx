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
  const { fetchUser } = useUserStore();

  useEffect(() => {
    async function checkUser() {
      const user = await fetchUser();
      if (!user) {
        router.push("/login");
      }
    }
    checkUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Header />
      {children}
    </>
  );
}
