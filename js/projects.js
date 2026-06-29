/* KAMBA+ Projects Page — fixed navbar + safe motion */
(function () {
  'use strict';

  function initProjectsPage() {
    var nav = document.getElementById('nav');
    var burger = document.getElementById('burger');
    var drawer = document.getElementById('drawer');

    function setScrolled() {
      if (!nav) return;
      var isScrolled = window.scrollY > 24;
      nav.classList.toggle('nav--scrolled', isScrolled);
      nav.classList.toggle('scrolled', isScrolled);
      nav.classList.toggle('is-scrolled', isScrolled);
    }

    setScrolled();
    window.addEventListener('scroll', setScrolled, { passive: true });
    window.addEventListener('resize', setScrolled, { passive: true });

    if (burger && drawer) {
      burger.addEventListener('click', function () {
        var open = burger.getAttribute('aria-expanded') !== 'true';
        burger.setAttribute('aria-expanded', String(open));
        burger.classList.toggle('is-open', open);
        burger.classList.toggle('open', open);
        drawer.classList.toggle('is-open', open);
        drawer.classList.toggle('open', open);
        drawer.setAttribute('aria-hidden', String(!open));
        document.body.classList.toggle('drawer-open', open);
      });

      drawer.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          burger.setAttribute('aria-expanded', 'false');
          burger.classList.remove('is-open', 'open');
          drawer.classList.remove('is-open', 'open');
          drawer.setAttribute('aria-hidden', 'true');
          document.body.classList.remove('drawer-open');
        });
      });
    }

    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || !window.gsap || !window.ScrollTrigger) return;

    var gsap = window.gsap;
    gsap.registerPlugin(window.ScrollTrigger);

    gsap.fromTo('.projects-hero__copy > *',
      { opacity: 0, y: 26 },
      { opacity: 1, y: 0, duration: .75, stagger: .11, ease: 'power3.out', delay: .08 }
    );

    gsap.fromTo('.projects-hero__panel',
      { opacity: 0, y: 30, scale: .98 },
      { opacity: 1, y: 0, scale: 1, duration: .78, ease: 'power3.out', delay: .25 }
    );

    gsap.utils.toArray('.project-card').forEach(function (card, index) {
      gsap.fromTo(card,
        { opacity: 0, y: 34, scale: .985 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: .72,
          ease: 'power3.out',
          delay: (index % 3) * .06,
          scrollTrigger: { trigger: card, start: 'top 86%', once: true }
        }
      );
    });

    gsap.to('.projects-blob--a', {
      y: 90,
      x: -30,
      ease: 'none',
      scrollTrigger: { trigger: '.projects-hero', start: 'top top', end: 'bottom top', scrub: true }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProjectsPage);
  } else {
    initProjectsPage();
  }
})();
