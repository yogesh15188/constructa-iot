// Component Catalog for Constructa 3D IoT Workbench

export const COMPONENT_CATEGORIES = {
  MCU: 'Microcontrollers',
  SENSOR: 'Sensors',
  ACTUATOR: 'Actuators & Outputs',
  PROTOTYPING: 'Prototyping',
  CAD_SHAPES: '3D CAD Solids'
};

export const CATALOG_ITEMS = [
  // Microcontrollers
  {
    id: 'esp32',
    name: 'ESP32-WROOM-32',
    category: COMPONENT_CATEGORIES.MCU,
    desc: 'Dual-core 240MHz, WiFi & BLE, 30 GPIOs, 3.3V logic',
    dimensions: { x: 52, y: 5, z: 28 }, // mm
    color: '#1e293b',
    pins: [
      { name: '3V3', type: 'power', voltage: 3.3 },
      { name: 'GND', type: 'ground', voltage: 0 },
      { name: 'GPIO 2', type: 'digital', hasPwm: true },
      { name: 'GPIO 4', type: 'digital', hasPwm: true, hasAdc: true },
      { name: 'GPIO 5', type: 'digital', hasPwm: true },
      { name: 'GPIO 12', type: 'digital', hasPwm: true, hasAdc: true },
      { name: 'GPIO 13', type: 'digital', hasPwm: true, hasAdc: true },
      { name: 'GPIO 14', type: 'digital', hasPwm: true, hasAdc: true },
      { name: 'GPIO 15', type: 'digital', hasPwm: true },
      { name: 'GPIO 18', type: 'digital', spi: 'SCK' },
      { name: 'GPIO 19', type: 'digital', spi: 'MISO' },
      { name: 'GPIO 21', type: 'digital', i2c: 'SDA' },
      { name: 'GPIO 22', type: 'digital', i2c: 'SCL' },
      { name: 'GPIO 23', type: 'digital', spi: 'MOSI' },
      { name: 'VIN (5V)', type: 'power', voltage: 5.0 }
    ]
  },
  {
    id: 'arduino_uno',
    name: 'Arduino Uno R3',
    category: COMPONENT_CATEGORIES.MCU,
    desc: 'ATmega328P, 16MHz, 14 Digital I/O, 6 Analog Inputs, 5V logic',
    dimensions: { x: 68, y: 12, z: 53 },
    color: '#0284c7',
    pins: [
      { name: '5V', type: 'power', voltage: 5.0 },
      { name: '3V3', type: 'power', voltage: 3.3 },
      { name: 'GND', type: 'ground', voltage: 0 },
      { name: 'D2', type: 'digital' },
      { name: 'D3', type: 'digital', hasPwm: true },
      { name: 'D4', type: 'digital' },
      { name: 'D5', type: 'digital', hasPwm: true },
      { name: 'D6', type: 'digital', hasPwm: true },
      { name: 'D7', type: 'digital' },
      { name: 'D8', type: 'digital' },
      { name: 'D9', type: 'digital', hasPwm: true },
      { name: 'D10', type: 'digital', hasPwm: true },
      { name: 'D11', type: 'digital', hasPwm: true },
      { name: 'D12', type: 'digital' },
      { name: 'D13', type: 'digital' },
      { name: 'A0', type: 'analog' },
      { name: 'A1', type: 'analog' },
      { name: 'A4 (SDA)', type: 'analog', i2c: 'SDA' },
      { name: 'A5 (SCL)', type: 'analog', i2c: 'SCL' }
    ]
  },
  {
    id: 'rpi_pico',
    name: 'Raspberry Pi Pico',
    category: COMPONENT_CATEGORIES.MCU,
    desc: 'RP2040 Dual ARM Cortex-M0+, 26 Multi-function GPIOs, 3.3V',
    dimensions: { x: 51, y: 4, z: 21 },
    color: '#15803d',
    pins: [
      { name: '3V3', type: 'power', voltage: 3.3 },
      { name: 'GND', type: 'ground', voltage: 0 },
      { name: 'GP0', type: 'digital' },
      { name: 'GP1', type: 'digital' },
      { name: 'GP2', type: 'digital' },
      { name: 'GP3', type: 'digital' },
      { name: 'GP4 (SDA)', type: 'digital', i2c: 'SDA' },
      { name: 'GP5 (SCL)', type: 'digital', i2c: 'SCL' },
      { name: 'GP15', type: 'digital' },
      { name: 'GP26 (ADC0)', type: 'analog' },
      { name: 'VBUS (5V)', type: 'power', voltage: 5.0 }
    ]
  },

  // Sensors
  {
    id: 'hc_sr04',
    name: 'Ultrasonic Sensor (HC-SR04)',
    category: COMPONENT_CATEGORIES.SENSOR,
    desc: 'Sonar distance measurement: 2cm - 400cm, 15° beam angle',
    dimensions: { x: 45, y: 20, z: 15 },
    color: '#0284c7',
    pins: [
      { name: 'VCC', type: 'power', voltage: 5.0 },
      { name: 'Trig', type: 'digital_in' },
      { name: 'Echo', type: 'digital_out' },
      { name: 'GND', type: 'ground', voltage: 0 }
    ]
  },
  {
    id: 'dht22',
    name: 'DHT22 Temp & Humidity',
    category: COMPONENT_CATEGORIES.SENSOR,
    desc: 'High precision: -40 to 80°C (±0.5°C), 0-100% RH (±2%)',
    dimensions: { x: 25, y: 15, z: 8 },
    color: '#f8fafc',
    pins: [
      { name: 'VCC', type: 'power', voltage: 3.3 },
      { name: 'DATA', type: 'digital_io' },
      { name: 'NC', type: 'no_connect' },
      { name: 'GND', type: 'ground', voltage: 0 }
    ]
  },
  {
    id: 'pir_sensor',
    name: 'PIR Motion Sensor (HC-SR501)',
    category: COMPONENT_CATEGORIES.SENSOR,
    desc: 'Infrared human motion detection up to 7 meters',
    dimensions: { x: 32, y: 24, z: 25 },
    color: '#f1f5f9',
    pins: [
      { name: 'VCC', type: 'power', voltage: 5.0 },
      { name: 'OUT', type: 'digital_out' },
      { name: 'GND', type: 'ground', voltage: 0 }
    ]
  },
  {
    id: 'soil_moisture',
    name: 'Soil Moisture Sensor',
    category: COMPONENT_CATEGORIES.SENSOR,
    desc: 'Capacitive / resistive soil moisture probe with analog out',
    dimensions: { x: 60, y: 20, z: 5 },
    color: '#334155',
    pins: [
      { name: 'VCC', type: 'power', voltage: 3.3 },
      { name: 'GND', type: 'ground', voltage: 0 },
      { name: 'AOUT', type: 'analog_out' },
      { name: 'DOUT', type: 'digital_out' }
    ]
  },
  {
    id: 'ldr_light',
    name: 'LDR Ambient Light Sensor',
    category: COMPONENT_CATEGORIES.SENSOR,
    desc: 'Photoresistor light intensity sensor with LM393 comparator',
    dimensions: { x: 32, y: 14, z: 8 },
    color: '#047857',
    pins: [
      { name: 'VCC', type: 'power', voltage: 3.3 },
      { name: 'GND', type: 'ground', voltage: 0 },
      { name: 'DO', type: 'digital_out' },
      { name: 'AO', type: 'analog_out' }
    ]
  },

  // Actuators & Outputs
  {
    id: 'sg90_servo',
    name: 'SG90 Micro Servo',
    category: COMPONENT_CATEGORIES.ACTUATOR,
    desc: '9g 180° positional rotation servo motor, 4.8V-6V',
    dimensions: { x: 23, y: 28, z: 12 },
    color: '#2563eb',
    pins: [
      { name: 'PWM (Orange)', type: 'pwm_in' },
      { name: 'VCC 5V (Red)', type: 'power', voltage: 5.0 },
      { name: 'GND (Brown)', type: 'ground', voltage: 0 }
    ]
  },
  {
    id: 'ssd1306_oled',
    name: '0.96" I2C OLED Display',
    category: COMPONENT_CATEGORIES.ACTUATOR,
    desc: '128x64 pixels, monochrome blue/white, I2C address 0x3C',
    dimensions: { x: 27, y: 27, z: 4 },
    color: '#0f172a',
    pins: [
      { name: 'GND', type: 'ground', voltage: 0 },
      { name: 'VCC', type: 'power', voltage: 3.3 },
      { name: 'SCL', type: 'i2c_clock' },
      { name: 'SDA', type: 'i2c_data' }
    ]
  },
  {
    id: 'relay_module',
    name: '5V Single Relay Module',
    category: COMPONENT_CATEGORIES.ACTUATOR,
    desc: 'Optocoupled 10A 250VAC switching relay for AC/DC appliances',
    dimensions: { x: 50, y: 25, z: 18 },
    color: '#0284c7',
    pins: [
      { name: 'VCC', type: 'power', voltage: 5.0 },
      { name: 'GND', type: 'ground', voltage: 0 },
      { name: 'IN', type: 'digital_in' }
    ]
  },
  {
    id: 'rgb_led',
    name: 'RGB LED (Common Cathode)',
    category: COMPONENT_CATEGORIES.ACTUATOR,
    desc: 'Full color 5mm diffuse LED, individual R, G, B pins',
    dimensions: { x: 8, y: 12, z: 8 },
    color: '#f8fafc',
    pins: [
      { name: 'Red', type: 'pwm_in' },
      { name: 'Cathode (GND)', type: 'ground', voltage: 0 },
      { name: 'Green', type: 'pwm_in' },
      { name: 'Blue', type: 'pwm_in' }
    ]
  },
  {
    id: 'led_5mm',
    name: 'LED 5mm (Orange Indicator)',
    category: COMPONENT_CATEGORIES.ACTUATOR,
    desc: 'Bright diffused indicator LED',
    dimensions: { x: 6, y: 10, z: 6 },
    color: '#f97316',
    pins: [
      { name: 'Anode (+)', type: 'digital_in' },
      { name: 'Cathode (-)', type: 'ground', voltage: 0 }
    ]
  },
  {
    id: 'buzzer',
    name: 'Active Buzzer Module',
    category: COMPONENT_CATEGORIES.ACTUATOR,
    desc: 'Continuous audible 2.5kHz alarm tone on high trigger',
    dimensions: { x: 12, y: 10, z: 12 },
    color: '#0f172a',
    pins: [
      { name: 'VCC (+)', type: 'power', voltage: 3.3 },
      { name: 'I/O', type: 'digital_in' },
      { name: 'GND (-)', type: 'ground', voltage: 0 }
    ]
  },

  // Prototyping
  {
    id: 'breadboard_half',
    name: 'Half-Size Breadboard (400 Tie)',
    category: COMPONENT_CATEGORIES.PROTOTYPING,
    desc: '400 contact points, dual power buses, solderless prototyping',
    dimensions: { x: 85, y: 10, z: 55 },
    color: '#f8fafc'
  },

  // 3D CAD Shapes & Robotics Parts
  {
    id: 'cad_enclosure',
    name: 'IoT Device Enclosure Box',
    category: COMPONENT_CATEGORIES.CAD_SHAPES,
    desc: 'Custom snap-fit enclosure with sensor and USB cutouts',
    dimensions: { x: 90, y: 35, z: 70 },
    color: '#f97316'
  },
  {
    id: 'cad_cube',
    name: 'Solid Box / Standoff',
    category: COMPONENT_CATEGORIES.CAD_SHAPES,
    desc: 'Parametric rectangular solid for mounts, spacers, brackets',
    dimensions: { x: 30, y: 30, z: 30 },
    color: '#94a3b8'
  },
  {
    id: 'cad_cylinder',
    name: 'Cylinder / Shaft',
    category: COMPONENT_CATEGORIES.CAD_SHAPES,
    desc: 'Round post, wheel axle, or spacer column',
    dimensions: { x: 20, y: 30, z: 20 },
    color: '#64748b'
  },
  {
    id: 'cad_chassis',
    name: '2WD Robot Chassis Plate',
    category: COMPONENT_CATEGORIES.CAD_SHAPES,
    desc: 'Dual DC motor acrylic baseplate with caster mounting holes',
    dimensions: { x: 120, y: 4, z: 90 },
    color: '#1e293b'
  }
];
