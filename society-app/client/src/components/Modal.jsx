const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
      <div className="modal animate-up" onClick={e => e.stopPropagation()}>
        <div className="modal-header border-b border-slate-50 pb-4 mb-2">
          <h3 className="modal-title text-slate-900 font-black tracking-tight">{title}</h3>
          <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-slate-900 transition-colors" onClick={onClose} id="modal-close">✕</button>
        </div>
        <div className="modal-body no-scrollbar" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
