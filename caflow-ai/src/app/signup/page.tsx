"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Mail, Lock, Eye, EyeOff, ArrowRight, User, Building2, Phone } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // For demo, we always sign up as admin
      await signup(email, password, name, "admin");
      router.push("/dashboard?trial=true");
    } catch (err: any) {
      setError(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-white p-12 flex-col justify-between relative overflow-hidden border-r border-slate-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.05),transparent)]" />
        
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 text-slate-900">
            <div className="w-10 h-10 rounded-lg bg-amber-600 flex items-center justify-center shadow-lg shadow-amber-600/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">CAFlow</span>
          </Link>
        </div>

        <div className="relative z-10 space-y-6">
          <h1 className="text-4xl font-bold text-slate-900 leading-tight">
            Start Your <span className="text-amber-600">14-Day</span><br />
            Free Trial Today
          </h1>
          <p className="text-slate-500 max-w-md text-sm leading-relaxed">
            No credit card required. Get full access to AI document tracking, 
            WhatsApp automation, and practice management tools.
          </p>
          
          <div className="space-y-4 pt-4">
            {[
              "Automated Client Follow-ups",
              "Smart Document Vault",
              "Task Management System",
              "Performance Analytics"
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3 text-slate-600 text-sm">
                <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                </div>
                {feature}
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-slate-400 text-xs">
          Join 500+ CA Firms simplifying their practice.
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div className="lg:hidden mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-amber-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">CAFlow</span>
            </Link>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-1">Create Account</h2>
          <p className="text-slate-500 text-sm mb-8">Get started with your free trial</p>

          <form onSubmit={handleSignup} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@firm.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 00000 00000"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input type="checkbox" required className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500" />
              <p className="text-xs text-slate-500 leading-none">
                I agree to the <a href="#" className="text-amber-600">Terms of Service</a> and <a href="#" className="text-amber-600">Privacy Policy</a>
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 mt-4 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-70 shadow-lg shadow-amber-500/20"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Start 14-Day Free Trial
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-600">
            Already have an account? <Link href="/login" className="text-amber-600 font-semibold">Sign In</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
