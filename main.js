/* =============================================
   SAA — main.js
   Three.js backdrop + GSAP ScrollTrigger
   ============================================= */

gsap.registerPlugin(ScrollTrigger);

/* ========================
   CUSTOM CURSOR
   ======================== */
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mx = 0, my = 0, fx = 0, fy = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  gsap.set(cursor, { x: mx, y: my });
});

function followCursor() {
  fx += (mx - fx) * 0.1;
  fy += (my - fy) * 0.1;
  gsap.set(follower, { x: fx, y: fy });
  requestAnimationFrame(followCursor);
}
followCursor();

/* ========================
   NAV SCROLL STATE
   ======================== */
const nav = document.getElementById('nav');
ScrollTrigger.create({
  start: 'top -80',
  onUpdate: self => nav.classList.toggle('scrolled', self.progress > 0)
});

/* ========================
   THREE.JS — HERO CANVAS
   ======================== */
(function initThree() {
  const canvas = document.getElementById('hero-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x080808, 1);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 4;

  // Resize
  function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  // ---- Particle field ----
  const COUNT = 600;
  const positions = new Float32Array(COUNT * 3);
  const scales = new Float32Array(COUNT);
  const velocities = [];

  for (let i = 0; i < COUNT; i++) {
    const i3 = i * 3;
    positions[i3]     = (Math.random() - 0.5) * 14;
    positions[i3 + 1] = (Math.random() - 0.5) * 14;
    positions[i3 + 2] = (Math.random() - 0.5) * 6;
    scales[i] = Math.random();
    velocities.push({
      x: (Math.random() - 0.5) * 0.002,
      y: (Math.random() - 0.5) * 0.002,
      z: 0
    });
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));

  const mat = new THREE.ShaderMaterial({
    vertexShader: `
      attribute float aScale;
      uniform float uTime;
      void main() {
        vec3 pos = position;
        pos.y += sin(uTime * 0.3 + position.x * 0.5) * 0.08;
        pos.x += cos(uTime * 0.2 + position.y * 0.4) * 0.06;
        vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = aScale * 2.5 * (300.0 / -mvPos.z);
        gl_Position = projectionMatrix * mvPos;
      }
    `,
    fragmentShader: `
      void main() {
        float d = distance(gl_PointCoord, vec2(0.5));
        if (d > 0.5) discard;
        float alpha = 1.0 - smoothstep(0.2, 0.5, d);
        gl_FragColor = vec4(0.788, 0.659, 0.298, alpha * 0.55);
      }
    `,
    uniforms: { uTime: { value: 0 } },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  const points = new THREE.Points(geo, mat);
  scene.add(points);

  // ---- Floating wireframe ring ----
  const ringGeo = new THREE.TorusGeometry(1.8, 0.008, 4, 80);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0xc9a84c, wireframe: false, transparent: true, opacity: 0.18 });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI * 0.2;
  scene.add(ring);

  const ring2Geo = new THREE.TorusGeometry(2.5, 0.004, 4, 100);
  const ring2Mat = new THREE.MeshBasicMaterial({ color: 0xc9a84c, transparent: true, opacity: 0.08 });
  const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
  ring2.rotation.x = -Math.PI * 0.35;
  ring2.rotation.y = Math.PI * 0.1;
  scene.add(ring2);

  // ---- Mouse parallax ----
  let targetX = 0, targetY = 0, curX = 0, curY = 0;
  document.addEventListener('mousemove', e => {
    targetX = (e.clientX / window.innerWidth - 0.5) * 0.4;
    targetY = -(e.clientY / window.innerHeight - 0.5) * 0.3;
  });

  // ---- Animate ----
  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    mat.uniforms.uTime.value = t;

    // Particle drift
    const pos = geo.attributes.position.array;
    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;
      pos[i3]     += velocities[i].x;
      pos[i3 + 1] += velocities[i].y;
      // wrap
      if (pos[i3] > 7) pos[i3] = -7;
      if (pos[i3] < -7) pos[i3] = 7;
      if (pos[i3 + 1] > 7) pos[i3 + 1] = -7;
      if (pos[i3 + 1] < -7) pos[i3 + 1] = 7;
    }
    geo.attributes.position.needsUpdate = true;

    // Mouse parallax
    curX += (targetX - curX) * 0.03;
    curY += (targetY - curY) * 0.03;
    scene.rotation.y = curX;
    scene.rotation.x = curY;

    // Rings rotate
    ring.rotation.z = t * 0.06;
    ring2.rotation.z = -t * 0.04;
    ring.rotation.y = t * 0.03;

    renderer.render(scene, camera);
  }
  animate();

  // Fade canvas on scroll
  ScrollTrigger.create({
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    onUpdate: self => {
      canvas.style.opacity = 1 - self.progress * 0.7;
    }
  });
})();

/* ========================
   GALLERY — HORIZONTAL SCROLL
   ======================== */
(function initGallery() {
  const track = document.getElementById('gallery-track');
  const progress = document.getElementById('gallery-progress');
  const section = document.querySelector('.gallery-section');
  const items = track.querySelectorAll('.gallery-item');

  // Animate items in from bottom on load/enter
  gsap.set(items, { opacity: 0, y: 60 });

  function buildGalleryScroll() {
    const totalWidth = track.scrollWidth - window.innerWidth + 96; // 48px padding each side

    ScrollTrigger.getAll().filter(t => t.vars.id === 'gallery-scroll').forEach(t => t.kill());
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.2,
      pin: false,
      onUpdate: self => {
        progress.style.width = (self.progress * 100) + '%';
      }
    }
  });

  tl.to(track, {
    x: -totalWidth,
    ease: 'none'
  });

  // Show all gallery items immediately
  gsap.set(items, { opacity: 1, y: 0 });
})();

/* ========================
   ABOUT — TEXT REVEAL
   ======================== */
(function initAbout() {
  const lines = document.querySelectorAll('.about-reveal-line');

  lines.forEach((line, i) => {
    ScrollTrigger.create({
      trigger: line,
      start: 'top 85%',
      onEnter: () => {
        gsap.to(line, {
          color: i >= 4 ? '#f5f0ea' : 'rgba(245,240,234,0.7)',
          duration: 0.6,
          delay: i * 0.07,
          ease: 'power2.out'
        });
      }
    });
  });

  // Stats counter
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = parseInt(el.dataset.target);
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to({ val: 0 }, {
          val: target,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate: function() {
            el.textContent = Math.round(this.targets()[0].val);
          }
        });
      }
    });
  });
})();

/* ========================
   VENUES — ENTRANCE
   ======================== */
(function initVenues() {
  gsap.set('.venue-card', { opacity: 0, y: 48 });
  ScrollTrigger.batch('.venue-card', {
    start: 'top 85%',
    onEnter: batch => {
      gsap.to(batch, {
        opacity: 1, y: 0,
        stagger: 0.15,
        duration: 0.9,
        ease: 'power3.out'
      });
    },
    once: true
  });
})();

/* ========================
   EVENTS — HORIZONTAL SCROLL
   ======================== */
(function initEvents() {
  const section = document.querySelector('.events-section');
  const track = document.getElementById('events-track');
  const totalWidth = track.scrollWidth - window.innerWidth + 48;

  gsap.to(track, {
    x: -totalWidth,
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.5,
      pin: false
    }
  });

  // Cards entrance
  gsap.set('.event-card', { opacity: 0, y: 32 });
  ScrollTrigger.create({
    trigger: section,
    start: 'top 80%',
    once: true,
    onEnter: () => {
      gsap.to('.event-card', {
        opacity: 1, y: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out'
      });
    }
  });
})();

/* ========================
   EXHIBITION — ENTRANCE
   ======================== */
(function initExhibition() {
  const text = document.querySelector('.exhibition-text');
  const grid = document.querySelector('.exhibition-art-grid');

  if (text) {
    gsap.set(text, { opacity: 0, x: -48 });
    ScrollTrigger.create({
      trigger: '.exhibition-section',
      start: 'top 75%',
      once: true,
      onEnter: () => {
        gsap.to(text, { opacity: 1, x: 0, duration: 1, ease: 'power3.out' });
      }
    });
  }

  if (grid) {
    const arts = grid.querySelectorAll('.ex-art');
    gsap.set(arts, { opacity: 0, scale: 0.94 });
    ScrollTrigger.create({
      trigger: '.exhibition-section',
      start: 'top 70%',
      once: true,
      onEnter: () => {
        gsap.to(arts, {
          opacity: 1, scale: 1,
          stagger: 0.12,
          duration: 1,
          ease: 'power3.out',
          delay: 0.2
        });
      }
    });
  }
})();

/* ========================
   FOOTER EMAIL
   ======================== */
document.querySelector('.footer-btn')?.addEventListener('click', () => {
  const input = document.querySelector('.footer-input');
  if (input.value && input.value.includes('@')) {
    input.value = 'Thank you! ✓';
    input.style.borderColor = 'rgba(201,168,76,0.6)';
    input.disabled = true;
  }
});

/* ========================
   REFRESH SCROLL TRIGGERS
   ======================== */
window.addEventListener('load', () => {
  ScrollTrigger.refresh();
});
