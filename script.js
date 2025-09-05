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

// Scroll-down from intro with subtle fade
(function(){
  const btn = document.querySelector('#loading .scroll-down');
  const loading = document.getElementById('loading');
  const about = document.getElementById('about');
  if (btn && loading && about) {
    btn.addEventListener('click', ()=>{
      loading.classList.add('exited');
      about.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(()=> loading.classList.remove('exited'), 700);
    });
  }
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
    camera.aspect = 1; camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize); resize();
  const light = new THREE.DirectionalLight(0xffffff, 1); light.position.set(3,4,5); scene.add(light);
  scene.add(new THREE.AmbientLight(0xffffff, 0.4));
  const geo = new THREE.TorusKnotGeometry(1.2, 0.35, 200, 32);
  const mat = new THREE.MeshStandardMaterial({ color: 0x6a5acd, metalness: 0.35, roughness: 0.25 });
  const mesh = new THREE.Mesh(geo, mat); scene.add(mesh);
  let targetX = 0, targetY = 0;
  window.addEventListener('mousemove', (e)=>{
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = (e.clientY / window.innerHeight) * 2 - 1;
    targetY = x * 0.25; targetX = -y * 0.2;
  });
  function animate(){
    mesh.rotation.x += 0.004 + (targetX - mesh.rotation.x) * 0.02;
    mesh.rotation.y += 0.007 + (targetY - mesh.rotation.y) * 0.02;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
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
    const fd = new FormData(form);
    try {
      const res = await fetch(GOOGLE_FORM_URL, { method: 'POST', mode: 'no-cors', body: fd });
      status.textContent = 'Thanks! Your message was sent.';
      form.reset();
    } catch {
      status.textContent = 'Something went wrong. Please try again later.';
    }
  });
})();
