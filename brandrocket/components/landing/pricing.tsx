"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  highlighted: boolean;
  badge?: string;
}

const tiers: PricingTier[] = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    description: "For individuals exploring AI-powered marketing.",
    features: [
      "50 AI credits per month",
      "1 team member",
      "Basic ad generator",
      "SEO site audit",
      "Community support",
      "1 brand profile",
    ],
    cta: "Get Started Free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/mo",
    description: "For growing teams ready to scale their marketing.",
    features: [
      "Unlimited AI credits",
      "Up to 5 team members",
      "Advanced ad generator",
      "Full SEO toolkit",
      "Blog writer with brand voice",
      "Social media scheduler",
      "Priority support",
      "5 brand profiles",
    ],
    cta: "Start Pro Trial",
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "/mo",
    description: "For organizations that need custom solutions at scale.",
    features: [
      "Everything in Pro",
      "Unlimited team members",
      "Custom AI model training",
      "API access",
      "Advanced analytics",
      "Dedicated account manager",
      "SSO & SAML",
      "Custom integrations",
    ],
    cta: "Contact Sales",
    highlighted: false,
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

export function Pricing() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24 lg:py-32">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] as const }}
        className="mx-auto max-w-2xl text-center"
      >
        <p className="text-sm font-medium text-brand">Pricing</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Simple, transparent pricing
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          No hidden fees. No surprise charges. Pick a plan that fits your team
          and upgrade anytime.
        </p>
      </motion.div>

      {/* Pricing cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="mt-14 grid gap-6 lg:grid-cols-3"
      >
        {tiers.map((tier) => (
          <motion.div
            key={tier.name}
            variants={cardVariants}
            className={cn(
              "relative flex flex-col rounded-2xl border bg-card p-8",
              tier.highlighted
                ? "border-brand shadow-md"
                : "border-border shadow-sm"
            )}
          >
            {/* Badge */}
            {tier.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-brand px-3 py-1 text-xs font-medium text-brand-foreground">
                  {tier.badge}
                </Badge>
              </div>
            )}

            {/* Plan header */}
            <div>
              <h3 className="text-base font-semibold text-foreground">
                {tier.name}
              </h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight text-foreground">
                  {tier.price}
                </span>
                {tier.period && (
                  <span className="text-sm text-muted-foreground">
                    {tier.period}
                  </span>
                )}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {tier.description}
              </p>
            </div>

            {/* Divider */}
            <div className="my-6 h-px bg-border" />

            {/* Features */}
            <ul className="flex-1 space-y-3">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-brand" />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Button
              className={cn(
                "mt-8 h-11 w-full rounded-xl text-sm font-medium",
                tier.highlighted
                  ? "bg-brand text-brand-foreground hover:bg-brand/90"
                  : ""
              )}
              variant={tier.highlighted ? "default" : "outline"}
            >
              {tier.cta}
            </Button>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
