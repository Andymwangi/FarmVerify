"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  farmSize: z.coerce.number().positive("Farm size must be positive"),
  cropType: z.string().min(1, "Crop type is required"),
  latitude: z.coerce.number().min(-90).max(90).optional(),
  longitude: z.coerce.number().min(-180).max(180).optional(),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegistrationForm() {
  const { register: registerUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationStatus, setLocationStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [locationError, setLocationError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const latitude = watch("latitude");
  const longitude = watch("longitude");

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setLocationStatus("error");
      return;
    }

    setLocationStatus("loading");
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setValue("latitude", parseFloat(position.coords.latitude.toFixed(6)));
        setValue("longitude", parseFloat(position.coords.longitude.toFixed(6)));
        setLocationStatus("success");
      },
      (err) => {
        setLocationStatus("error");
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setLocationError("Location permission denied. Please enable location access.");
            break;
          case err.POSITION_UNAVAILABLE:
            setLocationError("Location information unavailable.");
            break;
          case err.TIMEOUT:
            setLocationError("Location request timed out.");
            break;
          default:
            setLocationError("Unable to get location.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const clearLocation = () => {
    setValue("latitude", undefined);
    setValue("longitude", undefined);
    setLocationStatus("idle");
    setLocationError(null);
  };

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

      {/* Location Section */}
      <div className="space-y-3 rounded-lg border border-border bg-muted/30 p-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">
            Farm Location <span className="text-muted-foreground">(optional)</span>
          </label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={detectLocation}
            disabled={locationStatus === "loading"}
            className="gap-2"
          >
            {locationStatus === "loading" ? (
              <>
                <Icon icon="solar:refresh-linear" className="h-4 w-4 animate-spin" />
                Detecting...
              </>
            ) : locationStatus === "success" ? (
              <>
                <Icon icon="solar:check-circle-linear" className="h-4 w-4 text-green-500" />
                Detected
              </>
            ) : (
              <>
                <Icon icon="solar:map-point-linear" className="h-4 w-4" />
                Detect Location
              </>
            )}
          </Button>
        </div>

        {locationError && (
          <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-2 text-xs text-destructive">
            <Icon icon="solar:danger-triangle-linear" className="h-4 w-4" />
            {locationError}
          </div>
        )}

        {locationStatus === "success" && (
          <div className="flex items-center gap-2 rounded-md bg-green-500/10 p-2 text-xs text-green-600 dark:text-green-400">
            <Icon icon="solar:check-circle-linear" className="h-4 w-4" />
            Location detected! You can adjust the values below if needed.
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            id="latitude"
            type="number"
            step="0.000001"
            label="Latitude"
            placeholder="-1.286389"
            error={errors.latitude?.message}
            {...register("latitude")}
          />
          <Input
            id="longitude"
            type="number"
            step="0.000001"
            label="Longitude"
            placeholder="36.817223"
            error={errors.longitude?.message}
            {...register("longitude")}
          />
        </div>

        {(latitude || longitude) && (
          <button
            type="button"
            onClick={clearLocation}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <Icon icon="solar:close-circle-linear" className="h-3 w-3" />
            Clear location
          </button>
        )}
      </div>

      <Button type="submit" className="w-full" isLoading={isLoading}>
        Register
      </Button>
    </form>
  );
}
