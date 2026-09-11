// js/three-effects.js
// This module creates four independent 3D scenes using Three.js.
// Each scene is rendered into its own <canvas> element defined in index.html:
//   #effect1-canvas – Rotating sphere (general 3D demo)
//   #effect2-canvas – Rotating cube (basic geometry)
//   #effect3-canvas – Code editor model (web developer theme)
//   #effect4-canvas – CPU gear (computer engineer theme)

function initScene({ canvasId, initObjects, animateObjects }) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return null;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    45,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    100
  );
  camera.position.set(0, 0, 3);

  const ambient = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambient);
  const directional = new THREE.DirectionalLight(0xffffff, 0.4);
  directional.position.set(5, 5, 5);
  scene.add(directional);

  initObjects(scene);

  function onResize() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', onResize);

  function animate() {
    requestAnimationFrame(animate);
    animateObjects(scene);
    renderer.render(scene, camera);
  }
  animate();
  return { renderer, scene, camera };
}

// Effect 1: Rotating Sphere
initScene({
  canvasId: 'effect1-canvas',
  initObjects: (scene) => {
    const geometry = new THREE.SphereGeometry(0.8, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      color: 0x00d4ff,
      metalness: 0.2,
      roughness: 0.6,
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
    scene.userData.sphere = sphere;
  },
  animateObjects: (scene) => {
    const s = scene.userData.sphere;
    s.rotation.y += 0.01;
    s.rotation.x += 0.005;
  },
});

// Effect 2: Rotating Cube
initScene({
  canvasId: 'effect2-canvas',
  initObjects: (scene) => {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      metalness: 0.3,
      roughness: 0.5,
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    scene.userData.cube = cube;
  },
  animateObjects: (scene) => {
    const c = scene.userData.cube;
    c.rotation.x += 0.008;
    c.rotation.y += 0.012;
  },
});

// Effect 3: Code Editor Model (Web Dev)
initScene({
  canvasId: 'effect3-canvas',
  initObjects: (scene) => {
    const monitorGeo = new THREE.BoxGeometry(1.2, 0.8, 0.05);
    const monitorMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.6 });
    const monitor = new THREE.Mesh(monitorGeo, monitorMat);
    monitor.position.set(0, 0.2, 0);
    scene.add(monitor);
    const lineMat = new THREE.MeshBasicMaterial({ color: 0x00ff00, emissive: 0x00ff00 });
    for (let y = -0.3; y <= 0.3; y += 0.07) {
      const lineGeo = new THREE.PlaneGeometry(0.9, 0.02);
      const line = new THREE.Mesh(lineGeo, lineMat);
      line.position.set(0, y, 0.028);
      scene.add(line);
    }
    const standGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.4, 16);
    const standMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const stand = new THREE.Mesh(standGeo, standMat);
    stand.position.set(0, -0.2, 0);
    scene.add(stand);
    scene.userData.monitor = monitor;
  },
  animateObjects: (scene) => {
    scene.userData.monitor.rotation.y += 0.006;
  },
});

// Effect 4: CPU Gear (Computer Engineer)
initScene({
  canvasId: 'effect4-canvas',
  initObjects: (scene) => {
    const geo = new THREE.TorusKnotGeometry(0.5, 0.15, 100, 16);
    const mat = new THREE.MeshStandardMaterial({
      color: 0xffc107,
      metalness: 0.7,
      roughness: 0.3,
    });
    const gear = new THREE.Mesh(geo, mat);
    scene.add(gear);
    scene.userData.gear = gear;
  },
  animateObjects: (scene) => {
    const g = scene.userData.gear;
    g.rotation.x += 0.004;
    g.rotation.y += 0.009;
  },
});

// End of three-effects.js
