"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/wallpaper.jpg')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/80 to-black/70" />

      <div className="container relative mx-auto px-4 py-12">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <Icon icon="solar:leaf-bold" className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-white">FarmVerify</span>
          </Link>
          <p className="mx-auto mt-3 max-w-sm text-sm text-white/70">
            Empowering farmers with digital certification for sustainable agriculture.
          </p>
        </div>

        <div className="mt-8 border-t border-white/10 pt-8">
          <p className="text-center text-sm text-white/60">
            &copy; {new Date().getFullYear()} Tradecare Africa. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
