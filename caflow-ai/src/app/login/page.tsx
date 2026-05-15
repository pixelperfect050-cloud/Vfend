"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Mail, Lock, Eye, EyeOff, ArrowRight, Building2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"admin" | "staff" | "client">("admin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Panel - Simple and Clean */}
      <div className="hidden lg:flex lg:w-1/2 bg-white p-12 flex-col justify-between border-r border-slate-100 relative overflow-hidden">
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
          <h1 className="text-3xl font-bold text-slate-900 leading-snug">
            Your CA Practice<br />
            <span className="text-amber-600">Simplified</span>
          </h1>
          <p className="text-slate-500 max-w-md text-sm leading-relaxed">
            Manage clients, track documents, and automate reminders. 
            Built for Indian CAs by someone who understands your daily chaos.
          </p>
          
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 shadow-sm">
              <div className="text-2xl font-bold text-amber-600">500+</div>
              <div className="text-xs text-slate-500">CA Firms Using</div>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 shadow-sm">
              <div className="text-2xl font-bold text-amber-600">10L+</div>
              <div className="text-xs text-slate-500">Docs Processed</div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-slate-400 text-xs">
          Made in India 🇮🇳 • For Indian CAs
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
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

          <h2 className="text-2xl font-bold text-slate-900 mb-1">Welcome back</h2>
          <p className="text-slate-500 text-sm mb-6">Sign in to your dashboard</p>

          {/* Role Selector - Simple tabs */}
          <div className="flex gap-1 p-1 bg-slate-100 rounded-lg mb-6 border border-slate-200">
            {[
              { value: "admin", label: "Admin" },
              { value: "staff", label: "Staff" },
              { value: "client", label: "Client" }
            ].map((r) => (
              <button
                key={r.value}
                onClick={() => setRole(r.value as "admin" | "staff" | "client")}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                  role === r.value
                    ? "bg-white text-amber-600 shadow-sm border border-slate-200"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-200 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
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

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                <span>Remember me</span>
              </label>
              <a href="#" className="text-amber-600 hover:text-amber-700">Forgot?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-medium text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-slate-100 rounded-lg border border-slate-200">
            <p className="text-xs font-medium text-slate-700 mb-2">Test Login:</p>
            <div className="text-xs text-slate-600 space-y-0.5">
              <p>Admin: admin@caflow.ai / admin123</p>
              <p>Staff: staff@caflow.ai / staff123</p>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-slate-500">
            New here? <Link href="/signup" className="text-amber-600 font-medium">Start free trial</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}