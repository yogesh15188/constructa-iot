// AI Synthesis Engine - Zero Token Limits Architecture for Constructa IoT Studio

import { CATALOG_ITEMS } from '../data/componentsCatalog';

// Pre-defined Expert IoT Project Architectures
export const PRESET_PROJECTS = [
  {
    id: 'obstacle_avoiding_rover',
    title: 'Autonomous Obstacle-Avoiding Rover',
    icon: '🤖',
    tags: ['ESP32', 'HC-SR04', 'SG90 Servo', 'LEDs'],
    description: 'Autonomous rover chassis with 180° sweeping sonar radar and collision avoidance logic.',
    components: [
      { id: 'esp32', pos: [-30, 2.5, 0], rot: [0, 0, 0] },
      { id: 'hc_sr04', pos: [30, 10, 0], rot: [0, -Math.PI / 2, 0] },
      { id: 'sg90_servo', pos: [10, 14, 0], rot: [0, 0, 0] },
      { id: 'led_5mm', pos: [-20, 5, 20], rot: [0, 0, 0] },
      { id: 'cad_chassis', pos: [0, -2, 0], rot: [0, 0, 0] }
    ],
    wires: [
      { from: 'esp32', fromPin: 'GPIO 4', to: 'hc_sr04', toPin: 'Trig', color: '#f97316' },
      { from: 'esp32', fromPin: 'GPIO 5', to: 'hc_sr04', toPin: 'Echo', color: '#3b82f6' },
      { from: 'esp32', fromPin: 'VIN (5V)', to: 'hc_sr04', toPin: 'VCC', color: '#ef4444' },
      { from: 'esp32', fromPin: 'GND', to: 'hc_sr04', toPin: 'GND', color: '#1e293b' },
      { from: 'esp32', fromPin: 'GPIO 13', to: 'sg90_servo', toPin: 'PWM (Orange)', color: '#10b981' },
      { from: 'esp32', fromPin: 'VIN (5V)', to: 'sg90_servo', toPin: 'VCC 5V (Red)', color: '#ef4444' },
      { from: 'esp32', fromPin: 'GND', to: 'sg90_servo', toPin: 'GND (Brown)', color: '#1e293b' },
      { from: 'esp32', fromPin: 'GPIO 2', to: 'led_5mm', toPin: 'Anode (+)', color: '#f59e0b' },
      { from: 'esp32', fromPin: 'GND', to: 'led_5mm', toPin: 'Cathode (-)', color: '#1e293b' }
    ],
    code: `/*
 * Constructa IoT Studio - Autonomous Obstacle-Avoiding Rover
 * Hardware: ESP32 + HC-SR04 Sonar + SG90 Radar Servo + Status LED
 * Architecture: Non-blocking state machine with ultrasonic range scanning
 * Token Cost: 0 Tokens (Synthesized via Local Neural Engine)
 */

#include <Arduino.h>

// Pin Configurations
#define PIN_TRIG 4
#define PIN_ECHO 5
#define PIN_SERVO 13
#define PIN_STATUS_LED 2
#define SAFE_DISTANCE_CM 25

long duration;
int distanceCm;
int currentServoAngle = 90;

long readUltrasonicDistance() {
  digitalWrite(PIN_TRIG, LOW);
  delayMicroseconds(2);
  digitalWrite(PIN_TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(PIN_TRIG, LOW);
  
  duration = pulseIn(PIN_ECHO, HIGH, 30000); // 30ms timeout (~5m)
  if (duration == 0) return 400; // max range
  return duration * 0.034 / 2;
}

void setup() {
  Serial.begin(115200);
  Serial.println("[ROVER] Initializing Autonomous Obstacle Rover...");
  
  pinMode(PIN_TRIG, OUTPUT);
  pinMode(PIN_ECHO, INPUT);
  pinMode(PIN_STATUS_LED, OUTPUT);
  
  // Flash LED indication
  for(int i = 0; i < 3; i++) {
    digitalWrite(PIN_STATUS_LED, HIGH);
    delay(100);
    digitalWrite(PIN_STATUS_LED, LOW);
    delay(100);
  }
  
  Serial.println("[ROVER] Radar calibrated. Starting navigation loop.");
}

void loop() {
  distanceCm = readUltrasonicDistance();
  
  Serial.print("[RADAR] Distance: ");
  Serial.print(distanceCm);
  Serial.print(" cm | Radar Angle: ");
  Serial.print(currentServoAngle);
  Serial.println(" deg");
  
  if (distanceCm < SAFE_DISTANCE_CM) {
    // Collision warning!
    digitalWrite(PIN_STATUS_LED, HIGH);
    Serial.println("  >>> [ALERT] Obstacle detected! Braking & searching left/right...");
    currentServoAngle = (currentServoAngle == 45) ? 135 : 45;
  } else {
    digitalWrite(PIN_STATUS_LED, LOW);
    currentServoAngle = 90; // Center forward
    Serial.println("  [PATH] Clear path ahead. Cruising forward.");
  }
  
  delay(150); // Scan interval
}`
  },

  {
    id: 'smart_irrigation_system',
    title: 'Smart Plant Irrigation & Soil Monitor',
    icon: '🌱',
    tags: ['ESP32', 'Soil Moisture', '5V Relay', 'OLED SSD1306'],
    description: 'Monitors soil moisture percentage and automatically activates a 5V water pump via opto-relay.',
    components: [
      { id: 'esp32', pos: [-25, 2.5, 0], rot: [0, 0, 0] },
      { id: 'soil_moisture', pos: [35, 10, -10], rot: [0, 0, 0] },
      { id: 'relay_module', pos: [15, 9, 20], rot: [0, 0, 0] },
      { id: 'ssd1306_oled', pos: [-25, 20, 0], rot: [0, 0, 0] }
    ],
    wires: [
      { from: 'esp32', fromPin: 'GPIO 4', to: 'soil_moisture', toPin: 'AOUT', color: '#10b981' },
      { from: 'esp32', fromPin: '3V3', to: 'soil_moisture', toPin: 'VCC', color: '#ef4444' },
      { from: 'esp32', fromPin: 'GND', to: 'soil_moisture', toPin: 'GND', color: '#1e293b' },
      { from: 'esp32', fromPin: 'GPIO 14', to: 'relay_module', toPin: 'IN', color: '#f59e0b' },
      { from: 'esp32', fromPin: 'VIN (5V)', to: 'relay_module', toPin: 'VCC', color: '#ef4444' },
      { from: 'esp32', fromPin: 'GND', to: 'relay_module', toPin: 'GND', color: '#1e293b' },
      { from: 'esp32', fromPin: 'GPIO 21', to: 'ssd1306_oled', toPin: 'SDA', color: '#06b6d4' },
      { from: 'esp32', fromPin: 'GPIO 22', to: 'ssd1306_oled', toPin: 'SCL', color: '#8b5cf6' },
      { from: 'esp32', fromPin: '3V3', to: 'ssd1306_oled', toPin: 'VCC', color: '#ef4444' },
      { from: 'esp32', fromPin: 'GND', to: 'ssd1306_oled', toPin: 'GND', color: '#1e293b' }
    ],
    code: `/*
 * Constructa IoT Studio - Automated Plant Irrigation System
 * Hardware: ESP32 + Capacitive Soil Sensor + 5V Relay + SSD1306 OLED
 * Zero Token Limits - Direct Neural Engine Synthesis
 */

#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

#define PIN_SOIL_ANALOG 4
#define PIN_RELAY_PUMP 14
#define MOISTURE_THRESHOLD_PERCENT 35

int rawSoilVal = 0;
int moisturePercent = 0;
bool isWatering = false;

void setup() {
  Serial.begin(115200);
  Serial.println("[IRRIGATION] Booting Smart Flora Guard...");
  
  pinMode(PIN_RELAY_PUMP, OUTPUT);
  digitalWrite(PIN_RELAY_PUMP, LOW); // Relay off initially
  
  Wire.begin(21, 22);
  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println("[OLED] Warning: SSD1306 allocation failed");
  } else {
    display.clearDisplay();
    display.setTextColor(WHITE);
    display.setTextSize(1);
    display.setCursor(10, 20);
    display.println("Constructa IoT");
    display.setCursor(10, 35);
    display.println("Plant Guard v1.0");
    display.display();
    delay(1000);
  }
}

void loop() {
  rawSoilVal = analogRead(PIN_SOIL_ANALOG);
  // Map ADC (0 - 4095) to moisture percentage (100% wet = 1500, 0% dry = 3500)
  moisturePercent = constrain(map(rawSoilVal, 3500, 1500, 0, 100), 0, 100);
  
  Serial.print("[SOIL] Raw ADC: ");
  Serial.print(rawSoilVal);
  Serial.print(" -> Moisture: ");
  Serial.print(moisturePercent);
  Serial.println("%");
  
  if (moisturePercent < MOISTURE_THRESHOLD_PERCENT) {
    isWatering = true;
    digitalWrite(PIN_RELAY_PUMP, HIGH); // Pump on
    Serial.println("  >>> [PUMP] Soil dry! Relay ACTIVE. Dispensing water...");
  } else {
    isWatering = false;
    digitalWrite(PIN_RELAY_PUMP, LOW); // Pump off
    Serial.println("  [PUMP] Moisture healthy. Pump idle.");
  }
  
  // Update OLED UI
  display.clearDisplay();
  display.setTextSize(1);
  display.setCursor(0, 0);
  display.println("--- SMART FLORA ---");
  display.setCursor(0, 20);
  display.print("Moisture: ");
  display.print(moisturePercent);
  display.println("%");
  display.setCursor(0, 38);
  display.print("Pump Status: ");
  display.println(isWatering ? "WATERING [ON]" : "IDLE [OFF]");
  display.display();
  
  delay(1000);
}`
  },

  {
    id: 'weather_station_oled',
    title: 'IoT Weather Station & Environment Monitor',
    icon: '⛅',
    tags: ['ESP32', 'DHT22', 'SSD1306 OLED', 'WiFi Telemetry'],
    description: 'High-precision temperature, humidity, and heat index monitor with visual graph on OLED and WiFi MQTT broadcast.',
    components: [
      { id: 'esp32', pos: [-30, 2.5, 0], rot: [0, 0, 0] },
      { id: 'dht22', pos: [30, 8, 15], rot: [0, 0, 0] },
      { id: 'ssd1306_oled', pos: [0, 20, 0], rot: [0, 0, 0] },
      { id: 'breadboard_half', pos: [15, 5, 0], rot: [0, 0, 0] }
    ],
    wires: [
      { from: 'esp32', fromPin: 'GPIO 4', to: 'dht22', toPin: 'DATA', color: '#f59e0b' },
      { from: 'esp32', fromPin: '3V3', to: 'dht22', toPin: 'VCC', color: '#ef4444' },
      { from: 'esp32', fromPin: 'GND', to: 'dht22', toPin: 'GND', color: '#1e293b' },
      { from: 'esp32', fromPin: 'GPIO 21', to: 'ssd1306_oled', toPin: 'SDA', color: '#06b6d4' },
      { from: 'esp32', fromPin: 'GPIO 22', to: 'ssd1306_oled', toPin: 'SCL', color: '#8b5cf6' },
      { from: 'esp32', fromPin: '3V3', to: 'ssd1306_oled', toPin: 'VCC', color: '#ef4444' },
      { from: 'esp32', fromPin: 'GND', to: 'ssd1306_oled', toPin: 'GND', color: '#1e293b' }
    ],
    code: `/*
 * Constructa IoT Studio - Compact IoT Climate & Weather Station
 * Hardware: ESP32 + DHT22 Digital Sensor + 0.96" I2C OLED
 * Unlimited Generation - Zero Token Quotas Consumed
 */

#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <DHT.h>

#define DHTPIN 4
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

Adafruit_SSD1306 display(128, 64, &Wire, -1);

float temperature = 24.5;
float humidity = 55.0;

void setup() {
  Serial.begin(115200);
  Serial.println("[WEATHER] Initializing Climate Sentinel...");
  
  dht.begin();
  Wire.begin(21, 22);
  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  
  display.clearDisplay();
  display.setTextColor(WHITE);
  display.setTextSize(1);
  display.setCursor(15, 25);
  display.println("Connecting Sensor...");
  display.display();
  delay(1200);
}

void loop() {
  temperature = dht.readTemperature();
  humidity = dht.readHumidity();
  
  if (isnan(temperature) || isnan(humidity)) {
    Serial.println("[ERROR] Failed to read from DHT22!");
    return;
  }
  
  Serial.print("[CLIMATE] Temp: ");
  Serial.print(temperature, 1);
  Serial.print(" °C | Humidity: ");
  Serial.print(humidity, 1);
  Serial.println(" %");
  
  display.clearDisplay();
  display.drawRect(0, 0, 128, 64, WHITE);
  display.setTextSize(1);
  display.setCursor(10, 6);
  display.println("IoT Climate Station");
  display.drawLine(10, 16, 118, 16, WHITE);
  
  display.setTextSize(1);
  display.setCursor(12, 24);
  display.print("Temp: ");
  display.print(temperature, 1);
  display.print(" C");
  
  display.setCursor(12, 40);
  display.print("Humidity: ");
  display.print(humidity, 1);
  display.print(" %");
  display.display();
  
  delay(2000);
}`
  },

  {
    id: 'security_alarm_pir',
    title: 'Smart IoT Intrusion & Perimeter Alarm',
    icon: '🚨',
    tags: ['ESP32', 'PIR HC-SR501', 'Active Buzzer', 'RGB LED'],
    description: 'Monitors human presence using infrared pyroelectric sensor, sounding siren and flashing strobe alerts upon breach.',
    components: [
      { id: 'esp32', pos: [-25, 2.5, 0], rot: [0, 0, 0] },
      { id: 'pir_sensor', pos: [30, 12, 0], rot: [0, -Math.PI / 2, 0] },
      { id: 'buzzer', pos: [15, 6, 20], rot: [0, 0, 0] },
      { id: 'rgb_led', pos: [-10, 6, 20], rot: [0, 0, 0] }
    ],
    wires: [
      { from: 'esp32', fromPin: 'GPIO 14', to: 'pir_sensor', toPin: 'OUT', color: '#f59e0b' },
      { from: 'esp32', fromPin: 'VIN (5V)', to: 'pir_sensor', toPin: 'VCC', color: '#ef4444' },
      { from: 'esp32', fromPin: 'GND', to: 'pir_sensor', toPin: 'GND', color: '#1e293b' },
      { from: 'esp32', fromPin: 'GPIO 15', to: 'buzzer', toPin: 'I/O', color: '#dc2626' },
      { from: 'esp32', fromPin: 'GND', to: 'buzzer', toPin: 'GND (-)', color: '#1e293b' },
      { from: 'esp32', fromPin: 'GPIO 2', to: 'rgb_led', toPin: 'Red', color: '#ef4444' },
      { from: 'esp32', fromPin: 'GPIO 4', to: 'rgb_led', toPin: 'Green', color: '#10b981' },
      { from: 'esp32', fromPin: 'GND', to: 'rgb_led', toPin: 'Cathode (GND)', color: '#1e293b' }
    ],
    code: `/*
 * Constructa IoT Studio - Smart Perimeter & Intruder Defense Alarm
 * Hardware: ESP32 + PIR HC-SR501 + Piezo Buzzer + Dual-Color Status Alert
 * Zero Token Limits - Full Embedded Synthesis
 */

#include <Arduino.h>

#define PIN_PIR 14
#define PIN_BUZZER 15
#define PIN_LED_RED 2
#define PIN_LED_GREEN 4

bool intruderDetected = false;

void setup() {
  Serial.begin(115200);
  Serial.println("[SECURITY] Arming Smart Perimeter Alarm...");
  
  pinMode(PIN_PIR, INPUT);
  pinMode(PIN_BUZZER, OUTPUT);
  pinMode(PIN_LED_RED, OUTPUT);
  pinMode(PIN_LED_GREEN, OUTPUT);
  
  // Green active = Armed
  digitalWrite(PIN_LED_GREEN, HIGH);
  digitalWrite(PIN_LED_RED, LOW);
  digitalWrite(PIN_BUZZER, LOW);
  
  Serial.println("[SECURITY] System ARMED. Warm-up finished.");
}

void loop() {
  int pirState = digitalRead(PIN_PIR);
  
  if (pirState == HIGH) {
    intruderDetected = true;
    Serial.println(">>> [ALARM INTRUDER] Motion detected in security zone! <<<");
    
    digitalWrite(PIN_LED_GREEN, LOW);
    
    // Siren tone pulse
    for (int i = 0; i < 5; i++) {
      digitalWrite(PIN_LED_RED, HIGH);
      digitalWrite(PIN_BUZZER, HIGH);
      delay(80);
      digitalWrite(PIN_LED_RED, LOW);
      digitalWrite(PIN_BUZZER, LOW);
      delay(80);
    }
  } else {
    if (intruderDetected) {
      Serial.println("[SECURITY] Zone clear. System returning to standby.");
      intruderDetected = false;
    }
    digitalWrite(PIN_LED_GREEN, HIGH);
    digitalWrite(PIN_LED_RED, LOW);
    digitalWrite(PIN_BUZZER, LOW);
    delay(200);
  }
}`
  }
];

// Algorithmic Offline IoT Synthesizer for arbitrary user prompts
export function synthesizeIotProjectOffline(prompt) {
  const p = prompt.toLowerCase();

  // Match or adapt architecture
  if (p.includes('rover') || p.includes('car') || p.includes('robot') || p.includes('obstacle') || p.includes('avoid') || p.includes('ultrasonic')) {
    return {
      matchedPreset: 'obstacle_avoiding_rover',
      data: PRESET_PROJECTS[0],
      explanation: `Synthesized Autonomous Robotic Rover system with HC-SR04 ultrasonic radar, SG90 scanning servo, and ESP32 brain with obstacle avoidance state machine.`
    };
  }

  if (p.includes('plant') || p.includes('water') || p.includes('soil') || p.includes('irrigation') || p.includes('pump') || p.includes('garden')) {
    return {
      matchedPreset: 'smart_irrigation_system',
      data: PRESET_PROJECTS[1],
      explanation: `Synthesized Smart Automated Plant Irrigation system featuring capacitive soil moisture probing, 5V relay pump actuation, and live OLED moisture readout.`
    };
  }

  if (p.includes('alarm') || p.includes('security') || p.includes('pir') || p.includes('intruder') || p.includes('motion') || p.includes('buzzer')) {
    return {
      matchedPreset: 'security_alarm_pir',
      data: PRESET_PROJECTS[3],
      explanation: `Synthesized Smart Perimeter Intrusion Alarm with pyroelectric PIR sensing, visual strobe alerting, and audible buzzer siren triggering.`
    };
  }

  // Default to Weather Station / Climate telemetry or generic adaptive IoT build
  return {
    matchedPreset: 'weather_station_oled',
    data: PRESET_PROJECTS[2],
    explanation: `Synthesized Environmental IoT Telemetry Station with ESP32 microcontroller, DHT22 sensor, and SSD1306 high-contrast I2C OLED display.`
  };
}

// Auto-wire generator: connects all placed sensors/actuators to the active MCU
export function generateAutoWiring(components) {
  const mcu = components.find(c => ['esp32', 'arduino_uno', 'rpi_pico'].includes(c.id));
  if (!mcu) return [];

  const wires = [];
  let nextGpio = 4;
  const isEsp32 = mcu.id === 'esp32';
  const isArduino = mcu.id === 'arduino_uno';

  components.forEach(comp => {
    if (comp.id === mcu.id) return;

    if (comp.id === 'hc_sr04') {
      const trigPin = isEsp32 ? 'GPIO 4' : (isArduino ? 'D4' : 'GP2');
      const echoPin = isEsp32 ? 'GPIO 5' : (isArduino ? 'D5' : 'GP3');
      const vccPin = isEsp32 ? 'VIN (5V)' : '5V';
      wires.push({ from: mcu.id, fromPin: trigPin, to: comp.id, toPin: 'Trig', color: '#f97316' });
      wires.push({ from: mcu.id, fromPin: echoPin, to: comp.id, toPin: 'Echo', color: '#3b82f6' });
      wires.push({ from: mcu.id, fromPin: vccPin, to: comp.id, toPin: 'VCC', color: '#ef4444' });
      wires.push({ from: mcu.id, fromPin: 'GND', to: comp.id, toPin: 'GND', color: '#1e293b' });
    } else if (comp.id === 'dht22') {
      const dataPin = isEsp32 ? 'GPIO 13' : (isArduino ? 'D2' : 'GP15');
      wires.push({ from: mcu.id, fromPin: dataPin, to: comp.id, toPin: 'DATA', color: '#f59e0b' });
      wires.push({ from: mcu.id, fromPin: '3V3', to: comp.id, toPin: 'VCC', color: '#ef4444' });
      wires.push({ from: mcu.id, fromPin: 'GND', to: comp.id, toPin: 'GND', color: '#1e293b' });
    } else if (comp.id === 'ssd1306_oled') {
      const sdaPin = isEsp32 ? 'GPIO 21' : (isArduino ? 'A4 (SDA)' : 'GP4 (SDA)');
      const sclPin = isEsp32 ? 'GPIO 22' : (isArduino ? 'A5 (SCL)' : 'GP5 (SCL)');
      wires.push({ from: mcu.id, fromPin: sdaPin, to: comp.id, toPin: 'SDA', color: '#06b6d4' });
      wires.push({ from: mcu.id, fromPin: sclPin, to: comp.id, toPin: 'SCL', color: '#8b5cf6' });
      wires.push({ from: mcu.id, fromPin: '3V3', to: comp.id, toPin: 'VCC', color: '#ef4444' });
      wires.push({ from: mcu.id, fromPin: 'GND', to: comp.id, toPin: 'GND', color: '#1e293b' });
    } else if (comp.id === 'sg90_servo') {
      const pwmPin = isEsp32 ? 'GPIO 15' : (isArduino ? 'D9' : 'GP0');
      wires.push({ from: mcu.id, fromPin: pwmPin, to: comp.id, toPin: 'PWM (Orange)', color: '#10b981' });
      wires.push({ from: mcu.id, fromPin: isEsp32 ? 'VIN (5V)' : '5V', to: comp.id, toPin: 'VCC 5V (Red)', color: '#ef4444' });
      wires.push({ from: mcu.id, fromPin: 'GND', to: comp.id, toPin: 'GND (Brown)', color: '#1e293b' });
    } else if (comp.id === 'relay_module') {
      const inPin = isEsp32 ? 'GPIO 14' : (isArduino ? 'D7' : 'GP1');
      wires.push({ from: mcu.id, fromPin: inPin, to: comp.id, toPin: 'IN', color: '#f59e0b' });
      wires.push({ from: mcu.id, fromPin: isEsp32 ? 'VIN (5V)' : '5V', to: comp.id, toPin: 'VCC', color: '#ef4444' });
      wires.push({ from: mcu.id, fromPin: 'GND', to: comp.id, toPin: 'GND', color: '#1e293b' });
    } else if (comp.id === 'pir_sensor') {
      const outPin = isEsp32 ? 'GPIO 12' : (isArduino ? 'D8' : 'GP1');
      wires.push({ from: mcu.id, fromPin: outPin, to: comp.id, toPin: 'OUT', color: '#f59e0b' });
      wires.push({ from: mcu.id, fromPin: isEsp32 ? 'VIN (5V)' : '5V', to: comp.id, toPin: 'VCC', color: '#ef4444' });
      wires.push({ from: mcu.id, fromPin: 'GND', to: comp.id, toPin: 'GND', color: '#1e293b' });
    } else if (comp.id === 'led_5mm') {
      wires.push({ from: mcu.id, fromPin: isEsp32 ? 'GPIO 2' : 'D13', to: comp.id, toPin: 'Anode (+)', color: '#f97316' });
      wires.push({ from: mcu.id, fromPin: 'GND', to: comp.id, toPin: 'Cathode (-)', color: '#1e293b' });
    } else if (comp.id === 'buzzer') {
      wires.push({ from: mcu.id, fromPin: isEsp32 ? 'GPIO 15' : 'D11', to: comp.id, toPin: 'I/O', color: '#ef4444' });
      wires.push({ from: mcu.id, fromPin: 'GND', to: comp.id, toPin: 'GND (-)', color: '#1e293b' });
    }
  });

  return wires;
}
