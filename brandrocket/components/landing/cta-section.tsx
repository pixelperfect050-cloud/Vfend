"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-24 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand/5 via-brand/[0.02] to-transparent border border-brand/10 px-8 py-16 text-center sm:px-16 lg:py-24"
        >
          {/* Subtle decorative element */}
          <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-brand/5 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 size-48 rounded-full bg-brand/5 blur-3xl" />

          <div className="relative">
            <h2 className="mx-auto max-w-xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Ready to supercharge your marketing?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
              Join thousands of teams already using BrandRocket to create
              better campaigns, faster. Start free — no credit card required.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button className="h-11 gap-2 rounded-xl bg-brand px-8 text-sm font-medium text-brand-foreground hover:bg-brand/90">
                Get Started Free
                <ArrowRight className="size-4" />
              </Button>
              <Button
                variant="outline"
                className="h-11 rounded-xl px-8 text-sm font-medium"
              >
                Talk to Sales
              </Button>
            </div>

            <p className="mt-6 text-xs text-muted-foreground">
              Free forever on Starter plan · No credit card required · Setup in
              under 2 minutes
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
