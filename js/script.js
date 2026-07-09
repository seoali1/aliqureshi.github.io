// Mobile nav toggle
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
      if (links.classList.contains('open')) {
        links.style.cssText = 'display:flex;position:absolute;top:100%;left:0;right:0;flex-direction:column;background:#fff;padding:20px 32px;border-bottom:1px solid #DFE5EC;gap:18px;';
      } else {
        links.style.cssText = '';
      }
    });
  }

  // Live console log cycling (hero signature element)
  const logData = [
    { tag: 'POST', tagClass: 'post', txt: 'Published article to', path: 'homegadget.info' },
    { tag: 'DONE', tagClass: 'done', txt: 'Backlink inserted (inbound + outbound)', path: '' },
    { tag: 'RUN', tagClass: 'run', txt: 'Campaign #1663 processing', path: 'k2beverage.com.pk' },
    { tag: 'DONE', tagClass: 'done', txt: 'Recipe card generated from content', path: 'belarecipes.com' },
    { tag: 'POST', tagClass: 'post', txt: 'Chatbot booked inspection for', path: 'ProFix Roofing' },
    { tag: 'DONE', tagClass: 'done', txt: 'Content spun + rewritten, 0 duplicates', path: '' },
    { tag: 'RUN', tagClass: 'run', txt: 'Syncing 50+ managed sites', path: '' },
    { tag: 'DONE', tagClass: 'done', txt: 'Front-desk query auto-resolved', path: 'AI chatbot' },
  ];

  const consoleBody = document.querySelector('.console-body');
  if (consoleBody) {
    let i = 0;
    const maxLines = 6;

    function pushLine() {
      const item = logData[i % logData.length];
      const line = document.createElement('div');
      line.className = 'console-line';
      line.innerHTML = `<span class="tag ${item.tagClass}">${item.tag}</span><span class="txt">${item.txt}${item.path ? ' <span class="path">' + item.path + '</span>' : ''}</span>`;
      consoleBody.insertBefore(line, consoleBody.querySelector('.console-stat-row'));

      const lines = consoleBody.querySelectorAll('.console-line');
      if (lines.length > maxLines) {
        lines[0].remove();
      }
      i++;
    }

    // seed initial lines
    for (let k = 0; k < 4; k++) pushLine();
    setInterval(pushLine, 2200);
  }

  // Animated stat counters
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count, 10);
          const suffix = el.dataset.suffix || '';
          const duration = 1200;
          const start = performance.now();
          function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(eased * target) + suffix;
            if (progress < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(c => observer.observe(c));
  }
});
