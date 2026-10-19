import React from 'react';
import { X, Download, FileCode, CheckCircle2 } from 'lucide-react';

export default function ExportModal({
  isOpen,
  onClose,
  projectName,
  components,
  wires,
  code
}) {
  if (!isOpen) return null;

  const downloadFile = (filename, content, type = 'text/plain') => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportIno = () => {
    downloadFile(`${projectName.toLowerCase().replace(/\s+/g, '_')}.ino`, code);
  };

  const handleExportNetlist = () => {
    let csv = 'FromComponent,FromPin,ToComponent,ToPin,WireColor\n';
    wires.forEach((w) => {
      csv += `${w.from},${w.fromPin},${w.to},${w.toPin},${w.color}\n`;
    });
    downloadFile(`${projectName.toLowerCase().replace(/\s+/g, '_')}_netlist.csv`, csv, 'text/csv');
  };

  const handleExportProjectJson = () => {
    const project = {
      name: projectName,
      timestamp: new Date().toISOString(),
      components,
      wires,
      code
    };
    downloadFile(`${projectName.toLowerCase().replace(/\s+/g, '_')}_project.json`, JSON.stringify(project, null, 2), 'application/json');
  };

  const handleExportWokwi = () => {
    const wokwi = {
      version: 1,
      author: 'Constructa IoT Studio',
      editor: 'wokwi',
      parts: components.map((c) => ({
        type: `board-${c.id}`,
        id: c.id,
        top: c.pos[2] * 4,
        left: c.pos[0] * 4,
        attrs: {}
      })),
      connections: wires.map((w) => [
        `${w.from}:${w.fromPin}`,
        `${w.to}:${w.toPin}`,
        w.color,
        ['v0']
      ])
    };
    downloadFile('diagram.json', JSON.stringify(wokwi, null, 2), 'application/json');
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Download size={20} color="var(--brand-orange)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Export Project Files</h3>
          </div>
          <button className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            className="subtab-btn"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', border: '1px solid var(--border-light)', background: 'var(--bg-hover)' }}
            onClick={handleExportIno}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileCode size={18} color="var(--brand-orange)" />
              <div style={{ textAlign: 'left' }}>
                <span style={{ fontWeight: 700, display: 'block', fontSize: '0.8rem' }}>Arduino C++ Sketch (.ino)</span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Compilable Arduino IDE & PlatformIO source</span>
              </div>
            </div>
            <Download size={14} />
          </button>

          <button
            className="subtab-btn"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', border: '1px solid var(--border-light)', background: 'var(--bg-hover)' }}
            onClick={handleExportNetlist}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileCode size={18} color="#06b6d4" />
              <div style={{ textAlign: 'left' }}>
                <span style={{ fontWeight: 700, display: 'block', fontSize: '0.8rem' }}>Circuit Netlist & Pin Table (.csv)</span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Component-to-pin wiring map for manual breadboarding</span>
              </div>
            </div>
            <Download size={14} />
          </button>

          <button
            className="subtab-btn"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', border: '1px solid var(--border-light)', background: 'var(--bg-hover)' }}
            onClick={handleExportWokwi}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileCode size={18} color="#10b981" />
              <div style={{ textAlign: 'left' }}>
                <span style={{ fontWeight: 700, display: 'block', fontSize: '0.8rem' }}>Wokwi Schematic (diagram.json)</span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Compatible with online Wokwi electronics simulator</span>
              </div>
            </div>
            <Download size={14} />
          </button>

          <button
            className="subtab-btn"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', border: '1px solid var(--border-light)', background: 'var(--bg-hover)' }}
            onClick={handleExportProjectJson}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileCode size={18} color="#8b5cf6" />
              <div style={{ textAlign: 'left' }}>
                <span style={{ fontWeight: 700, display: 'block', fontSize: '0.8rem' }}>Constructa Project Backup (.json)</span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Includes 3D scene solids, electronics netlist, & code</span>
              </div>
            </div>
            <Download size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
