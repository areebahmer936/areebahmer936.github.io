// Areeb Ahmer portfolio
(function () {
  'use strict';

  var root = document.documentElement;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.classList.add('js');

  document.getElementById('year').textContent = new Date().getFullYear();

  // ---------- Hero load sequence, once fonts are in ----------
  function ready() { requestAnimationFrame(function () { root.classList.add('is-ready'); }); }
  if (document.fonts && document.fonts.ready) {
    Promise.race([document.fonts.ready, new Promise(function (r) { setTimeout(r, 1200); })]).then(ready);
  } else { ready(); }

  // ---------- Nav ----------
  var nav = document.getElementById('nav');
  window.addEventListener('scroll', function () {
    nav.classList.toggle('is-scrolled', window.scrollY > 24);
  }, { passive: true });

  var links = document.querySelectorAll('.nav__links a');
  var sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      links.forEach(function (a) {
        a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id);
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  ['top', 'work', 'more', 'skills', 'contact'].forEach(function (id) {
    var s = document.getElementById(id);
    if (s) sectionObserver.observe(s);
  });

  // ---------- Scroll reveal ----------
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      // stagger siblings that enter together
      var siblings = Array.prototype.filter.call(el.parentNode.children, function (c) { return c.classList.contains('reveal'); });
      el.style.transitionDelay = Math.min(siblings.indexOf(el), 6) * 60 + 'ms';
      el.classList.add('is-in');
      setTimeout(function () { el.style.transitionDelay = ''; }, 1200);
      revealObserver.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  document.querySelectorAll('.reveal').forEach(function (el) { revealObserver.observe(el); });

  // ---------- Cursor spotlight on tiles ----------
  document.querySelectorAll('.tile').forEach(function (tile) {
    tile.addEventListener('pointermove', function (e) {
      var r = tile.getBoundingClientRect();
      tile.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      tile.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  // ---------- Stackup payment flow ----------
  var flow = document.getElementById('flow');
  if (flow) {
    var steps = flow.querySelectorAll('.flow__steps li');
    var i = -1, flowTimer = null;
    function tick() {
      i = (i + 1) % (steps.length + 2); // two beats of rest on the settled state
      if (i === 0) steps.forEach(function (s) { s.classList.remove('is-done', 'is-active'); });
      steps.forEach(function (s, n) {
        s.classList.toggle('is-active', n === i);
        if (n <= i) s.classList.add('is-done');
      });
    }
    if (reduced) {
      steps.forEach(function (s) { s.classList.add('is-done'); });
    } else {
      new IntersectionObserver(function (entries) {
        var visible = entries[0].isIntersecting;
        if (visible && !flowTimer) { tick(); flowTimer = setInterval(tick, 1400); }
        if (!visible && flowTimer) { clearInterval(flowTimer); flowTimer = null; }
      }, { threshold: 0.3 }).observe(flow);
    }
  }

  // ---------- Videos: play only while on screen ----------
  var videos = document.querySelectorAll('.browser video');
  var videoObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var v = entry.target;
      if (entry.isIntersecting) {
        if (v.preload === 'none') v.preload = 'auto';
        if (!reduced || v.dataset.userPlay) { var p = v.play(); if (p) p.catch(function () {}); }
      } else {
        v.pause();
      }
    });
  }, { threshold: 0.35 });
  videos.forEach(function (v) {
    videoObserver.observe(v);
    var btn = v.parentNode.querySelector('.sound');
    btn.addEventListener('click', function () {
      var on = v.muted;
      // only one video talks at a time
      videos.forEach(function (o) {
        o.muted = true;
        var b = o.parentNode.querySelector('.sound');
        b.setAttribute('aria-pressed', 'false'); b.textContent = 'Turn sound on';
      });
      if (on) {
        v.muted = false; v.dataset.userPlay = '1';
        var p = v.play(); if (p) p.catch(function () {});
        btn.setAttribute('aria-pressed', 'true'); btn.textContent = 'Mute';
      }
    });
  });

  // ---------- Copy email ----------
  var copyBtn = document.getElementById('copyEmail');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var label = 'Copy email address';
      function show(text) {
        copyBtn.textContent = text;
        setTimeout(function () { copyBtn.textContent = label; }, 2200);
      }
      if (!navigator.clipboard) return show('Copy failed. Use the email button instead.');
      navigator.clipboard.writeText(copyBtn.dataset.email).then(
        function () { show('Copied to clipboard'); },
        function () { show('Copy failed. Use the email button instead.'); }
      );
    });
  }
})();
