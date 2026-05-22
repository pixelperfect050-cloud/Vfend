"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  initials: string;
}

const testimonials: Testimonial[] = [
  {
    quote:
      "BrandRocket cut our content production time by 70%. We went from publishing two blog posts a month to eight — all while improving quality and SEO rankings.",
    name: "Sarah Chen",
    role: "Head of Marketing",
    company: "Flowbase",
    initials: "SC",
  },
  {
    quote:
      "The AI ad generator is incredible. We tested it against our in-house copy and it consistently outperformed on CTR. It's now our go-to tool for every campaign.",
    name: "Marcus Rivera",
    role: "Performance Marketing Lead",
    company: "Outshift",
    initials: "MR",
  },
  {
    quote:
      "Finally, a marketing tool that doesn't feel bloated. BrandRocket is exactly what we needed — clean, fast, and the AI actually gets our brand voice right.",
    name: "Emily Zhang",
    role: "Co-founder & CMO",
    company: "Stellara",
    initials: "EZ",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.4, 0.25, 1] as const,
    },
  },
};

export function Testimonials() {
  return (
    <section className="border-y border-border bg-muted/30 py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] as const }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-sm font-medium text-brand">Testimonials</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Loved by marketers worldwide
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            See why thousands of teams trust BrandRocket to power their
            marketing.
          </p>
        </motion.div>

        {/* Testimonial cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {testimonials.map((t) => (
            <motion.div
              key={t.name}
              variants={cardVariants}
              className="flex flex-col rounded-xl border border-border bg-card p-6 shadow-sm"
            >
              {/* Stars */}
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="size-3.5 fill-brand text-brand"
                  />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="mt-6 flex items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand/10 text-xs font-semibold text-brand">
                  {t.initials}
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">
                    {t.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t.role}, {t.company}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
