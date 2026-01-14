"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";
import { RegistrationForm } from "@/components/farmer/RegistrationForm";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/Button";

export default function RegisterPage() {
  return (
    <div className="relative min-h-screen">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/wallpaper.jpg')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-green-900/60" />

      {/* Top Navigation */}
      <div className="absolute left-0 top-0 z-10 flex w-full justify-between p-4">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2 text-white hover:bg-white/10 hover:text-white">
            <Icon icon="solar:arrow-left-linear" className="h-5 w-5" />
            Back to Home
          </Button>
        </Link>
        <div className="rounded-lg bg-black/20 backdrop-blur-sm">
          <ThemeToggle className="text-white hover:bg-white/10 hover:text-white" />
        </div>
      </div>

      <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          <Link href="/" className="mb-8 flex items-center justify-center gap-2">
            <Icon icon="solar:leaf-bold" className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-white">FarmVerify</span>
          </Link>

          <div className="rounded-2xl border border-white/10 bg-white/95 p-6 backdrop-blur-sm dark:bg-gray-900/95">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Icon icon="solar:leaf-bold" className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold">Create Account</h1>
              <p className="mt-1 text-sm text-muted-foreground">Register your farm for certification</p>
            </div>

            <RegistrationForm />

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
