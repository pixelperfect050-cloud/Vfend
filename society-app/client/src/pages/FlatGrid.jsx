import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const FlatGrid = () => {
  const { blockId } = useParams();
  const [block, setBlock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchBlockData();
  }, [blockId]);

  const fetchBlockData = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/blocks/${blockId}`);
      setBlock(res.data);
    } catch (err) {
      console.error('Fetch block data error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="page-loader"><div className="spinner"></div></div>;
  if (!block) return <div className="p-10 text-center font-black">Block not found</div>;

  // Group flats by floor
  const floors = {};
  block.flats.forEach(flat => {
    if (!floors[flat.floor]) floors[flat.floor] = [];
    floors[flat.floor].push(flat);
  });

  const floorNumbers = Object.keys(floors).sort((a, b) => b - a);

  return (
    <div className="animate-up">
      <header className="mb-8">
        <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-widest mb-1">
          <Link to="/blocks">Blocks</Link>
          <span>/</span>
          <span>Block {block.name}</span>
        </div>
        <h1 className="page-title">Unit Management</h1>
        <p className="text-secondary font-medium">Floor-wise visualization of all flats</p>
      </header>

      {/* Filter Tabs for Payment Status */}
      <div className="card mb-8">
        <p className="text-[10px] font-black text-secondary uppercase tracking-widest mb-4">Filter by Status</p>
        <div className="filter-tabs">
          {['all', 'paid', 'pending', 'partial'].map(s => (
            <button key={s} className={`filter-tab ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>
              {s.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Visualization Grid */}
      <div className="space-y-12">
        {floorNumbers.map(floorNum => (
          <div key={floorNum} className="relative">
            {/* Floor Label */}
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-slate-900 text-white px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest shadow-lg">
                Floor {floorNum}
              </div>
              <div className="flex-1 h-px bg-slate-200"></div>
            </div>

            {/* Flat Grid for this Floor */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {floors[floorNum].map(flat => {
                const isMatch = filter === 'all' || flat.currentMonthStatus === filter;
                return (
                  <Link 
                    key={flat._id} 
                    to={`/flats/${flat._id}`}
                    className={`
                      card p-4 transition-all duration-300 group
                      ${!isMatch ? 'opacity-30 scale-95 grayscale' : 'hover:-translate-y-1 hover:shadow-xl'}
                      ${flat.currentMonthStatus === 'paid' ? 'border-l-4 border-l-emerald-500' : 
                        flat.currentMonthStatus === 'partial' ? 'border-l-4 border-l-amber-400' : 'border-l-4 border-l-rose-500'}
                    `}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {flat.number}
                      </span>
                      <div className={`w-2 h-2 rounded-full ${
                        flat.currentMonthStatus === 'paid' ? 'bg-emerald-500' : 
                        flat.currentMonthStatus === 'partial' ? 'bg-amber-400' : 'bg-rose-500'
                      }`} />
                    </div>
                    
                    <p className="text-[10px] font-bold text-secondary truncate mb-3">
                      {flat.ownerName || 'Vaccant'}
                    </p>

                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-[9px] font-black uppercase text-slate-400">{flat.type}</span>
                      <span className="text-[10px] font-bold text-indigo-500 group-hover:underline">View Details</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlatGrid;
