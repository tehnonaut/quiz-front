"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getStorageItem } from "@/lib/storage";

export const usePublicRoute = () => {
  const router = useRouter();

  useEffect(() => {
    const token = getStorageItem("token");
    if (token) router.push("/dashboard");
  }, []);
};
