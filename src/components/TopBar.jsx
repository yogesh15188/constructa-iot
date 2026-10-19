import React, { useState } from 'react';
import { 
  Undo2, 
  Redo2, 
  Moon, 
  Sun, 
  GraduationCap, 
  Save, 
  Menu, 
  Sparkles, 
  Download, 
  FolderOpen, 
  FileText, 
  CheckCircle2,
  Box
} from 'lucide-react';

export default function TopBar({
  projectName,
  onProjectNameChange,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  isDarkTheme,
  onToggleTheme,
  onOpenLearnModal,
  onOpenExportModal,
  onSaveProject,
  onOpenAiCopilot
}) {
  const [fileMenuOpen, setFileMenuOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    onSaveProject();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <header className="top-bar">
      {/* Top Bar Left: Logo & Project Title */}
      <div className="top-bar-left">
        <div className="logo-wrapper" onClick={() => window.location.reload()} title="Constructa IoT Workbench">
          <div className="logo-icon">
            <Box size={18} strokeWidth={2.5} />
          </div>
          <span className="logo-text">Constructa</span>
        </div>

        <input
          type="text"
          value={projectName}
          onChange={(e) => onProjectNameChange(e.target.value)}
          className="project-title-input"
          title="Click to rename project"
        />

        <div className="history-buttons">
          <button
            className="icon-btn"
            disabled={!canUndo}
            onClick={onUndo}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 size={15} />
          </button>
          <button
            className="icon-btn"
            disabled={!canRedo}
            onClick={onRedo}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 size={15} />
          </button>
        </div>
      </div>

      {/* Center Status Pill */}
      <div className="top-bar-center">
        <div className="center-pill">
          <button className="dash-btn" onClick={() => alert("Constructa Workspace Dashboard: Local Session Active")}>
            ← Dashboard
          </button>
          <div className="status-badge">
            <span className="status-dot" />
            <span>{saveSuccess ? 'Saved to LocalStorage!' : 'Cloud Synced'}</span>
          </div>
        </div>
      </div>

      {/* Top Bar Right: Action buttons matching Constructa */}
      <div className="top-bar-right">
        {/* AI Copilot Quick Launcher */}
        <button className="ai-pill-btn" onClick={onOpenAiCopilot} title="Open AI Copilot (Zero Token Limits)">
          <Sparkles size={14} />
          <span>AI Copilot (∞)</span>
        </button>

        {/* Theme Toggle */}
        <button className="pill-action-btn" onClick={onToggleTheme} title="Toggle Dark/Light Mode">
          {isDarkTheme ? <Sun size={14} /> : <Moon size={14} />}
          <span>{isDarkTheme ? 'Light' : 'Dark'}</span>
        </button>

        {/* Learn */}
        <button className="pill-action-btn" onClick={onOpenLearnModal} title="Learn & Cheatsheets">
          <GraduationCap size={14} />
          <span>Learn</span>
        </button>

        {/* Save */}
        <button className="pill-action-btn primary-orange" onClick={handleSave} title="Save Project (Ctrl+S)">
          <Save size={14} />
          <span>{saveSuccess ? 'Saved' : 'Save'}</span>
        </button>

        {/* File Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            className="pill-action-btn"
            onClick={() => setFileMenuOpen(!fileMenuOpen)}
            title="File Menu"
          >
            <Menu size={14} />
            <span>File</span>
          </button>

          {fileMenuOpen && (
            <div
              style={{
                position: 'absolute',
                top: '38px',
                right: 0,
                width: '180px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-light)',
                borderRadius: '8px',
                boxShadow: 'var(--shadow-lg)',
                padding: '6px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                zIndex: 100
              }}
              onMouseLeave={() => setFileMenuOpen(false)}
            >
              <button
                className="subtab-btn"
                style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px' }}
                onClick={() => {
                  setFileMenuOpen(false);
                  onOpenExportModal();
                }}
              >
                <Download size={14} /> Export Package...
              </button>
              <button
                className="subtab-btn"
                style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px' }}
                onClick={() => {
                  setFileMenuOpen(false);
                  handleSave();
                }}
              >
                <Save size={14} /> Save JSON
              </button>
              <button
                className="subtab-btn"
                style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px' }}
                onClick={() => {
                  setFileMenuOpen(false);
                  if (confirm("Reset workspace to empty scene?")) {
                    window.location.reload();
                  }
                }}
              >
                <FolderOpen size={14} /> New Project
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
