/* ====================================================
   SneakerHive — JavaScript
   Anti-gravity physics · Scroll animations · Interactions
   ==================================================== */

(function () {
  'use strict';

  /* ──────────────────────────────────────────────
     PRELOADER
     ────────────────────────────────────────────── */
  window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      setTimeout(() => preloader.classList.add('hidden'), 600);
    }
  });

  /* ──────────────────────────────────────────────
     SCROLL PROGRESS BAR
     ────────────────────────────────────────────── */
  const scrollProgress = document.getElementById('scrollProgress');
  window.addEventListener('scroll', () => {
    if (!scrollProgress) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = progress + '%';
  });

  /* ──────────────────────────────────────────────
     CUSTOM CURSOR GLOW
     ────────────────────────────────────────────── */
  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow) {
    document.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = e.clientX + 'px';
      cursorGlow.style.top = e.clientY + 'px';
    });

    // Enlarge on hoverable elements
    const hoverTargets = 'a, button, .btn, .btn-cart, .filter-pill, .quick-view span';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(hoverTargets)) cursorGlow.classList.add('hover');
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(hoverTargets)) cursorGlow.classList.remove('hover');
    });
  }

  /* ──────────────────────────────────────────────
     NAVBAR — Shrink on scroll + Hamburger
     ────────────────────────────────────────────── */
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    }
  });

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
    // Close on link click (mobile)
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  /* ──────────────────────────────────────────────
     PAGE TRANSITION
     ────────────────────────────────────────────── */
  const pageTransition = document.getElementById('pageTransition');
  document.querySelectorAll('.page-link').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      if (pageTransition) {
        pageTransition.classList.add('active');
        setTimeout(() => { window.location.href = href; }, 400);
      } else {
        window.location.href = href;
      }
    });
  });

  /* ──────────────────────────────────────────────
     SCROLL REVEAL (IntersectionObserver)
     ────────────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (revealEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => observer.observe(el));
  }

  /* ──────────────────────────────────────────────
     BUTTON RIPPLE EFFECT
     ────────────────────────────────────────────── */
  document.querySelectorAll('.btn, .btn-cart').forEach((btn) => {
    btn.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      this.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });

  /* ──────────────────────────────────────────────
     ADD TO CART ANIMATION
     ────────────────────────────────────────────── */
  document.querySelectorAll('.btn-cart').forEach((btn) => {
    btn.addEventListener('click', function () {
      if (this.classList.contains('added')) return;
      this.classList.add('added');
      this.textContent = 'Added ✓';
      setTimeout(() => {
        this.classList.remove('added');
        this.textContent = 'Add to Cart 🛒';
      }, 2000);
    });
  });

  /* ──────────────────────────────────────────────
     FILTER PILLS (Shop page — UI only)
     ────────────────────────────────────────────── */
  document.querySelectorAll('.filter-pill').forEach((pill) => {
    pill.addEventListener('click', function () {
      document.querySelectorAll('.filter-pill').forEach((p) => p.classList.remove('active'));
      this.classList.add('active');
    });
  });

  /* ──────────────────────────────────────────────
     COUNTER ANIMATION (About page)
     ────────────────────────────────────────────── */
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  if (statNumbers.length) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    statNumbers.forEach((el) => counterObserver.observe(el));
  }

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 2000; // ms
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);

      if (target >= 10000) {
        el.textContent = (current / 1000).toFixed(current >= target ? 0 : 1) + 'K+';
      } else if (target >= 100) {
        el.textContent = current + '+';
      } else {
        el.textContent = current;
      }

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        // Final value
        if (target >= 10000) el.textContent = '10K+';
        else if (target >= 100) el.textContent = target + '+';
        else el.textContent = target;
      }
    }
    requestAnimationFrame(tick);
  }

  /* ──────────────────────────────────────────────
     FLOATING SNEAKERS BACKGROUND
     ────────────────────────────────────────────── */
  const floatingContainer = document.getElementById('floatingSneakers');
  if (floatingContainer) {
    const sneakerEmojis = ['👟', '👠', '🥾', '👞', '👟', '🩴'];
    for (let i = 0; i < 12; i++) {
      const el = document.createElement('span');
      el.classList.add('floating-sneaker');
      el.textContent = sneakerEmojis[i % sneakerEmojis.length];
      el.style.left = Math.random() * 100 + '%';
      el.style.animationDuration = (15 + Math.random() * 20) + 's';
      el.style.animationDelay = (Math.random() * 15) + 's';
      el.style.fontSize = (1.2 + Math.random() * 2) + 'rem';
      floatingContainer.appendChild(el);
    }
  }

  /* ──────────────────────────────────────────────
     ★ ANTI-GRAVITY PHYSICS ★  (Home page)
     ────────────────────────────────────────────── */
  const btnGravity = document.getElementById('btnGravity');
  const btnReset = document.getElementById('btnReset');
  const heroContent = document.getElementById('heroContent');

  if (btnGravity && btnReset && heroContent) {
    let physicsRunning = false;
    let animationId = null;
    let bodies = []; // tracked physics bodies

    const GRAVITY = 0.45;       // px/frame²
    const BOUNCE = 0.55;        // energy retention
    const FRICTION = 0.98;      // horizontal damping
    const FLOOR_OFFSET = 40;    // px above viewport bottom

    btnGravity.addEventListener('click', startGravity);
    btnReset.addEventListener('click', resetLayout);

    function startGravity() {
      if (physicsRunning) return;
      physicsRunning = true;
      btnGravity.style.display = 'none';
      btnReset.style.display = 'inline-flex';

      const els = heroContent.querySelectorAll('.hero-el');
      const heroRect = heroContent.getBoundingClientRect();

      bodies = [];

      els.forEach((el) => {
        const rect = el.getBoundingClientRect();
        // Store original position relative to heroContent
        const origLeft = rect.left - heroRect.left;
        const origTop = rect.top - heroRect.top;

        el.style.position = 'absolute';
        el.style.left = origLeft + 'px';
        el.style.top = origTop + 'px';
        el.style.width = rect.width + 'px';
        el.style.margin = '0';
        el.style.transition = 'none';

        bodies.push({
          el: el,
          x: origLeft,
          y: origTop,
          vx: (Math.random() - 0.5) * 6,
          vy: (Math.random() - 0.5) * 2,
          w: rect.width,
          h: rect.height,
          origLeft: origLeft,
          origTop: origTop,
          rotation: 0,
          vr: (Math.random() - 0.5) * 4
        });
      });

      heroContent.style.position = 'relative';
      heroContent.style.width = '100%';
      heroContent.style.height = heroContent.offsetHeight + 'px';

      animationId = requestAnimationFrame(physicsTick);
    }

    function physicsTick() {
      const viewH = window.innerHeight;
      const heroRect = heroContent.getBoundingClientRect();
      const floorY = viewH - heroRect.top - FLOOR_OFFSET;
      const containerW = heroContent.offsetWidth;

      bodies.forEach((b) => {
        // Apply gravity
        b.vy += GRAVITY;

        // Apply friction
        b.vx *= FRICTION;

        // Update position
        b.x += b.vx;
        b.y += b.vy;

        // Rotation
        b.rotation += b.vr;
        b.vr *= 0.99;

        // Floor collision
        if (b.y + b.h > floorY) {
          b.y = floorY - b.h;
          b.vy = -b.vy * BOUNCE;
          b.vr *= 0.8;
          // Stop tiny bounces
          if (Math.abs(b.vy) < 1) b.vy = 0;
        }

        // Left wall
        if (b.x < 0) {
          b.x = 0;
          b.vx = -b.vx * BOUNCE;
        }

        // Right wall
        if (b.x + b.w > containerW) {
          b.x = containerW - b.w;
          b.vx = -b.vx * BOUNCE;
        }

        // Apply transform (using translate + rotate for performance)
        b.el.style.left = b.x + 'px';
        b.el.style.top = b.y + 'px';
        b.el.style.transform = 'rotate(' + b.rotation + 'deg)';
      });

      // Keep running until all settled
      const allSettled = bodies.every(
        (b) => Math.abs(b.vy) < 0.1 && Math.abs(b.vx) < 0.1 && Math.abs(b.vr) < 0.05
      );

      if (!allSettled) {
        animationId = requestAnimationFrame(physicsTick);
      }
    }

    function resetLayout() {
      physicsRunning = false;
      if (animationId) cancelAnimationFrame(animationId);

      bodies.forEach((b) => {
        b.el.style.transition = 'all 0.6s cubic-bezier(.4,0,.2,1)';
        b.el.style.left = b.origLeft + 'px';
        b.el.style.top = b.origTop + 'px';
        b.el.style.transform = 'rotate(0deg)';
      });

      setTimeout(() => {
        bodies.forEach((b) => {
          b.el.style.position = '';
          b.el.style.left = '';
          b.el.style.top = '';
          b.el.style.width = '';
          b.el.style.margin = '';
          b.el.style.transform = '';
          b.el.style.transition = '';
        });
        heroContent.style.position = '';
        heroContent.style.width = '';
        heroContent.style.height = '';
        bodies = [];
      }, 700);

      btnGravity.style.display = 'inline-flex';
      btnReset.style.display = 'none';
    }
  }

  /* ──────────────────────────────────────────────
     FLOATING CHAT WIDGET
     ────────────────────────────────────────────── */
  const chatBubble = document.getElementById('chatBubble');
  const chatPanel  = document.getElementById('chatPanel');
  const chatBadge  = document.getElementById('chatBadge');

  if (chatBubble && chatPanel) {
    let chatOpen = false;

    chatBubble.addEventListener('click', () => {
      chatOpen = !chatOpen;
      chatBubble.classList.toggle('active', chatOpen);
      chatPanel.classList.toggle('open', chatOpen);
      chatBubble.setAttribute('aria-expanded', String(chatOpen));

      // Hide unread badge on first open
      if (chatOpen && chatBadge) {
        chatBadge.classList.add('hidden');
      }
    });

    // Close chat when pressing Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && chatOpen) {
        chatOpen = false;
        chatBubble.classList.remove('active');
        chatPanel.classList.remove('open');
        chatBubble.setAttribute('aria-expanded', 'false');
        chatBubble.focus();
      }
    });
  }

  /* ──────────────────────────────────────────────
     PARTICLE SYSTEM (Hero Canvas)
     ────────────────────────────────────────────── */
  const canvas = document.getElementById('particleCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId;

    function resizeCanvas() {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', () => { resizeCanvas(); particles = []; initParticles(); });

    function randomBetween(a, b) { return a + Math.random() * (b - a); }

    function Particle() {
      this.x  = randomBetween(0, canvas.width);
      this.y  = randomBetween(0, canvas.height);
      this.r  = randomBetween(0.5, 2.2);
      this.vx = randomBetween(-0.3, 0.3);
      this.vy = randomBetween(-0.6, -0.15);
      this.alpha = randomBetween(0.2, 0.8);
      const hues = ['0,240,255', '176,38,255', '192,255,0'];
      this.color = hues[Math.floor(Math.random() * hues.length)];
    }
    Particle.prototype.update = function () {
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= 0.002;
      if (this.alpha <= 0 || this.y < -5) {
        this.x = randomBetween(0, canvas.width);
        this.y = canvas.height + 5;
        this.alpha = randomBetween(0.2, 0.8);
      }
    };
    Particle.prototype.draw = function () {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
      ctx.fill();
    };

    function initParticles() {
      particles = [];
      const count = Math.min(120, Math.floor(canvas.width * canvas.height / 6000));
      for (let i = 0; i < count; i++) particles.push(new Particle());
    }
    initParticles();

    // Draw connecting lines between nearby particles
    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 90) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0,240,255,${0.06 * (1 - dist / 90)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => { p.update(); p.draw(); });
      drawConnections();
      animId = requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  /* ──────────────────────────────────────────────
     VOICE-TO-TEXT (Chat Mic Button)
     Uses Web Speech API — Chrome/Edge supported
     ────────────────────────────────────────────── */
  const micBtn         = document.getElementById('micBtn');
  const voiceBar       = document.getElementById('voiceBar');
  const voiceTranscript = document.getElementById('voiceTranscript');

  if (micBtn && voiceBar && voiceTranscript) {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRec) {
      // Hide mic if browser doesn't support it
      micBtn.style.display = 'none';
    } else {
      const recognition = new SpeechRec();
      recognition.continuous    = false;
      recognition.interimResults = true;
      recognition.lang          = 'en-US';

      let isListening = false;

      micBtn.addEventListener('click', () => {
        if (isListening) {
          recognition.stop();
        } else {
          recognition.start();
        }
      });

      recognition.onstart = () => {
        isListening = true;
        micBtn.classList.add('recording');
        micBtn.setAttribute('aria-label', 'Stop recording');
        voiceBar.classList.add('active');
        voiceTranscript.textContent = 'Listening…';
      };

      recognition.onresult = (e) => {
        let interim = '';
        let final   = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const t = e.results[i][0].transcript;
          if (e.results[i].isFinal) final += t;
          else interim += t;
        }
        voiceTranscript.textContent = final || interim || 'Listening…';

        // Auto-copy final transcript to clipboard
        if (final) {
          navigator.clipboard.writeText(final).catch(() => {});
          voiceTranscript.textContent = `✓ Copied: "${final.slice(0,40)}${final.length>40?'…':''}"`;
        }
      };

      recognition.onerror = (e) => {
        voiceTranscript.textContent = e.error === 'not-allowed'
          ? '⚠ Mic permission denied'
          : '⚠ Could not hear you';
      };

      recognition.onend = () => {
        isListening = false;
        micBtn.classList.remove('recording');
        micBtn.setAttribute('aria-label', 'Voice input');
        setTimeout(() => {
          voiceBar.classList.remove('active');
          voiceTranscript.textContent = 'Listening…';
        }, 2500);
      };
    }
  }

})();
