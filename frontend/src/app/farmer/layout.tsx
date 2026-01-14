"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";

export default function FarmerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isFarmer, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!isAuthenticated || !isFarmer)) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, isFarmer, router]);

  if (loading) {
    return null;
  }

  return <>{children}</>;
}
