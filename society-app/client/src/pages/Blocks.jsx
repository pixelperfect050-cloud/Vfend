import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Modal from '../components/Modal';

const Blocks = () => {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ name: '', totalFloors: '', flatsPerFloor: '', description: '' });

  useEffect(() => {
    fetchBlocks();
  }, []);

  const fetchBlocks = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/blocks`);
      setBlocks(res.data);
    } catch (err) {
      console.error('Fetch blocks error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/blocks`, formData);
      setShowModal(false);
      fetchBlocks();
      setFormData({ name: '', totalFloors: '', flatsPerFloor: '', description: '' });
    } catch (err) {
      alert('Failed to create block');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="page-loader"><div className="spinner"></div></div>;

  return (
    <div className="animate-up">
      <header className="mb-8">
        <p className="page-subtitle uppercase tracking-widest mb-1">Infrastructure</p>
        <h1 className="page-title">Society Blocks</h1>
        <p className="text-secondary font-medium">Manage wings and buildings</p>
      </header>

      <button onClick={() => setShowModal(true)} className="btn btn--primary btn--full shadow-xl mb-8">
        🏗️ Add New Block
      </button>

      <div className="grid-2">
        {blocks.map(block => (
          <Link key={block._id} to={`/blocks/${block._id}`} className="card card--interactive group">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  🏢
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Block {block.name}</h3>
                  <p className="text-[10px] font-black text-secondary uppercase tracking-widest">
                    {block.totalFloors} Floors • {block.totalFloors * block.flatsPerFloor} Units
                  </p>
                </div>
              </div>
              <div className="p-2 text-indigo-400 group-hover:translate-x-1 transition-transform">→</div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <p className="text-[9px] font-black text-secondary uppercase mb-1">Flats/Floor</p>
                <p className="font-bold text-slate-900">{block.flatsPerFloor}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <p className="text-[9px] font-black text-secondary uppercase mb-1">Total Units</p>
                <p className="font-bold text-slate-900">{block.totalFloors * block.flatsPerFloor}</p>
              </div>
            </div>

            <p className="text-xs text-secondary font-medium italic">
              {block.description || 'No description provided'}
            </p>
          </Link>
        ))}

        {blocks.length === 0 && (
          <div className="card text-center py-20 col-span-full">
            <div className="text-6xl mb-6">🏗️</div>
            <h2 className="text-xl font-black mb-2">No Blocks Setup</h2>
            <p className="text-secondary font-medium">Add your first society block to begin mapping flats.</p>
          </div>
        )}
      </div>

      {/* Modern Block Creation Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Building Block">
        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          <div className="form-group">
            <label className="form-label">Block Name / Wing</label>
            <input type="text" className="form-input" placeholder="e.g. A Wing" required
              value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Total Floors</label>
              <input type="number" className="form-input" placeholder="0" required
                value={formData.totalFloors} onChange={e => setFormData({ ...formData, totalFloors: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Flats Per Floor</label>
              <input type="number" className="form-input" placeholder="0" required
                value={formData.flatsPerFloor} onChange={e => setFormData({ ...formData, flatsPerFloor: e.target.value })} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Notes / Description</label>
            <textarea className="form-input" rows={3} placeholder="Optional details..."
              value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
          </div>

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={() => setShowModal(false)} className="btn btn--secondary flex-1">Cancel</button>
            <button type="submit" disabled={saving} className="btn btn--primary flex-1">
              {saving ? 'Creating...' : '🏗️ Create Block'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Blocks;
