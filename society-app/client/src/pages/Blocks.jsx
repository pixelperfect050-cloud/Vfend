import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import api from '../utils/api';

const Blocks = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', totalFloors: 5, flatsPerFloor: 4, description: '' });
  const [saving, setSaving] = useState(false);
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchBlocks();
  }, []);

  const fetchBlocks = async () => {
    try {
      const sid = user?.societyId?._id || user?.societyId;
      if (!sid) return;
      const data = await api.get(`/api/blocks/society/${sid}`);
      setBlocks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const sid = user?.societyId?._id || user?.societyId;
      await api.post('/api/blocks', { ...formData, societyId: sid });
      setShowModal(false);
      setFormData({ name: '', totalFloors: 5, flatsPerFloor: 4, description: '' });
      fetchBlocks();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="page-loader"><div className="spinner"></div></div>;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Blocks & Flats</h1>
          <p className="page-subtitle">Select a block to view flats</p>
        </div>
        {isAdmin && (
          <button className="btn btn--primary" onClick={() => setShowModal(true)} id="add-block-btn">
            + Add Block
          </button>
        )}
      </div>

      {blocks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🏗️</div>
          <h2>No blocks yet</h2>
          <p>Add your first block to get started</p>
          {isAdmin && <button className="btn btn--primary" onClick={() => setShowModal(true)}>+ Add Block</button>}
        </div>
      ) : (
        <div className="blocks-grid">
          {blocks.map(block => {
            const stats = block.flatStats || { total: 0, paid: 0, pending: 0, partial: 0 };
            const paidPercent = stats.total ? Math.round((stats.paid / stats.total) * 100) : 0;

            return (
              <div key={block._id} className="block-card" onClick={() => navigate(`/blocks/${block._id}/flats`)}
                id={`block-${block.name}`}>
                <div className="block-card__header">
                  <div className="block-card__name">Block {block.name}</div>
                  <div className="block-card__icon">🏢</div>
                </div>
                <div className="block-card__info">
                  <span>{block.totalFloors} Floors</span>
                  <span>•</span>
                  <span>{stats.total} Flats</span>
                </div>

                {/* Mini progress ring */}
                <div className="block-card__progress">
                  <svg className="progress-ring" viewBox="0 0 80 80">
                    <circle className="progress-ring__bg" cx="40" cy="40" r="32" />
                    <circle className="progress-ring__fill" cx="40" cy="40" r="32"
                      strokeDasharray={`${paidPercent * 2.01} ${201 - paidPercent * 2.01}`}
                      strokeDashoffset="50" />
                  </svg>
                  <span className="progress-ring__text">{paidPercent}%</span>
                </div>

                <div className="block-card__stats">
                  <span className="status-dot status-dot--paid">{stats.paid} Paid</span>
                  <span className="status-dot status-dot--pending">{stats.pending} Due</span>
                  <span className="status-dot status-dot--partial">{stats.partial} Partial</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Block Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Block">
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="block-name">Block Name</label>
            <input type="text" id="block-name" value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., A, B, C" required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="block-floors">Total Floors</label>
              <input type="number" id="block-floors" min="1" value={formData.totalFloors}
                onChange={e => setFormData({ ...formData, totalFloors: parseInt(e.target.value) })} required />
            </div>
            <div className="form-group">
              <label htmlFor="block-flats">Flats/Floor</label>
              <input type="number" id="block-flats" min="1" value={formData.flatsPerFloor}
                onChange={e => setFormData({ ...formData, flatsPerFloor: parseInt(e.target.value) })} required />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="block-desc">Description (Optional)</label>
            <input type="text" id="block-desc" value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g., East Wing" />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn--ghost" onClick={() => setShowModal(false)}>Cancel</button>
            <button type="submit" className="btn btn--primary" disabled={saving} id="save-block-btn">
              {saving ? <span className="btn-spinner"></span> : 'Create Block'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Blocks;
