"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Mail, Phone, Building2, Briefcase, MapPin, Plus } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { useToast } from "@/components/ui/toast";

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddClientModal({ isOpen, onClose }: AddClientModalProps) {
  const { addClient } = useData();
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    businessType: "proprietorship",
    gstNumber: "",
    panNumber: "",
    address: "",
    city: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    addClient(formData);
    addToast({
      title: "Client Added",
      message: `${formData.name} has been added successfully.`,
      type: "success"
    });
    onClose();
    setFormData({
      name: "",
      email: "",
      phone: "",
      businessType: "proprietorship",
      gstNumber: "",
      panNumber: "",
      address: "",
      city: "",
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                  <Plus className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Add New Entity</h2>
                  <p className="text-xs text-slate-500">Register a new client or business unit</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-xl transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4 col-span-2">
                  <label className="block">
                    <span className="text-sm font-bold text-slate-700 ml-1">Entity Name *</span>
                    <div className="mt-1 relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        required
                        type="text"
                        placeholder="e.g. Acme Corporation"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-amber-500 outline-none transition-all"
                      />
                    </div>
                  </label>
                </div>

                <div className="space-y-4">
                  <label className="block">
                    <span className="text-sm font-bold text-slate-700 ml-1">Email Address</span>
                    <div className="mt-1 relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="email"
                        placeholder="client@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-amber-500 outline-none transition-all"
                      />
                    </div>
                  </label>
                </div>

                <div className="space-y-4">
                  <label className="block">
                    <span className="text-sm font-bold text-slate-700 ml-1">Phone Number</span>
                    <div className="mt-1 relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="tel"
                        placeholder="+91 00000 00000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-amber-500 outline-none transition-all"
                      />
                    </div>
                  </label>
                </div>

                <div className="space-y-4">
                  <label className="block">
                    <span className="text-sm font-bold text-slate-700 ml-1">Business Type</span>
                    <div className="mt-1 relative">
                      <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <select
                        value={formData.businessType}
                        onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-amber-500 outline-none transition-all appearance-none"
                      >
                        <option value="proprietorship">Proprietorship</option>
                        <option value="partnership">Partnership</option>
                        <option value="llp">LLP</option>
                        <option value="private_ltd">Private Ltd</option>
                        <option value="public_ltd">Public Ltd</option>
                      </select>
                    </div>
                  </label>
                </div>

                <div className="space-y-4">
                  <label className="block">
                    <span className="text-sm font-bold text-slate-700 ml-1">GSTIN (Optional)</span>
                    <div className="mt-1 relative">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="27AAACH..."
                        value={formData.gstNumber}
                        onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-amber-500 outline-none transition-all"
                      />
                    </div>
                  </label>
                </div>

                <div className="space-y-4 col-span-2">
                  <label className="block">
                    <span className="text-sm font-bold text-slate-700 ml-1">Full Address</span>
                    <div className="mt-1 relative">
                      <MapPin className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                      <textarea
                        rows={2}
                        placeholder="Office address..."
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-amber-500 outline-none transition-all resize-none"
                      />
                    </div>
                  </label>
                </div>
              </div>

              <div className="mt-10 flex gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-4 rounded-2xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-4 rounded-2xl bg-amber-600 text-white font-bold hover:bg-amber-700 shadow-lg shadow-amber-600/20 transition-all"
                >
                  Add Client
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
