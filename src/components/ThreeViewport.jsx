import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default function ThreeViewport({
  components,
  wires,
  selectedComponentId,
  onSelectComponent,
  activeTool,
  simState,
  isSimulating,
  isDarkTheme,
  showGrid = true,
  showAxes = true
}) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const objectsMapRef = useRef(new Map());
  const wiresGroupRef = useRef(null);
  const oledTextureCanvasRef = useRef(null);
  const oledTextureRef = useRef(null);
  const servoHornRef = useRef(null);
  const ledLightRef = useRef(null);
  const gridHelperRef = useRef(null);
  const axesHelperRef = useRef(null);

  // Initialize Three.js Scene
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(isDarkTheme ? 0x090d16 : 0xf8fafc);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(70, 80, 100);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.target.set(0, 5, 0);
    controls.maxPolarAngle = Math.PI / 2 - 0.02; // Don't go below ground
    controls.minDistance = 10;
    controls.maxDistance = 350;
    controlsRef.current = controls;

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(isDarkTheme ? 0x223344 : 0xffffff, isDarkTheme ? 0.7 : 0.9);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(60, 120, 80);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 10;
    dirLight.shadow.camera.far = 300;
    dirLight.shadow.camera.left = -90;
    dirLight.shadow.camera.right = 90;
    dirLight.shadow.camera.top = 90;
    dirLight.shadow.camera.bottom = -90;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.35);
    fillLight.position.set(-60, 40, -60);
    scene.add(fillLight);

    // 6. 3D Grid Floor
    const gridHelper = new THREE.GridHelper(160, 32, 0xf97316, isDarkTheme ? 0x1e293b : 0xcbd5e1);
    gridHelper.position.y = -0.05;
    scene.add(gridHelper);
    gridHelperRef.current = gridHelper;

    // 7. Ground shadow receiver plane
    const groundGeo = new THREE.PlaneGeometry(300, 300);
    const groundMat = new THREE.ShadowMaterial({ opacity: isDarkTheme ? 0.4 : 0.15 });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = -0.1;
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);

    // 8. Coordinate Axes
    const axesHelper = new THREE.AxesHelper(20);
    axesHelper.position.set(-75, 0.1, -75);
    scene.add(axesHelper);
    axesHelperRef.current = axesHelper;

    // 9. Jumper wires container group
    const wiresGroup = new THREE.Group();
    scene.add(wiresGroup);
    wiresGroupRef.current = wiresGroup;

    // Raycasting for clicking objects
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const interactables = [];
      objectsMapRef.current.forEach((mesh) => interactables.push(mesh));

      const intersects = raycaster.intersectObjects(interactables, true);
      if (intersects.length > 0) {
        // Find top-level registered component
        let hit = intersects[0].object;
        while (hit && !hit.userData?.componentId && hit.parent) {
          hit = hit.parent;
        }
        if (hit && hit.userData?.componentId) {
          onSelectComponent(hit.userData.componentId);
        }
      } else {
        onSelectComponent(null);
      }
    };

    renderer.domElement.addEventListener('pointerdown', handleClick);

    // Handle Window Resize
    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Render Animation Loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', handleClick);
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update Theme Colors & Grid
  useEffect(() => {
    if (!sceneRef.current) return;
    sceneRef.current.background = new THREE.Color(isDarkTheme ? 0x090d16 : 0xf8fafc);
    if (gridHelperRef.current) {
      gridHelperRef.current.visible = showGrid;
    }
    if (axesHelperRef.current) {
      axesHelperRef.current.visible = showAxes;
    }
  }, [isDarkTheme, showGrid, showAxes]);

  // Build / Update Procedural 3D Components
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Clean old components
    objectsMapRef.current.forEach((obj) => scene.remove(obj));
    objectsMapRef.current.clear();

    components.forEach((comp) => {
      const group = createProceduralComponent(comp, isDarkTheme);
      group.position.set(comp.pos[0], comp.pos[1], comp.pos[2]);
      group.rotation.set(comp.rot[0], comp.rot[1], comp.rot[2]);
      group.userData = { componentId: comp.id };

      // Highlight selected
      if (comp.id === selectedComponentId) {
        const bbox = new THREE.BoxHelper(group, 0xf97316);
        group.add(bbox);
      }

      scene.add(group);
      objectsMapRef.current.set(comp.id, group);

      // Save references for live animation
      if (comp.id === 'sg90_servo') {
        servoHornRef.current = group.userData.servoHorn;
      }
      if (comp.id === 'ssd1306_oled') {
        oledTextureRef.current = group.userData.oledTexture;
        oledTextureCanvasRef.current = group.userData.oledCanvas;
      }
      if (comp.id === 'led_5mm' || comp.id === 'rgb_led') {
        ledLightRef.current = group.userData.pointLight;
      }
    });
  }, [components, selectedComponentId, isDarkTheme]);

  // Build / Update Jumper Wires
  useEffect(() => {
    const wiresGroup = wiresGroupRef.current;
    if (!wiresGroup) return;

    while (wiresGroup.children.length > 0) {
      wiresGroup.remove(wiresGroup.children[0]);
    }

    wires.forEach((wire) => {
      const fromObj = objectsMapRef.current.get(wire.from);
      const toObj = objectsMapRef.current.get(wire.to);
      if (!fromObj || !toObj) return;

      const p1 = fromObj.position.clone().add(new THREE.Vector3(0, 2, 0));
      const p2 = toObj.position.clone().add(new THREE.Vector3(0, 2, 0));
      
      // Calculate smooth sagging curve
      const mid = p1.clone().lerp(p2, 0.5);
      mid.y += Math.max(8, p1.distanceTo(p2) * 0.25);

      const curve = new THREE.CatmullRomCurve3([p1, mid, p2]);
      const tubeGeo = new THREE.TubeGeometry(curve, 24, 0.55, 8, false);
      const tubeMat = new THREE.MeshStandardMaterial({
        color: wire.color || 0xf97316,
        roughness: 0.35,
        metalness: 0.1
      });
      const wireMesh = new THREE.Mesh(tubeGeo, tubeMat);
      wireMesh.castShadow = true;
      wiresGroup.add(wireMesh);
    });
  }, [wires, components]);

  // Simulation Updates (Servo rotation, LED glow, OLED display screen)
  useEffect(() => {
    if (!isSimulating) return;

    // 1. Servo Motor Dynamic Rotation
    if (servoHornRef.current && simState.servoAngle !== undefined) {
      const rad = THREE.MathUtils.degToRad(simState.servoAngle - 90);
      servoHornRef.current.rotation.y = rad;
    }

    // 2. LED Light Pulse / Glow
    if (ledLightRef.current) {
      ledLightRef.current.intensity = simState.ledActive ? 2.5 : 0;
    }

    // 3. Dynamic OLED Screen Canvas Texture
    if (oledTextureCanvasRef.current && oledTextureRef.current) {
      const canvas = oledTextureCanvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#050811';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 16px "JetBrains Mono", monospace';
      ctx.fillText('Constructa IoT', 10, 22);

      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(10, 28);
      ctx.lineTo(246, 28);
      ctx.stroke();

      ctx.font = '14px "JetBrains Mono", monospace';
      ctx.fillStyle = '#f8fafc';
      ctx.fillText(`Dist : ${simState.distanceCm || 24} cm`, 10, 52);
      ctx.fillText(`Temp : ${simState.temperature || 24.5} C`, 10, 74);
      ctx.fillText(`Soil : ${simState.moisture || 45} %`, 10, 96);
      ctx.fillText(`Mode : ${simState.statusText || 'ACTIVE RUN'}`, 10, 118);

      oledTextureRef.current.needsUpdate = true;
    }
  }, [simState, isSimulating]);

  // Camera Orientation Snapping (ViewCube actions)
  const snapCamera = (view) => {
    if (!cameraRef.current || !controlsRef.current) return;
    const cam = cameraRef.current;
    const ctrl = controlsRef.current;

    switch (view) {
      case 'top':
        cam.position.set(0, 140, 0.001);
        ctrl.target.set(0, 0, 0);
        break;
      case 'front':
        cam.position.set(0, 20, 130);
        ctrl.target.set(0, 10, 0);
        break;
      case 'right':
        cam.position.set(130, 20, 0);
        ctrl.target.set(0, 10, 0);
        break;
      case 'iso':
      default:
        cam.position.set(70, 80, 100);
        ctrl.target.set(0, 5, 0);
        break;
    }
    cam.lookAt(ctrl.target);
    ctrl.update();
  };

  return (
    <div className="canvas-container" ref={mountRef}>
      {/* 3D ViewCube in Top Right */}
      <div className="viewcube-wrapper">
        <div className="viewcube-box" title="Click to reset Isometric Perspective" onClick={() => snapCamera('iso')}>
          <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--brand-orange)' }}>ISO</span>
        </div>
        <div style={{ display: 'flex', gap: '3px' }}>
          <button className="subtab-btn" style={{ padding: '2px 5px', fontSize: '10px' }} onClick={() => snapCamera('top')}>TOP</button>
          <button className="subtab-btn" style={{ padding: '2px 5px', fontSize: '10px' }} onClick={() => snapCamera('front')}>FRNT</button>
          <button className="subtab-btn" style={{ padding: '2px 5px', fontSize: '10px' }} onClick={() => snapCamera('right')}>RGHT</button>
        </div>
      </div>

      {/* Empty Scene Guide */}
      {components.length === 0 && (
        <div className="empty-scene-overlay">
          <h3>Your scene is ready</h3>
          <p>
            Pick a component from <span className="highlight">CAD / ELEC</span> or use the{' '}
            <span className="highlight">AI Copilot</span> to build a complete IoT project instantly without token limits.
          </p>
        </div>
      )}

      {/* Canvas Bottom Helper */}
      <div className="canvas-bottom-helper">
        Left-drag to Orbit · Right-drag to Pan · Wheel to Zoom · Click object to Select
      </div>
    </div>
  );
}

// Procedural 3D Mesh Generator for all components
function createProceduralComponent(comp, isDarkTheme) {
  const group = new THREE.Group();

  switch (comp.id) {
    case 'esp32': {
      // PCB Board
      const pcbGeo = new THREE.BoxGeometry(52, 2.5, 28);
      const pcbMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.4 });
      const pcb = new THREE.Mesh(pcbGeo, pcbMat);
      pcb.castShadow = true;
      group.add(pcb);

      // Metal RF Shield
      const shieldGeo = new THREE.BoxGeometry(18, 2, 18);
      const shieldMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.85, roughness: 0.2 });
      const shield = new THREE.Mesh(shieldGeo, shieldMat);
      shield.position.set(-8, 2, 0);
      shield.castShadow = true;
      group.add(shield);

      // Gold PCB Antenna Traces
      const antGeo = new THREE.BoxGeometry(10, 0.4, 24);
      const antMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.9, roughness: 0.1 });
      const ant = new THREE.Mesh(antGeo, antMat);
      ant.position.set(20, 1.4, 0);
      group.add(ant);

      // Dual Pin Headers
      const pinHeaderGeo = new THREE.BoxGeometry(46, 5, 2.5);
      const pinMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5 });
      const headerTop = new THREE.Mesh(pinHeaderGeo, pinMat);
      headerTop.position.set(0, 3, 12);
      group.add(headerTop);
      const headerBottom = new THREE.Mesh(pinHeaderGeo, pinMat);
      headerBottom.position.set(0, 3, -12);
      group.add(headerBottom);

      // Micro USB Port
      const usbGeo = new THREE.BoxGeometry(6, 3, 8);
      const usbMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.2 });
      const usb = new THREE.Mesh(usbGeo, usbMat);
      usb.position.set(-25, 2, 0);
      group.add(usb);

      // Onboard status LED
      const ledGeo = new THREE.BoxGeometry(1.5, 1, 1.5);
      const ledMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.8 });
      const statusLed = new THREE.Mesh(ledGeo, ledMat);
      statusLed.position.set(-15, 1.8, 8);
      group.add(statusLed);
      break;
    }

    case 'arduino_uno': {
      // Classic Blue PCB
      const pcbGeo = new THREE.BoxGeometry(68, 3, 53);
      const pcbMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.4 });
      const pcb = new THREE.Mesh(pcbGeo, pcbMat);
      pcb.castShadow = true;
      group.add(pcb);

      // Silver USB Type-B Port
      const usbGeo = new THREE.BoxGeometry(14, 11, 12);
      const usbMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.2 });
      const usb = new THREE.Mesh(usbGeo, usbMat);
      usb.position.set(-27, 7, 16);
      usb.castShadow = true;
      group.add(usb);

      // Black DC Jack
      const dcGeo = new THREE.BoxGeometry(14, 10, 10);
      const dcMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.6 });
      const dcJack = new THREE.Mesh(dcGeo, dcMat);
      dcJack.position.set(-27, 6, -18);
      group.add(dcJack);

      // ATmega328P DIP-28 Chip
      const chipGeo = new THREE.BoxGeometry(34, 3, 8);
      const chipMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 });
      const chip = new THREE.Mesh(chipGeo, chipMat);
      chip.position.set(10, 2.5, -5);
      group.add(chip);

      // Pin Headers
      const headerMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });
      const headerTop = new THREE.Mesh(new THREE.BoxGeometry(45, 8, 3), headerMat);
      headerTop.position.set(8, 5, 24);
      group.add(headerTop);
      const headerBottom = new THREE.Mesh(new THREE.BoxGeometry(50, 8, 3), headerMat);
      headerBottom.position.set(5, 5, -24);
      group.add(headerBottom);
      break;
    }

    case 'hc_sr04': {
      // Blue PCB
      const pcbGeo = new THREE.BoxGeometry(45, 20, 2);
      const pcbMat = new THREE.MeshStandardMaterial({ color: 0x0284c7 });
      const pcb = new THREE.Mesh(pcbGeo, pcbMat);
      pcb.castShadow = true;
      group.add(pcb);

      // Two Aluminum Ultrasonic Transducer Cylinders
      const canGeo = new THREE.CylinderGeometry(8, 8, 12, 24);
      const canMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.8, roughness: 0.2 });

      const txCan = new THREE.Mesh(canGeo, canMat);
      txCan.rotation.x = Math.PI / 2;
      txCan.position.set(-11, 0, 7);
      txCan.castShadow = true;
      group.add(txCan);

      const rxCan = new THREE.Mesh(canGeo, canMat);
      rxCan.rotation.x = Math.PI / 2;
      rxCan.position.set(11, 0, 7);
      rxCan.castShadow = true;
      group.add(rxCan);

      // 4 gold connector pins
      const pinMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.9 });
      for (let i = 0; i < 4; i++) {
        const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 6, 8), pinMat);
        pin.position.set(-6 + i * 4, -12, 0);
        group.add(pin);
      }
      break;
    }

    case 'dht22': {
      // White slotted plastic case
      const caseGeo = new THREE.BoxGeometry(15, 20, 8);
      const caseMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5 });
      const dhtCase = new THREE.Mesh(caseGeo, caseMat);
      dhtCase.castShadow = true;
      group.add(dhtCase);

      // Front air slot indentations
      const slotMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1 });
      for (let i = -3; i <= 3; i++) {
        const slot = new THREE.Mesh(new THREE.BoxGeometry(10, 0.8, 0.4), slotMat);
        slot.position.set(0, i * 2.2, 4.1);
        group.add(slot);
      }
      break;
    }

    case 'pir_sensor': {
      // Green PCB base
      const pcb = new THREE.Mesh(new THREE.BoxGeometry(32, 2, 24), new THREE.MeshStandardMaterial({ color: 0x15803d }));
      pcb.castShadow = true;
      group.add(pcb);

      // White Fresnel Lens Dome
      const domeGeo = new THREE.SphereGeometry(11, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2);
      const domeMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3, transparent: true, opacity: 0.9 });
      const dome = new THREE.Mesh(domeGeo, domeMat);
      dome.position.set(0, 1, 0);
      dome.castShadow = true;
      group.add(dome);
      break;
    }

    case 'sg90_servo': {
      // Translucent Blue Body
      const bodyGeo = new THREE.BoxGeometry(23, 24, 12);
      const bodyMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, transparent: true, opacity: 0.88, roughness: 0.3 });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.castShadow = true;
      group.add(body);

      // Mounting ears
      const earGeo = new THREE.BoxGeometry(32, 2.5, 12);
      const ear = new THREE.Mesh(earGeo, bodyMat);
      ear.position.set(0, 6, 0);
      group.add(ear);

      // Rotating Gear Output Cylinder & White Horn
      const hornGroup = new THREE.Group();
      hornGroup.position.set(6, 12, 0);

      const shaft = new THREE.Mesh(
        new THREE.CylinderGeometry(2.5, 2.5, 5, 16),
        new THREE.MeshStandardMaterial({ color: 0xf8fafc })
      );
      shaft.position.y = 2.5;
      hornGroup.add(shaft);

      const arm = new THREE.Mesh(
        new THREE.BoxGeometry(18, 1.5, 4),
        new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 })
      );
      arm.position.set(6, 5, 0);
      arm.castShadow = true;
      hornGroup.add(arm);

      group.add(hornGroup);
      group.userData.servoHorn = hornGroup;
      break;
    }

    case 'ssd1306_oled': {
      // PCB Base
      const pcb = new THREE.Mesh(
        new THREE.BoxGeometry(27, 27, 2),
        new THREE.MeshStandardMaterial({ color: 0x0f172a })
      );
      pcb.castShadow = true;
      group.add(pcb);

      // Dynamic Canvas Texture for live OLED readout
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#050811';
      ctx.fillRect(0, 0, 256, 128);
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 20px monospace';
      ctx.fillText('Constructa OLED', 16, 40);

      const oledTexture = new THREE.CanvasTexture(canvas);
      const screenMat = new THREE.MeshBasicMaterial({ map: oledTexture });
      const screen = new THREE.Mesh(new THREE.PlaneGeometry(22, 14), screenMat);
      screen.position.set(0, 0, 1.1);
      group.add(screen);

      group.userData.oledCanvas = canvas;
      group.userData.oledTexture = oledTexture;
      break;
    }

    case 'relay_module': {
      // Blue Songle Relay Box
      const pcb = new THREE.Mesh(new THREE.BoxGeometry(45, 2, 25), new THREE.MeshStandardMaterial({ color: 0x0284c7 }));
      pcb.castShadow = true;
      group.add(pcb);

      const cube = new THREE.Mesh(
        new THREE.BoxGeometry(19, 15, 15),
        new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3 })
      );
      cube.position.set(-6, 8, 0);
      cube.castShadow = true;
      group.add(cube);

      // Green Terminal Block
      const term = new THREE.Mesh(
        new THREE.BoxGeometry(10, 10, 18),
        new THREE.MeshStandardMaterial({ color: 0x16a34a })
      );
      term.position.set(16, 6, 0);
      group.add(term);
      break;
    }

    case 'led_5mm':
    case 'rgb_led': {
      // Colored LED Dome
      const domeGeo = new THREE.SphereGeometry(3, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
      const domeMat = new THREE.MeshStandardMaterial({
        color: comp.color || 0xf97316,
        emissive: comp.color || 0xf97316,
        emissiveIntensity: 0.6,
        roughness: 0.2
      });
      const dome = new THREE.Mesh(domeGeo, domeMat);
      dome.position.y = 5;
      group.add(dome);

      // Cylinder base
      const cyl = new THREE.Mesh(
        new THREE.CylinderGeometry(3, 3, 5, 16),
        domeMat
      );
      cyl.position.y = 2.5;
      group.add(cyl);

      // Dynamic light source
      const pLight = new THREE.PointLight(comp.color || 0xf97316, 0, 40);
      pLight.position.set(0, 6, 0);
      group.add(pLight);
      group.userData.pointLight = pLight;
      break;
    }

    case 'breadboard_half': {
      // Half-size breadboard
      const bbGeo = new THREE.BoxGeometry(85, 8, 55);
      const bbMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.6 });
      const bb = new THREE.Mesh(bbGeo, bbMat);
      bb.castShadow = true;
      bb.receiveShadow = true;
      group.add(bb);

      // Center Divider Trench
      const trench = new THREE.Mesh(
        new THREE.BoxGeometry(80, 1.5, 4),
        new THREE.MeshStandardMaterial({ color: 0xcbd5e1 })
      );
      trench.position.set(0, 4, 0);
      group.add(trench);
      break;
    }

    case 'cad_enclosure': {
      // Custom 3D Enclosure Box
      const encGeo = new THREE.BoxGeometry(90, 32, 65);
      const encMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.35, metalness: 0.1 });
      const enc = new THREE.Mesh(encGeo, encMat);
      enc.castShadow = true;
      group.add(enc);
      break;
    }

    default: {
      // Generic CAD solid or part
      const defaultGeo = new THREE.BoxGeometry(
        comp.dimensions?.x || 25,
        comp.dimensions?.y || 25,
        comp.dimensions?.z || 25
      );
      const defaultMat = new THREE.MeshStandardMaterial({
        color: comp.color || 0x94a3b8,
        roughness: 0.4
      });
      const mesh = new THREE.Mesh(defaultGeo, defaultMat);
      mesh.castShadow = true;
      group.add(mesh);
      break;
    }
  }

  return group;
}
