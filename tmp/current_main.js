/* Click-driven multi-step progression engine (no scroll listeners or observers) */
(function () {
  const qs = (s) => document.querySelector(s);
  const qsa = (s) => Array.from(document.querySelectorAll(s));

  document.addEventListener('DOMContentLoaded', () => {
    const steps = qsa('.step');
    let current = -1; // start at -1 so showStep(0) will activate the first card

    function showStep(index) {
      if (index < 0 || index >= steps.length) return;
      const prev = steps[current];
      const next = steps[index];

      if (prev === next) return;

      // animate out previous
      if (prev) {
        prev.classList.remove('anim-in');
        prev.classList.add('anim-out');
        setTimeout(() => {
          prev.classList.remove('anim-out');
          prev.classList.remove('active');
        }, 420);
      }

      // animate in next
      next.classList.add('active');
      next.classList.add('anim-in');
      setTimeout(() => next.classList.remove('anim-in'), 520);

      current = index;
    }

    // wire next buttons (data-target is 1-based step id; convert to 0-based index)
    qsa('.next-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const target = Number(btn.getAttribute('data-target'));
        if (!Number.isFinite(target)) return;
        const targetIndex = Math.max(0, target - 1);
        showStep(targetIndex);
      });
    });

    // show the first memory card by default (first .step element)
    showStep(0);
  });
})();

