/**
 * King's Lounge — Main JavaScript
 * Navigation, animations, sliders, counters, forms
 */

(function () {
  'use strict';

  /* --- Loading Screen --- */
  const loader = document.querySelector('.loader');
  const PROMO_VERSION = '1';
  const PROMO_STORAGE_KEY = 'kingsLoungePromoDismissed';

  function hideLoader() {
    if (!loader) {
      maybeShowPromo();
      return;
    }
    setTimeout(function () {
      loader.classList.add('hidden');
      maybeShowPromo();
    }, 2200);
  }

  window.addEventListener('load', hideLoader);
  document.body.classList.add('no-scroll');

  /* --- Promotion Modal (first visit) --- */
  const promoModal = document.getElementById('promo-modal');
  const promoImage = promoModal ? promoModal.querySelector('.promo-modal-image') : null;

  function shouldShowPromo() {
    try {
      return localStorage.getItem(PROMO_STORAGE_KEY) !== PROMO_VERSION;
    } catch (err) {
      return true;
    }
  }

  function dismissPromo() {
    try {
      localStorage.setItem(PROMO_STORAGE_KEY, PROMO_VERSION);
    } catch (err) {
      /* ignore storage errors */
    }
  }

  function closePromoModal() {
    if (!promoModal) return;
    promoModal.classList.remove('active');
    promoModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    dismissPromo();
  }

  function showPromoModal() {
    if (!promoModal) {
      document.body.classList.remove('no-scroll');
      return;
    }
    promoModal.classList.add('active');
    promoModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
  }

  function maybeShowPromo() {
    if (!promoModal || !shouldShowPromo()) {
      document.body.classList.remove('no-scroll');
      return;
    }

    if (promoImage && !promoImage.complete) {
      promoImage.addEventListener('load', function () {
        showPromoModal();
      });
      promoImage.addEventListener('error', function () {
        document.body.classList.remove('no-scroll');
      });
      return;
    }

    if (promoImage && promoImage.naturalWidth === 0) {
      document.body.classList.remove('no-scroll');
      return;
    }

    showPromoModal();
  }

  if (promoModal) {
    promoModal.querySelectorAll('[data-promo-close]').forEach(function (el) {
      el.addEventListener('click', closePromoModal);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && promoModal.classList.contains('active')) {
        closePromoModal();
      }
    });
  }

  /* --- Navbar Scroll Effect --- */
  const navbar = document.querySelector('.navbar');
  const hero = document.querySelector('.hero, .page-hero');

  function handleNavScroll() {
    if (!navbar) return;

    if (document.querySelector('.page-hero')) {
      navbar.classList.add('scrolled');
      navbar.classList.remove('transparent');
      return;
    }

    const scrollY = window.scrollY;
    const threshold = hero ? hero.offsetHeight * 0.8 : 100;

    if (scrollY > threshold) {
      navbar.classList.add('scrolled');
      navbar.classList.remove('transparent');
    } else {
      navbar.classList.remove('scrolled');
      if (hero) navbar.classList.add('transparent');
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  /* --- Mobile Menu --- */
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-menu a');

  function toggleMobileMenu() {
    if (!hamburger || !mobileMenu) return;
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    document.body.classList.toggle('no-scroll', isOpen);
  }

  function closeMobileMenu() {
    if (!hamburger || !mobileMenu) return;
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
  }

  if (hamburger) {
    hamburger.addEventListener('click', toggleMobileMenu);
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Toggle navigation menu');
  }

  mobileLinks.forEach(function (link) {
    link.addEventListener('click', closeMobileMenu);
  });

  /* --- Smooth Scrolling --- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = navbar ? navbar.offsetHeight : 0;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  /* --- Intersection Observer: Scroll Reveal --- */
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* --- Animated Statistics Counter --- */
  const statNumbers = document.querySelectorAll('.stat-number');

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);

      el.textContent = current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  if ('IntersectionObserver' in window && statNumbers.length) {
    const statsObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    statNumbers.forEach(function (stat) {
      statsObserver.observe(stat);
    });
  }

  /* --- Testimonial Slider --- */
  const testimonialTrack = document.querySelector('.testimonial-track');
  const testimonialSlides = document.querySelectorAll('.testimonial-slide');
  const testimonialDots = document.querySelectorAll('.testimonial-dot');
  let currentSlide = 0;
  let slideInterval;

  function goToSlide(index) {
    if (!testimonialTrack || !testimonialSlides.length) return;

    currentSlide = index;
    if (currentSlide >= testimonialSlides.length) currentSlide = 0;
    if (currentSlide < 0) currentSlide = testimonialSlides.length - 1;

    testimonialTrack.style.transform = 'translateX(-' + currentSlide * 100 + '%)';

    testimonialDots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  function startSlideShow() {
    slideInterval = setInterval(function () {
      goToSlide(currentSlide + 1);
    }, 5000);
  }

  function resetSlideShow() {
    clearInterval(slideInterval);
    startSlideShow();
  }

  if (testimonialSlides.length) {
    testimonialDots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        goToSlide(i);
        resetSlideShow();
      });
    });

    startSlideShow();

    const slider = document.querySelector('.testimonial-slider');
    if (slider) {
      slider.addEventListener('mouseenter', function () {
        clearInterval(slideInterval);
      });
      slider.addEventListener('mouseleave', startSlideShow);
    }
  }

  /* --- Back to Top Button --- */
  const backToTop = document.querySelector('.back-to-top');

  function handleBackToTop() {
    if (!backToTop) return;
    if (window.scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', handleBackToTop, { passive: true });

  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* --- Contact Form --- */
  const contactForm = document.getElementById('reservation-form');
  const formSuccess = document.querySelector('.form-success');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const formData = new FormData(contactForm);
      const name = formData.get('name');
      const phone = formData.get('phone');
      const email = formData.get('email');
      const guests = formData.get('guests');
      const date = formData.get('date');
      const time = formData.get('time');
      const message = formData.get('message') || '';

      const whatsappMessage = encodeURIComponent(
        "Hello King's Lounge! I'd like to make a reservation.\n\n" +
          'Name: ' + name + '\n' +
          'Phone: ' + phone + '\n' +
          'Email: ' + email + '\n' +
          'Guests: ' + guests + '\n' +
          'Date: ' + date + '\n' +
          'Time: ' + time + '\n' +
          (message ? 'Message: ' + message : '')
      );

      const whatsappBtn = contactForm.querySelector('.btn-whatsapp-submit');
      if (whatsappBtn) {
        whatsappBtn.href = 'https://wa.me/94704010005?text=' + whatsappMessage;
      }

      if (formSuccess) {
        formSuccess.classList.add('show');
        contactForm.reset();

        setTimeout(function () {
          formSuccess.classList.remove('show');
        }, 5000);
      }
    });
  }

  /* --- WhatsApp Reservation Button --- */
  const whatsappReserveBtn = document.querySelector('.whatsapp-reserve-btn');
  if (whatsappReserveBtn) {
    whatsappReserveBtn.addEventListener('click', function (e) {
      if (contactForm) {
        e.preventDefault();
        contactForm.dispatchEvent(new Event('submit', { cancelable: true }));
        const whatsappLink = contactForm.querySelector('.btn-whatsapp-submit');
        if (whatsappLink && whatsappLink.href) {
          window.open(whatsappLink.href, '_blank');
        }
      }
    });
  }

  /* --- Menu Category Navigation --- */
  const menuCatBtns = document.querySelectorAll('.menu-cat-btn');

  menuCatBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      menuCatBtns.forEach(function (b) {
        b.classList.remove('active');
      });
      this.classList.add('active');
    });
  });

  /* --- Set minimum date for reservation --- */
  const dateInput = document.querySelector('input[type="date"]');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  /* --- Active Nav Link based on current page --- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* --- Lazy Load Images (native + fallback) --- */
  if ('loading' in HTMLImageElement.prototype) {
    document.querySelectorAll('img[loading="lazy"]').forEach(function (img) {
      if (img.dataset.src) {
        img.src = img.dataset.src;
      }
    });
  } else {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    const lazyObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) img.src = img.dataset.src;
          lazyObserver.unobserve(img);
        }
      });
    });

    lazyImages.forEach(function (img) {
      lazyObserver.observe(img);
    });
  }
})();
