// Typewriter Effect for Skills Page
(function(){
  const words = ["Web Developer", "Cybersecurity Enthusiast", "Creative Designer"];
  let i = 0, j = 0, currentWord = "", isDeleting = false;
  const typewriter = document.getElementById("typewriter");
  function step() {
    if (!typewriter) return;
    currentWord = words[i];
    typewriter.textContent = isDeleting ? currentWord.substring(0, j--) : currentWord.substring(0, j++);
    if (!isDeleting && j === currentWord.length + 1) {
      isDeleting = true; setTimeout(step, 900);
    } else if (isDeleting && j === 0) {
      isDeleting = false; i = (i + 1) % words.length; setTimeout(step, 200);
    } else {
      setTimeout(step, isDeleting ? 80 : 160);
    }
  }
  step();
})();

// Three.js minimal avatar + parallax
(function(){
  if (!(window.THREE && document.getElementById('avatar'))) return;
  const canvas = document.getElementById('avatar');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.z = 6;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  function resize(){
    const s = Math.min(window.innerWidth, window.innerHeight) * 0.8;
    canvas.style.width = s + 'px';
    canvas.style.height = s + 'px';
    const rect = canvas.getBoundingClientRect();
    renderer.setSize(rect.width, rect.height, false);
    camera.aspect = rect.width / rect.height || 1; camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize); resize();

  const light = new THREE.DirectionalLight(0xffffff, 1.1); light.position.set(3, 5, 4); scene.add(light);
  scene.add(new THREE.AmbientLight(0xffffff, 0.35));

  const group = new THREE.Group(); scene.add(group);
  const headGeo = new THREE.SphereGeometry(1.4, 32, 32);
  const headMat = new THREE.MeshStandardMaterial({ color: 0xf1f1f1, roughness: 0.3, metalness: 0.1 });
  const head = new THREE.Mesh(headGeo, headMat); group.add(head);
  const eyeGeo = new THREE.SphereGeometry(0.12, 16, 16);
  const eyeMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
  const leftEye = new THREE.Mesh(eyeGeo, eyeMat); leftEye.position.set(-0.45, 0.2, 1.0);
  const rightEye = new THREE.Mesh(eyeGeo, eyeMat); rightEye.position.set(0.45, 0.2, 1.0);
  group.add(leftEye, rightEye);
  const noseGeo = new THREE.ConeGeometry(0.1, 0.4, 16);
  const noseMat = new THREE.MeshStandardMaterial({ color: 0x6a5acd });
  const nose = new THREE.Mesh(noseGeo, noseMat); nose.rotation.x = Math.PI/2; nose.position.set(0, -0.1, 1.1); group.add(nose);

  let targetRotX = 0, targetRotY = 0;
  window.addEventListener('mousemove', (e)=>{
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = (e.clientY / window.innerHeight) * 2 - 1;
    targetRotY = x * 0.4; targetRotX = -y * 0.3;
  });

  function animate(){
    group.rotation.x += (targetRotX - group.rotation.x) * 0.05;
    group.rotation.y += (targetRotY - group.rotation.y) * 0.05;
    head.position.y = Math.sin(performance.now()/900) * 0.05;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
})();

// Section fade-in on view
(function(){
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-in, #projects, #skills, #contact').forEach(el=>{
    el.classList.add('fade-in'); io.observe(el);
  });
  const topbar = document.querySelector('.topbar');
  const about = document.getElementById('about');
  if (topbar && about) {
    const showHdr = new IntersectionObserver((entries)=>{
      entries.forEach(en=>{ if (en.isIntersecting) topbar.classList.add('visible'); });
    }, { threshold: 0.2 });
    showHdr.observe(about);
  }
})();

// Wheel/touch to enter home from loading + set class for layout shift
(function(){
  const loading = document.getElementById('loading');
  const about = document.getElementById('about');
  if (!loading || !about) return;
  if (sessionStorage.getItem('introSeen') === '1') { document.body.classList.add('entered-home'); loading.remove(); return; }
  let triggered = false;
  function go(){
    if (triggered) return; triggered = true;
    sessionStorage.setItem('introSeen','1');
    document.documentElement.classList.add('intro-seen');
    document.body.classList.add('entered-home');
    loading.classList.add('exited');
    about.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(()=> { if (loading && loading.parentNode) loading.remove(); }, 1700);
  }
  loading.addEventListener('wheel', (e)=>{ if (e.deltaY > 0) go(); }, { passive: true });
  loading.addEventListener('touchstart', (e)=>{ loading.dataset.y = e.touches[0].clientY; }, { passive: true });
  loading.addEventListener('touchmove', (e)=>{ const y0 = Number(loading.dataset.y||0); if (e.touches[0].clientY < y0 - 12) go(); }, { passive: true });
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{ if (!en.isIntersecting) document.body.classList.add('entered-home'); });
  }, { threshold: 0.6 });
  io.observe(loading);
})();

// Nav button smooth scroll + section slide bump
(function(){
  document.querySelectorAll('.main-nav a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.classList.add('section-bump');
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(()=> target.classList.remove('section-bump'), 650);
    });
  });
})();

// 3D vector on home (about)
(function(){
  if (!(window.THREE && document.getElementById('vector3d'))) return;
  const canvas = document.getElementById('vector3d');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.z = 6;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });

  function resize(){
    const rect = canvas.getBoundingClientRect();
    const size = Math.min(rect.width || 400, 420);
    renderer.setSize(size, size, false);
    camera.aspect = 1;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize); resize();

  const light = new THREE.DirectionalLight(0xffffff, 1); light.position.set(3,4,5); scene.add(light);
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));

  let root = null;
  const url = "https://cdn.builder.io/o/assets%2F46d439807ce146dfa87c3e06c032c776%2F462503d91900447ca25b1309cfe80765?alt=media&token=6b18219c-8651-4eda-83f1-3312726f89c3&apiKey=46d439807ce146dfa87c3e06c032c776";

  function fitToView(object) {
    const box = new THREE.Box3().setFromObject(object);
    const size = new THREE.Vector3(); box.getSize(size);
    const center = new THREE.Vector3(); box.getCenter(center);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const fov = camera.fov * (Math.PI/180);
    const dist = Math.max(3, (maxDim/2) / Math.tan(fov/2));
    camera.position.z = dist;
    object.position.sub(center);
  }

  if (THREE.GLTFLoader) {
    const loader = new THREE.GLTFLoader();
    loader.load(url, (gltf)=>{
      root = gltf.scene;
      scene.add(root);
      fitToView(root);
    });
  } else {
    const fallback = new THREE.Mesh(
      new THREE.TorusKnotGeometry(1.2, 0.35, 200, 32),
      new THREE.MeshStandardMaterial({ color: 0x6a5acd, metalness: 0.35, roughness: 0.25 })
    );
    root = fallback; scene.add(root);
  }

  let isDown = false, lastX = 0, lastY = 0, velX = 0, velY = 0;
  let targetScale = 1, currScale = 1;
  canvas.addEventListener('pointerdown', (e)=>{ isDown = true; lastX = e.clientX; lastY = e.clientY; canvas.setPointerCapture(e.pointerId); });
  window.addEventListener('pointerup', ()=>{ isDown = false; });
  window.addEventListener('pointermove', (e)=>{
    targetScale = 1.03;
    if (!isDown || !root) return;
    const dx = (e.clientX - lastX) / 200;
    const dy = (e.clientY - lastY) / 200;
    velY = dx; velX = dy;
    lastX = e.clientX; lastY = e.clientY;
  });
  canvas.addEventListener('mouseleave', ()=>{ targetScale = 1; });

  canvas.addEventListener('wheel', (e)=>{
    e.preventDefault();
    camera.position.z = Math.min(12, Math.max(3, camera.position.z + (e.deltaY > 0 ? 0.5 : -0.5)));
  }, { passive: false });

  function animate(){
    if (root) {
      root.rotation.x += velX * 0.8 + 0.004;
      root.rotation.y += velY * 0.8 + 0.007;
      velX *= 0.92; velY *= 0.92;
      currScale += (targetScale - currScale) * 0.1;
      root.scale.set(currScale, currScale, currScale);
      targetScale = 1;
    }
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
})();

// Interactive tilt for PNG model images (avatar + vector)
(function(){
  function addTilt(el){
    if (!el) return;
    let scale = 1;
    const maxDeg = 12;
    function apply(e){
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rx = (0.5 - y) * maxDeg;
      const ry = (x - 0.5) * maxDeg;
      el.style.transform = `translateX(var(--shiftX, 0)) perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${scale})`;
    }
    el.addEventListener('pointermove', (e)=>{ scale = 1.03; apply(e); });
    el.addEventListener('pointerleave', ()=>{ scale = 1; el.style.transform = 'translateX(var(--shiftX, 0)) perspective(800px) rotateX(0) rotateY(0) scale(1)'; });
    el.addEventListener('pointerdown', ()=>{ scale = 0.98; });
    window.addEventListener('pointerup', ()=>{ scale = 1.03; });
    let t = 0; (function idle(){
      if (!document.body.contains(el)) return;
      if (!el.matches(':hover')) {
        t += 0.02; const rx = Math.sin(t)*1.5, ry = Math.cos(t*0.8)*1.5;
        el.style.transform = `translateX(var(--shiftX, 0)) perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1)`;
      }
      requestAnimationFrame(idle);
    })();
  }
  addTilt(document.getElementById('avatar'));
  addTilt(document.getElementById('vector3d'));
})();

// Skills filtering (dim non-matching)
(function(){
  const chips = Array.from(document.querySelectorAll('.skill-chip'));
  const cards = Array.from(document.querySelectorAll('.project-card'));
  let active = '';
  function apply(){
    cards.forEach(c=>{
      const tags = (c.getAttribute('data-tags')||'').split(',').map(s=>s.trim().toLowerCase());
      const match = !active || tags.includes(active);
      c.classList.toggle('dimmed', !match);
    });
  }
  chips.forEach(ch=>{
    ch.addEventListener('click', ()=>{
      const v = ch.getAttribute('data-filter');
      chips.forEach(x=>x.classList.toggle('active', x===ch && active!==v));
      active = active===v ? '' : v; apply();
    });
  });
  apply();
})();

// CV download
(function(){
  const btn = document.querySelector('.cv-btn');
  const cvUrl = document.body.getAttribute('data-cv-url');
  if (btn) btn.addEventListener('click', ()=>{ if (cvUrl) window.open(cvUrl, '_blank'); });
})();

// Contact form → Google Forms
(function(){
  const form = document.getElementById('contact-form');
  if (!form) return;
  const status = form.querySelector('.form-status');
  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const GOOGLE_FORM_URL = window.GOOGLE_FORM_URL || '';
    if (!GOOGLE_FORM_URL) { status.textContent = 'Form backend not configured.'; return; }
    const fd = new FormData();
    fd.append('entry.1435239664', form.elements['name']?.value || '');
    fd.append('entry.1477657095', form.elements['email']?.value || '');
    fd.append('entry.2053526753', form.elements['message']?.value || '');
    try {
      const res = await fetch(GOOGLE_FORM_URL, { method: 'POST', mode: 'no-cors', body: fd });
      status.textContent = 'Thanks! Your message was sent.';
      form.reset();
    } catch {
      status.textContent = 'Something went wrong. Please try again later.';
    }
  });
})();
