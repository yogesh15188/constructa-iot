import React, { useState } from 'react';
import { CATALOG_ITEMS, COMPONENT_CATEGORIES } from '../data/componentsCatalog';
import { 
  Box, 
  Trash2, 
  Copy, 
  Layers, 
  Eye, 
  Combine, 
  Spline, 
  Grid 
} from 'lucide-react';

export default function InspectorCad({
  components,
  selectedComponentId,
  onSelectComponent,
  onAddComponent,
  onUpdateComponent,
  onDeleteComponent
}) {
  const [activeSubtab, setActiveSubtab] = useState('library');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const selectedComp = components.find((c) => c.id === selectedComponentId);
  const catalogMeta = selectedComp ? CATALOG_ITEMS.find((item) => item.id === selectedComp.id) : null;

  const handlePropChange = (axis, value, propType = 'pos') => {
    if (!selectedComp) return;
    const num = parseFloat(value) || 0;
    const updated = { ...selectedComp };
    if (propType === 'pos') {
      const idx = axis === 'x' ? 0 : axis === 'y' ? 1 : 2;
      const newPos = [...selectedComp.pos];
      newPos[idx] = num;
      updated.pos = newPos;
    } else if (propType === 'rot') {
      const idx = axis === 'x' ? 0 : axis === 'y' ? 1 : 2;
      const newRot = [...selectedComp.rot];
      newRot[idx] = (num * Math.PI) / 180;
      updated.rot = newRot;
    } else if (propType === 'color') {
      updated.color = value;
    }
    onUpdateComponent(updated);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Subtabs matching Constructa */}
      <div className="inspector-subtabs">
        <button
          className={`subtab-btn ${activeSubtab === 'library' ? 'active' : ''}`}
          onClick={() => setActiveSubtab('library')}
        >
          Library
        </button>
        <button
          className={`subtab-btn ${activeSubtab === 'design' ? 'active' : ''}`}
          onClick={() => setActiveSubtab('design')}
        >
          Design
        </button>
        <button
          className={`subtab-btn ${activeSubtab === 'boolean' ? 'active' : ''}`}
          onClick={() => setActiveSubtab('boolean')}
        >
          Boolean
        </button>
        <button
          className={`subtab-btn ${activeSubtab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveSubtab('overview')}
        >
          Overview ({components.length})
        </button>
      </div>

      <div className="inspector-content">
        {/* SUBTAB: LIBRARY */}
        {activeSubtab === 'library' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Category Filter */}
            <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '4px' }}>
              <button
                className={`quick-prompt-chip ${categoryFilter === 'all' ? 'active' : ''}`}
                onClick={() => setCategoryFilter('all')}
              >
                All Parts
              </button>
              <button
                className={`quick-prompt-chip ${categoryFilter === COMPONENT_CATEGORIES.CAD_SHAPES ? 'active' : ''}`}
                onClick={() => setCategoryFilter(COMPONENT_CATEGORIES.CAD_SHAPES)}
              >
                3D CAD
              </button>
              <button
                className={`quick-prompt-chip ${categoryFilter === COMPONENT_CATEGORIES.MCU ? 'active' : ''}`}
                onClick={() => setCategoryFilter(COMPONENT_CATEGORIES.MCU)}
              >
                MCUs
              </button>
              <button
                className={`quick-prompt-chip ${categoryFilter === COMPONENT_CATEGORIES.SENSOR ? 'active' : ''}`}
                onClick={() => setCategoryFilter(COMPONENT_CATEGORIES.SENSOR)}
              >
                Sensors
              </button>
              <button
                className={`quick-prompt-chip ${categoryFilter === COMPONENT_CATEGORIES.ACTUATOR ? 'active' : ''}`}
                onClick={() => setCategoryFilter(COMPONENT_CATEGORIES.ACTUATOR)}
              >
                Actuators
              </button>
            </div>

            <div className="library-grid">
              {CATALOG_ITEMS.filter((item) =>
                categoryFilter === 'all' ? true : item.category === categoryFilter
              ).map((item) => (
                <div
                  key={item.id}
                  className="library-card"
                  onClick={() => onAddComponent(item.id)}
                  title={`Click to add ${item.name} to 3D scene`}
                >
                  <div className="library-card-icon">
                    <Box size={18} />
                  </div>
                  <span className="library-card-name">{item.name}</span>
                  <span className="library-card-desc">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBTAB: DESIGN (PROPERTIES) */}
        {activeSubtab === 'design' && (
          <div>
            {!selectedComp ? (
              <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--text-muted)' }}>
                <Box size={32} style={{ margin: '0 auto 8px', opacity: 0.4 }} />
                <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)' }}>No object selected</p>
                <p style={{ fontSize: '0.72rem', marginTop: '4px' }}>
                  Click an object in the 3D scene or from Library to inspect and modify dimensions.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontSize: '0.88rem', fontWeight: 700 }}>{catalogMeta?.name || selectedComp.id}</h4>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>ID: {selectedComp.id}</span>
                  </div>
                  <button
                    className="icon-btn"
                    style={{ color: '#ef4444' }}
                    onClick={() => onDeleteComponent(selectedComp.id)}
                    title="Delete object"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Position Group */}
                <div className="property-group">
                  <span className="property-group-title">Position (mm)</span>
                  <div className="prop-input-xyz">
                    <div className="prop-num-box">
                      <span>X</span>
                      <input
                        type="number"
                        value={Math.round(selectedComp.pos[0])}
                        onChange={(e) => handlePropChange('x', e.target.value, 'pos')}
                      />
                    </div>
                    <div className="prop-num-box">
                      <span>Y</span>
                      <input
                        type="number"
                        value={Math.round(selectedComp.pos[1])}
                        onChange={(e) => handlePropChange('y', e.target.value, 'pos')}
                      />
                    </div>
                    <div className="prop-num-box">
                      <span>Z</span>
                      <input
                        type="number"
                        value={Math.round(selectedComp.pos[2])}
                        onChange={(e) => handlePropChange('z', e.target.value, 'pos')}
                      />
                    </div>
                  </div>
                </div>

                {/* Rotation Group */}
                <div className="property-group">
                  <span className="property-group-title">Rotation (deg)</span>
                  <div className="prop-input-xyz">
                    <div className="prop-num-box">
                      <span>X</span>
                      <input
                        type="number"
                        value={Math.round((selectedComp.rot[0] * 180) / Math.PI)}
                        onChange={(e) => handlePropChange('x', e.target.value, 'rot')}
                      />
                    </div>
                    <div className="prop-num-box">
                      <span>Y</span>
                      <input
                        type="number"
                        value={Math.round((selectedComp.rot[1] * 180) / Math.PI)}
                        onChange={(e) => handlePropChange('y', e.target.value, 'rot')}
                      />
                    </div>
                    <div className="prop-num-box">
                      <span>Z</span>
                      <input
                        type="number"
                        value={Math.round((selectedComp.rot[2] * 180) / Math.PI)}
                        onChange={(e) => handlePropChange('z', e.target.value, 'rot')}
                      />
                    </div>
                  </div>
                </div>

                {/* Color & Material */}
                <div className="property-group">
                  <span className="property-group-title">Appearance & Color</span>
                  <div className="property-row">
                    <span className="property-label">Hex Color</span>
                    <input
                      type="color"
                      value={selectedComp.color || '#f97316'}
                      onChange={(e) => handlePropChange(null, e.target.value, 'color')}
                      style={{ border: 'none', width: '32px', height: '24px', cursor: 'pointer', borderRadius: '4px' }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SUBTAB: BOOLEAN */}
        {activeSubtab === 'boolean' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Constructive Solid Geometry (CSG) operations for creating custom 3D enclosures and sensor brackets:
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              <button className="subtab-btn" style={{ padding: '12px 6px', border: '1px solid var(--border-light)' }}>
                <Combine size={18} style={{ margin: '0 auto 4px' }} />
                <span>Union</span>
              </button>
              <button className="subtab-btn" style={{ padding: '12px 6px', border: '1px solid var(--border-light)' }}>
                <Spline size={18} style={{ margin: '0 auto 4px' }} />
                <span>Subtract (Hole)</span>
              </button>
              <button className="subtab-btn" style={{ padding: '12px 6px', border: '1px solid var(--border-light)' }}>
                <Layers size={18} style={{ margin: '0 auto 4px' }} />
                <span>Intersect</span>
              </button>
            </div>
            <div style={{ background: 'var(--bg-hover)', padding: '10px', borderRadius: '6px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Tip: Shift+click two objects to create port cutouts for micro-USB or ultrasonic transducers.
            </div>
          </div>
        )}

        {/* SUBTAB: OVERVIEW (SCENE TREE) */}
        {activeSubtab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {components.length === 0 ? (
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>No items in scene</p>
            ) : (
              components.map((c) => {
                const meta = CATALOG_ITEMS.find((it) => it.id === c.id);
                const isSel = c.id === selectedComponentId;
                return (
                  <div
                    key={c.id}
                    onClick={() => onSelectComponent(c.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      background: isSel ? 'var(--brand-orange-subtle)' : 'var(--bg-hover)',
                      border: `1px solid ${isSel ? 'var(--brand-orange)' : 'var(--border-light)'}`,
                      cursor: 'pointer'
                    }}
                  >
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: isSel ? 'var(--brand-orange)' : 'var(--text-main)' }}>
                      {meta?.name || c.id}
                    </span>
                    <button
                      className="icon-btn"
                      style={{ width: '24px', height: '24px', color: '#ef4444' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteComponent(c.id);
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
