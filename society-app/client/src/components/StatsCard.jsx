const StatsCard = ({ icon, label, value, subValue, trend }) => {
  return (
    <div className="stat-card group hover:-translate-y-1 transition-all">
      <div className="stat-icon bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
        {icon || '📊'}
      </div>
      <div className="stat-info">
        <span className="stat-label uppercase tracking-widest">{label}</span>
        <span className="stat-value text-slate-900">{value}</span>
        {subValue && <span className="text-[10px] font-bold text-secondary mt-1">{subValue}</span>}
        {trend !== undefined && (
          <div className={`text-[10px] font-black mt-2 flex items-center gap-1 ${trend >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
            <span>{trend >= 0 ? '↗' : '↘'}</span>
            <span>{Math.abs(trend)}% from last month</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
