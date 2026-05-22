"use client";

import { motion } from "framer-motion";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What AI models does BrandRocket use?",
    answer:
      "BrandRocket leverages a combination of GPT-4o, Claude, and our own fine-tuned marketing models. We automatically select the best model for each task — ad copy, blog writing, SEO analysis — so you always get the highest quality output without needing to choose.",
  },
  {
    question: "How does the free plan work?",
    answer:
      "The Starter plan is completely free with no credit card required. You get 50 AI credits per month, access to our basic ad generator and SEO audit tools, and support through our community forum. You can upgrade to Pro anytime to unlock unlimited credits and advanced features.",
  },
  {
    question: "Is my data secure and private?",
    answer:
      "Absolutely. We take data privacy seriously. All data is encrypted at rest and in transit using AES-256 and TLS 1.3. We never use your content to train our models. We're SOC 2 Type II compliant and offer data processing agreements for Enterprise customers. You can delete your data at any time.",
  },
  {
    question: "What integrations are available?",
    answer:
      "BrandRocket integrates with the tools you already use: Google Ads, Meta Ads, LinkedIn, HubSpot, WordPress, Shopify, Webflow, Google Analytics, Search Console, and Slack. Enterprise plans include custom API access and webhook support for building your own integrations.",
  },
  {
    question: "Can I use BrandRocket for multiple brands?",
    answer:
      "Yes. Each plan includes brand profiles — 1 for Starter, 5 for Pro, and unlimited for Enterprise. Each brand profile stores its own tone of voice, style guidelines, target audience, and content history so the AI generates perfectly on-brand content every time.",
  },
  {
    question: "What happens if I exceed my plan limits?",
    answer:
      "On the Starter plan, you'll be notified when you're approaching your monthly credit limit and can upgrade seamlessly. Pro and Enterprise plans include unlimited AI credits, so there's nothing to worry about. We never throttle your usage or add surprise charges.",
  },
];

export function FAQ() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24 lg:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
        className="mx-auto max-w-2xl text-center"
      >
        <p className="text-sm font-medium text-brand">FAQ</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Frequently asked questions
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          Can&apos;t find what you&apos;re looking for? Reach out to our support
          team and we&apos;ll get back to you within an hour.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.4, 0.25, 1] }}
        className="mx-auto mt-14 max-w-2xl"
      >
        <Accordion>
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`faq-${index}`}>
              <AccordionTrigger className="text-left text-sm font-medium text-foreground">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {faq.answer}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </section>
  );
}
