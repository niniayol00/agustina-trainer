/* main.js — Agustina Casentini */
'use strict';

// ── Nav scroll ───────────────────────────────────────
const nav = document.getElementById('mainNav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

// ── Menu overlay (focus trap + restore focus) ─────────
(function () {
  const menuBtn  = document.getElementById('menuBtn');
  const overlay  = document.getElementById('menuOverlay');
  const closeBtn = document.getElementById('menuClose');
  const links    = overlay ? Array.from(overlay.querySelectorAll('a')) : [];
  let lastFocus  = null;

  function openMenu() {
    if (!overlay || !menuBtn) return;
    overlay.classList.add('open');
    menuBtn.setAttribute('aria-expanded', 'true');
    lastFocus = document.activeElement;
    closeBtn && closeBtn.focus();
  }

  function closeMenu() {
    if (!overlay || !menuBtn) return;
    overlay.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    if (lastFocus) lastFocus.focus();
  }

  // Focus trap inside overlay
  function trapFocus(e) {
    if (!overlay || !overlay.classList.contains('open')) return;
    const focusable = [closeBtn, ...links].filter(Boolean);
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  if (menuBtn) menuBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  links.forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay && overlay.classList.contains('open')) closeMenu();
    trapFocus(e);
  });
})();

// ── Scroll fade-in ───────────────────────────────────
(function () {
  const elems = document.querySelectorAll('.fi');
  if (!elems.length) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(el => {
      if (el.isIntersecting) { el.target.classList.add('visible'); observer.unobserve(el.target); }
    });
  }, { threshold: 0.12 });
  elems.forEach(el => observer.observe(el));
})();

// ── Stats counter ────────────────────────────────────
(function () {
  function animateCount(el) {
    const target = +el.dataset.target;
    const suffix = el.dataset.suffix || '';
    if (isNaN(target)) return;
    let cur = 0;
    const step = target / 50;
    const t = setInterval(() => {
      cur = Math.min(cur + step, target);
      el.textContent = Math.floor(cur) + suffix;
      if (cur >= target) clearInterval(t);
    }, 24);
  }
  const statObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { animateCount(e.target); statObs.unobserve(e.target); } });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-target]').forEach(el => statObs.observe(el));
})();

// ── Trainer carousel ─────────────────────────────────
(function () {
  const cards   = Array.from(document.querySelectorAll('.trainer-card'));
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  if (!cards.length || !prevBtn || !nextBtn) return;

  let cur = 0;

  function updateCards() {
    cards.forEach((c, i) => {
      c.className = 'trainer-card';
      if (i === cur) c.classList.add('active');
      else if (i === (cur - 1 + cards.length) % cards.length) c.classList.add('prev');
      else if (i === (cur + 1) % cards.length) c.classList.add('next');
      else c.classList.add('hidden');
    });
  }

  prevBtn.addEventListener('click', () => { cur = (cur - 1 + cards.length) % cards.length; updateCards(); });
  nextBtn.addEventListener('click', () => { cur = (cur + 1) % cards.length; updateCards(); });

  // Click card: prev/next → navigate; active → lightbox con las 3 fotos del carrusel
  cards.forEach(card => {
    card.addEventListener('click', () => {
      if (card.classList.contains('prev')) {
        cur = (cur - 1 + cards.length) % cards.length; updateCards();
      } else if (card.classList.contains('next')) {
        cur = (cur + 1) % cards.length; updateCards();
      } else if (card.classList.contains('active')) {
        const carouselImgs = cards.map(c => c.querySelector('img')).filter(Boolean);
        if (window.openLightbox) window.openLightbox(carouselImgs, cur, card.querySelector('img'));
      }
    });
  });

  updateCards();
})();

// ── Gallery slider ───────────────────────────────────
(function () {
  const track   = document.getElementById('galleryTrack');
  const dotsEl  = document.getElementById('galleryDots');
  const prevBtn = document.getElementById('galleryPrev');
  const nextBtn = document.getElementById('galleryNext');
  if (!track || !dotsEl || !prevBtn || !nextBtn) return;

  const slides = Array.from(track.querySelectorAll('.gallery-slide'));
  if (!slides.length) return;

  const GAP = 16;
  let VISIBLE = getVisible(), cur = 0, pages = 1;

  function getVisible() { return window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 4; }
  function calcPages()  { pages = Math.max(1, slides.length - VISIBLE + 1 - 2); }

  function buildDots() {
    dotsEl.innerHTML = '';
    for (let i = 0; i < pages; i++) {
      const d = document.createElement('div');
      d.className = 'g-dot';
      // Solo el dot 0 empieza visible
      d.style.display = i === 0 ? '' : 'none';
      d.setAttribute('role', 'button');
      d.setAttribute('aria-label', `Ir a imagen ${i + 1}`);
      d.addEventListener('click', () => goTo(i));
      dotsEl.appendChild(d);
    }
  }

  function updateDots() {
    const dotEls = dotsEl.querySelectorAll('.g-dot');
    dotEls.forEach((d, i) => {
      // Mostrar solo dots hasta la posición actual (sin puntos futuros)
      d.style.display = i <= cur ? '' : 'none';
      d.classList.toggle('active', i === cur);
    });
  }

  function goTo(idx) {
    cur = Math.max(0, Math.min(idx, pages - 1));

    const vp      = track.parentElement.offsetWidth;
    const slideW  = (vp - GAP * (VISIBLE - 1)) / VISIBLE;
    const maxShift = Math.max(0, slides.length * (slideW + GAP) - GAP - vp);
    const shift    = Math.min(cur * (slideW + GAP), maxShift);

    track.style.transform = `translateX(-${shift}px)`;
    updateDots();

    const atStart = cur === 0;
    const atEnd   = cur >= pages - 1;

    prevBtn.disabled         = atStart;
    nextBtn.disabled         = atEnd;
    prevBtn.style.opacity    = atStart ? '0.25' : '1';
    nextBtn.style.opacity    = atEnd   ? '0.25' : '1';
    prevBtn.style.cursor     = atStart ? 'default' : 'pointer';
    nextBtn.style.cursor     = atEnd   ? 'default' : 'pointer';
  }

  prevBtn.addEventListener('click', () => { if (!prevBtn.disabled) goTo(cur - 1); });
  nextBtn.addEventListener('click', () => { if (!nextBtn.disabled) goTo(cur + 1); });
  calcPages(); buildDots(); goTo(0);

  window.addEventListener('resize', () => {
    const nv = getVisible();
    if (nv !== VISIBLE) { VISIBLE = nv; calcPages(); buildDots(); }
    goTo(Math.min(cur, pages - 1));
  }, { passive: true });
})();

// ── FAQ ──────────────────────────────────────────────
(function () {
  document.querySelectorAll('.faq-item').forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    if (!trigger) return;
    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('open');
        const t = i.querySelector('.faq-trigger');
        if (t) t.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();

// ── Contact form ─────────────────────────────────────
(function () {
  const form    = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  if (!form || !submitBtn) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.textContent = 'Enviando…';
    submitBtn.disabled    = true;
    submitBtn.style.opacity = '0.7';

    try {
      const res  = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const data = await res.json();
      if (data.success) {
        submitBtn.textContent   = '¡Enviado! Te respondo pronto ✓';
        submitBtn.style.opacity = '1';
        form.reset();
        setTimeout(() => { submitBtn.textContent = 'Enviar consulta'; submitBtn.disabled = false; }, 4000);
      } else throw new Error('form_error');
    } catch {
      submitBtn.textContent   = 'Error al enviar. Intentá de nuevo.';
      submitBtn.style.opacity = '1';
      submitBtn.disabled      = false;
      setTimeout(() => { submitBtn.textContent = 'Enviar consulta'; }, 4000);
    }
  });
})();

// ── Lightbox (context-aware: carrusel o galería) ──────
(function () {
  const lb      = document.getElementById('lightbox');
  const lbImg   = document.getElementById('lightboxImg');
  const closeBtn= document.getElementById('lightboxClose');
  const lbPrev  = document.getElementById('lbPrev');
  const lbNext  = document.getElementById('lbNext');
  if (!lb || !lbImg) return;

  let imgs = [], cur = 0, lastFocus = null;

  function show(i) {
    if (!imgs.length) return;
    cur = (i + imgs.length) % imgs.length;
    lbImg.src = imgs[cur].src;
    lbImg.alt = imgs[cur].alt || '';
    lb.classList.add('open');
    lb.removeAttribute('aria-hidden');
    closeBtn && closeBtn.focus();
  }

  function close() {
    lb.classList.remove('open');
    lbImg.src = '';
    lb.setAttribute('aria-hidden', 'true');
    if (lastFocus) lastFocus.focus();
  }

  // API pública: carrusel la llama con su propio array de imágenes
  window.openLightbox = function(imageArray, startIndex, focusEl) {
    imgs = imageArray;
    lastFocus = focusEl || null;
    show(startIndex);
  };

  // Galería: abre con sus propias imágenes
  const galleryImgs = Array.from(document.querySelectorAll('.gallery-slide img'));
  galleryImgs.forEach((img, i) => img.addEventListener('click', () => {
    lastFocus = img;
    imgs = galleryImgs;
    show(i);
  }));

  if (closeBtn) closeBtn.addEventListener('click', close);
  if (lbPrev)   lbPrev.addEventListener('click', e => { e.stopPropagation(); show(cur - 1); });
  if (lbNext)   lbNext.addEventListener('click', e => { e.stopPropagation(); show(cur + 1); });
  lb.addEventListener('click', e => { if (e.target === lb) close(); });

  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  show(cur - 1);
    if (e.key === 'ArrowRight') show(cur + 1);
    // Focus trap
    if (e.key === 'Tab') {
      const focusable = [closeBtn, lbPrev, lbNext].filter(Boolean);
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  lb.setAttribute('aria-hidden', 'true');
})();
