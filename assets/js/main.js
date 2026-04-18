/**
 * main.js — Росен Симеонов | rosensimeonov.com
 * Handles: mobile drawer, header scroll, smooth scroll, contact form, back-to-top
 */

document.addEventListener('DOMContentLoaded', function () {

  /* ─── ELEMENTS ─────────────────────────────────────────── */
  const header       = document.getElementById('siteHeader');
  const burgerBtn    = document.getElementById('burgerBtn');
  const drawer       = document.getElementById('drawer');
  const drawerClose  = document.getElementById('drawerClose');
  const drawerOverlay= document.getElementById('drawerOverlay');
  const backTop      = document.getElementById('backTop');
  const contactForm  = document.getElementById('contactForm');
  const formSubmit   = document.getElementById('formSubmit');
  const formStatus   = document.getElementById('formStatus');

  const scrollLinks  = document.querySelectorAll('.js-scroll-link');
  const closeDrawerLinks = document.querySelectorAll('.js-close-drawer');

  let lastFocused = null;
  let ticking = false;

  /* ─── DRAWER ────────────────────────────────────────────── */
  function openDrawer() {
    lastFocused = document.activeElement;
    drawer.classList.add('is-open');
    drawerOverlay.classList.add('is-open');
    burgerBtn.classList.add('is-open');
    burgerBtn.setAttribute('aria-expanded', 'true');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('drawer-open');
    drawerClose.focus();
  }

  function closeDrawer() {
    drawer.classList.remove('is-open');
    drawerOverlay.classList.remove('is-open');
    burgerBtn.classList.remove('is-open');
    burgerBtn.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('drawer-open');
    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus();
    }
  }

  if (burgerBtn) {
    burgerBtn.addEventListener('click', function () {
      drawer.classList.contains('is-open') ? closeDrawer() : openDrawer();
    });
  }

  if (drawerClose)   drawerClose.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

  closeDrawerLinks.forEach(function (el) {
    el.addEventListener('click', closeDrawer);
  });

  // Close drawer on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawer && drawer.classList.contains('is-open')) {
      closeDrawer();
    }
  });

  // Close drawer on resize to desktop
  window.addEventListener('resize', function () {
    if (window.innerWidth > 900 && drawer && drawer.classList.contains('is-open')) {
      closeDrawer();
    }
  });

  /* ─── HEADER SCROLL STATE ───────────────────────────────── */
  function updateHeader() {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 20);
  }

  /* ─── BACK TO TOP ───────────────────────────────────────── */
  function updateBackTop() {
    if (!backTop) return;
    backTop.classList.toggle('is-visible', window.scrollY > 400);
  }

  if (backTop) {
    backTop.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
      });
    });
  }

  /* ─── SCROLL HANDLER (rAF-throttled) ───────────────────── */
  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(function () {
        updateHeader();
        updateBackTop();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  updateHeader();
  updateBackTop();

  /* ─── SMOOTH SCROLL ─────────────────────────────────────── */
  function smoothScrollTo(targetId) {
    const target = document.getElementById(targetId);
    if (!target) return;

    const headerH = header ? header.offsetHeight : 80;
    const top = target.getBoundingClientRect().top + window.pageYOffset - headerH - 12;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' });

    // Move focus for keyboard / screen reader users
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  }

  scrollLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      const targetId = this.dataset.target;
      if (!targetId) return;
      e.preventDefault();
      closeDrawer();
      // Small delay so drawer animates out before scroll
      setTimeout(function () { smoothScrollTo(targetId); }, 50);
    });
  });

  /* ─── CONTACT FORM ──────────────────────────────────────── */
  if (contactForm && formSubmit && formStatus) {

    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      // Clear old status
      setStatus('', '');

      if (!contactForm.checkValidity()) {
        setStatus('error', 'Моля, попълнете коректно всички задължителни полета.');
        return;
      }

      setLoading(true);

      try {
        const res = await fetch(contactForm.action, {
          method: 'POST',
          body: new FormData(contactForm),
          headers: { Accept: 'application/json' }
        });

        if (res.ok) {
          contactForm.reset();
          setStatus('success', 'Съобщението беше изпратено успешно. Благодарим Ви!');
        } else {
          setStatus('error', 'Възникна проблем при изпращането. Моля, опитайте отново.');
        }
      } catch (_) {
        setStatus('error', 'Неуспешна връзка. Моля, опитайте след малко.');
      } finally {
        setLoading(false);
      }
    });
  }

  function setLoading(on) {
    if (!formSubmit) return;
    formSubmit.disabled = on;
    formSubmit.textContent = on ? 'Изпращане…' : 'Изпрати';
    formSubmit.classList.toggle('is-loading', on);
  }

  function setStatus(type, msg) {
    if (!formStatus) return;
    formStatus.className = 'form-status' + (type ? ' is-visible is-' + type : '');
    formStatus.textContent = msg;
  }

  /* ─── HERO SCROLL HINT: hide after first scroll ─────────── */
  const scrollHint = document.querySelector('.hero-scroll-hint');
  if (scrollHint) {
    window.addEventListener('scroll', function hideHint() {
      if (window.scrollY > 60) {
        scrollHint.style.opacity = '0';
        scrollHint.style.pointerEvents = 'none';
        window.removeEventListener('scroll', hideHint);
      }
    }, { passive: true });
  }

  /* ─── FAQ: close others on open ─────────────────────────── */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (this.open) {
        faqItems.forEach(function (other) {
          if (other !== item && other.open) other.open = false;
        });
      }
    });
  });

});
