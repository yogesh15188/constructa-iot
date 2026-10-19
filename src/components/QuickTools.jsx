import React, { useState } from 'react';
import { 
  Move, 
  RotateCw, 
  Maximize2, 
  Layers, 
  ChevronsUp, 
  Scissors, 
  Magnet, 
  Grid, 
  Compass, 
  Eye, 
  Minus, 
  Maximize,
  RotateCcw
} from 'lucide-react';

export default function QuickTools({
  activeTool,
  setActiveTool,
  showGrid,
  setShowGrid,
  showAxes,
  setShowAxes,
  snapEnabled,
  setSnapEnabled,
  rotSnapEnabled,
  setRotSnapEnabled
}) {
  const [minimized, setMinimized] = useState(false);

  const tools = [
    { id: 'move', label: 'Move', key: 'W', icon: Move },
    { id: 'rotate', label: 'Rotate', key: 'E', icon: RotateCw },
    { id: 'scale', label: 'Scale', key: 'R', icon: Maximize2 },
    { id: 'surface', label: 'Surface', key: '', icon: Layers },
    { id: 'extrude', label: 'Extrude', key: '', icon: ChevronsUp },
    { id: 'slice', label: 'Slice', key: '', icon: Scissors },
    { 
      id: 'snap', 
      label: 'Snap', 
      key: '', 
      icon: Magnet, 
      active: snapEnabled, 
      onClick: () => setSnapEnabled(!snapEnabled) 
    },
    { 
      id: 'rotsnap', 
      label: 'Rot snap', 
      key: '', 
      icon: RotateCcw, 
      active: rotSnapEnabled, 
      onClick: () => setRotSnapEnabled(!rotSnapEnabled) 
    },
    { 
      id: 'grid', 
      label: 'Grid', 
      key: 'G', 
      icon: Grid, 
      active: showGrid, 
      onClick: () => setShowGrid(!showGrid) 
    },
    { 
      id: 'axes', 
      label: 'Axes', 
      key: 'A', 
      icon: Compass, 
      active: showAxes, 
      onClick: () => setShowAxes(!showAxes) 
    }
  ];

  return (
    <div className="quick-tools-floating">
      <div className="quick-tools-header">
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Layers size={13} /> Quick Tools
        </span>
        <button 
          className="icon-btn" 
          style={{ width: '18px', height: '18px' }} 
          onClick={() => setMinimized(!minimized)}
          title={minimized ? "Expand" : "Collapse"}
        >
          {minimized ? <Maximize size={10} /> : <Minus size={10} />}
        </button>
      </div>

      {!minimized && (
        <div className="quick-tools-grid">
          {tools.map((t) => {
            const Icon = t.icon;
            const isSelected = t.onClick ? t.active : activeTool === t.id;
            return (
              <button
                key={t.id}
                className={`tool-tile ${isSelected ? 'active' : ''}`}
                onClick={t.onClick ? t.onClick : () => setActiveTool(t.id)}
                title={`${t.label} ${t.key ? `(${t.key})` : ''}`}
              >
                <Icon size={16} />
                <span>{t.label}</span>
                {t.key && <span className="shortcut-badge">{t.key}</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
