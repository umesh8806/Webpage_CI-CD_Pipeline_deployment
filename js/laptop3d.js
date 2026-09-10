/**
 * LAPTOP3D.JS - Three.js 3D Laptop with Dynamic Interactive Screen Canvas
 */
(function() {
  const canvas = document.getElementById('three-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const container = canvas.parentElement;
  if (!container) return;

  // Scene & Camera
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.set(0, 0.5, 6);
  camera.lookAt(0, 0, 0);

  // Renderer
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
  } catch (err) {
    console.warn('WebGL is not supported or initialization failed:', err);
    return;
  }

  // Handle Resize
  function resizeRenderer() {
    if (!container || !renderer) return;
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (w === 0 || h === 0) return;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resizeRenderer, { passive: true });

  // Laptop Group
  const laptop = new THREE.Group();

  // Materials
  const baseMat = new THREE.MeshStandardMaterial({ color: 0x141418, metalness: 0.85, roughness: 0.3 });
  const kbMat = new THREE.MeshStandardMaterial({ color: 0x050508, metalness: 0.9, roughness: 0.5 });
  const tpMat = new THREE.MeshStandardMaterial({ color: 0x1f1f28, metalness: 0.8, roughness: 0.35 });
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x141418, metalness: 0.8, roughness: 0.35 });

  // 1. Base / Keyboard plate
  const baseGeom = new THREE.BoxGeometry(4.6, 0.15, 3.1);
  const base = new THREE.Mesh(baseGeom, baseMat);
  base.position.y = -1;
  base.rotation.x = -Math.PI / 12;
  laptop.add(base);

  // 2. Keyboard recess
  const kbGeom = new THREE.BoxGeometry(4.1, 0.02, 1.55);
  const keyboard = new THREE.Mesh(kbGeom, kbMat);
  keyboard.position.set(0, 0.08, 0.3);
  keyboard.rotation.x = -Math.PI / 12;
  laptop.add(keyboard);

  // 3. Trackpad
  const tpGeom = new THREE.BoxGeometry(1.6, 0.015, 0.85);
  const trackpad = new THREE.Mesh(tpGeom, tpMat);
  trackpad.position.set(0, 0.09, 1.35);
  trackpad.rotation.x = -Math.PI / 12;
  laptop.add(trackpad);

  // 4. Screen frame
  const screenFrameGeom = new THREE.BoxGeometry(4.6, 2.9, 0.12);
  const screenFrame = new THREE.Mesh(screenFrameGeom, frameMat);
  screenFrame.position.set(0, 0.45, -1.4);
  screenFrame.rotation.x = -Math.PI / 8;
  laptop.add(screenFrame);

  // 5. Dynamic Screen Texture via Offscreen Canvas
  const screenCanvas = document.createElement('canvas');
  screenCanvas.width = 800;
  screenCanvas.height = 500;
  const screenCtx = screenCanvas.getContext('2d');

  let slideIndex = 0;
  const slides = [
    { bg: ['#1a0a2e', '#0a0a1a'], title: 'LUXE DINING', subtitle: 'Restaurant & Fine Dining', accent: '#ffaa66' },
    { bg: ['#0a1a2e', '#051020'], title: 'AZURE HOTEL', subtitle: 'Luxury Resort & Stays', accent: '#00D4FF' },
    { bg: ['#1a0a0a', '#0a0505'], title: 'IRON FITNESS', subtitle: 'High-Performance Gym', accent: '#ff4444' },
    { bg: ['#2a1a2e', '#1a0f1a'], title: 'BELLA SALON', subtitle: 'Modern Beauty Studio', accent: '#ec4899' },
    { bg: ['#0a1528', '#050a1a'], title: 'MEDICARE', subtitle: 'Clinic & Health Portal', accent: '#3b82f6' }
  ];

  function drawScreen() {
    const slide = slides[slideIndex];
    
    // Background gradient
    const grad = screenCtx.createLinearGradient(0, 0, 800, 500);
    grad.addColorStop(0, slide.bg[0]);
    grad.addColorStop(1, slide.bg[1]);
    screenCtx.fillStyle = grad;
    screenCtx.fillRect(0, 0, 800, 500);

    // Accent radial glow
    const glowGrad = screenCtx.createRadialGradient(400, 240, 50, 400, 240, 380);
    glowGrad.addColorStop(0, slide.accent + '44');
    glowGrad.addColorStop(1, 'transparent');
    screenCtx.fillStyle = glowGrad;
    screenCtx.fillRect(0, 0, 800, 500);

    // Top Navigation Mockup
    screenCtx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    screenCtx.font = '500 15px sans-serif';
    screenCtx.textAlign = 'left';
    screenCtx.fillText('HOME    SERVICES    ABOUT    WORK    CONTACT', 50, 50);

    // Title
    screenCtx.fillStyle = '#ffffff';
    screenCtx.font = 'bold 64px sans-serif';
    screenCtx.textAlign = 'center';
    screenCtx.fillText(slide.title, 400, 220);

    // Subtitle
    screenCtx.fillStyle = slide.accent;
    screenCtx.font = '600 20px sans-serif';
    screenCtx.letterSpacing = '4px';
    screenCtx.fillText(slide.subtitle.toUpperCase(), 400, 268);

    // CTA Button Mockup
    screenCtx.fillStyle = slide.accent;
    screenCtx.beginPath();
    screenCtx.roundRect(325, 310, 150, 46, 23);
    screenCtx.fill();

    screenCtx.fillStyle = '#050508';
    screenCtx.font = 'bold 15px sans-serif';
    screenCtx.textAlign = 'center';
    screenCtx.fillText('EXPLORE NOW', 400, 339);

    // Indicators dots
    for (let i = 0; i < slides.length; i++) {
      screenCtx.fillStyle = i === slideIndex ? slide.accent : 'rgba(255,255,255,0.2)';
      screenCtx.beginPath();
      screenCtx.arc(360 + i * 20, 420, i === slideIndex ? 5 : 3.5, 0, Math.PI * 2);
      screenCtx.fill();
    }
  }

  drawScreen();

  const screenTexture = new THREE.CanvasTexture(screenCanvas);
  const screenGeom = new THREE.PlaneGeometry(4.35, 2.65);
  const screenMat = new THREE.MeshBasicMaterial({ map: screenTexture });
  const screen = new THREE.Mesh(screenGeom, screenMat);
  screen.position.set(0, 0.45, -1.33);
  screen.rotation.x = -Math.PI / 8;
  laptop.add(screen);

  // Rotate screen slides periodically
  setInterval(() => {
    slideIndex = (slideIndex + 1) % slides.length;
    drawScreen();
    screenTexture.needsUpdate = true;
  }, 3200);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const pointLightCyan = new THREE.PointLight(0x00D4FF, 2.5, 20);
  pointLightCyan.position.set(5, 5, 5);
  scene.add(pointLightCyan);

  const pointLightPurple = new THREE.PointLight(0xA855F7, 2.2, 20);
  pointLightPurple.position.set(-5, 3, -5);
  scene.add(pointLightPurple);

  const rimLight = new THREE.DirectionalLight(0xffffff, 0.6);
  rimLight.position.set(0, 6, -6);
  scene.add(rimLight);

  scene.add(laptop);

  // Mouse Parallax Interaction
  let targetRotationY = 0;
  let targetRotationX = 0;

  window.addEventListener('mousemove', (e) => {
    const normX = (e.clientX / window.innerWidth) * 2 - 1;
    const normY = (e.clientY / window.innerHeight) * 2 - 1;
    targetRotationY = normX * 0.25;
    targetRotationX = normY * 0.15;
  }, { passive: true });

  // Animation Loop
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Floating bobbing motion
    laptop.position.y = Math.sin(elapsedTime * 1.5) * 0.08;

    // Smooth lerp rotation towards mouse position with subtle continuous idle sway
    laptop.rotation.y += (targetRotationY + Math.sin(elapsedTime * 0.6) * 0.08 - laptop.rotation.y) * 0.05;
    laptop.rotation.x += (targetRotationX - laptop.rotation.x) * 0.05;

    // Moving dynamic lights
    pointLightCyan.position.x = Math.sin(elapsedTime * 0.8) * 5;
    pointLightPurple.position.z = Math.cos(elapsedTime * 0.8) * 5;

    renderer.render(scene, camera);
  }

  animate();
})();
