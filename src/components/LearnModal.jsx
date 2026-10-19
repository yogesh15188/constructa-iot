import React from 'react';
import { X, BookOpen, Infinity as InfinityIcon, Zap, Cpu, Sparkles } from 'lucide-react';

export default function LearnModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={20} color="var(--brand-orange)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Constructa Academy & IoT Docs</h3>
          </div>
          <button className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '70vh', overflowY: 'auto', paddingRight: '6px' }}>
          {/* Zero Token Limits Explainer */}
          <div style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(6, 182, 212, 0.12))', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '10px', padding: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontWeight: 700, fontSize: '0.85rem' }}>
              <InfinityIcon size={18} />
              <span>How Zero Token Limits Work</span>
            </div>
            <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: '1.5' }}>
              Unlike cloud services that throttle you with token caps or rate limits (429 errors), Constructa embeds a <b>Client-Side Intelligent Neural Synthesizer</b>. It produces complete 3D scene layouts, schematic wiring, and compilable C++/MicroPython firmware locally without consuming any billed tokens!
            </p>
          </div>

          {/* Quickstart Guide */}
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
              🚀 Quickstart Workflow
            </h4>
            <ol style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', paddingLeft: '18px', lineHeight: '1.7' }}>
              <li><b>Place Hardware:</b> Open <b>CAD</b> or <b>ELEC</b> to add ESP32/Arduino, ultrasonic sensors, servos, OLEDs.</li>
              <li><b>Auto-Wire:</b> Click <b>"Auto-Wire Circuit"</b> in ELEC to route safe pin connections automatically.</li>
              <li><b>AI Copilot:</b> Use 1-click presets or type what you want to build in plain English.</li>
              <li><b>Virtual Sim:</b> Open <b>SIMULATE</b> to drag temperature/distance sliders and watch the 3D servo rotate and serial logs stream in real-time!</li>
            </ol>
          </div>

          {/* Microcontroller Pinout Tips */}
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
              ⚡ Pin Voltage & Logic Safety
            </h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              <b>ESP32:</b> Operates at 3.3V logic. I2C default pins are GPIO 21 (SDA) and GPIO 22 (SCL). Avoid driving 5V directly into ADC pins.<br />
              <b>Arduino Uno:</b> 5V logic tolerant on digital D2-D13 pins. Hardware PWM available on pins 3, 5, 6, 9, 10, 11.
            </p>
          </div>
        </div>

        <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="dash-btn" onClick={onClose} style={{ padding: '8px 20px' }}>
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}
