document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Mobile nav toggle ---------- */
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      links.style.cssText = open
        ? 'display:flex;position:absolute;top:100%;left:0;right:0;flex-direction:column;background:#0A0F1C;padding:20px 32px;border-bottom:1px solid rgba(255,255,255,0.09);gap:18px;'
        : '';
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      links.classList.remove('open');
      links.style.cssText = '';
    }));
  }

  /* ---------- Hero canvas: network / node graph ---------- */
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w, h, nodes;
    const NODE_COUNT = window.innerWidth < 700 ? 34 : 60;
    const MAX_DIST = 150;

    function resize() {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    }

    function initNodes() {
      nodes = Array.from({ length: NODE_COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.8
      }));
    }

    function tick() {
      ctx.clearRect(0, 0, w, h);
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            ctx.strokeStyle = `rgba(62,142,247,${(1 - dist / MAX_DIST) * 0.28})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(127,187,255,0.75)';
        ctx.fill();
      }
      requestAnimationFrame(tick);
    }

    resize();
    initNodes();
    tick();
    window.addEventListener('resize', () => { resize(); initNodes(); });
  }

  /* ---------- Hero typing effect ---------- */
  const typedEl = document.querySelector('.hero-typed');
  if (typedEl) {
    const phrases = [
      'while you sleep.',
      'while you scale.',
      'without the manual work.'
    ];
    let phraseIdx = 0, charIdx = 0, deleting = false;
    const span = document.createElement('span');
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    typedEl.appendChild(span);
    typedEl.appendChild(cursor);

    function loop() {
      const current = phrases[phraseIdx];
      if (!deleting) {
        span.textContent = current.slice(0, charIdx + 1);
        charIdx++;
        if (charIdx === current.length) {
          deleting = true;
          setTimeout(loop, 1800);
          return;
        }
      } else {
        span.textContent = current.slice(0, charIdx - 1);
        charIdx--;
        if (charIdx === 0) {
          deleting = false;
          phraseIdx = (phraseIdx + 1) % phrases.length;
        }
      }
      setTimeout(loop, deleting ? 35 : 55);
    }
    loop();
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in-view');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  }

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const co = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count, 10);
          const suffix = el.dataset.suffix || '';
          const duration = 1300;
          const start = performance.now();
          function step(now) {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(eased * target) + suffix;
            if (p < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
          co.unobserve(el);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(c => co.observe(c));
  }

  /* ---------- Animated skill bars ---------- */
  const bars = document.querySelectorAll('.skill-bar-fill');
  if (bars.length) {
    const bo = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.width = entry.target.dataset.pct + '%';
          bo.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    bars.forEach(b => bo.observe(b));
  }

  /* ---------- Project card tilt ---------- */
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rx = ((y / rect.height) - 0.5) * -6;
      const ry = ((x / rect.width) - 0.5) * 6;
      card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ---------- Nav active-section highlight ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  if (sections.length && navLinks.length) {
    const so = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(l => l.classList.remove('active'));
          const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
          if (active) active.classList.add('active');
        }
      });
    }, { threshold: 0.4, rootMargin: '-80px 0px -50% 0px' });
    sections.forEach(s => so.observe(s));
  }

  /* ---------- Back to top ---------- */
  const backTop = document.querySelector('.back-top');
  if (backTop) {
    window.addEventListener('scroll', () => {
      backTop.classList.toggle('visible', window.scrollY > 700);
    });
    backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---------- Sticky header border glow on scroll ---------- */
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.style.borderBottomColor = window.scrollY > 40 ? 'rgba(110,177,255,0.25)' : 'rgba(255,255,255,0.09)';
    });
  }

  /* ---------- Contact form -> mailto ---------- */
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const service = document.getElementById('service').value;
      const message = document.getElementById('message').value;
      const subject = encodeURIComponent('Project inquiry: ' + service);
      const body = encodeURIComponent(
        'Name: ' + name + '\n' +
        'Email: ' + email + '\n' +
        'Service: ' + service + '\n\n' +
        'Message:\n' + message
      );
      window.location.href = 'mailto:seoalione1@gmail.com?subject=' + subject + '&body=' + body;
    });
  }
});

/* ---------- FAQ accordion ---------- */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    if (!q) return;
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => { if (i !== item) i.classList.remove('open'); });
      item.classList.toggle('open', !isOpen);
    });
  });
});
