"use client";

import { motion } from "framer-motion";
import { BarChart3, FileText, Search, Sparkles, TrendingUp, Type } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const tabs = [
  {
    value: "ads",
    label: "Ad Generation",
    icon: Sparkles,
    heading: "Create ads that convert",
    description:
      "Generate high-performing ad copy for every platform in seconds. Our AI analyzes top-performing campaigns in your industry to craft messages that resonate with your audience and drive action.",
    features: ["Google Ads", "Meta Ads", "LinkedIn Ads", "A/B Variants"],
    mockup: {
      gradient: "from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30",
      lines: [
        { icon: Sparkles, text: "Headline: Grow 3x Faster with AI Marketing", accent: true },
        { icon: Type, text: "Description: Join 2,000+ brands using BrandRocket..." },
        { icon: TrendingUp, text: "Predicted CTR: 4.2% — Above average" },
      ],
    },
  },
  {
    value: "seo",
    label: "SEO Analysis",
    icon: Search,
    heading: "Rank higher, faster",
    description:
      "Get a complete SEO audit with prioritized recommendations. Our AI identifies keyword opportunities, content gaps, and technical issues that are holding your site back.",
    features: ["Site Audit", "Keyword Research", "Competitor Analysis", "Rank Tracking"],
    mockup: {
      gradient: "from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30",
      lines: [
        { icon: Search, text: "Domain Authority: 45/100 — Improving", accent: true },
        { icon: TrendingUp, text: "Keyword Rankings: 128 keywords in top 10" },
        { icon: BarChart3, text: "Organic Traffic: +32% this month" },
      ],
    },
  },
  {
    value: "content",
    label: "Content Writing",
    icon: FileText,
    heading: "Content that drives results",
    description:
      "From blog posts to email campaigns, generate on-brand content in minutes instead of hours. Our AI learns your tone of voice and maintains consistency across every channel.",
    features: ["Blog Posts", "Email Campaigns", "Social Media", "Landing Pages"],
    mockup: {
      gradient: "from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30",
      lines: [
        { icon: FileText, text: "Blog: 10 Marketing Trends for 2026", accent: true },
        { icon: Type, text: "Word count: 1,842 — SEO optimized" },
        { icon: BarChart3, text: "Readability: Grade 8 — Easy to read" },
      ],
    },
  },
];

export function ProductShowcase() {
  return (
    <section className="border-y border-border bg-muted/30 py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-sm font-medium text-brand">Product</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Built for modern marketing teams
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Three powerful tools, one seamless workflow. Everything you need
            from ideation to execution.
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.25, 0.4, 0.25, 1] }}
          className="mt-14"
        >
          <Tabs defaultValue="ads">
            <div className="flex justify-center">
              <TabsList className="h-10">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="gap-2 px-4 text-sm"
                  >
                    <tab.icon className="size-4" />
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {tabs.map((tab) => (
              <TabsContent key={tab.value} value={tab.value} className="mt-10">
                <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                  {/* Text side */}
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight text-foreground">
                      {tab.heading}
                    </h3>
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                      {tab.description}
                    </p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {tab.features.map((f) => (
                        <Badge key={f} variant="secondary" className="px-3 py-1 text-xs font-medium">
                          {f}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Mockup side */}
                  <div
                    className={`rounded-2xl bg-gradient-to-br ${tab.mockup.gradient} border border-border p-6 lg:p-8`}
                  >
                    <div className="space-y-4">
                      {tab.mockup.lines.map((line, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center gap-3 rounded-lg border bg-card p-4 text-sm ${
                            line.accent
                              ? "border-brand/20 shadow-sm"
                              : "border-border"
                          }`}
                        >
                          <line.icon
                            className={`size-4 shrink-0 ${
                              line.accent
                                ? "text-brand"
                                : "text-muted-foreground"
                            }`}
                          />
                          <span
                            className={
                              line.accent
                                ? "font-medium text-foreground"
                                : "text-muted-foreground"
                            }
                          >
                            {line.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>
      </div>
    </section>
  );
}
