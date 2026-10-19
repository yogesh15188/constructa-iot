import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Terminal, 
  Sliders, 
  Activity, 
  Send, 
  Trash2 
} from 'lucide-react';

export default function InspectorSimulate({
  isSimulating,
  onToggleSimulation,
  onResetSimulation,
  simState,
  onUpdateSimState,
  serialLogs,
  onClearLogs,
  onSendSerialCommand
}) {
  const [serialInput, setSerialInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!serialInput.trim()) return;
    onSendSerialCommand(serialInput);
    setSerialInput('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '12px' }}>
      <div className="inspector-content" style={{ padding: '12px', gap: '14px' }}>
        {/* Play / Pause / Reset Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-hover)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              className={`pill-action-btn ${isSimulating ? 'primary-orange' : ''}`}
              onClick={onToggleSimulation}
              style={{ padding: '6px 14px' }}
            >
              {isSimulating ? <><Pause size={14} /> Pause Sim</> : <><Play size={14} /> Start Sim</>}
            </button>
            <button
              className="icon-btn"
              onClick={onResetSimulation}
              title="Reset Simulation State"
            >
              <RotateCcw size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', fontWeight: 600 }}>
            <div className={`status-dot ${isSimulating ? '' : 'paused'}`} style={{ background: isSimulating ? '#10b981' : '#f59e0b' }} />
            <span>{isSimulating ? 'SIMULATION RUNNING' : 'STANDBY'}</span>
          </div>
        </div>

        {/* Live Hardware Feedback Indicators */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
          <div style={{ background: 'var(--bg-hover)', padding: '8px', borderRadius: '6px', textAlign: 'center', border: '1px solid var(--border-light)' }}>
            <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', display: 'block' }}>LED Status</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: simState.ledActive ? '#f97316' : 'var(--text-secondary)' }}>
              {simState.ledActive ? 'ON (BLOWN)' : 'OFF'}
            </span>
          </div>
          <div style={{ background: 'var(--bg-hover)', padding: '8px', borderRadius: '6px', textAlign: 'center', border: '1px solid var(--border-light)' }}>
            <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', display: 'block' }}>Servo Horn</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#3b82f6' }}>
              {Math.round(simState.servoAngle || 90)}°
            </span>
          </div>
          <div style={{ background: 'var(--bg-hover)', padding: '8px', borderRadius: '6px', textAlign: 'center', border: '1px solid var(--border-light)' }}>
            <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', display: 'block' }}>Relay Coil</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: simState.relayActive ? '#10b981' : 'var(--text-secondary)' }}>
              {simState.relayActive ? 'CLOSED (ACTIVE)' : 'OPEN'}
            </span>
          </div>
        </div>

        {/* Interactive Sensor Stimuli Sliders */}
        <div className="sim-controls-card">
          <span className="property-group-title" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Sliders size={13} /> Interactive Sensor Stimuli
          </span>

          {/* Distance Slider (HC-SR04) */}
          <div className="sim-slider-row">
            <div className="sim-slider-header">
              <span>Ultrasonic Distance (HC-SR04)</span>
              <span style={{ color: simState.distanceCm < 25 ? '#ef4444' : 'var(--brand-orange)', fontWeight: 700 }}>
                {simState.distanceCm} cm
              </span>
            </div>
            <input
              type="range"
              min="2"
              max="200"
              value={simState.distanceCm || 30}
              onChange={(e) => onUpdateSimState({ distanceCm: parseInt(e.target.value) })}
              className="slider-input"
            />
          </div>

          {/* Temperature Slider (DHT22) */}
          <div className="sim-slider-row">
            <div className="sim-slider-header">
              <span>Ambient Temperature (DHT22)</span>
              <span style={{ color: 'var(--brand-orange)', fontWeight: 700 }}>
                {simState.temperature || 24.5} °C
              </span>
            </div>
            <input
              type="range"
              min="-10"
              max="60"
              step="0.5"
              value={simState.temperature || 24.5}
              onChange={(e) => onUpdateSimState({ temperature: parseFloat(e.target.value) })}
              className="slider-input"
            />
          </div>

          {/* Soil Moisture Slider */}
          <div className="sim-slider-row">
            <div className="sim-slider-header">
              <span>Soil Moisture Percentage</span>
              <span style={{ color: simState.moisture < 35 ? '#ef4444' : '#10b981', fontWeight: 700 }}>
                {simState.moisture || 40} %
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={simState.moisture || 40}
              onChange={(e) => onUpdateSimState({ moisture: parseInt(e.target.value) })}
              className="slider-input"
            />
          </div>

          {/* Motion Trigger Button (PIR) */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 600 }}>PIR Motion Trigger</span>
            <button
              className="dash-btn"
              style={{ padding: '4px 10px', fontSize: '0.7rem' }}
              onClick={() => {
                onUpdateSimState({ pirTriggered: true });
                setTimeout(() => onUpdateSimState({ pirTriggered: false }), 1500);
              }}
            >
              Trigger Motion Wave
            </button>
          </div>
        </div>

        {/* Virtual Serial Monitor (115200 baud) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="property-group-title" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Terminal size={13} /> Virtual Serial Monitor (115200 baud)
            </span>
            <button
              className="icon-btn"
              style={{ width: '22px', height: '22px' }}
              onClick={onClearLogs}
              title="Clear Serial Monitor"
            >
              <Trash2 size={12} />
            </button>
          </div>

          <div className="terminal-box">
            {serialLogs.length === 0 ? (
              <span style={{ color: '#64748b' }}>[System Ready. Start simulation to view serial telemetry.]</span>
            ) : (
              serialLogs.map((log, idx) => (
                <div key={idx}>{log}</div>
              ))
            )}
          </div>

          {/* Serial Send Input */}
          <form onSubmit={handleSend} style={{ display: 'flex', gap: '6px' }}>
            <input
              type="text"
              placeholder="Send command to Arduino/ESP32 (e.g. LED_ON, SERVO_90)"
              value={serialInput}
              onChange={(e) => setSerialInput(e.target.value)}
              className="ai-prompt-input"
              style={{ minHeight: 'unset', padding: '6px 10px', fontSize: '0.72rem', flex: 1 }}
            />
            <button type="submit" className="dash-btn" style={{ padding: '6px 12px' }}>
              <Send size={12} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
