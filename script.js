(function () {
  'use strict';

  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav-toggle');

  if (nav && toggle) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', nav.classList.contains('nav-open'));
    });

    document.querySelectorAll('.nav-links a, .nav-menu .btn').forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.innerWidth < 769) nav.classList.remove('nav-open');
      });
    });
  }

  /* Hero carousel: washing images with lazy loading */
  const slides = document.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.carousel-dots .dot');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');

  /* Lazy load carousel images with mobile/desktop support */
  function loadCarouselImage(slide) {
    const isMobile = window.innerWidth <= 768;
    const bgUrl = isMobile
      ? slide.getAttribute('data-bg-mobile')
      : slide.getAttribute('data-bg-desktop') || slide.getAttribute('data-bg-mobile');
    const isLoaded = slide.getAttribute('data-loaded') === 'true';
    const hasBackground = slide.style.backgroundImage && slide.style.backgroundImage !== 'none';

    if (bgUrl && !isLoaded && !hasBackground) {
      const img = new Image();
      img.onload = function () {
        slide.style.backgroundImage = 'url(' + bgUrl + ')';
        slide.classList.add('loaded');
        slide.setAttribute('data-loaded', 'true');
      };
      img.onerror = function () {
        console.warn('Failed to load carousel image:', bgUrl);
        slide.setAttribute('data-loaded', 'error');
      };
      img.src = bgUrl;
    } else if (bgUrl && !hasBackground) {
      slide.style.backgroundImage = 'url(' + bgUrl + ')';
      slide.setAttribute('data-loaded', 'true');
    }
  }

  /* Handle window resize for responsive images */
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      const slides = document.querySelectorAll('.carousel-slide');
      slides.forEach(function(slide) {
        if (slide.classList.contains('active')) {
          slide.setAttribute('data-loaded', 'false');
          loadCarouselImage(slide);
        }
      });
    }, 250);
  });

  /* Load first slide immediately, mobile-optimized preloading */
  if (slides.length) {
    const isMobile = window.innerWidth <= 768;
    // First slide - load immediately
    const firstSlide = slides[0];
    loadCarouselImage(firstSlide);

    // On mobile: only preload next slide, on desktop: preload next 2
    if (!isMobile) {
      if (slides.length > 1) {
        setTimeout(function() { loadCarouselImage(slides[1]); }, 500);
      }
      if (slides.length > 2) {
        setTimeout(function() { loadCarouselImage(slides[2]); }, 1000);
      }
    } else {
      // Mobile: only preload next slide when user interacts
      if (slides.length > 1) {
        const observer = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              loadCarouselImage(entry.target);
              observer.unobserve(entry.target);
            }
          });
        }, { rootMargin: '50px' });
        observer.observe(slides[1]);
      }
    }

    // Lazy load remaining slides
    slides.forEach(function (slide, index) {
      if (index > (isMobile ? 1 : 2)) {
        const observer = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              loadCarouselImage(entry.target);
              observer.unobserve(entry.target);
            }
          });
        }, { rootMargin: isMobile ? '100px' : '200px' });
        observer.observe(slide);
      }
    });
  }

  if (slides.length && dots.length) {
    let current = 0;
    const total = slides.length;
    const isMobile = window.innerWidth <= 768;
    const INTERVAL = isMobile ? 7000 : 5500; // Slower on mobile to reduce CPU
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function goTo(index) {
      current = (index + total) % total;

      // Ensure current slide image is loaded
      const currentSlide = slides[current];
      loadCarouselImage(currentSlide);

      // Preload adjacent slides
      const nextIndex = (current + 1) % total;
      const prevIndex = (current - 1 + total) % total;
      loadCarouselImage(slides[nextIndex]);
      loadCarouselImage(slides[prevIndex]);

      slides.forEach(function (s, i) {
        s.classList.toggle('active', i === current);
      });
      dots.forEach(function (d, i) {
        d.classList.toggle('active', i === current);
        d.setAttribute('aria-current', i === current ? 'true' : null);
      });
    }

    function next() {
      goTo(current + 1);
    }

    function prev() {
      goTo(current - 1);
    }

    let timer = prefersReducedMotion ? null : setInterval(next, INTERVAL);

    function resetTimer() {
      if (timer) clearInterval(timer);
      timer = prefersReducedMotion ? null : setInterval(next, INTERVAL);
    }

    function clearCarouselTimer() {
      if (timer) clearInterval(timer);
      timer = null;
    }

    nextBtn && nextBtn.addEventListener('click', function () {
      next();
      resetTimer();
    });
    prevBtn && prevBtn.addEventListener('click', function () {
      prev();
      resetTimer();
    });
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        goTo(i);
        resetTimer();
      });
    });

    document.addEventListener('visibilitychange', function () {
      if (prefersReducedMotion) return;
      if (document.hidden) {
        clearCarouselTimer();
      } else {
        timer = setInterval(next, INTERVAL);
      }
    });
  }

  /* Scroll-triggered reveal animations */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { root: null, rootMargin: '0px 0px -60px 0px', threshold: 0.1 }
    );
    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* Number counting animation for stats */
  const stats = document.querySelectorAll('.stat-num');
  if (stats.length) {
    const statsObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            entry.target.classList.add('counted');
            const target = entry.target;
            const text = target.textContent.trim();
            const match = text.match(/^(\d+)([+\.]?)$/);
            if (match) {
              const num = parseInt(match[1], 10);
              const suffix = match[2] || '';
              let current = 0;
              const increment = num / 40;
              const timer = setInterval(function () {
                current += increment;
                if (current >= num) {
                  current = num;
                  clearInterval(timer);
                }
                target.textContent = Math.floor(current) + suffix;
              }, 20);
            }
          }
        });
      },
      { root: null, rootMargin: '0px', threshold: 0.5 }
    );
    stats.forEach(function (stat) {
      statsObserver.observe(stat);
    });
  }

  /* Parallax scrolling effect (disabled on mobile for performance) */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth <= 768;
  if (!prefersReducedMotion && !isMobile) {
    let ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          const scrolled = window.pageYOffset;
          const heroCarousel = document.querySelector('.hero-carousel');
          const heroVisual = document.querySelector('.hero-visual');

          if (heroCarousel) {
            heroCarousel.style.transform = 'translateY(' + (scrolled * 0.3) + 'px)';
          }

          if (heroVisual) {
            heroVisual.style.transform = 'translateX(-50%) translateY(' + (scrolled * 0.2) + 'px)';
          }

          ticking = false;
        });
        ticking = true;
      }
    });
  }

  /* Smooth scroll with offset for fixed header */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = anchor.getAttribute('href');
      if (href !== '#' && href.length > 1) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const headerOffset = 80;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  /* Interactive cursor effect for buttons and cards */
  const interactiveElements = document.querySelectorAll('.btn, .service-card, .pricing-card, .contact-card, .stat');
  interactiveElements.forEach(function (el) {
    el.addEventListener('mouseenter', function () {
      el.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });
    el.addEventListener('mouseleave', function () {
      el.style.transition = '';
    });
  });

  /* Scroll-based animations for sections */
  const sections = document.querySelectorAll('.section');
  const sectionObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'fade-in-scale 0.8s ease-out';
          entry.target.style.opacity = '1';
        }
      });
    },
    { root: null, rootMargin: '-10% 0px', threshold: 0.1 }
  );
  sections.forEach(function (section) {
    section.style.opacity = '0';
    sectionObserver.observe(section);
  });

  /* Mouse move parallax for hero content (disabled on mobile) */
  const heroContent = document.querySelector('.hero-content');
  if (heroContent && !prefersReducedMotion && !isMobile) {
    let ticking = false;
    document.addEventListener('mousemove', function (e) {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          const x = (e.clientX / window.innerWidth - 0.5) * 15;
          const y = (e.clientY / window.innerHeight - 0.5) * 15;
          heroContent.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  /* Add sparkle effect on click */
  document.addEventListener('click', function (e) {
    if (e.target.matches('.btn, .service-card, .pricing-card')) {
      const sparkle = document.createElement('span');
      sparkle.style.position = 'fixed';
      sparkle.style.width = '6px';
      sparkle.style.height = '6px';
      sparkle.style.background = 'var(--accent)';
      sparkle.style.borderRadius = '50%';
      sparkle.style.pointerEvents = 'none';
      sparkle.style.left = e.clientX + 'px';
      sparkle.style.top = e.clientY + 'px';
      sparkle.style.boxShadow = '0 0 12px var(--accent-glow)';
      sparkle.style.animation = 'sparkle 0.6s ease-out forwards';
      document.body.appendChild(sparkle);
      setTimeout(function () {
        sparkle.remove();
      }, 600);
    }
  });

  /* Animate section dividers on scroll */
  const dividers = document.querySelectorAll('.section-divider');
  const dividerObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'bounce-in 0.8s ease-out';
        }
      });
    },
    { threshold: 0.5 }
  );
  dividers.forEach(function (divider) {
    dividerObserver.observe(divider);
  });

  /* Stagger animation for service cards on hover (desktop only) */
  if (!isMobile) {
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(function (card, index) {
      card.addEventListener('mouseenter', function () {
        serviceCards.forEach(function (otherCard, otherIndex) {
          if (otherIndex !== index) {
            otherCard.style.transform = 'scale(0.98)';
            otherCard.style.opacity = '0.7';
          }
        });
      });
      card.addEventListener('mouseleave', function () {
        serviceCards.forEach(function (otherCard) {
          otherCard.style.transform = '';
          otherCard.style.opacity = '';
        });
      });
    });
  }
})();
