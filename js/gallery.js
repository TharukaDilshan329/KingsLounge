/**
 * King's Lounge — Gallery JavaScript
 * Masonry filtering and lightbox functionality
 */

(function () {
  'use strict';

  /* --- Gallery Filter --- */
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-masonry-item');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const filter = this.getAttribute('data-filter');

      filterBtns.forEach(function (b) {
        b.classList.remove('active');
      });
      this.classList.add('active');

      galleryItems.forEach(function (item) {
        const category = item.getAttribute('data-category');

        if (filter === 'all' || category === filter) {
          item.style.display = 'block';
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';

          requestAnimationFrame(function () {
            item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          });
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(function () {
            item.style.display = 'none';
          }, 400);
        }
      });
    });
  });

  /* --- Lightbox --- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.querySelector('.lightbox-image');
  const lightboxCaption = document.querySelector('.lightbox-caption');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');

  let currentImages = [];
  let currentIndex = 0;

  function collectImages() {
    currentImages = [];
    document.querySelectorAll('.gallery-masonry-item:not([style*="display: none"]) img, .gallery-item-preview img').forEach(function (img) {
      currentImages.push({
        src: img.src || img.getAttribute('data-full') || img.dataset.src,
        alt: img.alt || '',
        caption: img.getAttribute('data-caption') || img.alt || ''
      });
    });
  }

  function openLightbox(index) {
    if (!lightbox || !lightboxImage) return;

    collectImages();
    currentIndex = index;

    if (currentImages.length === 0) return;

    updateLightboxImage();
    lightbox.classList.add('active');
    document.body.classList.add('no-scroll');
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.classList.remove('no-scroll');
  }

  function updateLightboxImage() {
    if (!lightboxImage || currentImages.length === 0) return;

    const image = currentImages[currentIndex];
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;

    if (lightboxCaption) {
      lightboxCaption.textContent = image.caption;
    }
  }

  function showPrev() {
    currentIndex = currentIndex > 0 ? currentIndex - 1 : currentImages.length - 1;
    updateLightboxImage();
  }

  function showNext() {
    currentIndex = currentIndex < currentImages.length - 1 ? currentIndex + 1 : 0;
    updateLightboxImage();
  }

  /* Bind click events to gallery items */
  document.querySelectorAll('.gallery-masonry-item, .gallery-item-preview').forEach(function (item, index) {
    item.addEventListener('click', function () {
      collectImages();
      const img = this.querySelector('img');
      const clickedSrc = img ? (img.src || img.dataset.src) : '';

      const foundIndex = currentImages.findIndex(function (imgData) {
        return imgData.src === clickedSrc;
      });

      openLightbox(foundIndex >= 0 ? foundIndex : index);
    });

    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', '0');
    item.setAttribute('aria-label', 'View image in lightbox');

    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', showPrev);
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', showNext);
  }

  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  document.addEventListener('keydown', function (e) {
    if (!lightbox || !lightbox.classList.contains('active')) return;

    switch (e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowLeft':
        showPrev();
        break;
      case 'ArrowRight':
        showNext();
        break;
    }
  });

  /* Touch swipe support for lightbox */
  let touchStartX = 0;
  let touchEndX = 0;

  if (lightbox) {
    lightbox.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', function (e) {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          showNext();
        } else {
          showPrev();
        }
      }
    }, { passive: true });
  }
})();
