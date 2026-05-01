import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PenTool, ArrowRight, Send, Loader2, CheckCircle2, Upload, ArrowLeft, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const serviceOptions = [
  'Vector Tracing',
  'Embroidery Digitizing',
  'Logo Design',
  'Format Conversion',
  'Virtual Sample / Proof',
  'Catalog & Flyer Design',
  'Branding Package',
  'Custom / Other',
];

export default function RequestQuote() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', company: '',
    service: '', description: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.service || !form.description) {
      return toast.error('Please fill all required fields');
    }
    setLoading(true);
    try {
      await axios.post('/api/quotes/submit', form);
      setSubmitted(true);
      toast.success('Quote request submitted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 text-sm outline-none transition-all duration-200 focus:border-[#ff7a18] focus:ring-2 focus:ring-orange-500/15";

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-[72px]">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#ff7a18] flex items-center justify-center shadow-md shadow-orange-200">
              <PenTool className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-lg font-display font-bold text-[#0B1220]">ArtFlow Studio</span>
          </Link>
          <Link to="/" className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#0B1220] transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20">
              <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-3xl font-display font-bold text-[#0B1220] mb-3">Quote Request Submitted!</h2>
              <p className="text-gray-500 max-w-md mx-auto mb-8">
                Thank you for reaching out. Our team will review your request and get back to you within 2-4 hours with a detailed quote.
              </p>
              <div className="flex justify-center gap-4">
                <Link to="/" className="btn-pill btn-pill-outline !py-3 !px-6 text-sm">
                  <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>
                <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', company: '', service: '', description: '' }); }}
                  className="btn-pill btn-pill-primary !py-3 !px-6 text-sm">
                  Submit Another <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              {/* Header */}
              <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-10 h-[2px] bg-[#ff7a18]" />
                  <span className="text-sm font-semibold uppercase tracking-widest text-[#ff7a18]">Free Quote</span>
                  <div className="w-10 h-[2px] bg-[#ff7a18]" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-display font-bold text-[#0B1220] mb-3">Request a Quote</h1>
                <p className="text-gray-500 max-w-lg mx-auto">
                  It's free, fast and with zero obligations. Fill out the form below and we'll get in touch with you as soon as possible.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-10" style={{ boxShadow: '0 4px 32px rgba(0,0,0,0.06)' }}>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Left column */}
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-semibold text-[#0B1220] mb-2">
                          <FileText className="w-3.5 h-3.5 inline mr-1.5 text-[#ff7a18]" />
                          Select Service <span className="text-red-400">*</span>
                        </label>
                        <select value={form.service} onChange={update('service')} className={inputClass} required>
                          <option value="">Please Select Service</option>
                          {serviceOptions.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#0B1220] mb-2">
                          Tell us about your project <span className="text-red-400">*</span>
                        </label>
                        <textarea value={form.description} onChange={update('description')}
                          rows={6} className={`${inputClass} resize-none`}
                          placeholder="Describe what you would like quoted — include dimensions, colors, file formats needed, quantity, etc."
                          required />
                      </div>
                    </div>

                    {/* Right column */}
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-semibold text-[#0B1220] mb-2">
                          Name <span className="text-red-400">*</span>
                        </label>
                        <input type="text" value={form.name} onChange={update('name')}
                          className={inputClass} placeholder="John Doe" required />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#0B1220] mb-2">
                          Company Name
                        </label>
                        <input type="text" value={form.company} onChange={update('company')}
                          className={inputClass} placeholder="Your company" />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#0B1220] mb-2">
                          Phone <span className="text-red-400">*</span>
                        </label>
                        <input type="tel" value={form.phone} onChange={update('phone')}
                          className={inputClass} placeholder="+91 98765 43210" />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#0B1220] mb-2">
                          Email <span className="text-red-400">*</span>
                        </label>
                        <input type="email" value={form.email} onChange={update('email')}
                          className={inputClass} placeholder="you@company.com" required />
                      </div>
                    </div>
                  </div>

                  <motion.button whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}
                    type="submit" disabled={loading}
                    className="mt-8 w-full sm:w-auto mx-auto flex items-center justify-center gap-2 px-10 py-4 bg-[#ff7a18] hover:bg-[#EA580C] text-white font-semibold rounded-full text-base transition-all shadow-lg shadow-orange-500/25 disabled:opacity-60">
                    {loading ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</>
                    ) : (
                      <><Send className="w-5 h-5" /> Submit Request</>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
