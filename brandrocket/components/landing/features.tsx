"use client";

import { motion, type Variants } from "framer-motion";
import {
  BarChart3,
  Bot,
  CalendarDays,
  FileText,
  Search,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Campaign Orchestration",
    description:
      "Describe your goal — your AI team plans, creates, and executes complete multi-channel campaigns autonomously.",
  },
  {
    icon: Bot,
    title: "AI Growth Agents",
    description:
      "Specialized agents for SEO, content, ads, and analytics that work 24/7 to optimize your growth.",
  },
  {
    icon: CalendarDays,
    title: "Autonomous Execution",
    description:
      "AI monitors performance, detects issues, and automatically optimizes — no manual intervention needed.",
  },
  {
    icon: Search,
    title: "Real-time Intelligence",
    description:
      "Continuous monitoring of rankings, competitors, and opportunities with proactive recommendations.",
  },
  {
    icon: BarChart3,
    title: "Growth Scoring",
    description:
      "AI-powered scoring system that measures campaign health, risk, and growth potential at a glance.",
  },
  {
    icon: FileText,
    title: "Smart Content Engine",
    description:
      "AI that learns your brand voice and creates consistent, on-brand content across all channels.",
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.4, 0.25, 1],
    },
  },
};

export function Features() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24 lg:py-32">
      {/* Section header */}
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-medium text-brand">Features</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Everything you need to grow
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          A complete AI-powered marketing suite designed for teams that move
          fast and expect results.
        </p>
      </div>

      {/* Feature cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {features.map((feature) => (
          <motion.div
            key={feature.title}
            variants={cardVariants}
            className="group rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow duration-200 hover:shadow-md"
          >
            <div className="flex size-10 items-center justify-center rounded-lg bg-brand/10">
              <feature.icon className="size-5 text-brand" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-foreground">
              {feature.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
