(function () {
  'use strict';

  /* ═══════════════════════════════════════════════════════════════════
     UTILITIES
  ═══════════════════════════════════════════════════════════════════ */
  const qs  = (s) => document.querySelector(s);
  const qsa = (s) => Array.from(document.querySelectorAll(s));

  /* ═══════════════════════════════════════════════════════════════════
     DOM REFS
  ═══════════════════════════════════════════════════════════════════ */
  const layer          = qs('#particle-layer');
  const lockScreen     = qs('#lock-screen');
  const heroPanel      = qs('#hero-panel');
  const journeyStage   = qs('#journey-stage');
  const codeScreen     = qs('#code-screen');
  const portraitScreen = qs('#portrait-screen');
  const secretInput    = qs('#secret-key');
  const unlockButton   = qs('#unlock-button');
  const lockError      = qs('#lock-error');
  const portraitBox    = qs('#portrait-reveal-box');
  const bgMusic        = qs('#romantic-finale-track');
  const acceptedKeys   = ['04-09-2022', '4-9-2022'];

  /* ═══════════════════════════════════════════════════════════════════
     STEP / VIEW SEQUENCING
  ═══════════════════════════════════════════════════════════════════ */
  function clearStepView() {
    qsa('.journey-step').forEach((s) => s.classList.remove('is-active'));
  }

  function showStep(stepId) {
    clearStepView();
    const target = qs('#' + stepId);
    if (target) {
      target.classList.add('is-active');
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function openJourney() {
    heroPanel.classList.add('is-hidden');
    heroPanel.style.display = 'none';
    journeyStage.style.display = 'block';
    journeyStage.classList.add('is-visible');
    clearStepView();
    showStep('step-1');
    portraitScreen.classList.remove('is-active');
    portraitScreen.style.display = 'none';
    codeScreen.style.display = 'none';
    codeScreen.classList.remove('is-active');
  }

  function unlockExperience() {
    const raw  = secretInput.value.trim();
    const norm = raw.toLowerCase().replace(/\s+/g, '');
    const ok   = acceptedKeys.some((k) => norm === k.toLowerCase().replace(/\s+/g, ''));

    if (!ok) {
      lockError.textContent = 'That date did not match. Try the milestone date again.';
      secretInput.value = '';
      secretInput.focus();
      const card = qs('.lock-card');
      if (card) {
        card.classList.add('shake');
        window.setTimeout(() => card.classList.remove('shake'), 500);
      }
      return;
    }

    lockError.textContent = '';
    lockScreen.classList.add('is-hidden');
    heroPanel.classList.remove('is-hidden');
    heroPanel.style.display = 'grid';
    window.setTimeout(() => { lockScreen.style.display = 'none'; }, 700);
  }

  /* ── Transition to Code Apology Terminal ───────────────────────── */
  function showCodeScreen() {
    journeyStage.style.display = 'none';
    journeyStage.classList.remove('is-visible');
    clearStepView();

    codeScreen.style.display = 'grid';
    codeScreen.classList.add('is-active');
    codeScreen.style.zIndex = '18';
    
    /* Crucially: music MUST NOT play on this apology text screen */
  }

  /* ── Transition from Code Screen to Portrait Screen with music and particles ── */
  function decodeApology() {
    codeScreen.classList.add('fade-out');
    
    // Wait for the fade-out transition, then switch screens
    window.setTimeout(() => {
      codeScreen.style.display = 'none';
      codeScreen.classList.remove('is-active');
      codeScreen.classList.remove('fade-out');
      
      portraitScreen.style.display = 'grid';
      portraitScreen.classList.add('is-active');
      portraitScreen.style.zIndex = '18';

      /* a) Instantly auto-play romantic track from the beginning */
      if (bgMusic) {
        bgMusic.currentTime = 0;
        bgMusic.volume = 0.85;
        bgMusic.play().then(() => {
          // Playback started successfully
        }).catch(() => {
          /* Fallback if autoplay gets blocked by browser policy */
          const hint = qs('#music-hint');
          if (hint) hint.style.display = 'flex';
        });
      }

      /* b) Trigger the lightweight requestAnimationFrame particle generator */
      initAntigravityEngine();
    }, 500);
  }

  /* ═══════════════════════════════════════════════════════════════════
     ✦  ANTIGRAVITY PHYSICS ENGINE  ✦
  ═══════════════════════════════════════════════════════════════════ */
  let cursorX = -9999;
  let cursorY = -9999;
  document.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
  });

  const ICON_POOL = ['🩷','🩷','🩷','🧡','🧡','🧡','🦋','🦋','✨'];

  const GRAVITY       = -0.016;
  const DRAG          = 0.991;
  const SWAY_SINE_AMP = 0.08;
  const SWAY_VEL_AMP  = 0.20;
  const SWAY_FREQ     = 0.022;
  const REPEL_R       = 120;
  const REPEL_F       = 0.44;
  const MAX_VX        = 2.2;
  const MAX_VY        = 3.0;
  const SPAWN_EVERY   = 14;

  const particles     = [];
  let   engineStarted = false;
  let   frameCount    = 0;
  let   lastSpawn     = 0;

  function spawnParticle(overrideY) {
    const el = document.createElement('span');
    el.textContent = ICON_POOL[Math.floor(Math.random() * ICON_POOL.length)];
    el.style.cssText = [
      'position:absolute',
      'top:0',
      'left:0',
      'pointer-events:none',
      'user-select:none',
      'will-change:transform,opacity',
      'opacity:0',
      'line-height:1',
      'backface-visibility:hidden',
      'font-size:' + (12 + Math.random() * 22) + 'px',
    ].join(';');

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const p  = {
      el,
      x:      Math.random() * vw,
      y:      (overrideY !== undefined) ? overrideY : vh + 20 + Math.random() * 60,
      vx:     (Math.random() - 0.5) * 0.5,
      vy:     -(0.35 + Math.random() * 0.55),
      phase:  Math.random() * Math.PI * 2,
      age:    0,
      maxAge: 360 + Math.random() * 260,
    };
    layer.appendChild(el);
    particles.push(p);
    return p;
  }

  function physicsTick() {
    frameCount++;

    if (frameCount - lastSpawn >= SPAWN_EVERY) {
      spawnParticle();
      lastSpawn = frameCount;
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.age++;

      p.vy += GRAVITY;
      p.vx += Math.sin(p.y * 0.015) * SWAY_SINE_AMP;
      p.vx += Math.sin(p.phase + p.age * SWAY_FREQ) * SWAY_VEL_AMP;

      const dx   = p.x - cursorX;
      const dy   = p.y - cursorY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < REPEL_R && dist > 0.5) {
        const str = (1 - dist / REPEL_R) * REPEL_F;
        p.vx += (dx / dist) * str;
        p.vy += (dy / dist) * str;
      }

      p.vx *= DRAG;
      p.vy *= DRAG;

      p.vx = Math.max(-MAX_VX, Math.min(MAX_VX, p.vx));
      p.vy = Math.max(-MAX_VY, Math.min(MAX_VY, p.vy));

      p.x += p.vx;
      p.y += p.vy;

      const fade = 40;
      let opacity = 1;
      if      (p.age < fade)              opacity = p.age / fade;
      else if (p.age > p.maxAge - fade)   opacity = (p.maxAge - p.age) / fade;
      opacity = Math.max(0, Math.min(1, opacity));

      if (p.age >= p.maxAge || p.y < -120) {
        p.el.remove();
        particles.splice(i, 1);
        continue;
      }

      p.el.style.transform = 'translate(' + p.x.toFixed(1) + 'px,' + p.y.toFixed(1) + 'px)';
      p.el.style.opacity   = opacity.toFixed(3);
    }

    requestAnimationFrame(physicsTick);
  }

  function initAntigravityEngine() {
    if (engineStarted) return;
    engineStarted = true;

    const vh = window.innerHeight;
    for (let i = 0; i < 28; i++) {
      window.setTimeout(() => {
        const p = spawnParticle(Math.random() * (vh * 1.2));
        p.age = Math.floor(Math.random() * 40);
      }, i * 50);
    }
    requestAnimationFrame(physicsTick);
  }

  /* ═══════════════════════════════════════════════════════════════════
     BOOT
  ═══════════════════════════════════════════════════════════════════ */
  document.addEventListener('DOMContentLoaded', () => {
    heroPanel.classList.remove('is-hidden');
    heroPanel.style.display = 'grid';
    journeyStage.classList.remove('is-visible');
    journeyStage.style.display = 'none';
    portraitScreen.classList.remove('is-active');
    portraitScreen.style.display = 'none';
    codeScreen.style.display = 'none';
    codeScreen.classList.remove('is-active');
    clearStepView();

    qs('.hero-button').addEventListener('click', openJourney);

    qsa('.next-button').forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-target');
        if (!target) return;
        if (target === 'code-screen') {
          showCodeScreen();
        } else {
          showStep(target);
        }
      });
    });

    const decodeBtn = qs('#decode-btn');
    if (decodeBtn) {
      decodeBtn.addEventListener('click', decodeApology);
    }

    if (portraitBox) {
      portraitBox.addEventListener('click', () => {
        portraitBox.classList.add('revealed');
      });
    }

    const musicHintBtn = qs('#music-hint-btn');
    if (musicHintBtn && bgMusic) {
      musicHintBtn.addEventListener('click', () => {
        bgMusic.play();
        const hint = qs('#music-hint');
        if (hint) hint.style.display = 'none';
      });
    }

    unlockButton.addEventListener('click', unlockExperience);
    secretInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); unlockExperience(); }
    });
  });

})();
