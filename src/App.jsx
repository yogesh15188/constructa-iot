import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Cpu, 
  Code, 
  Play, 
  Settings, 
  Sparkles, 
  Layers,
  Infinity as InfinityIcon,
  X
} from 'lucide-react';

import TopBar from './components/TopBar';
import ThreeViewport from './components/ThreeViewport';
import QuickTools from './components/QuickTools';
import InspectorCad from './components/InspectorCad';
import InspectorElec from './components/InspectorElec';
import InspectorCode from './components/InspectorCode';
import InspectorSimulate from './components/InspectorSimulate';
import InspectorAiCopilot from './components/InspectorAiCopilot';
import LearnModal from './components/LearnModal';
import ExportModal from './components/ExportModal';

import { PRESET_PROJECTS } from './engine/aiSynthesisEngine';
import { CATALOG_ITEMS } from './data/componentsCatalog';

export default function App() {
  // Theme state
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    return localStorage.getItem('constructa_theme') === 'dark';
  });

  // Project state
  const [projectName, setProjectName] = useState('Autonomous Obstacle-Avoiding Rover');
  const [components, setComponents] = useState(PRESET_PROJECTS[0].components);
  const [wires, setWires] = useState(PRESET_PROJECTS[0].wires);
  const [code, setCode] = useState(PRESET_PROJECTS[0].code);
  const [selectedComponentId, setSelectedComponentId] = useState('esp32');

  // History stack for Undo / Redo
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Inspector & Dock state
  const [activeDockTab, setActiveDockTab] = useState('CAD'); // CAD, ELEC, CODE, SIMULATE, AI, SETTINGS
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);

  // Tools state
  const [activeTool, setActiveTool] = useState('move');
  const [showGrid, setShowGrid] = useState(true);
  const [showAxes, setShowAxes] = useState(true);
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [rotSnapEnabled, setRotSnapEnabled] = useState(false);

  // Modals state
  const [isLearnModalOpen, setIsLearnModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Physical Simulation State
  const [isSimulating, setIsSimulating] = useState(false);
  const [simState, setSimState] = useState({
    distanceCm: 32,
    temperature: 24.5,
    moisture: 45,
    servoAngle: 90,
    ledActive: false,
    relayActive: false,
    pirTriggered: false,
    statusText: 'NAVIGATING'
  });
  const [serialLogs, setSerialLogs] = useState([
    '[INIT] Constructa Real-Time Hardware Simulator Ready.',
    '[SYSTEM] ESP32 Core 1 running at 240MHz. WiFi Ready.'
  ]);

  // Sync theme with body class
  useEffect(() => {
    document.body.className = isDarkTheme ? 'theme-dark' : 'theme-light';
    localStorage.setItem('constructa_theme', isDarkTheme ? 'dark' : 'light');
  }, [isDarkTheme]);

  // Record undo history
  const pushHistory = (newComps, newWires, newCode) => {
    const snapshot = {
      components: JSON.parse(JSON.stringify(newComps)),
      wires: JSON.parse(JSON.stringify(newWires)),
      code: newCode
    };
    const sliced = history.slice(0, historyIndex + 1);
    setHistory([...sliced, snapshot]);
    setHistoryIndex(sliced.length);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setComponents(prev.components);
      setWires(prev.wires);
      setCode(prev.code);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setComponents(next.components);
      setWires(next.wires);
      setCode(next.code);
      setHistoryIndex(historyIndex + 1);
    }
  };

  // Component manipulation
  const handleAddComponent = (catalogItemId) => {
    const catalogItem = CATALOG_ITEMS.find((it) => it.id === catalogItemId);
    const newComp = {
      id: catalogItemId,
      pos: [
        Math.floor(Math.random() * 40 - 20),
        5,
        Math.floor(Math.random() * 40 - 20)
      ],
      rot: [0, 0, 0],
      color: catalogItem?.color || '#94a3b8'
    };
    const updated = [...components.filter((c) => c.id !== catalogItemId), newComp];
    setComponents(updated);
    setSelectedComponentId(catalogItemId);
    pushHistory(updated, wires, code);
  };

  const handleUpdateComponent = (updatedComp) => {
    const updated = components.map((c) => (c.id === updatedComp.id ? updatedComp : c));
    setComponents(updated);
  };

  const handleDeleteComponent = (compId) => {
    const updatedComps = components.filter((c) => c.id !== compId);
    const updatedWires = wires.filter((w) => w.from !== compId && w.to !== compId);
    setComponents(updatedComps);
    setWires(updatedWires);
    if (selectedComponentId === compId) setSelectedComponentId(null);
    pushHistory(updatedComps, updatedWires, code);
  };

  // Wire manipulation
  const handleAddWire = (newWire) => {
    const updated = [...wires, newWire];
    setWires(updated);
    pushHistory(components, updated, code);
  };

  const handleDeleteWire = (wireIdx) => {
    const updated = wires.filter((_, idx) => idx !== wireIdx);
    setWires(updated);
    pushHistory(components, updated, code);
  };

  // Load complete project from AI / Presets
  const handleLoadProject = ({ name, components: newComps, wires: newWires, code: newCode }) => {
    if (name) setProjectName(name);
    setComponents(newComps);
    setWires(newWires);
    setCode(newCode);
    setSelectedComponentId(newComps[0]?.id || null);
    pushHistory(newComps, newWires, newCode);
    setSerialLogs([
      `[PROJECT] Loaded "${name}" into workbench.`,
      `[HARDWARE] ${newComps.length} parts mapped, ${newWires.length} connections active.`
    ]);
  };

  // Simulation Loop Tick
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setSimState((prev) => {
        let nextAngle = prev.servoAngle;
        let nextLed = prev.ledActive;
        let nextRelay = prev.relayActive;
        let status = 'CRUISING';

        const timestamp = new Date().toLocaleTimeString();

        // 1. Distance simulation for Obstacle Avoidance
        if (prev.distanceCm < 25) {
          nextLed = true;
          nextAngle = prev.servoAngle === 45 ? 135 : 45;
          status = 'COLLISION AVERTED';
          setSerialLogs((logs) => [
            ...logs.slice(-40),
            `[${timestamp}] [RADAR] Obstacle detected at ${prev.distanceCm}cm! Swiveling radar to ${nextAngle}°`
          ]);
        } else {
          nextLed = false;
          nextAngle = 90;
          status = 'PATH CLEAR';
          setSerialLogs((logs) => [
            ...logs.slice(-40),
            `[${timestamp}] [TELEMETRY] Dist: ${prev.distanceCm}cm | Temp: ${prev.temperature}°C | Soil: ${prev.moisture}%`
          ]);
        }

        // 2. Moisture / Relay Pump
        if (prev.moisture < 35) {
          nextRelay = true;
        } else {
          nextRelay = false;
        }

        return {
          ...prev,
          servoAngle: nextAngle,
          ledActive: nextLed,
          relayActive: nextRelay,
          statusText: status
        };
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [isSimulating]);

  const handleSendSerialCommand = (cmd) => {
    const timestamp = new Date().toLocaleTimeString();
    setSerialLogs((logs) => [
      ...logs.slice(-40),
      `> ${cmd}`,
      `[${timestamp}] [UART RX] Command acknowledged: ${cmd}`
    ]);

    if (cmd.toUpperCase().includes('LED_ON')) {
      setSimState((s) => ({ ...s, ledActive: true }));
    } else if (cmd.toUpperCase().includes('LED_OFF')) {
      setSimState((s) => ({ ...s, ledActive: false }));
    } else if (cmd.toUpperCase().includes('SERVO')) {
      const match = cmd.match(/\d+/);
      if (match) setSimState((s) => ({ ...s, servoAngle: parseInt(match[0]) }));
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'w' || e.key === 'W') setActiveTool('move');
      if (e.key === 'e' || e.key === 'E') setActiveTool('rotate');
      if (e.key === 'r' || e.key === 'R') setActiveTool('scale');
      if (e.key === 'g' || e.key === 'G') setShowGrid((prev) => !prev);
      if (e.key === 'a' || e.key === 'A') setShowAxes((prev) => !prev);
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedComponentId) handleDeleteComponent(selectedComponentId);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        handleUndo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedComponentId, historyIndex, history]);

  return (
    <div className="constructa-container">
      {/* Top Bar Navigation */}
      <TopBar
        projectName={projectName}
        onProjectNameChange={setProjectName}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
        isDarkTheme={isDarkTheme}
        onToggleTheme={() => setIsDarkTheme(!isDarkTheme)}
        onOpenLearnModal={() => setIsLearnModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onSaveProject={() => {
          localStorage.setItem('constructa_project', JSON.stringify({ projectName, components, wires, code }));
        }}
        onOpenAiCopilot={() => {
          setActiveDockTab('AI');
          setIsInspectorOpen(true);
        }}
      />

      {/* Main Workbench Body */}
      <div className="workbench-body">
        {/* Floating Quick Tools (Left) */}
        <QuickTools
          activeTool={activeTool}
          setActiveTool={setActiveTool}
          showGrid={showGrid}
          setShowGrid={setShowGrid}
          showAxes={showAxes}
          setShowAxes={setShowAxes}
          snapEnabled={snapEnabled}
          setSnapEnabled={setSnapEnabled}
          rotSnapEnabled={rotSnapEnabled}
          setRotSnapEnabled={setRotSnapEnabled}
        />

        {/* 3D Three.js Viewport */}
        <ThreeViewport
          components={components}
          wires={wires}
          selectedComponentId={selectedComponentId}
          onSelectComponent={(id) => {
            setSelectedComponentId(id);
            if (id && activeDockTab !== 'CAD' && activeDockTab !== 'ELEC') {
              setActiveDockTab('CAD');
              setIsInspectorOpen(true);
            }
          }}
          activeTool={activeTool}
          simState={simState}
          isSimulating={isSimulating}
          isDarkTheme={isDarkTheme}
          showGrid={showGrid}
          showAxes={showAxes}
        />

        {/* Right Inspector Panel */}
        {isInspectorOpen && (
          <div className="inspector-panel">
            <div className="inspector-header">
              <div className="inspector-title">
                {activeDockTab === 'CAD' && <><Box size={16} className="mode-tag" /> CAD / Design</>}
                {activeDockTab === 'ELEC' && <><Cpu size={16} className="mode-tag" /> ELEC / Circuit & Wiring</>}
                {activeDockTab === 'CODE' && <><Code size={16} className="mode-tag" /> CODE / Firmware Studio</>}
                {activeDockTab === 'SIMULATE' && <><Play size={16} className="mode-tag" /> SIMULATE / Virtual Lab</>}
                {activeDockTab === 'AI' && <><Sparkles size={16} className="mode-tag" /> AI COPILOT (Zero Token Limits)</>}
                {activeDockTab === 'SETTINGS' && <><Settings size={16} className="mode-tag" /> SETTINGS</>}
              </div>
              <button
                className="icon-btn"
                style={{ width: '22px', height: '22px' }}
                onClick={() => setIsInspectorOpen(false)}
                title="Hide Inspector"
              >
                <X size={14} />
              </button>
            </div>

            {/* Sub-panel content depending on active dock tab */}
            {activeDockTab === 'CAD' && (
              <InspectorCad
                components={components}
                selectedComponentId={selectedComponentId}
                onSelectComponent={setSelectedComponentId}
                onAddComponent={handleAddComponent}
                onUpdateComponent={handleUpdateComponent}
                onDeleteComponent={handleDeleteComponent}
              />
            )}

            {activeDockTab === 'ELEC' && (
              <InspectorElec
                components={components}
                wires={wires}
                onUpdateWires={(newWires) => {
                  setWires(newWires);
                  pushHistory(components, newWires, code);
                }}
                onAddWire={handleAddWire}
                onDeleteWire={handleDeleteWire}
              />
            )}

            {activeDockTab === 'CODE' && (
              <InspectorCode
                code={code}
                onCodeChange={(newCode) => {
                  setCode(newCode);
                  pushHistory(components, wires, newCode);
                }}
                onRunSimulation={() => {
                  setActiveDockTab('SIMULATE');
                  setIsSimulating(true);
                }}
              />
            )}

            {activeDockTab === 'SIMULATE' && (
              <InspectorSimulate
                isSimulating={isSimulating}
                onToggleSimulation={() => setIsSimulating(!isSimulating)}
                onResetSimulation={() => {
                  setIsSimulating(false);
                  setSimState({
                    distanceCm: 32,
                    temperature: 24.5,
                    moisture: 45,
                    servoAngle: 90,
                    ledActive: false,
                    relayActive: false,
                    pirTriggered: false,
                    statusText: 'RESET'
                  });
                  setSerialLogs(['[RESET] Hardware simulator state restored to factory defaults.']);
                }}
                simState={simState}
                onUpdateSimState={(patch) => setSimState((prev) => ({ ...prev, ...patch }))}
                serialLogs={serialLogs}
                onClearLogs={() => setSerialLogs([])}
                onSendSerialCommand={handleSendSerialCommand}
              />
            )}

            {activeDockTab === 'AI' && (
              <InspectorAiCopilot
                components={components}
                wires={wires}
                code={code}
                onLoadProject={handleLoadProject}
                onUpdateWires={(newWires) => {
                  setWires(newWires);
                  pushHistory(components, newWires, code);
                }}
                onUpdateCode={(newCode) => {
                  setCode(newCode);
                  pushHistory(components, wires, newCode);
                }}
                onAddComponent={handleAddComponent}
              />
            )}

            {activeDockTab === 'SETTINGS' && (
              <div className="inspector-content">
                <div className="property-group">
                  <span className="property-group-title">Studio Environment</span>
                  <div className="property-row">
                    <span className="property-label">Measurement Units</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Metric (mm)</span>
                  </div>
                  <div className="property-row">
                    <span className="property-label">Grid Spacing</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>5.0 mm</span>
                  </div>
                  <div className="property-row">
                    <span className="property-label">Physics Step</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>60 Hz</span>
                  </div>
                </div>

                <div className="property-group">
                  <span className="property-group-title">Zero-Token Engine Diagnostics</span>
                  <div className="property-row">
                    <span className="property-label">Engine Mode</span>
                    <span style={{ color: '#10b981', fontWeight: 700, fontSize: '0.72rem' }}>Offline Neural Active</span>
                  </div>
                  <div className="property-row">
                    <span className="property-label">Token Consumption</span>
                    <span style={{ color: '#06b6d4', fontWeight: 700, fontSize: '0.72rem' }}>0 Tokens (Unlimited)</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Far-Right Vertical Dock Bar */}
        <aside className="vertical-dock">
          <button
            className={`dock-item ${activeDockTab === 'CAD' && isInspectorOpen ? 'active' : ''}`}
            onClick={() => {
              setActiveDockTab('CAD');
              setIsInspectorOpen(true);
            }}
            title="CAD & 3D Solids"
          >
            <Box size={18} />
            <span>CAD</span>
          </button>

          <button
            className={`dock-item ${activeDockTab === 'ELEC' && isInspectorOpen ? 'active' : ''}`}
            onClick={() => {
              setActiveDockTab('ELEC');
              setIsInspectorOpen(true);
            }}
            title="ELEC & Circuitry"
          >
            <Cpu size={18} />
            <span>ELEC</span>
          </button>

          <button
            className={`dock-item ${activeDockTab === 'CODE' && isInspectorOpen ? 'active' : ''}`}
            onClick={() => {
              setActiveDockTab('CODE');
              setIsInspectorOpen(true);
            }}
            title="CODE & Firmware"
          >
            <Code size={18} />
            <span>CODE</span>
          </button>

          <button
            className={`dock-item ${activeDockTab === 'SIMULATE' && isInspectorOpen ? 'active' : ''}`}
            onClick={() => {
              setActiveDockTab('SIMULATE');
              setIsInspectorOpen(true);
            }}
            title="SIMULATE & Serial Monitor"
          >
            <Play size={18} />
            <span>SIM</span>
          </button>

          <button
            className={`dock-item ai-special ${activeDockTab === 'AI' && isInspectorOpen ? 'active' : ''}`}
            onClick={() => {
              setActiveDockTab('AI');
              setIsInspectorOpen(true);
            }}
            title="AI Copilot (Zero Token Limits)"
          >
            <Sparkles size={18} />
            <span>AI ∞</span>
          </button>

          <div style={{ flex: 1 }} />

          <button
            className={`dock-item ${activeDockTab === 'SETTINGS' && isInspectorOpen ? 'active' : ''}`}
            onClick={() => {
              setActiveDockTab('SETTINGS');
              setIsInspectorOpen(true);
            }}
            title="Studio Settings"
          >
            <Settings size={18} />
            <span>SETTINGS</span>
          </button>
        </aside>
      </div>

      {/* Bottom Status Bar */}
      <footer className="bottom-bar">
        <div className="bottom-left">
          <span>Objects: <b>{components.length}</b></span>
          <span>Wires: <b>{wires.length}</b></span>
          <span>Selected: <b>{selectedComponentId || 'None'}</b></span>
        </div>
        <div className="bottom-right">
          <span>Shortcuts: 1-0 add shape · W/E/R move·rotate·scale · G grid · A axes · Del delete · Ctrl+Z/Y undo/redo · Space run sim</span>
        </div>
      </footer>

      {/* Modals */}
      <LearnModal
        isOpen={isLearnModalOpen}
        onClose={() => setIsLearnModalOpen(false)}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        projectName={projectName}
        components={components}
        wires={wires}
        code={code}
      />
    </div>
  );
}
