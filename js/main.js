(function () {
  const qs = (selector) => document.querySelector(selector);
  const qsa = (selector) => Array.from(document.querySelectorAll(selector));
  const layer = qs('#particle-layer');
  const lockScreen = qs('#lock-screen');
  const heroPanel = qs('#hero-panel');
  const journeyStage = qs('#journey-stage');
  const finalNoteView = qs('#final-note-view');
  const secretInput = qs('#secret-key');
  const unlockButton = qs('#unlock-button');
  const lockError = qs('#lock-error');
  const portraitBox = qs('#portrait-reveal-box');
  const promiseButton = qs('#promise-button');
  const acceptedKeys = ['04-09-2022', '4-9-2022'];

  function clearStepView() {
    qsa('.journey-step').forEach((step) => step.classList.remove('is-active'));
  }

  function showStep(stepId) {
    clearStepView();
    const targetStep = qs(`#${stepId}`);
    if (targetStep) {
      targetStep.classList.add('is-active');
    }
  }

  function openJourney() {
    heroPanel.classList.add('is-hidden');
    heroPanel.style.display = 'none';
    journeyStage.style.display = 'block';
    journeyStage.classList.add('is-visible');
    clearStepView();
    showStep('step-1');
    finalNoteView.classList.remove('is-active');
    finalNoteView.style.display = 'none';
  }

  function unlockExperience() {
    const rawValue = secretInput.value.trim();
    const normalized = rawValue.toLowerCase().replace(/\s+/g, '');
    const isValid = acceptedKeys.some((key) => normalized === key.toLowerCase().replace(/\s+/g, ''));

    if (!isValid) {
      lockError.textContent = 'That date did not match. Try the milestone date again.';
      secretInput.value = '';
      secretInput.focus();
      return;
    }

    lockError.textContent = '';
    lockScreen.classList.add('is-hidden');
    heroPanel.classList.remove('is-hidden');
    heroPanel.style.display = 'grid';

    window.setTimeout(() => {
      lockScreen.style.display = 'none';
    }, 450);
  }

  function showFinalNote() {
    journeyStage.style.display = 'none';
    journeyStage.classList.remove('is-visible');
    clearStepView();
    finalNoteView.style.display = 'grid';
    finalNoteView.classList.add('is-active');
  }

  function createParticle() {
    const particle = document.createElement('span');
    const icons = ['💚', '🧡', '🦋', '🌹'];
    const icon = icons[Math.floor(Math.random() * icons.length)];
    particle.textContent = icon;
    particle.className = 'floating-particle';

    const size = 14 + Math.random() * 20;
    particle.style.fontSize = `${size}px`;
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.animationDelay = `${Math.random() * 1.4}s`;
    particle.style.animationDuration = `${6 + Math.random() * 5}s`;
    particle.style.setProperty('--drift', `${(Math.random() - 0.5) * 240}px`);
    particle.style.setProperty('--duration', `${6 + Math.random() * 5}s`);

    layer.appendChild(particle);
    particle.addEventListener('animationend', () => particle.remove());
  }

  function initParticles() {
    const particleCount = 24;
    for (let i = 0; i < particleCount; i += 1) {
      window.setTimeout(createParticle, i * 90);
    }

    window.setInterval(createParticle, 240);
  }

  document.addEventListener('DOMContentLoaded', () => {
    heroPanel.classList.remove('is-hidden');
    heroPanel.style.display = 'grid';
    journeyStage.classList.remove('is-visible');
    journeyStage.style.display = 'none';
    finalNoteView.classList.remove('is-active');
    finalNoteView.style.display = 'none';
    clearStepView();

    qs('.hero-button').addEventListener('click', openJourney);

    qsa('.next-button').forEach((button) => {
      button.addEventListener('click', () => {
        const target = button.getAttribute('data-target');
        if (target) {
          showStep(target);
        }
      });
    });

    if (portraitBox) {
      portraitBox.addEventListener('click', () => {
        portraitBox.classList.add('revealed');
      });
    }

    if (promiseButton) {
      promiseButton.addEventListener('click', showFinalNote);
    }

    unlockButton.addEventListener('click', unlockExperience);
    secretInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        unlockExperience();
      }
    });

    initParticles();
  });
})();
