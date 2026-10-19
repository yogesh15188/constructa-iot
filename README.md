# Constructa IoT Studio - 3D IoT & Robotics Workbench with Zero Token Limit AI Copilot

> A modern, high-fidelity 3D IoT & Robotics design studio and simulation environment inspired by Constructa, featuring an embedded **Zero Token Limit AI Copilot** to build end-to-end IoT projects with zero quota caps or API fees.

![Constructa IoT Studio](https://raw.githubusercontent.com/yogesh15188/constructa-iot/main/preview.png)

---

## 🌟 Key Highlights

- **🧠 Zero Token Limit AI Copilot**:
  - **Embedded Neural Synthesizer**: Generates complete 3D scene placement, schematic wiring, and compilable C++/MicroPython firmware **locally** without consuming billed API tokens or hitting rate limits.
  - **Multi-Provider BYOK Hub**: Connect your own API keys for Google Gemini 2.0 Flash, Groq Llama-3, OpenAI GPT-4o, or connect directly to **Local Ollama (`http://localhost:11434`)** for 100% private, free, and unlimited local LLM inference.
  - **1-Click Instant IoT Presets**:
    - 🤖 *Autonomous Obstacle-Avoiding Rover* (ESP32 + HC-SR04 Sonar + SG90 Radar Servo + Status LEDs)
    - 🌱 *Smart Plant Irrigation & Soil Monitor* (ESP32 + Capacitive Soil Sensor + 5V Relay Pump + SSD1306 OLED)
    - ⛅ *IoT Climate & Weather Station* (ESP32 + DHT22 Digital Sensor + 0.96" I2C OLED Display)
    - 🚨 *Smart Perimeter & Intrusion Alarm* (ESP32 + PIR Motion Sensor + Active Buzzer + Dual Alerts)

- **📐 Interactive 3D CAD Studio (Three.js)**:
  - Realistic procedural 3D models for **ESP32-WROOM-32**, **Arduino Uno R3**, **Raspberry Pi Pico**, sensors (HC-SR04, DHT22, PIR, Soil, LDR), actuators (SG90 Servo, OLED, Relay, RGB LEDs, Buzzer), half-size breadboard, and 3D enclosures.
  - **Quick Tools Floating Dock**: Move (W), Rotate (E), Scale (R), Surface, Extrude, Slice, Snap, Rot Snap, Grid, Axes.
  - **3D ViewCube**: Smooth camera transitions between Isometric, Top, Front, Right, and Perspective/Orthographic modes.

- **⚡ ELEC Circuit & Wiring Studio**:
  - Interactive point-and-click pin connections with color-coded, smooth 3D Catmull-Rom jumper wires.
  - **1-Click Auto-Wire**: Computes safe, short-circuit-free pin assignments between microcontrollers and peripherals.
  - **Circuit Health & Logic Validator**: Verifies power rails, ground continuity, and logic voltage compatibility (3.3V vs 5V).

- **💻 CODE Firmware Studio**:
  - Syntax-highlighted code editor supporting `main.ino` (Arduino C++), `main.py` (MicroPython), and `diagram.json`.
  - Sketch verification/linting, one-click copy, and `.ino` download.
  - "Run in Simulator" compiles firmware logic directly into the virtual physical engine.

- **🎮 SIMULATE Physical IoT Lab & Serial Monitor**:
  - **Interactive Sensor Stimuli**: Real-time sliders for Ultrasonic Distance (2cm–200cm), Temperature (-10°C–60°C), Soil Moisture (0%–100%), and PIR Motion Wave trigger.
  - **Dynamic Physical Feedback**:
    - SG90 Servo horn physically swivels to commanded angles in 3D.
    - Status LEDs illuminate with realistic emissive glow and point-light bloom.
    - 0.96" OLED screen renders live telemetry graphics and text in the 3D scene.
    - Relay module visually flips coil state.
  - **Virtual Serial Monitor (115200 baud)**: Real-time timestamped UART telemetry log with an interactive serial command transmitter.

- **📦 Comprehensive Project Export**:
  - Export Arduino Sketch (`.ino`)
  - Export Circuit Netlist & Pin Map (`.csv`)
  - Export Wokwi Schematic (`diagram.json`)
  - Export Complete Project Backup (`.json`)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yogesh15188/constructa-iot.git
cd constructa-iot

# Install dependencies
npm install

# Start local development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
npm run preview
```

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite
- **3D Graphics**: Three.js, OrbitControls
- **Icons**: Lucide React
- **Animations & Effects**: Canvas Confetti, CSS Glassmorphism
- **Styling**: Vanilla CSS with custom properties & responsive light/dark design system

---

## 📄 License

MIT License. Free for open-source IoT development and education.
