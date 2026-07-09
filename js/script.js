(function(){
  "use strict";

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------
     Header scroll state
  --------------------------------------------------------- */
  var header = document.getElementById('site-header');
  function onScrollHeader(){
    if(window.scrollY > 12) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, {passive:true});

  /* ---------------------------------------------------------
     Mobile nav toggle
  --------------------------------------------------------- */
  var navToggle = document.getElementById('nav-toggle');
  var navLinks = document.getElementById('nav-links');
  navToggle.addEventListener('click', function(){
    var open = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  navLinks.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded','false');
    });
  });

  /* ---------------------------------------------------------
     Scrollspy — highlight active nav link by section in view
  --------------------------------------------------------- */
  var sections = ['home','services','projects','about','contact']
    .map(function(id){ return document.getElementById(id); })
    .filter(Boolean);
  var navMap = {};
  document.querySelectorAll('.nav-links a').forEach(function(a){
    navMap[a.dataset.nav] = a;
  });

  function updateSpy(){
    var scrollPos = window.scrollY + window.innerHeight * 0.3;
    var current = sections[0];
    sections.forEach(function(sec){
      if(sec.offsetTop <= scrollPos) current = sec;
    });
    Object.keys(navMap).forEach(function(key){
      navMap[key].classList.toggle('active', key === current.id);
    });
  }
  updateSpy();
  window.addEventListener('scroll', updateSpy, {passive:true});

  /* ---------------------------------------------------------
     Scroll reveal via IntersectionObserver
  --------------------------------------------------------- */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if('IntersectionObserver' in window && !reduceMotion){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold:0.12, rootMargin:'0px 0px -40px 0px' });
    revealEls.forEach(function(el){ io.observe(el); });

    var timelineEl = document.querySelector('.timeline');
    if(timelineEl){
      var tio = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(entry.isIntersecting){
            entry.target.classList.add('in-view');
            tio.unobserve(entry.target);
          }
        });
      }, { threshold:0.3 });
      tio.observe(timelineEl);
    }
  } else {
    revealEls.forEach(function(el){ el.classList.add('in-view'); });
    var tl = document.querySelector('.timeline');
    if(tl) tl.classList.add('in-view');
  }

  /* ---------------------------------------------------------
     Animated stat counters
  --------------------------------------------------------- */
  function animateCount(el){
    if(el.dataset.plain){ return; }
    var target = parseInt(el.dataset.count, 10) || 0;
    var suffix = el.dataset.suffix || '';
    var duration = 1400;
    var start = null;
    function step(ts){
      if(!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if(progress < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(step);
  }

  var counters = document.querySelectorAll('[data-count]');
  if('IntersectionObserver' in window){
    var cio = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          animateCount(entry.target);
          cio.unobserve(entry.target);
        }
      });
    }, { threshold:0.5 });
    counters.forEach(function(el){ cio.observe(el); });
  } else {
    counters.forEach(animateCount);
  }

  /* ---------------------------------------------------------
     Hero role typewriter
  --------------------------------------------------------- */
  var roles = ['ai_automation', 'web_systems', 'chatbots', 'seo_growth'];
  var roleEl = document.getElementById('role-type');
  if(roleEl){
    if(reduceMotion){
      roleEl.textContent = roles[0];
    } else {
      var ri = 0, ci = 0, deleting = false;
      function tick(){
        var word = roles[ri];
        if(!deleting){
          ci++;
          roleEl.textContent = word.slice(0, ci);
          if(ci === word.length){
            deleting = true;
            setTimeout(tick, 1400);
            return;
          }
        } else {
          ci--;
          roleEl.textContent = word.slice(0, ci);
          if(ci === 0){
            deleting = false;
            ri = (ri + 1) % roles.length;
          }
        }
        setTimeout(tick, deleting ? 45 : 85);
      }
      tick();
    }
  }

  /* ---------------------------------------------------------
     Console log typing loop
  --------------------------------------------------------- */
  var logLines = [
    { t:'prompt', text:'$ deploy automation.py --client=k2beverages' },
    { t:'out', text:'> build: figma \u2192 wordpress \u2192 live \u2713' },
    { t:'prompt', text:'$ chatbot.serve --client=profix-roofing' },
    { t:'out', text:'> front_desk_manual_work: 0%' },
    { t:'prompt', text:'$ content_pipeline.run --sites=50' },
    { t:'out', text:'> content_time: -90% \u2713' },
    { t:'prompt', text:'$ status --all-systems' },
    { t:'out', text:'> 50+ sites online. all automations running.' }
  ];
  var consoleEl = document.getElementById('console-log');
  if(consoleEl){
    if(reduceMotion){
      consoleEl.innerHTML = logLines.map(function(l){
        return '<span class="cl-line ' + (l.t === 'prompt' ? 'cl-prompt' : 'cl-out') + '">' + l.text + '</span>';
      }).join('');
    } else {
      (function typeLoop(){
        consoleEl.innerHTML = '';
        var li = 0;
        function nextLine(){
          if(li >= logLines.length){
            setTimeout(typeLoop, 2200);
            return;
          }
          var line = logLines[li];
          var span = document.createElement('span');
          span.className = 'cl-line ' + (line.t === 'prompt' ? 'cl-prompt' : 'cl-out');
          consoleEl.appendChild(span);
          var ci = 0;
          function typeChar(){
            ci++;
            span.textContent = line.text.slice(0, ci);
            if(ci < line.text.length){
              setTimeout(typeChar, line.t === 'prompt' ? 26 : 12);
            } else {
              li++;
              setTimeout(nextLine, line.t === 'prompt' ? 220 : 380);
            }
          }
          typeChar();
        }
        nextLine();
      })();
    }
  }

  /* ---------------------------------------------------------
     Tilt effect on cards
  --------------------------------------------------------- */
  if(!reduceMotion && window.matchMedia('(hover:hover)').matches){
    document.querySelectorAll('[data-tilt]').forEach(function(card){
      var rect;
      card.addEventListener('mouseenter', function(){
        rect = card.getBoundingClientRect();
      });
      card.addEventListener('mousemove', function(e){
        if(!rect) rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = 'perspective(700px) rotateY(' + (x * 6) + 'deg) rotateX(' + (y * -6) + 'deg) translateY(-3px)';
      });
      card.addEventListener('mouseleave', function(){
        card.style.transform = '';
      });
    });
  }

  /* ---------------------------------------------------------
     Floating algorithm / code glyphs
  --------------------------------------------------------- */
  var glyphChars = ['01','10','\u03BB','\u03A3','f(x)','{ }','< >','if/else','0x1F','\u2211','\u2248','while(1)','=>','101010','O(n)','#!/'];
  var glyphField = document.getElementById('glyph-field');
  if(glyphField && !reduceMotion){
    var count = window.innerWidth < 760 ? 8 : 16;
    for(var i=0;i<count;i++){
      var g = document.createElement('span');
      g.className = 'glyph';
      g.textContent = glyphChars[Math.floor(Math.random()*glyphChars.length)];
      g.style.left = (Math.random()*100) + 'vw';
      g.style.top = (100 + Math.random()*20) + 'vh';
      g.style.fontSize = (0.85 + Math.random()*0.9) + 'rem';
      var duration = 22 + Math.random()*26;
      g.style.animationDuration = duration + 's';
      g.style.animationDelay = (Math.random()*duration) + 's';
      glyphField.appendChild(g);
    }
  }

  /* ---------------------------------------------------------
     Neural-network canvas background (hero-anchored, ambient)
  --------------------------------------------------------- */
  var canvas = document.getElementById('net-canvas');
  if(canvas && !reduceMotion){
    var ctx = canvas.getContext('2d');
    var w, h, nodes;
    var NODE_COUNT_BASE = 60;

    function resize(){
      w = canvas.width = window.innerWidth;
      h = canvas.height = Math.max(window.innerHeight, document.getElementById('home').offsetHeight);
      var count = Math.round((w * 900) / (1400 * 900) * NODE_COUNT_BASE);
      count = Math.max(28, Math.min(count, 90));
      nodes = [];
      for(var i=0;i<count;i++){
        nodes.push({
          x: Math.random()*w,
          y: Math.random()*h,
          vx: (Math.random()-0.5)*0.25,
          vy: (Math.random()-0.5)*0.25
        });
      }
    }

    function step(){
      ctx.clearRect(0,0,w,h);
      var maxDist = 130;

      for(var i=0;i<nodes.length;i++){
        var n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;
        if(n.x < 0 || n.x > w) n.vx *= -1;
        if(n.y < 0 || n.y > h) n.vy *= -1;
      }

      for(i=0;i<nodes.length;i++){
        for(var j=i+1;j<nodes.length;j++){
          var a = nodes[i], b = nodes[j];
          var dx = a.x-b.x, dy = a.y-b.y;
          var dist = Math.sqrt(dx*dx+dy*dy);
          if(dist < maxDist){
            var alpha = (1 - dist/maxDist) * 0.16;
            ctx.strokeStyle = 'rgba(63,201,255,' + alpha + ')';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for(i=0;i<nodes.length;i++){
        ctx.fillStyle = 'rgba(53,240,166,0.55)';
        ctx.beginPath();
        ctx.arc(nodes[i].x, nodes[i].y, 1.6, 0, Math.PI*2);
        ctx.fill();
      }
      requestAnimationFrame(step);
    }

    resize();
    step();
    var resizeTimer;
    window.addEventListener('resize', function(){
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 200);
    });
  }

  /* ---------------------------------------------------------
     Contact form -> mailto
  --------------------------------------------------------- */
  var form = document.getElementById('contact-form');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var name = document.getElementById('name').value;
      var email = document.getElementById('email').value;
      var service = document.getElementById('service').value;
      var message = document.getElementById('message').value;
      var subject = encodeURIComponent('Project inquiry: ' + service);
      var body = encodeURIComponent(
        'Name: ' + name + '\n' +
        'Email: ' + email + '\n' +
        'Service: ' + service + '\n\n' +
        'Message:\n' + message
      );
      window.location.href = 'mailto:seoalione1@gmail.com?subject=' + subject + '&body=' + body;
    });
  }

})();
