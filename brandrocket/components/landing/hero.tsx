"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";

import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.12,
      duration: 0.5,
      ease: [0.25, 0.4, 0.25, 1] as const,
    },
  }),
};

const stats = [
  { value: "10x", label: "Faster campaigns" },
  { value: "3x", label: "More conversions" },
  { value: "24/7", label: "AI Growth Team" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Dot grid background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--color-border) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          opacity: 0.5,
        }}
      />

      <div className="relative mx-auto max-w-5xl px-6 py-24 text-center lg:py-36">
        <motion.div
          initial="hidden"
          animate="visible"
          viewport={{ once: true }}
          className="flex flex-col items-center"
        >
          {/* Badge */}
          <motion.div custom={0} variants={fadeUp}>
            <span className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/5 px-4 py-1.5 text-xs font-medium text-brand shadow-sm">
              <span className="inline-block size-1.5 rounded-full bg-brand animate-pulse" />
              Your AI Growth Team is ready
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            custom={1}
            variants={fadeUp}
            className="mt-8 max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            Autonomous growth,{" "}
            <span className="text-brand">powered by AI</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            custom={2}
            variants={fadeUp}
            className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            Tell BrandRocket what you want to achieve, and your AI growth team 
            will plan, create, execute, and optimize your marketing — 24/7.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            custom={3}
            variants={fadeUp}
            className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
          >
            <Button
              className="h-11 gap-2 rounded-xl bg-brand px-6 text-sm font-medium text-brand-foreground hover:bg-brand/90"
            >
              Get Started Free
              <ArrowRight className="size-4" />
            </Button>
            <Button
              variant="outline"
              className="h-11 gap-2 rounded-xl px-6 text-sm font-medium"
            >
              <Play className="size-4" />
              See How It Works
            </Button>
          </motion.div>

          {/* Trust stats */}
          <motion.div
            custom={4}
            variants={fadeUp}
            className="mt-16 flex flex-col items-center gap-8 sm:flex-row sm:gap-12"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-semibold tracking-tight text-foreground">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
