"use client";

import { Icon } from "@iconify/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = isAuthenticated
    ? user?.role === "ADMIN"
      ? [{ href: "/admin", label: "Dashboard" }]
      : [{ href: "/farmer", label: "Dashboard" }]
    : [
        { href: "/", label: "Home" },
        { href: "/login", label: "Login" },
        { href: "/register", label: "Register" },
      ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Icon icon="solar:leaf-bold" className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-foreground">FarmVerify</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === link.href
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}

          {isAuthenticated && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {user?.email}
              </span>
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          )}

          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-lg p-2 hover:bg-accent"
              aria-label="Toggle theme"
            >
              <Icon
                icon={theme === "dark" ? "solar:sun-bold" : "solar:moon-bold"}
                className="h-5 w-5"
              />
            </button>
          )}
        </div>

        <button
          className="rounded-lg p-2 md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <Icon
            icon={mobileMenuOpen ? "solar:close-circle-bold" : "solar:hamburger-menu-bold"}
            className="h-6 w-6"
          />
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="border-t bg-background px-4 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === link.href
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {isAuthenticated && (
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
            )}

            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <Icon
                  icon={theme === "dark" ? "solar:sun-bold" : "solar:moon-bold"}
                  className="h-5 w-5"
                />
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
