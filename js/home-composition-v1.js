/* KAMBA+ Home Composition Upgrade v1
   Safe layer-only motion: does not touch translations, nav or partners. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;
  if (!window.gsap || !window.ScrollTrigger) return;

  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);

  document.querySelectorAll('.comp-svg').forEach(function (svg) {
    var lines = svg.querySelectorAll('.comp-line');
    lines.forEach(function (line) {
      try {
        var len = line.getTotalLength();
        line.style.strokeDasharray = len;
        line.style.strokeDashoffset = len;
      } catch (e) {}
    });

    ScrollTrigger.create({
      trigger: svg.closest('section') || svg,
      start: 'top 78%',
      once: true,
      onEnter: function () {
        gsap.to(lines, {
          strokeDashoffset: 0,
          duration: 1.4,
          stagger: 0.12,
          ease: 'power2.out'
        });

        gsap.fromTo(
          svg.querySelectorAll('.comp-node'),
          { opacity: 0, scale: 0.5, transformOrigin: 'center' },
          { opacity: 0.75, scale: 1, duration: 0.55, stagger: 0.08, ease: 'back.out(1.7)' }
        );
      }
    });
  });

  document.querySelectorAll('.comp-blob[data-depth]').forEach(function (blob) {
    var section = blob.closest('section');
    var depth = parseFloat(blob.getAttribute('data-depth')) || 0.12;

    gsap.to(blob, {
      y: function () { return depth * 180; },
      x: function () { return depth * -42; },
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  });

  var premiumGroups = [
    { trigger: '.new-services', targets: '.feat-card', y: 34, stagger: 0.08 },
    { trigger: '.packages', targets: '.package-card', y: 28, stagger: 0.10 },
    { trigger: '.cred', targets: '.cred__stat', y: 22, stagger: 0.08 }
  ];

  premiumGroups.forEach(function (group) {
    var targets = document.querySelectorAll(group.targets);
    var trigger = document.querySelector(group.trigger);
    if (!targets.length || !trigger) return;

    gsap.set(targets, { willChange: 'transform, opacity' });

    ScrollTrigger.create({
      trigger: trigger,
      start: 'top 82%',
      once: true,
      onEnter: function () {
        gsap.fromTo(
          targets,
          { opacity: 0, y: group.y, scale: 0.985 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.75,
            stagger: group.stagger,
            ease: 'power3.out',
            clearProps: 'willChange'
          }
        );
      }
    });
  });

  var heroVisual = document.querySelector('.hero__visual');

  if (heroVisual) {
    gsap.to(heroVisual, {
      y: -22,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
  }
})();