/**
 * Shashemene Flora Archive — Premium Motion
 * GSAP + Lenis + SplitType orchestration
 */
(function () {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initLenis() {
    if (reducedMotion || typeof Lenis === 'undefined') return null;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4
    });

    lenis.on('scroll', () => {
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.update();
    });

    if (typeof gsap !== 'undefined') {
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }

    window.sfaLenis = lenis;
    return lenis;
  }

  function initHeroParticles() {
    const canvas = document.querySelector('.hero__particles');
    if (!canvas || reducedMotion) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let w, h;

    function resize() {
      const hero = canvas.closest('.hero');
      if (!hero) return;
      w = canvas.width = hero.offsetWidth;
      h = canvas.height = hero.offsetHeight;
    }

    function createParticles(count) {
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.5 + 0.5,
          vx: (Math.random() - 0.5) * 0.3,
          vy: -Math.random() * 0.4 - 0.1,
          o: Math.random() * 0.4 + 0.1
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(247, 243, 235, ${p.o})`;
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
      });
      requestAnimationFrame(draw);
    }

    resize();
    createParticles(Math.min(40, Math.floor(w / 40)));
    draw();
    window.addEventListener('resize', () => {
      resize();
      createParticles(Math.min(40, Math.floor(w / 40)));
    });
  }

  function splitText(el) {
    if (!el || reducedMotion || typeof SplitType === 'undefined') return null;
    try {
      return new SplitType(el, { types: 'lines, words', lineClass: 'line', wordClass: 'word' });
    } catch {
      return null;
    }
  }

  function initHeroTimeline() {
    const hero = document.querySelector('.hero--cinematic');
    if (!hero || typeof gsap === 'undefined') return;

    const label = hero.querySelector('.hero__content .label-upper');
    const h1 = hero.querySelector('.hero__content h1');
    const subtitle = hero.querySelector('.hero__content p:not(.label-upper)');
    const actions = hero.querySelector('.hero__actions');
    const stats = hero.querySelector('.hero__stats');
    const scroll = hero.querySelector('.hero__scroll');

    if (reducedMotion) {
      hero.querySelectorAll('.text-reveal, .reveal').forEach(el => el.classList.add('visible'));
      return;
    }

    const split = h1 ? splitText(h1) : null;
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    if (label) {
      gsap.set(label, { opacity: 0, y: 20 });
      tl.to(label, { opacity: 1, y: 0, duration: 0.8 }, 0.3);
    }

    if (split && split.words) {
      gsap.set(split.words, { opacity: 0, y: '110%' });
      tl.to(split.words, { opacity: 1, y: 0, duration: 1, stagger: 0.04 }, 0.5);
    } else if (h1) {
      gsap.set(h1, { opacity: 0, y: 30 });
      tl.to(h1, { opacity: 1, y: 0, duration: 1 }, 0.5);
    }

    if (subtitle) {
      gsap.set(subtitle, { opacity: 0, y: 24 });
      tl.to(subtitle, { opacity: 1, y: 0, duration: 0.9 }, '-=0.5');
    }

    if (actions) {
      gsap.set(actions.children, { opacity: 0, y: 20 });
      tl.to(actions.children, { opacity: 1, y: 0, duration: 0.7, stagger: 0.12 }, '-=0.4');
    }

    if (stats) {
      gsap.set(stats, { opacity: 0, y: 30 });
      tl.to(stats, { opacity: 1, y: 0, duration: 0.9 }, '-=0.3');
    }

    if (scroll) {
      gsap.set(scroll, { opacity: 0 });
      tl.to(scroll, { opacity: 1, duration: 0.8 }, '-=0.2');
    }

    const videoWrap = hero.querySelector('.hero__video-wrap');
    if (videoWrap && typeof ScrollTrigger !== 'undefined') {
      gsap.to(videoWrap, {
        y: 100,
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
    }
  }

  function initScrollAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      document.querySelectorAll('.reveal, .text-reveal, .mask-reveal, [data-stagger]').forEach(el => {
        el.classList.add('visible');
      });
      return;
    }

    if (reducedMotion) {
      document.querySelectorAll('.reveal, [data-stagger]').forEach(el => el.classList.add('visible'));
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray('.section h2, .section-header h2').forEach(heading => {
      if (heading.closest('.hero')) return;
      const split = splitText(heading);
      if (split && split.lines) {
        gsap.set(split.lines, { opacity: 0, y: 40 });
        gsap.to(split.lines, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: heading,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        });
      }
    });

    gsap.utils.toArray('.reveal:not(.hero .reveal)').forEach(el => {
      if (el.classList.contains('visible')) return;
      gsap.set(el, { opacity: 0, y: 48 });
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none'
        },
        onComplete: () => el.classList.add('visible')
      });
    });

    gsap.utils.toArray('.mask-reveal').forEach(el => {
      gsap.set(el, { clipPath: 'inset(100% 0 0 0)' });
      gsap.to(el, {
        clipPath: 'inset(0% 0 0 0)',
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        onComplete: () => el.classList.add('visible')
      });
    });

    gsap.utils.toArray('.split-layout__media img, .featured-plant__image img').forEach(img => {
      gsap.fromTo(img,
        { scale: 1.1 },
        {
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: img,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        }
      );
    });

    gsap.utils.toArray('[data-stagger]').forEach(container => {
      const children = container.children;
      if (!children.length) return;
      gsap.set(children, { opacity: 0, y: 32 });
      gsap.to(children, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: container,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        onComplete: () => container.classList.add('visible')
      });
    });
  }

  function initPageHero() {
    const pageHero = document.querySelector('.hero--page .hero__content');
    if (!pageHero || typeof gsap === 'undefined' || reducedMotion) return;

    const h1 = pageHero.querySelector('h1');
    const split = h1 ? splitText(h1) : null;
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    if (split && split.words) {
      gsap.set(pageHero.querySelector('.label-upper'), { opacity: 0, y: 20 });
      gsap.set(split.words, { opacity: 0, y: '100%' });
      tl.to(pageHero.querySelector('.label-upper'), { opacity: 1, y: 0, duration: 0.6 }, 0.2);
      tl.to(split.words, { opacity: 1, y: 0, duration: 0.8, stagger: 0.03 }, 0.35);
      tl.to(pageHero.querySelector('p'), { opacity: 1, y: 0, duration: 0.7 }, '-=0.4');
      gsap.set(pageHero.querySelector('p'), { opacity: 0, y: 20 });
    } else {
      gsap.set(pageHero.children, { opacity: 0, y: 24 });
      tl.to(pageHero.children, { opacity: 1, y: 0, duration: 0.8, stagger: 0.12 }, 0.2);
    }
  }

  function initHeaderShrink() {
    let bound = false;

    function bindShrink() {
      if (bound) return;
      const header = document.querySelector('.site-header--pill');
      if (!header) return;
      bound = true;

      function updateHeader() {
        if (document.body.classList.contains('page-home')) {
          header.classList.toggle('scrolled', window.scrollY > 40);
        }
      }

      window.addEventListener('scroll', updateHeader, { passive: true });
      updateHeader();
    }

    window.addEventListener('sfa:header-ready', bindShrink);
    document.addEventListener('DOMContentLoaded', bindShrink);
  }

  document.addEventListener('DOMContentLoaded', () => {
    initLenis();
    initHeroParticles();
    initHeroTimeline();
    initPageHero();
    initScrollAnimations();
    initHeaderShrink();
  });
})();
