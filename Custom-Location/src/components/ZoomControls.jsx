export default function ZoomControls({ onZoomIn, onZoomOut }) {
  return (
    <div className="zoom-controls">
      <button className="zoom-btn" onClick={onZoomIn}>+</button>
      <button className="zoom-btn" onClick={onZoomOut}>−</button>
    </div>
  );
}