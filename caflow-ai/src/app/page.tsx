"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, ArrowRight, Zap, MessageCircle, Users, FileCheck,
  Brain, Clock, Shield, BarChart3, CheckCircle2, Star,
  Mic, Bell, Workflow, Target, Rocket, Globe, FileText,
  DollarSign, Send, Upload, Plus, Phone, Calendar, Menu, X
} from "lucide-react";
import { Footer } from "@/components/layout/Footer";

const features = [
  { 
    icon: Brain, 
    title: "AI Office Assistant", 
    desc: "Intelligent automation that learns your workflow and handles repetitive tasks",
    color: "from-amber-500 to-amber-600"
  },
  { 
    icon: MessageCircle, 
    title: "WhatsApp-First Communication", 
    desc: "Send reminders, collect documents, and follow up — all from WhatsApp",
    color: "from-green-500 to-emerald-500"
  },
  { 
    icon: FileCheck, 
    title: "Smart Document Tracking", 
    desc: "Auto-detect missing documents and get AI-powered alerts before deadlines",
    color: "from-amber-400 to-amber-500"
  },
  { 
    icon: Clock, 
    title: "Automated Follow-ups", 
    desc: "Never miss a deadline. AI sends personalized reminders in Hindi + English",
    color: "from-orange-500 to-amber-500"
  },
  { 
    icon: Workflow, 
    title: "Workflow Command Center", 
    desc: "One-tap actions for everything — file returns, send reminders, create tasks",
    color: "from-amber-600 to-orange-600"
  },
  { 
    icon: Shield, 
    title: "Enterprise-Grade Security", 
    desc: "Bank-level encryption. Your client data is always protected",
    color: "from-slate-700 to-slate-900"
  },
];

const stats = [
  { value: "500+", label: "CA Firms Trust Us" },
  { value: "₹50Cr+", label: "Payments Tracked" },
  { value: "10L+", label: "Documents Processed" },
  { value: "80%", label: "Less Follow-up Time" },
];

const testimonials = [
  { name: "CA Ramesh S.", role: "Mumbai, 20 yrs exp", content: "It feels like having an AI assistant that never sleeps. 80% less manual work.", avatar: "RS" },
  { name: "Priya M.", role: "Delhi, Tax Consultant", content: "Clients upload documents themselves. I'm free for actual CA work.", avatar: "PM" },
  { name: "Vikram P.", role: "Ahmedabad, Firm Owner", content: "The WhatsApp integration is magical. 90% of clients respond instantly.", avatar: "VP" },
];

const pricingPlans = [
  { 
    name: "Starter", 
    price: "₹4,999", 
    period: "/year",
    desc: "Perfect for small practice",
    features: ["Up to 50 Clients", "10 GB Cloud Storage", "GST/ITR Tracking", "WhatsApp Reminders"],
    highlight: false
  },
  { 
    name: "Professional", 
    price: "₹9,999", 
    period: "/year",
    desc: "For growing CA firms",
    features: ["Up to 200 Clients", "50 GB Cloud Storage", "AI Suggestions", "Voice Tasks", "WhatsApp Support"],
    highlight: true
  },
  { 
    name: "Enterprise", 
    price: "₹14,999", 
    period: "/year",
    desc: "For large firms",
    features: ["Unlimited Clients", "Unlimited Storage", "Dedicated Manager", "API Access", "Custom Reports"],
    highlight: false
  },
];

const comparisonData = [
  { name: "CAFlow AI", storage: "10GB - Unlimited", pricing: "₹4,999/yr", setup: "Free", ai: "Native AI", whatsapp: "AI-Powered", mobile: "Android & iOS", portal: "Full Access", highlighted: true },
  { name: "Finexo", storage: "5GB (Limited)", pricing: "₹5,999/yr", setup: "Free", ai: "No AI", whatsapp: "Basic Plugin", mobile: "Android Only", portal: "Basic", highlighted: false },
  { name: "Jamku", storage: "External Drive", pricing: "₹6,500/yr", setup: "Paid", ai: "Basic", whatsapp: "Manual/Api", mobile: "Limited App", portal: "Add-on", highlighted: false },
  { name: "Papilio", storage: "1GB/User", pricing: "₹1,800/usr", setup: "Free", ai: "None", whatsapp: "Basic", mobile: "Web-only", portal: "Limited", highlighted: false },
  { name: "CAOA", storage: "5GB", pricing: "₹2,388/usr", setup: "₹3,999", ai: "None", whatsapp: "Paid API", mobile: "Basic", portal: "Professional", highlighted: false },
];

const workflowSteps = [
  { num: "01", title: "Connect", desc: "Add your clients in seconds" },
  { num: "02", title: "Automate", desc: "AI handles follow-ups" },
  { num: "03", title: "Execute", desc: "Complete tasks faster" },
  { num: "04", title: "Scale", desc: "Grow without overhead" },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.05),transparent)]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-glow">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">CAFlow AI</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-slate-400 hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm text-slate-400 hover:text-white transition-colors">How it Works</a>
              <a href="#pricing" className="text-sm text-slate-400 hover:text-white transition-colors">Pricing</a>
              <a href="#testimonials" className="text-sm text-slate-400 hover:text-white transition-colors">Reviews</a>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/login" className="hidden sm:block text-sm text-slate-400 hover:text-white font-medium transition-colors">
                Log In
              </Link>
              <Link href="/login" className="hidden sm:block px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:shadow-glow text-white text-sm font-semibold transition-all hover:scale-105">
                Start Free
              </Link>
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden glass border-t border-white/5 overflow-hidden"
            >
              <div className="px-4 py-6 space-y-4">
                <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block text-base text-slate-400 hover:text-white transition-colors">Features</a>
                <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="block text-base text-slate-400 hover:text-white transition-colors">How it Works</a>
                <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="block text-base text-slate-400 hover:text-white transition-colors">Pricing</a>
                <a href="#testimonials" onClick={() => setMobileMenuOpen(false)} className="block text-base text-slate-400 hover:text-white transition-colors">Reviews</a>
                <div className="pt-4 flex flex-col gap-3">
                  <Link href="/login" className="w-full py-3 rounded-xl border border-white/10 text-center text-sm font-medium">
                    Log In
                  </Link>
                  <Link href="/login" className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-center text-sm font-bold shadow-glow">
                    Start Free Trial
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-amber-500/30 mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm text-slate-600">AI-Powered Workflow for CA Firms</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6">
              Modern Workflow for <br />
              <span className="text-amber-600">Smart Accountants</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Automate GST follow-ups, manage client tasks with AI, and scale your practice 10x faster with India's first AI-native PMS.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link 
                href="/signup" 
                className="group flex items-center gap-2 px-8 py-4 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-semibold transition-all hover:scale-105"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="flex items-center gap-2 px-8 py-4 rounded-2xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-all">
                <Play className="w-5 h-5" />
                See Demo
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {stats.map((stat, index) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-slate-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Not Just Software. Your AI Partner.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div 
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg shadow-amber-500/10`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-4 relative">
        <div className="absolute inset-0 gradient-cyan-glow opacity-50" />
        <div className="max-w-6xl mx-auto relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              From Chaos to <span className="text-gradient">Command Center</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Get started in minutes. Transform your entire practice workflow.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {workflowSteps.map((step, index) => (
              <motion.div 
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                <div className="glass-card rounded-2xl p-6 border border-white/5 text-center">
                  <div className="text-4xl font-bold text-gradient mb-2">{step.num}</div>
                  <h3 className="text-lg font-semibold mb-1">{step.title}</h3>
                  <p className="text-sm text-slate-400">{step.desc}</p>
                </div>
                {index < workflowSteps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-slate-600" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Loved by <span className="text-gradient">500+ CA Firms</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <p className="text-slate-700 mb-6 leading-relaxed italic">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-semibold text-sm">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">{testimonial.name}</div>
                    <div className="text-sm text-slate-500">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Comparison Section */}
      <section className="py-24 px-4 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why CAFlow AI <span className="text-gradient-gold">Beats the Rest</span>
            </h2>
            <p className="text-slate-400">A clear comparison with other Indian practice management tools.</p>
          </motion.div>
          <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="p-6 text-sm font-semibold text-slate-500">Feature</th>
                  {comparisonData.map((comp) => (
                    <th key={comp.name} className={`p-6 text-sm font-bold ${comp.highlighted ? 'text-amber-600' : 'text-slate-900'}`}>
                      {comp.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "Starting Storage", key: "storage" },
                  { label: "Starting Price", key: "pricing" },
                  { label: "Setup Cost", key: "setup" },
                  { label: "AI Integration", key: "ai" },
                  { label: "WhatsApp Bot", key: "whatsapp" },
                  { label: "Mobile App", key: "mobile" },
                  { label: "Client Portal", key: "portal" },
                ].map((row, idx) => (
                  <tr key={row.key} className={`border-b border-slate-100 ${idx % 2 === 0 ? 'bg-slate-50/30' : ''}`}>
                    <td className="p-6 text-sm font-medium text-slate-700">{row.label}</td>
                    {comparisonData.map((comp) => (
                      <td key={comp.name} className={`p-6 text-sm ${comp.highlighted ? 'text-amber-600 font-bold bg-amber-50/5' : 'text-slate-500'}`}>
                        {comp[row.key as keyof typeof comp]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-8 text-center text-sm text-slate-500 italic">
            * Data based on public pricing as of May 2024. All trade names are properties of their respective owners.
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4 relative">
        <div className="absolute inset-0 gradient-glow opacity-30" />
        <div className="max-w-5xl mx-auto relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple, Transparent <span className="text-gradient-gold">Pricing</span>
            </h2>
            <p className="text-slate-400">No hidden charges. Cancel anytime.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {pricingPlans.map((plan, index) => (
              <motion.div 
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-2xl p-6 border ${plan.highlight ? 'border-amber-500 shadow-xl scale-105' : 'border-slate-200'} relative`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-amber-500 text-white text-xs font-bold rounded-full">
                    Most Popular
                  </div>
                )}
                <h3 className="text-lg font-bold text-slate-900 mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-3xl font-bold text-slate-900">{plan.price}</span>
                  <span className="text-sm text-slate-500">{plan.period}</span>
                </div>
                <p className="text-xs text-slate-500 mb-5">{plan.desc}</p>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className={`w-full block py-3 rounded-xl font-semibold text-center transition-all ${
                  plan.highlight 
                    ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-lg hover:shadow-amber-500/20' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}>
                  Start 14-Day Free Trial
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl p-10 border border-indigo-500/30"
          >
            <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto mb-6">
              <Rocket className="w-8 h-8 text-amber-600" />
            </div>
            <h2 className="text-3xl font-bold mb-4">
              Ready to Transform Your Practice?
            </h2>
            <p className="text-slate-400 mb-8 max-w-lg mx-auto">
              Join 500+ CA firms who reduced follow-up time by 80% with CAFlow AI.
            </p>
            <Link 
              href="/signup" 
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-semibold transition-all hover:scale-105 shadow-xl shadow-amber-600/20"
            >
              Start Your Free Trial
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

function Play(props: React.ComponentProps<typeof ArrowRight>) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      {...props}
    >
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}