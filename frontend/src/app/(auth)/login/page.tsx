"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { useAuth } from "@/hooks/useAuth";
import { ThemeToggle } from "@/components/ThemeToggle";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setValue("email", rememberedEmail);
      setRememberMe(true);
    }
  }, [setValue]);

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);
    
    if (rememberMe) {
      localStorage.setItem("rememberedEmail", data.email);
    } else {
      localStorage.removeItem("rememberedEmail");
    }

    try {
      await login(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

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
        <div className="w-full max-w-md">
          <Link href="/" className="mb-8 flex items-center justify-center gap-2">
            <Icon icon="solar:leaf-bold" className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-white">FarmVerify</span>
          </Link>

          <Card className="border-white/10 bg-white/95 backdrop-blur-sm dark:bg-gray-900/95">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Icon icon="solar:user-circle-bold" className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">Welcome Back</CardTitle>
              <CardDescription>Sign in to your account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {error && (
                  <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                    <Icon icon="solar:danger-triangle-bold" className="h-4 w-4" />
                    {error}
                  </div>
                )}

                <Input
                  id="email"
                  type="email"
                  label="Email Address"
                  placeholder="john@example.com"
                  error={errors.email?.message}
                  {...register("email")}
                />

                <Input
                  id="password"
                  type="password"
                  label="Password"
                  placeholder="••••••••"
                  error={errors.password?.message}
                  {...register("password")}
                />

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="remember"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Remember me
                  </label>
                </div>

                <Button type="submit" className="w-full" isLoading={isLoading}>
                  Sign In
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Don&#39;t have an account?{" "}
                  <Link href="/register" className="font-medium text-primary hover:underline">
                    Register here
                  </Link>
                </p>
              </form>

              <div className="mt-6 rounded-lg border bg-muted/50 p-4">
                <p className="mb-2 text-xs font-medium text-muted-foreground">Demo Credentials:</p>
                <div className="space-y-1 text-xs">
                  <p><span className="font-medium">Admin:</span> admin@tradecare.com / admin123</p>
                  <p><span className="font-medium">Farmer:</span> john.kamau@example.com / farmer123</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
