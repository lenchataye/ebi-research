/**
 * Shashemene Flora Archive — Premium Shared JavaScript
 * Navigation, animations, lightbox, theme, modals, and global UI chrome
 */

(function () {
  'use strict';

  const LOGO_MARK = `<svg class="site-logo__mark" viewBox="0 0 36 36" fill="none" aria-hidden="true">
    <circle cx="18" cy="18" r="17" stroke="currentColor" stroke-width="1.2" opacity="0.35"/>
    <path d="M18 8c-2 6-8 8-8 14 0 4 3.5 6 8 6s8-2 8-6c0-6-6-8-8-14z" fill="currentColor" opacity="0.9"/>
    <path d="M18 12v14M14 18h8" stroke="var(--ivory)" stroke-width="1" opacity="0.5"/>
  </svg>`;

  const NAV_LINKS = [
    { href: 'index.html', label: 'Home' },
    { href: 'initiative.html', label: 'Initiative' },
    { href: 'researchers.html', label: 'Researchers' },
    {
      href: 'archive.html',
      label: 'Archive',
      dropdown: [
        { href: 'archive.html', label: 'Plant Database', img: 'images/plants/kosso.jpg' },
        { href: 'gallery.html', label: 'Visual Gallery', img: 'images/plants/african wormwood.jpg' }
      ]
    },
    { href: 'field-research.html', label: 'Field Research' },
    { href: 'publications.html', label: 'Publications' },
    { href: 'partners.html', label: 'Partners' },
    { href: 'contact.html', label: 'Contact' }
  ];

  const MODAL_PRESETS = {
    linkedin: {
      title: 'LinkedIn Profile',
      body: 'Our institutional LinkedIn presence is being prepared. For professional inquiries, please contact us directly.',
      actionLabel: 'Email Us',
      actionHref: 'mailto:research@shashemeneflora.org'
    },
    researchgate: {
      title: 'ResearchGate',
      body: 'ResearchGate profiles for our team will be linked here upon publication of our first peer-reviewed paper.',
      actionLabel: 'View Publications',
      actionHref: 'publications.html'
    },
    'pdf-download': {
      title: 'Download PDF',
      body: 'This document is available as a preprint. Request the full PDF by email and we will respond within 5 business days.',
      actionLabel: 'Request PDF',
      actionHref: 'mailto:research@shashemeneflora.org?subject=PDF%20Request'
    },
    'coming-soon': {
      title: 'Publication In Preparation',
      body: 'This paper is currently being prepared for submission to an open-access ethnobotany journal. Subscribe on the home page to receive updates when it is released.',
      actionLabel: 'Back to Publications',
      actionHref: 'publications.html'
    },
    'cv-download': {
      title: 'Curriculum Vitae',
      body: 'A full CV is available on request for collaboration and grant applications. Contact the researcher directly to receive a copy.',
      actionLabel: 'Request CV',
      actionHref: 'mailto:research@shashemeneflora.org?subject=CV%20Request'
    },
    bookmark: {
      title: 'Bookmark Saved',
      body: 'This item has been saved to your browser bookmarks for this session. Full account-based bookmarking will be available in a future release.',
      actionLabel: 'Close',
      actionHref: null
    }
  };

  let modalEl = null;
  let toastEl = null;
  let modalFocusTrap = null;

  /* ==========================================================================
     Global UI Chrome Injection
     ========================================================================== */
  function injectChrome() {
    const theme = localStorage.getItem('sfa-theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);

    if (!document.querySelector('.skip-link')) {
      const skip = document.createElement('a');
      skip.href = '#main';
      skip.className = 'skip-link';
      skip.textContent = 'Skip to content';
      document.body.prepend(skip);
    }

    const preloader = document.createElement('div');
    preloader.className = 'preloader';
    preloader.innerHTML = `
      <div class="preloader__logo">Shashemene Flora Archive</div>
      <div class="preloader__bar"><span></span></div>`;
    document.body.prepend(preloader);
    document.body.classList.add('is-loading');

    const progress = document.createElement('div');
    progress.className = 'scroll-progress';
    progress.setAttribute('aria-hidden', 'true');
    document.body.prepend(progress);

    const backTop = document.createElement('button');
    backTop.className = 'back-to-top';
    backTop.setAttribute('aria-label', 'Back to top');
    backTop.innerHTML = '↑';
    document.body.appendChild(backTop);

    const themeBtn = document.createElement('button');
    themeBtn.className = 'theme-toggle';
    themeBtn.setAttribute('aria-label', 'Toggle dark mode');
    themeBtn.innerHTML = theme === 'dark' ? '☀' : '☾';
    document.body.appendChild(themeBtn);

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
        window.matchMedia('(pointer: fine)').matches) {
      const glow = document.createElement('div');
      glow.className = 'cursor-glow';
      glow.setAttribute('aria-hidden', 'true');
      document.body.appendChild(glow);
      document.body.classList.add('has-cursor');
    }

    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('hidden');
        document.body.classList.remove('is-loading');
      }, 900);
    });

    themeBtn.addEventListener('click', () => {
      const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('sfa-theme', next);
      themeBtn.innerHTML = next === 'dark' ? '☀' : '☾';
    });

    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = docHeight > 0 ? `${(scrollTop / docHeight) * 100}%` : '0%';
      backTop.classList.toggle('visible', scrollTop > 400);
    }, { passive: true });

    backTop.addEventListener('click', () => {
      if (window.sfaLenis) window.sfaLenis.scrollTo(0, { duration: 1.2 });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ==========================================================================
     Premium Pill Header
     ========================================================================== */
  function initPremiumHeader() {
    const header = document.querySelector('.site-header');
    if (!header || header.dataset.premium) return;
    header.dataset.premium = 'true';
    header.classList.add('site-header--pill');

    const inner = header.querySelector('.site-header__inner');
    if (!inner) return;

    if (!inner.querySelector('.site-header__capsule')) {
      const capsule = document.createElement('div');
      capsule.className = 'site-header__capsule';
      while (inner.firstChild) capsule.appendChild(inner.firstChild);
      inner.appendChild(capsule);
    }

    const capsule = inner.querySelector('.site-header__capsule');
    const logo = capsule.querySelector('.site-logo');
    if (logo && !logo.querySelector('.site-logo__words')) {
      const taglineEl = logo.querySelector('span');
      const tagline = taglineEl ? taglineEl.textContent.trim() : 'Ethnobotanical Research Initiative';
      let title = 'Shashemene Flora Archive';
      logo.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          title = node.textContent.trim();
        }
      });
      logo.innerHTML = `${LOGO_MARK}
        <span class="site-logo__words">
          <span class="site-logo__title">${title}</span>
          <span class="site-logo__tagline">${tagline}</span>
        </span>`;
    }

    const toggle = capsule.querySelector('.nav-toggle');
    if (toggle && !toggle.querySelector('.nav-toggle__icon')) {
      toggle.innerHTML = `
        <span class="nav-toggle__icon" aria-hidden="true">
          <span class="nav-toggle__bar"></span>
          <span class="nav-toggle__bar"></span>
          <span class="nav-toggle__bar"></span>
        </span>`;
      toggle.setAttribute('aria-label', 'Open menu');
    }

    /* Toggle always last — visible on mobile */
    if (toggle) capsule.appendChild(toggle);

    const nav = capsule.querySelector('.site-nav');
    if (nav) {
      const ul = nav.querySelector('ul') || document.createElement('ul');
      ul.innerHTML = NAV_LINKS.map(item => {
        if (item.dropdown) {
          return `<li class="nav-item--has-dropdown">
            <a href="${item.href}">${item.label}</a>
            <div class="nav-dropdown" role="menu">
              <p class="nav-dropdown__title">Explore</p>
              ${item.dropdown.map(d => `
                <a href="${d.href}" role="menuitem">
                  <img src="${d.img}" alt="" loading="lazy" onerror="this.style.display='none'">
                  ${d.label}
                </a>`).join('')}
            </div>
          </li>`;
        }
        return `<li><a href="${item.href}">${item.label}</a></li>`;
      }).join('');
      if (!nav.querySelector('ul')) nav.appendChild(ul);
    }

    if (!capsule.querySelector('.header-cta')) {
      const cta = document.createElement('a');
      cta.href = 'archive.html';
      cta.className = 'btn btn--gold btn--small header-cta magnetic-btn';
      cta.textContent = 'Explore Archive';
      capsule.appendChild(cta);
    }

    if (document.body.classList.contains('page-home')) {
      header.classList.toggle('scrolled', window.scrollY > 40);
    } else if (!header.classList.contains('scrolled')) {
      header.classList.add('scrolled');
    }

    window.dispatchEvent(new CustomEvent('sfa:header-ready'));
  }

  /* ==========================================================================
     Universal Modal System
     ========================================================================== */
  function ensureModal() {
    if (modalEl) return modalEl;

    modalEl = document.createElement('div');
    modalEl.className = 'sfa-modal';
    modalEl.setAttribute('role', 'dialog');
    modalEl.setAttribute('aria-modal', 'true');
    modalEl.setAttribute('aria-hidden', 'true');
    modalEl.innerHTML = `
      <div class="sfa-modal__dialog">
        <button class="sfa-modal__close" type="button" aria-label="Close">&times;</button>
        <h2 class="sfa-modal__title"></h2>
        <div class="sfa-modal__body"></div>
        <div class="sfa-modal__actions"></div>
      </div>`;
    document.body.appendChild(modalEl);

    modalEl.querySelector('.sfa-modal__close').addEventListener('click', closeModal);
    modalEl.addEventListener('click', (e) => { if (e.target === modalEl) closeModal(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalEl.classList.contains('active')) closeModal();
    });

    return modalEl;
  }

  function openModal({ title, body, actionLabel, actionHref }) {
    const modal = ensureModal();
    modal.querySelector('.sfa-modal__title').textContent = title;
    modal.querySelector('.sfa-modal__body').innerHTML = body;
    const actions = modal.querySelector('.sfa-modal__actions');
    actions.innerHTML = '';

    if (actionLabel) {
      if (actionHref) {
        const link = document.createElement('a');
        link.href = actionHref;
        link.className = 'btn btn--primary magnetic-btn';
        link.textContent = actionLabel;
        actions.appendChild(link);
      } else {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn btn--primary';
        btn.textContent = actionLabel;
        btn.addEventListener('click', closeModal);
        actions.appendChild(btn);
      }
    }

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modal.querySelector('.sfa-modal__close').focus();
  }

  function closeModal() {
    if (!modalEl) return;
    modalEl.classList.remove('active');
    modalEl.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function openPresetModal(key) {
    const preset = MODAL_PRESETS[key];
    if (preset) openModal(preset);
  }

  window.openSfaModal = openModal;
  window.openSfaPresetModal = openPresetModal;

  function showToast(message) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'sfa-toast';
      toastEl.setAttribute('role', 'status');
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = message;
    toastEl.classList.add('visible');
    setTimeout(() => toastEl.classList.remove('visible'), 3200);
  }

  function initPlaceholderLinks() {
    document.addEventListener('click', (e) => {
      const target = e.target.closest('[data-modal], a[href="#"], button[data-modal]');
      if (!target) return;

      if (target.dataset.modal) {
        e.preventDefault();
        openPresetModal(target.dataset.modal);
        return;
      }

      if (target.tagName === 'A' && target.getAttribute('href') === '#') {
        e.preventDefault();
        const text = target.textContent.trim().toLowerCase();
        if (text.includes('linkedin')) openPresetModal('linkedin');
        else if (text.includes('researchgate')) openPresetModal('researchgate');
        else if (text.includes('download pdf')) openPresetModal('pdf-download');
        else if (text.includes('download cv')) openPresetModal('cv-download');
        else if (text.includes('coming soon')) openPresetModal('coming-soon');
        else openModal({
          title: 'Coming Soon',
          body: 'This feature is under development. Please check back or contact us for more information.',
          actionLabel: 'Contact Us',
          actionHref: 'contact.html'
        });
      }
    });
  }

  /* ==========================================================================
     Button Ripple & Press
     ========================================================================== */
  function initButtonRipples() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn');
      if (!btn || btn.classList.contains('is-loading')) return;

      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'btn__ripple';
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  }

  /* ==========================================================================
     Mobile Navigation
     ========================================================================== */
  function initNav() {
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.site-nav');
    const header = document.querySelector('.site-header');
    if (!toggle || !nav) return;

    function closeNav() {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
      document.body.classList.remove('nav-open');
      document.body.style.overflow = '';
    }

    function openNav() {
      nav.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close menu');
      document.body.classList.add('nav-open');
      document.body.style.overflow = 'hidden';
    }

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (nav.classList.contains('open')) closeNav();
      else openNav();
    });

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeNav);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('open')) closeNav();
    });

    document.addEventListener('click', (e) => {
      if (!nav.classList.contains('open')) return;
      if (!nav.contains(e.target) && !toggle.contains(e.target)) closeNav();
    });

    if (header && typeof ScrollTrigger === 'undefined') {
      window.addEventListener('scroll', () => {
        if (document.body.classList.contains('page-home')) {
          header.classList.toggle('scrolled', window.scrollY > 40);
        }
      }, { passive: true });
      if (document.body.classList.contains('page-home')) {
        header.classList.toggle('scrolled', window.scrollY > 40);
      }
    }
  }

  function initActiveNav() {
    const current = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.site-nav a').forEach(link => {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href === current || (current === '' && href === 'index.html'));
    });
  }

  /* ==========================================================================
     Scroll Reveal (fallback when GSAP unavailable)
     ========================================================================== */
  function initScrollReveal() {
    if (typeof gsap !== 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -60px 0px' }
    );

    document.querySelectorAll('.reveal, .text-reveal, .mask-reveal, [data-stagger]').forEach(el => {
      observer.observe(el);
    });
  }

  /* ==========================================================================
     Counter Animation
     ========================================================================== */
  function initCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.counter, 10);
        const suffix = el.dataset.suffix || '';
        const duration = 1400;
        const start = performance.now();

        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 4);
          el.textContent = Math.floor(eased * target) + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
        observer.unobserve(el);
      });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
  }

  /* ==========================================================================
     Hero Parallax & Mouse Movement
     ========================================================================== */
  function initHeroEffects() {
    const hero = document.querySelector('.hero--cinematic');
    if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const videoWrap = hero.querySelector('.hero__video-wrap');
      const rays = hero.querySelector('.hero__rays');
      if (videoWrap) {
        videoWrap.style.transform = `translate(${x * 14}px, ${y * 10}px) scale(1.06)`;
      }
      if (rays) {
        rays.style.transform = `translate(${x * 20}px, ${y * 12}px)`;
      }
    });

    hero.addEventListener('mouseleave', () => {
      const videoWrap = hero.querySelector('.hero__video-wrap');
      const rays = hero.querySelector('.hero__rays');
      if (videoWrap) videoWrap.style.transform = '';
      if (rays) rays.style.transform = '';
    });
  }

  function initScrollIndicator() {
    const indicator = document.querySelector('.hero__scroll');
    if (!indicator) return;
    indicator.addEventListener('click', () => {
      const next = document.querySelector('.hero--cinematic')?.nextElementSibling;
      if (next) {
        if (window.sfaLenis) window.sfaLenis.scrollTo(next, { offset: -80, duration: 1.4 });
        else next.scrollIntoView({ behavior: 'smooth' });
      }
    });
    indicator.style.cursor = 'pointer';
  }

  /* ==========================================================================
     Cursor Glow
     ========================================================================== */
  function initCursorGlow() {
    const glow = document.querySelector('.cursor-glow');
    if (!glow) return;

    document.addEventListener('mousemove', (e) => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    }, { passive: true });
  }

  /* ==========================================================================
     Magnetic Buttons
     ========================================================================== */
  function initMagneticButtons() {
    document.querySelectorAll('.magnetic-btn, .btn--primary, .btn--gold').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  /* ==========================================================================
     Tabs
     ========================================================================== */
  function initTabs() {
    document.querySelectorAll('.tabs').forEach(tabGroup => {
      const buttons = tabGroup.querySelectorAll('.tab-btn');
      const panels = tabGroup.querySelectorAll('.tab-panel');

      buttons.forEach(btn => {
        btn.addEventListener('click', () => {
          const target = btn.dataset.tab;
          buttons.forEach(b => b.classList.remove('active'));
          panels.forEach(p => p.classList.remove('active'));
          btn.classList.add('active');
          const panel = tabGroup.querySelector(`[data-panel="${target}"]`);
          if (panel) panel.classList.add('active');
        });
      });
    });
  }

  window.initTabs = initTabs;

  /* ==========================================================================
     FAQ Accordion
     ========================================================================== */
  function initFaq() {
    document.querySelectorAll('.faq-item__question').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const isOpen = item.classList.contains('open');
        item.closest('.faq')?.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    });
  }

  /* ==========================================================================
     Gallery Lightbox — Enhanced
     ========================================================================== */
  function initLightbox() {
    const galleryItems = document.querySelectorAll('[data-lightbox]');
    if (!galleryItems.length) return;

    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-label', 'Media viewer');
    lightbox.innerHTML = `
      <button class="lightbox__close" aria-label="Close">&times;</button>
      <button class="lightbox__nav lightbox__prev" aria-label="Previous">&#8249;</button>
      <button class="lightbox__nav lightbox__next" aria-label="Next">&#8250;</button>
      <div class="lightbox__content"></div>
      <p class="lightbox__caption"></p>`;
    document.body.appendChild(lightbox);

    const content = lightbox.querySelector('.lightbox__content');
    const caption = lightbox.querySelector('.lightbox__caption');
    const closeBtn = lightbox.querySelector('.lightbox__close');
    const prevBtn = lightbox.querySelector('.lightbox__prev');
    const nextBtn = lightbox.querySelector('.lightbox__next');
    const items = Array.from(galleryItems);
    let currentIndex = 0;

    function showItem(index) {
      currentIndex = (index + items.length) % items.length;
      const item = items[currentIndex];
      const src = item.dataset.lightbox || item.querySelector('img, video')?.src;
      const type = item.dataset.lightboxType || (item.querySelector('video') ? 'video' : 'image');
      const alt = item.querySelector('img')?.alt || '';
      const meta = item.dataset.meta || '';

      content.innerHTML = '';
      if (type === 'video') {
        const video = document.createElement('video');
        video.src = src;
        video.controls = true;
        video.autoplay = true;
        content.appendChild(video);
      } else {
        const img = document.createElement('img');
        img.src = src;
        img.alt = alt;
        content.appendChild(img);
      }
      caption.textContent = item.dataset.caption || alt;
      if (meta) caption.textContent += ` · ${meta}`;
    }

    function openLightbox(index) {
      showItem(index);
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      content.innerHTML = '';
    }

    galleryItems.forEach((item, index) => {
      item.addEventListener('click', () => openLightbox(index));
    });

    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', () => showItem(currentIndex - 1));
    nextBtn.addEventListener('click', () => showItem(currentIndex + 1));
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showItem(currentIndex - 1);
      if (e.key === 'ArrowRight') showItem(currentIndex + 1);
    });
  }

  /* ==========================================================================
     Citation Copy & Print
     ========================================================================== */
  function initCitationCopy() {
    document.addEventListener('click', async (e) => {
      const btn = e.target.closest('[data-copy-citation]');
      if (!btn) return;
      const block = document.getElementById(btn.dataset.copyCitation);
      if (!block) return;
      try {
        await navigator.clipboard.writeText(block.textContent.trim());
        const orig = btn.textContent;
        btn.textContent = 'Copied!';
        showToast('Citation copied to clipboard');
        setTimeout(() => { btn.textContent = orig; }, 2000);
      } catch {
        btn.textContent = 'Copy failed';
        setTimeout(() => { btn.textContent = 'Copy Citation'; }, 2000);
      }
    });

    document.addEventListener('click', (e) => {
      if (e.target.closest('[data-print]')) window.print();
    });
  }

  /* ==========================================================================
     Contact & Newsletter Forms
     ========================================================================== */
  function validateForm(form) {
    let valid = true;
    form.querySelectorAll('.form-group').forEach(group => {
      group.classList.remove('error');
      const input = group.querySelector('input, textarea, select');
      const errorEl = group.querySelector('.form-error');
      if (errorEl) errorEl.textContent = '';
      if (!input) return;

      if (input.hasAttribute('required') && !input.value.trim()) {
        valid = false;
        group.classList.add('error');
        if (errorEl) errorEl.textContent = 'This field is required.';
      }
      if (input.type === 'email' && input.value.trim()) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) {
          valid = false;
          group.classList.add('error');
          if (errorEl) errorEl.textContent = 'Please enter a valid email address.';
        }
      }
    });
    return valid;
  }

  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    const successMsg = document.getElementById('form-success');
    const submitBtn = form.querySelector('[type="submit"]');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validateForm(form)) return;
      if (submitBtn) submitBtn.classList.add('is-loading');
      setTimeout(() => {
        if (submitBtn) submitBtn.classList.remove('is-loading');
        if (successMsg) {
          successMsg.classList.add('visible');
          form.reset();
          showToast('Message sent — we will respond within 5 business days');
          successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 800);
    });
  }

  function initNewsletter() {
    const form = document.getElementById('newsletter-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const btn = form.querySelector('[type="submit"]');
      if (input && input.value.trim()) {
        if (btn) btn.classList.add('is-loading');
        setTimeout(() => {
          if (btn) btn.classList.remove('is-loading');
          input.value = '';
          showToast('Thank you for subscribing to research updates');
        }, 700);
      }
    });
  }

  /* ==========================================================================
     Footer Last Updated
     ========================================================================== */
  function initLastUpdated() {
    document.querySelectorAll('#last-updated').forEach(el => {
      el.textContent = new Date().toLocaleDateString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric'
      });
    });
  }

  /* ==========================================================================
     Smooth Page Transitions
     ========================================================================== */
  function initPageTransitions() {
    document.querySelectorAll('a[href$=".html"]').forEach(link => {
      if (link.hostname && link.hostname !== window.location.hostname) return;
      if (link.hasAttribute('data-no-transition')) return;
      link.addEventListener('click', (e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
        if (link.getAttribute('href') === '#') return;
        e.preventDefault();
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.45s ease';
        setTimeout(() => { window.location.href = link.href; }, 400);
      });
    });

    document.body.style.opacity = '0';
    requestAnimationFrame(() => {
      document.body.style.transition = 'opacity 0.5s ease';
      document.body.style.opacity = '1';
    });
  }

  function initBookmarks() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-bookmark]');
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();
      const id = btn.dataset.bookmark;
      const key = 'sfa-bookmarks';
      let list = [];
      try { list = JSON.parse(localStorage.getItem(key) || '[]'); } catch { list = []; }
      if (!list.includes(id)) list.push(id);
      localStorage.setItem(key, JSON.stringify(list));
      showToast('Specimen saved to bookmarks');
    });
  }

  function initShareButtons() {
    document.addEventListener('click', async (e) => {
      const btn = e.target.closest('[data-share]');
      if (!btn) return;
      const title = btn.dataset.shareTitle || document.title;
      const url = window.location.href;
      const text = `Shashemene Flora Archive — ${title}`;

      if (navigator.share) {
        try {
          await navigator.share({ title, text, url });
          return;
        } catch { /* fall through */ }
      }

      try {
        await navigator.clipboard.writeText(`${text}\n${url}`);
        showToast('Link copied to clipboard');
      } catch {
        openModal({
          title: 'Share',
          body: `Copy this link to share: <br><br><code style="font-size:0.85em;word-break:break-all;">${url}</code>`,
          actionLabel: 'Close',
          actionHref: null
        });
      }
    });
  }

  /* ==========================================================================
     Init
     ========================================================================== */
  injectChrome();

  document.addEventListener('DOMContentLoaded', () => {
    initPremiumHeader();
    initNav();
    initActiveNav();
    initScrollReveal();
    initCounters();
    initHeroEffects();
    initScrollIndicator();
    initCursorGlow();
    initMagneticButtons();
    initButtonRipples();
    initPlaceholderLinks();
    initBookmarks();
    initShareButtons();
    initTabs();
    initFaq();
    initLightbox();
    initCitationCopy();
    initContactForm();
    initNewsletter();
    initLastUpdated();
    initPageTransitions();
  });

  window.initScrollReveal = initScrollReveal;
  window.showSfaToast = showToast;
})();
