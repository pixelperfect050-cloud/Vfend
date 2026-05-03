import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

const FlatGrid = () => {
  const { blockId } = useParams();
  const navigate = useNavigate();
  const [flats, setFlats] = useState([]);
  const [block, setBlock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchData();
  }, [blockId]);

  const fetchData = async () => {
    try {
      const [flatsData, blockData] = await Promise.all([
        api.get(`/api/flats/block/${blockId}`),
        api.get(`/api/blocks/${blockId}`)
      ]);
      setFlats(flatsData);
      setBlock(blockData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredFlats = flats.filter(f => filter === 'all' || f.currentMonthStatus === filter);

  // Group flats by floor
  const floors = {};
  filteredFlats.forEach(flat => {
    if (!floors[flat.floor]) floors[flat.floor] = [];
    floors[flat.floor].push(flat);
  });

  const statusCounts = {
    all: flats.length,
    paid: flats.filter(f => f.currentMonthStatus === 'paid').length,
    pending: flats.filter(f => f.currentMonthStatus === 'pending').length,
    partial: flats.filter(f => f.currentMonthStatus === 'partial').length
  };

  if (loading) return <div className="page-loader"><div className="spinner"></div></div>;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="breadcrumb">
            <Link to="/blocks" className="breadcrumb-link">Blocks</Link>
            <span className="breadcrumb-sep">›</span>
            <span>Block {block?.name}</span>
          </div>
          <h1 className="page-title">Block {block?.name} - Flats</h1>
          <p className="page-subtitle">{block?.totalFloors} Floors • {flats.length} Flats</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        {[
          { key: 'all', label: 'All', icon: '📋' },
          { key: 'paid', label: 'Paid', icon: '✅' },
          { key: 'pending', label: 'Pending', icon: '⏳' },
          { key: 'partial', label: 'Partial', icon: '🔶' }
        ].map(tab => (
          <button key={tab.key}
            className={`filter-tab ${filter === tab.key ? 'active' : ''} filter-tab--${tab.key}`}
            onClick={() => setFilter(tab.key)} id={`filter-${tab.key}`}>
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
            <span className="filter-count">{statusCounts[tab.key]}</span>
          </button>
        ))}
      </div>

      {/* Flat Grid by Floor */}
      <div className="floor-grid">
        {Object.keys(floors).sort((a, b) => b - a).map(floor => (
          <div key={floor} className="floor-row">
            <div className="floor-label">Floor {floor}</div>
            <div className="flat-grid">
              {floors[floor].map(flat => (
                <div key={flat._id}
                  className={`flat-card flat-card--${flat.currentMonthStatus}`}
                  onClick={() => navigate(`/flats/${flat._id}`)}
                  id={`flat-${flat.number}`}>
                  <div className="flat-card__number">{flat.number}</div>
                  <div className="flat-card__owner">{flat.ownerName}</div>
                  <div className="flat-card__type">{flat.type}</div>
                  <div className={`flat-card__status flat-card__status--${flat.currentMonthStatus}`}>
                    {flat.currentMonthStatus === 'paid' ? '✓' : flat.currentMonthStatus === 'partial' ? '◐' : '!'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredFlats.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h2>No flats found</h2>
          <p>No flats match the selected filter</p>
        </div>
      )}
    </div>
  );
};

export default FlatGrid;
