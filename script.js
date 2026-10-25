// AIMAURA: small enhancements (no framework, no build step)

/* ==========================================================================
   LIVE STREAM SETTINGS: the only part you need to edit for stream day.
   - twitch / facebook: paste the full channel or event links. The
     "Follow on ..." buttons appear automatically once a link is added.
   - date: e.g. '2026-11-12T19:00:00Z' (ISO format). Leave '' for "TBA".
   - live: set to true while you are streaming. This shows a LIVE banner
     at the top of the page and turns the badge red. Set back to false after.
   ========================================================================== */
var STREAM = {
  twitch:   '',   // e.g. 'https://www.twitch.tv/aimaura'
  facebook: '',   // e.g. 'https://www.facebook.com/aimaura'
  date:     '',   // e.g. '2026-11-12T19:00:00Z'
  live:     false
};

(function () {
  'use strict';

  // Year in footer
  var y = document.getElementById('year');
  if (y) y.textContent = String(new Date().getFullYear());

  // ---- Live stream wiring ------------------------------------------------
  function setLink(id, url) {
    var a = document.getElementById(id);
    if (a && url) { a.href = url; a.hidden = false; }
  }
  setLink('link-twitch', STREAM.twitch);
  setLink('link-facebook', STREAM.facebook);

  var dateEl = document.getElementById('live-date');
  if (dateEl && STREAM.date) {
    var d = new Date(STREAM.date);
    if (!isNaN(d)) {
      dateEl.textContent = d.toLocaleString('en-GB', {
        weekday: 'short', day: 'numeric', month: 'long',
        hour: '2-digit', minute: '2-digit', timeZoneName: 'short'
      });
    }
  }

  var tagText = document.getElementById('live-tag-text');
  if (STREAM.live) {
    document.documentElement.classList.add('is-live');
    if (tagText) tagText.textContent = 'Live now';
    var notify = document.getElementById('notify-btn');
    if (notify) notify.hidden = true;
    var banner = document.getElementById('live-banner');
    if (banner) {
      banner.hidden = false;
      // Point the banner at the first available channel
      var link = banner.querySelector('.live-banner__link');
      var url = STREAM.twitch || STREAM.facebook;
      if (link && url) { link.href = url; link.target = '_blank'; link.rel = 'noopener'; }
      var setH = function () {
        document.documentElement.style.setProperty('--banner-h', banner.offsetHeight + 'px');
      };
      setH();
      window.addEventListener('resize', setH, { passive: true });
    }
  } else if (tagText && STREAM.date) {
    tagText.textContent = 'Scheduled';
  }

  // ---- Sticky nav background ---------------------------------------------
  var nav = document.getElementById('nav');
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      if (nav) nav.classList.toggle('is-stuck', window.scrollY > 24);
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---- Mobile menu --------------------------------------------------------
  var burger = document.getElementById('burger');
  var links = document.getElementById('nav-links');
  function closeMenu() {
    if (!links || !burger) return;
    links.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
  }
  if (burger && links) {
    burger.addEventListener('click', function () {
      var open = links.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    links.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeMenu); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
  }

  // ---- Reveal on scroll ---------------------------------------------------
  var reveals = document.querySelectorAll('.reveal');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  // ---- Pause hero video when off-screen (saves CPU/battery) ----------------
  var heroVideo = document.querySelector('.hero__video');
  if (heroVideo) {
    if (reduce) {
      heroVideo.pause();
      heroVideo.removeAttribute('autoplay');
    } else if ('IntersectionObserver' in window) {
      var vo = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var pr = heroVideo.play();
            if (pr && pr.catch) pr.catch(function () {});
          } else {
            heroVideo.pause();
          }
        });
      }, { threshold: 0.05 });
      vo.observe(heroVideo);
    }
  }

  // ---- Highlight the current section in the nav ---------------------------
  if ('IntersectionObserver' in window && links) {
    var map = {};
    links.querySelectorAll('a[href^="#"]').forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var a = map[entry.target.id];
        if (!a) return;
        if (entry.isIntersecting) {
          Object.keys(map).forEach(function (k) { map[k].removeAttribute('aria-current'); });
          a.setAttribute('aria-current', 'true');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function (id) {
      var s = document.getElementById(id);
      if (s) so.observe(s);
    });
  }
})();
