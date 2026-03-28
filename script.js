/* ═══════════════════════════════════════════════════════════
   DINESH S — PORTFOLIO JAVASCRIPT
   All animations, interactions, and effects
═══════════════════════════════════════════════════════════ */

'use strict';

// ─── LOADING SCREEN ───────────────────────────────────────
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add('hidden');
    // Start intro animations after loading
    document.body.style.overflow = 'visible';
    initHeroAnimations();
  }, 2400);
});

// ─── AOS INIT ─────────────────────────────────────────────
AOS.init({
  duration: 700,
  easing: 'ease-out-cubic',
  once: true,
  offset: 60,
});

// ─── PARTICLES BACKGROUND ─────────────────────────────────
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let W, H, raf;

  const COLORS = ['rgba(0, 212, 255,', 'rgba(168, 85, 247,', 'rgba(6, 255, 165,'];
  const COUNT = 70;
  const MAX_DIST = 130;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 1.5 + 0.5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: Math.random() * 0.5 + 0.1,
    };
  }

  function init() {
    particles = Array.from({ length: COUNT }, createParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p, i) => {
      // Move
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      // Draw dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `${p.color}${p.alpha})`;
      ctx.fill();

      // Draw connections
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x, dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const opacity = (1 - dist / MAX_DIST) * 0.12;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    });
    raf = requestAnimationFrame(draw);
  }

  resize();
  init();
  draw();
  window.addEventListener('resize', () => { resize(); });
})();

// ─── CUSTOM CURSOR ────────────────────────────────────────
(function initCursor() {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mx = -100, my = -100;
  let rx = -100, ry = -100;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';
  });

  // Smooth ring follow
  function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Ring expand on interactive elements
  document.querySelectorAll('a, button, .flip-card, .tilt-card, .glass-card').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  });

  // Hide off window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0'; ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1'; ring.style.opacity = '1';
  });
})();

// ─── SCROLL PROGRESS ──────────────────────────────────────
(function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = (window.scrollY / max) * 100;
    bar.style.width = pct + '%';
  }, { passive: true });
})();

// ─── NAVBAR ───────────────────────────────────────────────
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  const links = document.querySelectorAll('.nav-link');

  // Scroll shadow
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  // Hamburger
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close on link click (mobile)
  links.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  // Active link on scroll
  const sections = document.querySelectorAll('section[id]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        links.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(s => observer.observe(s));
})();

// ─── TYPEWRITER EFFECT ────────────────────────────────────
(function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const roles = [
    'Cyber Forensics Student',
    'Full Stack Developer',
    'Security Researcher',
    'Python Developer',
  ];
  let roleIdx = 0, charIdx = 0, deleting = false;
  const SPEED = 80, DELETE_SPEED = 45, PAUSE = 2000;

  function type() {
    const current = roles[roleIdx];
    if (!deleting) {
      el.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(type, PAUSE);
        return;
      }
    } else {
      el.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
      }
    }
    setTimeout(type, deleting ? DELETE_SPEED : SPEED);
  }
  type();
})();

// ─── HERO INTRO ANIMATIONS ────────────────────────────────
function initHeroAnimations() {
  // Stagger in hero elements
  const els = document.querySelectorAll('.hero-eyebrow, .hero-name, .hero-roles, .hero-bio, .hero-location, .hero-cta, .hero-stats');
  els.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`;
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 100);
  });

  const card = document.getElementById('profile-card');
  if (card) {
    card.style.opacity = '0';
    card.style.transform = 'scale(0.8) translateY(30px)';
    card.style.transition = 'opacity 0.8s ease 0.4s, transform 0.8s ease 0.4s';
    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'scale(1) translateY(0)';
    }, 100);
  }
}

// ─── 3D PROFILE CARD TILT ─────────────────────────────────
(function initCardTilt() {
  const wrap = document.getElementById('profile-card-wrap');
  const card = document.getElementById('profile-card');
  if (!wrap || !card) return;

  wrap.addEventListener('mousemove', (e) => {
    const rect = wrap.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    card.style.transform = `rotateY(${dx * 18}deg) rotateX(${-dy * 12}deg) scale(1.02)`;
  });

  wrap.addEventListener('mouseleave', () => {
    card.style.transform = 'rotateY(0deg) rotateX(0deg) scale(1)';
    card.style.transition = 'transform 0.6s ease';
  });

  // Floating idle animation
  let idle = true;
  let t = 0;
  function floatCard() {
    if (idle) {
      t += 0.015;
      card.style.transform = `rotateY(${Math.sin(t) * 5}deg) rotateX(${Math.cos(t * 0.7) * 3}deg)`;
    }
    requestAnimationFrame(floatCard);
  }
  floatCard();

  wrap.addEventListener('mouseenter', () => { idle = false; });
  wrap.addEventListener('mouseleave', () => {
    setTimeout(() => { idle = true; }, 600);
  });
})();

// ─── SKILL CATEGORY CARD TILT ─────────────────────────────
(function initSkillTilt() {
  document.querySelectorAll('.tilt-card').forEach(card => {
    const inner = card.querySelector('.tilt-inner');
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      inner.style.transform = `perspective(600px) rotateY(${dx * 10}deg) rotateX(${-dy * 8}deg) translateZ(8px)`;
    });
    card.addEventListener('mouseleave', () => {
      inner.style.transform = 'perspective(600px) rotateY(0) rotateX(0) translateZ(0)';
      inner.style.transition = 'transform 0.4s ease';
    });
  });
})();

// ─── SKILL BARS ANIMATION ─────────────────────────────────
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        bar.style.width = bar.dataset.width + '%';
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.2 });

  bars.forEach(bar => observer.observe(bar));
})();

// ─── PARALLAX HERO GRID ───────────────────────────────────
(function initParallax() {
  const hero = document.getElementById('hero');
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      hero.style.backgroundPositionY = `${scrolled * 0.4}px`;
    }
  }, { passive: true });
})();

// ─── THEME TOGGLE ─────────────────────────────────────────
(function initTheme() {
  const btn = document.getElementById('theme-toggle');
  const icon = btn.querySelector('.theme-icon');
  let dark = true;

  // Load saved preference
  if (localStorage.getItem('theme') === 'light') {
    dark = false;
    document.body.classList.replace('dark-theme', 'light-theme');
    icon.textContent = '☀';
  }

  btn.addEventListener('click', () => {
    dark = !dark;
    if (dark) {
      document.body.classList.replace('light-theme', 'dark-theme');
      icon.textContent = '☀';
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.replace('dark-theme', 'light-theme');
      icon.textContent = '🌙';
      localStorage.setItem('theme', 'light');
    }
  });
})();

// ─── MUSIC TOGGLE ─────────────────────────────────────────
(function initMusic() {
  const btn = document.getElementById('music-toggle');
  let playing = false;
  let ctx, oscillators = [], gainNode;

  function createAmbient() {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 2);
    gainNode.connect(ctx.destination);

    // Ambient drone tones
    const freqs = [55, 82.5, 110, 165];
    freqs.forEach(freq => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      oscGain.gain.value = 0.3 + Math.random() * 0.2;
      osc.connect(oscGain);
      oscGain.connect(gainNode);
      osc.start();
      oscillators.push(osc);

      // Slow LFO modulation
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.05 + Math.random() * 0.1;
      lfoGain.gain.value = freq * 0.005;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start();
    });
  }

  btn.addEventListener('click', () => {
    playing = !playing;
    if (playing) {
      if (!ctx) createAmbient();
      else gainNode.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 1);
      btn.classList.add('playing');
    } else {
      if (gainNode) gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
      btn.classList.remove('playing');
    }
  });
})();

// ─── CONTACT FORM ─────────────────────────────────────────
(function initContactForm() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const success = document.getElementById('form-success');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btnText = submitBtn.querySelector('.btn-text');
    btnText.textContent = 'SENDING...';
    submitBtn.disabled = true;

    // Simulate form submission
    setTimeout(() => {
      form.reset();
      success.classList.remove('hidden');
      btnText.textContent = 'SEND MESSAGE';
      submitBtn.disabled = false;
      setTimeout(() => success.classList.add('hidden'), 4000);
    }, 1500);
  });

  // Glowing input focus
  form.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('focus', () => {
      input.closest('.form-group').style.setProperty('--input-glow', '1');
    });
    input.addEventListener('blur', () => {
      input.closest('.form-group').style.setProperty('--input-glow', '0');
    });
  });
})();

// ─── SMOOTH SCROLL FOR NAV LINKS ──────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      const offset = 80; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ─── PARALLAX ON SCROLL (Hero section only) ───────────────
window.addEventListener('scroll', () => {
  const hero = document.getElementById('hero');
  const scrolled = window.scrollY;
  if (scrolled < window.innerHeight * 1.5) {
    const heroContent = hero.querySelector('.hero-content');
    const heroCard = hero.querySelector('.hero-card-wrap');
    if (heroContent) heroContent.style.transform = `translateY(${scrolled * 0.15}px)`;
    if (heroCard) heroCard.style.transform = `translateY(${scrolled * 0.08}px)`;
  }
}, { passive: true });

// ─── GLITCH EFFECT ON HERO NAME ───────────────────────────
(function initGlitch() {
  const name = document.querySelector('.hero-name');
  if (!name) return;
  setInterval(() => {
    if (Math.random() > 0.97) {
      name.style.textShadow = `2px 0 var(--neon-purple), -2px 0 var(--neon-cyan)`;
      name.style.letterSpacing = `calc(0.05em + ${Math.random() * 2}px)`;
      setTimeout(() => {
        name.style.textShadow = '';
        name.style.letterSpacing = '0.05em';
      }, 80);
    }
  }, 500);
})();

// ─── STAT NUMBER COUNTER ──────────────────────────────────
(function initCounters() {
  const stats = document.querySelectorAll('.stat-num');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.textContent);
        const isDecimal = el.textContent.includes('.');
        const suffix = el.textContent.replace(/[\d.]/g, '');
        let current = 0;
        const increment = target / 40;
        const tick = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(tick);
          }
          el.textContent = (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;
        }, 40);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  stats.forEach(s => observer.observe(s));
})();

// ─── REVEAL TIMELINE ITEMS ────────────────────────────────
(function initTimelineReveal() {
  const items = document.querySelectorAll('.timeline-item');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  items.forEach(item => observer.observe(item));
})();

// ─── TECH BADGE STAGGER ───────────────────────────────────
(function initBadgeStagger() {
  const badges = document.querySelectorAll('.tech-badge');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        badges.forEach((b, i) => {
          setTimeout(() => {
            b.style.opacity = '1';
            b.style.transform = 'translateY(0)';
          }, i * 60);
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });

  badges.forEach(b => {
    b.style.opacity = '0';
    b.style.transform = 'translateY(12px)';
    b.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
  });
  const strip = document.querySelector('.tech-strip');
  if (strip) observer.observe(strip);
})();

// ─── HOVER GLOW ON BUTTONS ────────────────────────────────
document.querySelectorAll('.btn, .btn-sm').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    btn.style.setProperty('--mouse-x', x + '%');
    btn.style.setProperty('--mouse-y', y + '%');
  });
});
