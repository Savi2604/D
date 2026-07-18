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
  const introScreen    = qs('#intro-screen');
  const apologyScreen  = qs('#apology-screen');
  const commitmentScreen = qs('#commitment-screen');
  const dealScreen     = qs('#deal-screen');
  const memoriesScreen = qs('#memories-screen');
  const finalScreen    = qs('#final-portrait-screen');
  
  const secretInput    = qs('#secret-key');
  const unlockButton   = qs('#unlock-button');
  const lockError      = qs('#lock-error');
  const bgMusic        = qs('#romantic-finale-track');

  /* Accepted unlock keys */
  const acceptedKeys = ['04-09-2022', '4-9-2022'];

  /* ═══════════════════════════════════════════════════════════════════
     LOCK SCREEN — Validate date and transition to Screen 1
  ═══════════════════════════════════════════════════════════════════ */
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

    /* After lock fades out → show Screen 1 */
    window.setTimeout(() => {
      lockScreen.style.display = 'none';
      showIntroScreen();
    }, 650);
  }

  /* ═══════════════════════════════════════════════════════════════════
     SCREEN 1 — Intro & Journey Sequence
  ═══════════════════════════════════════════════════════════════════ */
  function showIntroScreen() {
    introScreen.style.display = 'flex';
    introScreen.classList.add('screen-enter');

    /* Start floating particles in the background */
    initAntigravityEngine();
  }

  /* ═══════════════════════════════════════════════════════════════════
     SCREEN 2 — Apology Screen
  ═══════════════════════════════════════════════════════════════════ */
  function showApologyScreen() {
    /* Fade out intro */
    introScreen.style.opacity = '0';
    introScreen.style.transform = 'translateY(-18px)';
    introScreen.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

    window.setTimeout(() => {
      introScreen.style.display = 'none';

      apologyScreen.style.display = 'flex';
      apologyScreen.classList.add('screen-enter');
    }, 500);
  }

  /* ═══════════════════════════════════════════════════════════════════
     SCREEN 2.5 — Hopeful Commitment Screen
  ═══════════════════════════════════════════════════════════════════ */
  function showCommitmentScreen() {
    /* Fade out apology screen */
    apologyScreen.style.opacity = '0';
    apologyScreen.style.transform = 'translateY(-18px)';
    apologyScreen.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

    window.setTimeout(() => {
      apologyScreen.style.display = 'none';

      commitmentScreen.style.display = 'flex';
      commitmentScreen.classList.add('screen-enter');
    }, 500);
  }

  /* ═══════════════════════════════════════════════════════════════════
     SCREEN 2.75 — Deal Screen
  ═══════════════════════════════════════════════════════════════════ */
  function showDealScreen() {
    /* Fade out commitment screen */
    commitmentScreen.style.opacity = '0';
    commitmentScreen.style.transform = 'translateY(-18px)';
    commitmentScreen.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

    window.setTimeout(() => {
      commitmentScreen.style.display = 'none';

      dealScreen.style.display = 'flex';
      dealScreen.classList.add('screen-enter');

      /* Start audio when deal screen loads */
      const dealAudio = qs('#deal-audio-player');
      if (dealAudio) {
        dealAudio.play().catch(() => {
          console.log('Autoplay blocked, user needs to interact first');
        });
      }
    }, 500);
  }

  /* ═══════════════════════════════════════════════════════════════════
     SCREEN 3 — Memories Photo Grid (staggered slide-in)
  ═══════════════════════════════════════════════════════════════════ */
  function showMemoriesScreen() {
    /* Fade out deal screen */
    dealScreen.style.opacity = '0';
    dealScreen.style.transform = 'translateY(-18px)';
    dealScreen.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

    window.setTimeout(() => {
      dealScreen.style.display = 'none';

      memoriesScreen.style.display = 'block';
      memoriesScreen.classList.add('screen-enter');

      /* Staggered Instant-Camera slide-in for each polaroid */
      const cards = qsa('.polaroid-card');
      cards.forEach((card, i) => {
        window.setTimeout(() => {
          card.classList.add('is-visible');
        }, 80 + i * 120);
      });
    }, 500);
  }

  /* ═══════════════════════════════════════════════════════════════════
     SCREEN 4 — Grand Finale + Music Trigger
  ═══════════════════════════════════════════════════════════════════ */
  function showFinalScreen() {
    /* Fade out memories screen */
    memoriesScreen.style.opacity = '0';
    memoriesScreen.style.transform = 'translateY(-18px)';
    memoriesScreen.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

    window.setTimeout(() => {
      memoriesScreen.style.display = 'none';

      finalScreen.style.display = 'flex';
      finalScreen.classList.add('screen-enter');

      /* ── MUSIC TRIGGER — plays ONLY when Screen 4 activates ── */
      if (bgMusic) {
        bgMusic.currentTime = 0;
        bgMusic.volume = 0.82;
        bgMusic.play().catch(() => {
          /* Autoplay blocked by browser — show fallback button */
          const hint = qs('#music-hint');
          if (hint) hint.style.display = 'flex';
        });
      }
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

  const ICON_POOL = ['💕','💕','💕','💗','💗','💗','💖','💖','💝','💝','💓','💞'];
  const COLOR_POOL = ['#ff4d6d', '#ff85a2', '#ffb3c1', '#ffd166'];

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
      p.vx  = Math.max(-MAX_VX, Math.min(MAX_VX, p.vx));
      p.vy  = Math.max(-MAX_VY, Math.min(MAX_VY, p.vy));

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
     BOOT — Wire up all event listeners on DOMContentLoaded
  ═══════════════════════════════════════════════════════════════════ */
  document.addEventListener('DOMContentLoaded', () => {

    /* Lock screen controls */
    unlockButton.addEventListener('click', unlockExperience);
    secretInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); unlockExperience(); }
    });

    /* Screen 1: Intro -> Journey Sequence */
    const openJourneyBtn = qs('#open-journey-btn');
    if (openJourneyBtn) {
      openJourneyBtn.addEventListener('click', () => {
        const introStart = qs('#intro-start');
        const journeySeq = qs('#journey-sequence');
        
        introStart.style.opacity = '0';
        introStart.style.transform = 'translateY(-18px)';
        introStart.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

        window.setTimeout(() => {
          introStart.style.display = 'none';
          journeySeq.style.display = 'block';
          journeySeq.classList.add('screen-enter');
        }, 400);
      });
    }

    /* Screen 1: Journey Step transitions */
    qsa('.j-next-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const currentStep = e.target.closest('.journey-step');
        const targetId = e.target.getAttribute('data-target');
        const nextStep = qs('#' + targetId);
        
        if (currentStep && nextStep) {
          currentStep.style.opacity = '0';
          currentStep.style.transform = 'translateY(-18px)';
          currentStep.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          
          window.setTimeout(() => {
            currentStep.classList.remove('is-active');
            currentStep.style.display = 'none';
            currentStep.style.opacity = '';
            currentStep.style.transform = '';

            nextStep.style.display = 'block';
            nextStep.classList.add('is-active', 'screen-enter');
          }, 400);
        }
      });
    });

    /* Screen 1 → Screen 2 (Apology) */
    const goToApologyBtn = qs('#go-to-apology-btn');
    if (goToApologyBtn) {
      goToApologyBtn.addEventListener('click', showApologyScreen);
    }

    /* Screen 2 → Screen 2.5 (Commitment) */
    const goToCommitmentBtn = qs('#go-to-commitment-btn');
    if (goToCommitmentBtn) {
      goToCommitmentBtn.addEventListener('click', showCommitmentScreen);
    }

    /* Screen 2.5 → Screen 2.75 (Deal) */
    const goToDealBtn = qs('#go-to-deal-btn');
    if (goToDealBtn) {
      goToDealBtn.addEventListener('click', showDealScreen);
    }

    /* Screen 2.75 → Screen 3 (Memories Grid) */
    const dealToMemoriesBtn = qs('#deal-to-memories-btn');
    if (dealToMemoriesBtn) {
      dealToMemoriesBtn.addEventListener('click', showMemoriesScreen);
    }

    /* Screen 3 → Screen 4 (Final Portrait) */
    const goToFinalBtn = qs('#go-to-final-btn');
    if (goToFinalBtn) {
      goToFinalBtn.addEventListener('click', showFinalScreen);
    }

    /* Music fallback button (shown if autoplay blocked) */
    const musicHintBtn = qs('#music-hint-btn');
    if (musicHintBtn && bgMusic) {
      musicHintBtn.addEventListener('click', () => {
        bgMusic.play();
        const hint = qs('#music-hint');
        if (hint) hint.style.display = 'none';
      });
    }
  });

})();
