"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { useAuth } from "@/hooks/useAuth";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  farmSize: z.coerce.number().positive("Farm size must be positive"),
  cropType: z.string().min(1, "Crop type is required"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegistrationForm() {
  const { register: registerUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      await registerUser(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Create Account</CardTitle>
        <CardDescription>Register as a new farmer</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <Input
            id="name"
            label="Full Name"
            placeholder="John Doe"
            error={errors.name?.message}
            {...register("name")}
          />

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

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              id="farmSize"
              type="number"
              step="0.1"
              label="Farm Size (acres)"
              placeholder="5.0"
              error={errors.farmSize?.message}
              {...register("farmSize")}
            />

            <Input
              id="cropType"
              label="Crop Type"
              placeholder="Maize"
              error={errors.cropType?.message}
              {...register("cropType")}
            />
          </div>

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Register
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
