/* ============================================================
   EMBER & OAK — main.js
   ============================================================ */

(function () {
  'use strict';

  /* ── 1. Navbar scroll effect ─────────────────────────────── */
  const mainNav = document.getElementById('mainNav');
  if (mainNav) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          mainNav.classList.toggle('scrolled', window.scrollY > 60);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
    // Set on load in case page is already scrolled
    mainNav.classList.toggle('scrolled', window.scrollY > 60);
  }

  /* ── 2. Scroll-triggered fade-in animations ──────────────── */
  const animatedEls = document.querySelectorAll('.animate-on-scroll');
  if (animatedEls.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    animatedEls.forEach((el) => observer.observe(el));
  } else {
    // Fallback: show everything immediately
    animatedEls.forEach((el) => el.classList.add('visible'));
  }

  /* ── 3. Testimonials carousel ────────────────────────────── */
  const carousel = document.getElementById('testimonialCarousel');
  if (carousel) {
    const items    = carousel.querySelectorAll('.carousel-item');
    const dots     = document.querySelectorAll('.carousel-dot');
    const prevBtn  = document.getElementById('testimonialPrev');
    const nextBtn  = document.getElementById('testimonialNext');
    let current    = 0;
    let timer      = null;

    function show(index) {
      items.forEach((item, i) => {
        item.classList.toggle('active', i === index);
      });
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
      current = index;
    }

    function advance() {
      show((current + 1) % items.length);
    }

    function startTimer() {
      clearInterval(timer);
      timer = setInterval(advance, 7000);
    }

    show(0);
    startTimer();

    if (nextBtn) {
      nextBtn.addEventListener('click', () => { advance(); startTimer(); });
    }
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        show((current - 1 + items.length) % items.length);
        startTimer();
      });
    }
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => { show(i); startTimer(); });
    });

    // Pause on hover
    carousel.addEventListener('mouseenter', () => clearInterval(timer));
    carousel.addEventListener('mouseleave', startTimer);

    // Swipe support
    let touchStartX = 0;
    carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    carousel.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(dx) > 40) {
        dx < 0 ? advance() : show((current - 1 + items.length) % items.length);
        startTimer();
      }
    }, { passive: true });
  }

  /* ── 4. Menu sticky category nav ────────────────────────── */
  const catButtons = document.querySelectorAll('.cat-btn[data-target]');
  const menuSections = document.querySelectorAll('.menu-section-block[id]');

  if (catButtons.length && menuSections.length) {
    // Smooth scroll on click
    catButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = document.getElementById(btn.dataset.target);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // Active state on scroll
    if ('IntersectionObserver' in window) {
      const sectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              catButtons.forEach((btn) => {
                btn.classList.toggle('active', btn.dataset.target === entry.target.id);
              });
            }
          });
        },
        { threshold: 0.25, rootMargin: '-120px 0px -40% 0px' }
      );
      menuSections.forEach((section) => sectionObserver.observe(section));
    }
  }

  /* ── 5. Form handling (reservations + contact) ────────────── */
  function handleForm(formId, successId) {
    const form    = document.getElementById(formId);
    const success = document.getElementById(successId);
    const spinner = form && form.querySelector('.btn-spinner');
    const btnText = form && form.querySelector('.btn-text');

    if (!form || !success) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (spinner) spinner.classList.remove('d-none');
      if (btnText) btnText.textContent = 'Sending…';
      form.querySelectorAll('button[type="submit"]').forEach((b) => (b.disabled = true));

      // Simulate network request
      setTimeout(() => {
        form.style.display = 'none';
        success.style.display = 'block';
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 1200);
    });
  }

  handleForm('reservationForm', 'reservationSuccess');
  handleForm('contactForm',     'contactSuccess');

  /* ── 6. Today's min-date on date inputs ──────────────────── */
  document.querySelectorAll('input[type="date"][data-min-today]').forEach((input) => {
    const today = new Date().toISOString().split('T')[0];
    input.setAttribute('min', today);
  });

  /* ── 7. Mobile nav close on link click ───────────────────── */
  const offcanvasEl = document.getElementById('mobileNav');
  if (offcanvasEl) {
    offcanvasEl.querySelectorAll('a.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
        if (bsOffcanvas) bsOffcanvas.hide();
      });
    });
  }

  /* ── 8. Spinner animation for submit buttons ──────────────── */
  // Already handled inside handleForm() above.

})();
