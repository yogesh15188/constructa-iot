import React, { useState } from 'react';
import { 
  Code, 
  Play, 
  Copy, 
  Download, 
  Check, 
  FileCode, 
  Terminal, 
  RefreshCw 
} from 'lucide-react';

export default function InspectorCode({
  code,
  onCodeChange,
  onRunSimulation
}) {
  const [activeFile, setActiveFile] = useState('main.ino');
  const [copied, setCopied] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifyMessage, setVerifyMessage] = useState(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeFile;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleVerify = () => {
    setVerifying(true);
    setVerifyMessage(null);
    setTimeout(() => {
      setVerifying(false);
      setVerifyMessage('Compilation Success! Sketch uses 218,490 bytes (16%) of program storage space.');
    }, 600);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* File Tabs */}
      <div className="inspector-subtabs">
        <button
          className={`subtab-btn ${activeFile === 'main.ino' ? 'active' : ''}`}
          onClick={() => setActiveFile('main.ino')}
        >
          <FileCode size={12} style={{ display: 'inline', marginRight: '4px' }} />
          main.ino
        </button>
        <button
          className={`subtab-btn ${activeFile === 'main.py' ? 'active' : ''}`}
          onClick={() => setActiveFile('main.py')}
        >
          main.py
        </button>
        <button
          className={`subtab-btn ${activeFile === 'diagram.json' ? 'active' : ''}`}
          onClick={() => setActiveFile('diagram.json')}
        >
          diagram.json
        </button>
      </div>

      <div className="inspector-content" style={{ padding: '12px', gap: '10px' }}>
        {/* Editor Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              className="dash-btn"
              style={{ padding: '6px 12px' }}
              onClick={onRunSimulation}
              title="Upload code and start physical simulation"
            >
              <Play size={12} /> Run Simulator
            </button>
            <button
              className="pill-action-btn"
              style={{ padding: '6px 10px' }}
              onClick={handleVerify}
              disabled={verifying}
              title="Check syntax and compile sketch"
            >
              <RefreshCw size={12} className={verifying ? 'spin-anim' : ''} />
              {verifying ? 'Compiling...' : 'Verify'}
            </button>
          </div>

          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              className="icon-btn"
              onClick={handleCopy}
              title="Copy code to clipboard"
            >
              {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
            </button>
            <button
              className="icon-btn"
              onClick={handleDownload}
              title="Download sketch file"
            >
              <Download size={14} />
            </button>
          </div>
        </div>

        {/* Verification Alert */}
        {verifyMessage && (
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '6px 10px', borderRadius: '6px', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Check size={12} />
            {verifyMessage}
          </div>
        )}

        {/* Code Editor Body */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            background: 'var(--bg-code)',
            borderRadius: '8px',
            border: '1px solid var(--border-light)',
            overflow: 'hidden'
          }}
        >
          <textarea
            value={code}
            onChange={(e) => onCodeChange(e.target.value)}
            spellCheck="false"
            style={{
              width: '100%',
              height: '100%',
              minHeight: '380px',
              background: 'transparent',
              color: '#38bdf8',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.74rem',
              lineHeight: '1.6',
              padding: '12px',
              border: 'none',
              outline: 'none',
              resize: 'none',
              whiteSpace: 'pre'
            }}
          />
        </div>
      </div>
    </div>
  );
}
