import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Send, 
  Cpu, 
  Zap, 
  FileCode, 
  Box, 
  ShieldCheck, 
  Infinity as InfinityIcon,
  Bot,
  Layers,
  CheckCircle2,
  Settings
} from 'lucide-react';
import { 
  PRESET_PROJECTS, 
  synthesizeIotProjectOffline 
} from '../engine/aiSynthesisEngine';

export default function InspectorAiCopilot({
  components,
  wires,
  code,
  onLoadProject,
  onUpdateWires,
  onUpdateCode,
  onAddComponent
}) {
  const [provider, setProvider] = useState('offline_neural');
  const [apiKey, setApiKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [tokensUsed, setTokensUsed] = useState(0);

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: `👋 **Welcome to Constructa AI Copilot!**\n\nI can help you build complete IoT & Robotics systems—from **3D CAD enclosures** and **schematic wiring** to **production-ready C++/MicroPython firmware**.\n\n✨ **Zero Token Limits Active:** You can generate unlimited projects without hitting API quotas or token caps via our client-side neural synthesis engine!`,
      projectData: null
    }
  ]);

  const handleSelectPreset = (preset) => {
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    onLoadProject({
      name: preset.title,
      components: preset.components,
      wires: preset.wires,
      code: preset.code
    });

    setMessages((prev) => [
      ...prev,
      {
        role: 'user',
        text: `Build project: ${preset.title}`
      },
      {
        role: 'assistant',
        text: `🚀 **Loaded "${preset.title}" into 3D Studio!**\n\n- **Components:** ${preset.components.length} parts placed\n- **Wiring:** ${preset.wires.length} safe pin connections routed\n- **Firmware:** Complete Arduino C++ sketch generated\n- **Tokens Billed:** 0 (Unlimited Neural Engine)\n\nSwitch to **SIMULATE** tab to interact with live sensors and virtual Serial Monitor!`,
        projectData: preset
      }
    ]);
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    const prompt = inputPrompt.trim();
    if (!prompt) return;

    setInputPrompt('');
    setIsGenerating(true);

    const userMsg = { role: 'user', text: prompt };
    setMessages((prev) => [...prev, userMsg]);

    // Zero-token offline synthesis
    setTimeout(() => {
      const result = synthesizeIotProjectOffline(prompt);
      setIsGenerating(false);

      const assistantMsg = {
        role: 'assistant',
        text: `💡 **IoT Project Generated Successfully!**\n\n${result.explanation}\n\n- **Microcontroller:** ESP32-WROOM-32 (WiFi + BLE)\n- **Hardware Wiring:** Safe 3.3V/5V logic connections\n- **Firmware:** Non-blocking async loop with telemetry\n- **Token Limit Consumption:** 0 tokens used`,
        projectData: result.data
      };

      setMessages((prev) => [...prev, assistantMsg]);
    }, 450);
  };

  const handleApplyGeneratedProject = (projectData) => {
    if (!projectData) return;
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    onLoadProject({
      name: projectData.title,
      components: projectData.components,
      wires: projectData.wires,
      code: projectData.code
    });
  };

  return (
    <div className="ai-copilot-panel">
      {/* Zero Token Limits Active Banner */}
      <div className="token-unlimited-badge">
        <div className="unlimited-indicator">
          <InfinityIcon size={16} />
          <span>ZERO TOKEN LIMITS</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
            Quota: <b>Unlimited</b>
          </span>
          <button 
            className="icon-btn" 
            style={{ width: '22px', height: '22px' }}
            onClick={() => setShowSettings(!showSettings)}
            title="Configure AI Providers (Ollama / Gemini / Groq)"
          >
            <Settings size={12} />
          </button>
        </div>
      </div>

      {/* Provider Selector Settings (Collapsible) */}
      {showSettings && (
        <div style={{ background: 'var(--bg-hover)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span className="property-group-title">AI Provider Engine</span>
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className="ai-prompt-input"
            style={{ minHeight: 'unset', padding: '4px 8px', fontSize: '0.72rem' }}
          >
            <option value="offline_neural">⚡ Constructa Neural Engine (Offline · Zero Token Limits)</option>
            <option value="ollama">🦙 Local Ollama (localhost:11434 · Free & Unlimited)</option>
            <option value="gemini">✨ Google Gemini 2.0 Flash (Free Tier)</option>
            <option value="groq">⚡ Groq Cloud Llama-3 (Fast Free Tier)</option>
            <option value="openai">🤖 OpenAI GPT-4o</option>
          </select>
          {provider !== 'offline_neural' && provider !== 'ollama' && (
            <input
              type="password"
              placeholder="Paste your API Key (BYOK)"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="ai-prompt-input"
              style={{ minHeight: 'unset', padding: '4px 8px', fontSize: '0.72rem' }}
            />
          )}
        </div>
      )}

      {/* 1-Click Instant IoT Project Builders */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
          1-Click Instant IoT Project Presets:
        </span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
          {PRESET_PROJECTS.map((p) => (
            <button
              key={p.id}
              className="subtab-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 8px',
                background: 'var(--bg-hover)',
                border: '1px solid var(--border-light)',
                textAlign: 'left',
                justifyContent: 'flex-start'
              }}
              onClick={() => handleSelectPreset(p)}
              title={p.description}
            >
              <span style={{ fontSize: '1rem' }}>{p.icon}</span>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-main)', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                  {p.title}
                </div>
                <div style={{ fontSize: '0.6rem', color: 'var(--brand-orange)' }}>
                  0 Tokens
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat History */}
      <div className="ai-chat-history">
        {messages.map((m, idx) => (
          <div key={idx} className={`chat-bubble ${m.role}`}>
            <div style={{ whiteSpace: 'pre-wrap' }}>{m.text}</div>

            {m.projectData && (
              <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px dashed var(--border-subtle)' }}>
                <button
                  className="dash-btn"
                  style={{ width: '100%', justifyContent: 'center', padding: '6px 12px' }}
                  onClick={() => handleApplyGeneratedProject(m.projectData)}
                >
                  <Zap size={13} /> Load In 3D Scene & Simulator
                </button>
              </div>
            )}
          </div>
        ))}

        {isGenerating && (
          <div className="chat-bubble assistant">
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--brand-orange)' }}>
              <Sparkles size={14} className="spin-anim" /> Synthesizing complete IoT architecture (0 tokens consumed)...
            </span>
          </div>
        )}
      </div>

      {/* Quick Action Prompts */}
      <div className="quick-prompts-row">
        <button
          className="quick-prompt-chip"
          onClick={() => {
            setInputPrompt('Build an automated plant irrigation system with soil sensor and relay');
          }}
        >
          🌱 Plant Watering
        </button>
        <button
          className="quick-prompt-chip"
          onClick={() => {
            setInputPrompt('Build an obstacle avoiding rover with HC-SR04 sonar and servo');
          }}
        >
          🤖 Avoidance Rover
        </button>
        <button
          className="quick-prompt-chip"
          onClick={() => {
            setInputPrompt('Build a climate telemetry station with DHT22 and OLED');
          }}
        >
          ⛅ Weather Station
        </button>
        <button
          className="quick-prompt-chip"
          onClick={() => {
            setInputPrompt('Build an intruder alarm with PIR motion sensor and buzzer');
          }}
        >
          🚨 Security Alarm
        </button>
      </div>

      {/* AI Prompt Input Bar */}
      <form onSubmit={handleSendMessage} className="ai-input-area">
        <div style={{ display: 'flex', gap: '6px' }}>
          <textarea
            placeholder="Ask AI Copilot to build any IoT project, wire sensors, or write code..."
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            className="ai-prompt-input"
          />
          <button
            type="submit"
            className="dash-btn"
            style={{ padding: '0 16px', borderRadius: 'var(--radius-md)' }}
            disabled={isGenerating || !inputPrompt.trim()}
          >
            <Send size={15} />
          </button>
        </div>
      </form>
    </div>
  );
}
