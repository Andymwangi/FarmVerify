"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={`rounded-lg p-2 transition-colors hover:bg-accent hover:text-accent-foreground ${className}`}
      aria-label="Toggle theme"
    >
      <Icon
        icon={theme === "dark" ? "solar:sun-bold" : "solar:moon-bold"}
        className="h-5 w-5"
      />
    </button>
  );
}
