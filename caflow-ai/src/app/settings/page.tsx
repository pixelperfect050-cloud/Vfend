"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Bell, Shield, Palette, Save, DollarSign } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { RazorpayButton } from "@/components/payment/RazorpayButton";

export default function SettingsPage() {
  const { user } = useAuth();
  const { addToast } = useToast();

  const handleSave = () => {
    addToast({
      title: "Settings Saved",
      message: "Your preferences have been updated successfully.",
      type: "success"
    });
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <Header 
        title="Settings" 
        description="Manage your account preferences and security"
      />
      
      <main className="flex-1 overflow-y-auto p-4 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sidebar Navigation */}
            <aside className="md:col-span-1 space-y-1">
              {[
                { icon: User, label: "Profile" },
                { icon: Bell, label: "Notifications" },
                { icon: Shield, label: "Security" },
                { icon: Palette, label: "Appearance" },
                { icon: DollarSign, label: "Billing" },
              ].map((item) => (
                <button
                  key={item.label}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-slate-200 text-slate-600"
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </aside>

            {/* Content Area */}
            <div className="md:col-span-3 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Full Name</label>
                      <Input defaultValue={user?.name} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email Address</label>
                      <Input defaultValue={user?.email} disabled />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Phone Number</label>
                      <Input defaultValue={user?.phone} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Role</label>
                      <Input defaultValue={user?.role} disabled />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: "Email Notifications", desc: "Receive document updates via email" },
                    { label: "WhatsApp Alerts", desc: "Get real-time alerts on WhatsApp" },
                    { label: "Desktop Notifications", desc: "Browser push notifications" },
                  ].map((notif) => (
                    <div key={notif.label} className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-sm font-medium">{notif.label}</p>
                        <p className="text-xs text-zinc-500">{notif.desc}</p>
                      </div>
                      <div className="w-10 h-6 bg-amber-600 rounded-full relative p-1 cursor-pointer shadow-sm">
                        <div className="w-4 h-4 bg-white rounded-full ml-auto" />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Billing & Subscription</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm font-medium text-amber-900">Current Plan: Free Trial</p>
                        <p className="text-xs text-amber-700">Your trial expires in 12 days</p>
                      </div>
                      <div className="px-3 py-1 bg-amber-600 text-white text-xs font-bold rounded-full">
                        ACTIVE
                      </div>
                    </div>
                    <div className="w-full bg-amber-200 rounded-full h-1.5">
                      <div className="bg-amber-600 h-1.5 rounded-full w-1/4" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border border-slate-200 space-y-3 hover:border-amber-500 transition-colors">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-slate-900">Professional</p>
                        <p className="text-sm font-bold text-amber-600">₹9,999/yr</p>
                      </div>
                      <p className="text-xs text-slate-500">Perfect for growing CA firms with up to 200 clients.</p>
                      <RazorpayButton amount={9999} planName="Professional" className="bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-600/20" />
                    </div>
                    
                    <div className="p-4 rounded-xl border border-slate-200 space-y-3 hover:border-amber-500 transition-colors">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-slate-900">Enterprise</p>
                        <p className="text-sm font-bold text-amber-600">₹14,999/yr</p>
                      </div>
                      <p className="text-xs text-slate-500">Unlimited everything for large-scale operations.</p>
                      <RazorpayButton amount={14999} planName="Enterprise" className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button onClick={handleSave} className="gap-2 bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-600/20">
                  <Save className="w-4 h-4" />
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
