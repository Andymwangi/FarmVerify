"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

interface LocationPickerProps {
  onLocationUpdate: (latitude: number, longitude: number) => Promise<void>;
  currentLatitude?: number | null;
  currentLongitude?: number | null;
}

export function LocationPicker({
  onLocationUpdate,
  currentLatitude,
  currentLongitude,
}: LocationPickerProps) {
  const [latitude, setLatitude] = useState<string>(
    currentLatitude?.toString() || ""
  );
  const [longitude, setLongitude] = useState<string>(
    currentLongitude?.toString() || ""
  );
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [error, setError] = useState<string>("");

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setGettingLocation(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toFixed(6));
        setLongitude(position.coords.longitude.toFixed(6));
        setGettingLocation(false);
      },
      (error) => {
        setError("Unable to retrieve your location: " + error.message);
        setGettingLocation(false);
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lon)) {
      setError("Please enter valid coordinates");
      return;
    }

    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      setError("Coordinates out of range");
      return;
    }

    setLoading(true);
    try {
      await onLocationUpdate(lat, lon);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update location");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon icon="solar:map-point-bold" className="h-5 w-5 text-primary" />
          Update Farm Location
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Button
            type="button"
            onClick={getCurrentLocation}
            disabled={gettingLocation}
            variant="outline"
            className="w-full gap-2"
          >
            {gettingLocation ? (
              <>
                <Icon icon="solar:refresh-bold" className="h-4 w-4 animate-spin" />
                Getting Location...
              </>
            ) : (
              <>
                <Icon icon="solar:gps-bold" className="h-4 w-4" />
                Use Current Location
              </>
            )}
          </Button>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Latitude"
              type="number"
              step="0.000001"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              placeholder="-1.286389"
              required
            />
            <Input
              label="Longitude"
              type="number"
              step="0.000001"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              placeholder="36.817223"
              required
            />
          </div>

          {error && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {currentLatitude && currentLongitude && (
            <div className="rounded-lg bg-muted p-3 text-sm">
              <p className="font-medium">Current Location:</p>
              <p className="text-muted-foreground">
                {currentLatitude.toFixed(6)}, {currentLongitude.toFixed(6)}
              </p>
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Updating..." : "Update Location"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
