"use client";

import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[85vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-background" />

        <div className="container relative mx-auto flex min-h-[85vh] items-center px-4 py-20">
          <div className="max-w-2xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl"
            >
              Digital Certification for{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
                  Modern Farmers
                </span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="absolute -bottom-2 left-0 h-1 w-full origin-left rounded-full bg-gradient-to-r from-green-400 to-emerald-300"
                />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8 text-lg text-white/80 sm:text-xl"
            >
              Streamline your farm certification process with our secure digital platform.
              Track applications, get verified, and access premium markets.
            </motion.p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/register">
                <Button size="lg" className="w-full gap-2 sm:w-auto">
                  Start Certification
                  <Icon icon="solar:arrow-right-linear" className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-white/30 bg-white/10 text-white hover:bg-white/20 sm:w-auto"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              Why Farmers Choose Us
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              A complete certification platform designed for agricultural excellence
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Large Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-green-600 p-8 text-white md:col-span-2 lg:col-span-1 lg:row-span-2"
            >
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
              <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/10" />
              <div className="relative">
                <Icon icon="solar:verified-check-bold" className="mb-6 h-12 w-12" />
                <h3 className="mb-4 text-2xl font-bold">Instant Verification</h3>
                <p className="text-white/80">
                  Get your certification status verified instantly. Our digital platform
                  ensures quick reviews and transparent tracking from application to approval.
                </p>
              </div>
            </motion.div>

            {/* Regular Cards */}
            {[
              {
                icon: "solar:shield-check-bold",
                title: "Secure Platform",
                desc: "Enterprise-grade security protects your data with encrypted storage and secure authentication.",
                color: "blue",
              },
              {
                icon: "solar:clock-circle-bold",
                title: "Fast Processing",
                desc: "Applications reviewed within 24-48 hours. Real-time status updates keep you informed.",
                color: "amber",
              },
              {
                icon: "solar:smartphone-update-bold",
                title: "Mobile Access",
                desc: "Check your status anywhere with our mobile app. Available for iOS and Android devices.",
                color: "purple",
              },
              {
                icon: "solar:chart-2-bold",
                title: "Analytics Dashboard",
                desc: "Track your certification journey with detailed insights and progress reports.",
                color: "emerald",
              },
            ].map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group rounded-3xl border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
              >
                <div
                  className={`mb-4 inline-flex rounded-2xl bg-${card.color}-100 p-3 text-${card.color}-600 dark:bg-${card.color}-900/30`}
                >
                  <Icon icon={card.icon} className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{card.title}</h3>
                <p className="text-sm text-muted-foreground">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-y bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">How It Works</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Get certified in three simple steps
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                icon: "solar:user-plus-bold",
                title: "Register Your Farm",
                description:
                  "Create an account and provide your farm details including size, location, and crop types.",
              },
              {
                step: "02",
                icon: "solar:document-add-bold",
                title: "Submit Application",
                description:
                  "Complete your certification application with required documentation and farm information.",
              },
              {
                step: "03",
                icon: "solar:verified-check-bold",
                title: "Get Certified",
                description:
                  "Receive your digital certification and gain access to premium agricultural markets.",
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative"
              >
                <div className="mb-6 flex items-center gap-4">
                  <span className="text-5xl font-bold text-primary/20">{item.step}</span>
                  <div className="rounded-2xl bg-primary/10 p-3">
                    <Icon icon={item.icon} className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-green-600 p-8 text-center text-white sm:p-12 lg:p-16">
            <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10" />
            <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-white/10" />

            <div className="relative">
              <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
                Ready to Get Certified?
              </h2>
              <p className="mx-auto mb-8 max-w-xl opacity-90">
                Join farmers across Kenya who have streamlined their certification process
                with our platform.
              </p>
              <Link href="/register">
                <Button size="lg" variant="secondary" className="gap-2">
                  Create Free Account
                  <Icon icon="solar:arrow-right-linear" className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
