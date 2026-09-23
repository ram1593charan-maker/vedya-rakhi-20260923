/* ============================================
   VEDYA RAKHI — Interactions
   Lightweight: scroll reveal, nav, parallax
   ============================================ */

(() => {
  'use strict';

  // ---------- Sticky nav scroll state ----------
  const nav = document.querySelector('.nav');
  if (nav) {
    let lastY = 0;
    const onScroll = () => {
      const y = window.scrollY;
      nav.classList.toggle('scrolled', y > 30);
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ---------- Scroll reveal ----------
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));

    // Safety net: after 2.5s, reveal anything still hidden so users
    // who land-and-scroll-fast never see permanently-hidden content.
    setTimeout(() => {
      document.querySelectorAll('.reveal:not(.in)').forEach(el => el.classList.add('in'));
    }, 2500);
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  // ---------- 3D tilt on product cards (desktop only) ----------
  const isCoarse = window.matchMedia('(pointer: coarse)').matches;
  if (!isCoarse) {
    document.querySelectorAll('.product').forEach(card => {
      const media = card.querySelector('.product__media');
      if (!media) return;
      const inner = card.querySelector('.product__media-inner') || media.querySelector('img');
      const target = inner || media;

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const rx = (y - 0.5) * -8;
        const ry = (x - 0.5) * 8;
        target.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.04)`;
      });

      card.addEventListener('mouseleave', () => {
        target.style.transform = '';
      });
    });
  }

  // ---------- Parallax hero cards (scroll-driven) ----------
  const heroCards = document.querySelectorAll('.hero__card');
  if (heroCards.length && !isCoarse) {
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      heroCards.forEach((c, i) => {
        const speed = 0.15 + (i * 0.05);
        const rot = parseFloat(c.dataset.rot || 0);
        c.style.transform = `translateY(${y * -speed}px) rotate(${rot}deg)`;
      });
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
    // store initial rotation
    heroCards.forEach(c => {
      const t = getComputedStyle(c).transform;
      // skip parsing, just use class-defined rotation via CSS animation; scroll overrides transform
    });
  }

  // ---------- Smooth-scroll anchor links ----------
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href === '#' || href.length < 2) return;
      const tgt = document.querySelector(href);
      if (!tgt) return;
      e.preventDefault();
      const top = tgt.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ---------- Collection page: filter ----------
  const filterBtns = document.querySelectorAll('.filter__btn[data-filter]');
  const productEls = document.querySelectorAll('.products .product[data-style]');
  if (filterBtns.length && productEls.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const f = btn.dataset.filter;
        filterBtns.forEach(b => b.classList.toggle('active', b === btn));
        productEls.forEach(p => {
          const match = f === 'all' || p.dataset.style === f;
          p.style.display = match ? '' : 'none';
        });
      });
    });
  }

  // ---------- Contact form: minimal validation ----------
  const form = document.querySelector('.form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = data.get('name') || 'Friend';
      const msg = data.get('message') || '';
      const phone = '+91XXXXXXXXXX'; // replace with real number on deploy
      const url = `https://wa.me/${phone.replace(/[^0-9]/g,'')}?text=${encodeURIComponent(
        `Hi Vedya Rakhi, I'm ${name}. ${msg}`
      )}`;
      window.open(url, '_blank');
    });
  }

  // ---------- Marquee duplication for seamless loop ----------
  document.querySelectorAll('.marquee__track').forEach(track => {
    track.innerHTML += track.innerHTML;
  });

  // ---------- Mobile menu toggle ----------
  const burger = document.querySelector('.nav__burger');
  const links  = document.querySelector('.nav__links');
  if (burger && links) {
    burger.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      if (open) {
        links.style.cssText = 'display:flex;position:absolute;top:100%;left:0;right:0;background:var(--ivory);flex-direction:column;padding:20px var(--gutter);box-shadow:var(--shadow-md);border-top:1px solid rgba(212,162,76,0.2);';
      } else {
        links.style.cssText = '';
      }
    });
  }

  // ---------- Animated number counters (showcase stats) ----------
  document.querySelectorAll('[data-counter]').forEach(el => {
    const target = parseInt(el.dataset.counter, 10);
    if (isNaN(target)) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const dur = 1400;
        const start = performance.now();
        const step = (now) => {
          const p = Math.min(1, (now - start) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.floor(target * eased).toLocaleString('en-IN');
          if (p < 1) requestAnimationFrame(step);
          else el.textContent = target.toLocaleString('en-IN');
        };
        requestAnimationFrame(step);
        io.unobserve(e.target);
      });
    }, { threshold: 0.5 });
    io.observe(el);
  });

})();