// ===== Areeb Ahmer · Portfolio interactions =====
(function () {
  'use strict';

  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ----- Footer year -----
  document.getElementById('year').textContent = new Date().getFullYear();

  // ----- Intro loader -----
  var intro = document.getElementById('intro');
  window.addEventListener('load', function () {
    setTimeout(function () {
      intro.classList.add('is-done');
      // kick off hero split animation after curtain lifts
      document.querySelectorAll('.hero .split').forEach(function (el) { el.classList.add('in'); });
    }, reduced ? 0 : 700);
  });
  // Fallback in case load fires late
  setTimeout(function () {
    intro.classList.add('is-done');
    document.querySelectorAll('.hero .split').forEach(function (el) { el.classList.add('in'); });
  }, 2500);

  // ----- Split text into animatable chars -----
  document.querySelectorAll('[data-split]').forEach(function (el) {
    var text = el.textContent;
    el.textContent = '';
    el.setAttribute('aria-label', text);
    Array.prototype.forEach.call(text, function (ch, i) {
      var span = document.createElement('span');
      span.className = 'char';
      span.style.setProperty('--ci', i);
      span.textContent = ch === ' ' ? '\u00A0' : ch;
      span.setAttribute('aria-hidden', 'true');
      el.appendChild(span);
    });
  });

  // Animate non-hero split elements on scroll
  var splitObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        splitObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('.split').forEach(function (el) {
    if (!el.closest('.hero')) splitObserver.observe(el);
  });

  // ----- Scroll progress bar -----
  var progress = document.getElementById('progress');

  // ----- Nav: scrolled state + hide on scroll down, show on scroll up -----
  var nav = document.getElementById('nav');
  var lastY = 0;

  window.addEventListener('scroll', function () {
    var y = window.scrollY;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    nav.classList.toggle('is-scrolled', y > 40);
    nav.classList.toggle('is-hidden', y > 300 && y > lastY);
    lastY = y;
  }, { passive: true });

  // ----- Mobile menu -----
  var burger = document.getElementById('burger');
  var links = document.getElementById('navLinks');
  burger.addEventListener('click', function () {
    burger.classList.toggle('is-open');
    links.classList.toggle('is-open');
  });
  links.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      burger.classList.remove('is-open');
      links.classList.remove('is-open');
    });
  });

  // ----- Custom cursor -----
  var cursor = document.querySelector('.cursor');
  var dot = document.querySelector('.cursor-dot');
  if (fine && cursor && dot) {
    var cx = 0, cy = 0, tx = 0, ty = 0;
    document.addEventListener('mousemove', function (e) {
      tx = e.clientX; ty = e.clientY;
      dot.style.left = tx + 'px';
      dot.style.top = ty + 'px';
      document.body.classList.add('cursor-on');
    });
    (function follow() {
      cx += (tx - cx) * 0.16;
      cy += (ty - cy) * 0.16;
      cursor.style.left = cx + 'px';
      cursor.style.top = cy + 'px';
      requestAnimationFrame(follow);
    })();
    document.querySelectorAll('a, button, .work-card, .craft-row').forEach(function (el) {
      el.addEventListener('mouseenter', function () { cursor.classList.add('is-hovering'); });
      el.addEventListener('mouseleave', function () { cursor.classList.remove('is-hovering'); });
    });
  }

  // ----- Magnetic elements -----
  if (fine && !reduced) {
    document.querySelectorAll('[data-magnetic]').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        el.style.transform = 'translate(' + x * 0.28 + 'px,' + y * 0.28 + 'px)';
      });
      el.addEventListener('mouseleave', function () {
        el.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
        el.style.transform = '';
        setTimeout(function () { el.style.transition = ''; }, 500);
      });
    });
  }

  // ----- Parallax (scroll-linked + mouse-linked) -----
  if (!reduced) {
    var speedEls = document.querySelectorAll('[data-speed]');
    var mouseEls = document.querySelectorAll('[data-mouse]');
    var mx = 0, my = 0;
    document.addEventListener('mousemove', function (e) {
      mx = e.clientX - window.innerWidth / 2;
      my = e.clientY - window.innerHeight / 2;
    });
    (function parallax() {
      var y = window.scrollY;
      speedEls.forEach(function (el) {
        el.style.transform = 'translateY(' + y * parseFloat(el.dataset.speed) + 'px)';
      });
      if (fine) {
        mouseEls.forEach(function (el) {
          var f = parseFloat(el.dataset.mouse);
          el.style.translate = mx * f + 'px ' + my * f + 'px';
        });
      }
      requestAnimationFrame(parallax);
    })();
  }

  // ----- Typing effect -----
  var roles = [
    'shipping enterprise back ends',
    'architecting on Azure & AWS \u2601\uFE0F',
    'shipping Flutter apps to both stores \uD83D\uDCF1',
    'taming Kubernetes clusters',
    'publishing NuGet packages \uD83D\uDCE6',
    'crafting VS Code extensions',
    'automating the boring stuff \uD83E\uDD16'
  ];
  var typingEl = document.getElementById('typing');
  var roleIdx = 0, charIdx = 0, deleting = false;
  (function type() {
    var word = roles[roleIdx];
    typingEl.textContent = word.slice(0, charIdx);
    if (!deleting && charIdx < word.length) {
      charIdx++; setTimeout(type, 60);
    } else if (!deleting) {
      deleting = true; setTimeout(type, 1800);
    } else if (charIdx > 0) {
      charIdx--; setTimeout(type, 30);
    } else {
      deleting = false; roleIdx = (roleIdx + 1) % roles.length; setTimeout(type, 350);
    }
  })();

  // ----- Directional reveal on scroll -----
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry, i) {
      if (entry.isIntersecting) {
        entry.target.style.transitionDelay = (i % 5) * 80 + 'ms';
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(function (el) { revealObserver.observe(el); });

  // ----- 3D tilt on work cards -----
  if (fine && !reduced) {
    document.querySelectorAll('[data-tilt]').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = 'perspective(800px) rotateY(' + x * 10 + 'deg) rotateX(' + -y * 10 + 'deg) translateY(-4px)';
      });
      card.addEventListener('mouseleave', function () { card.style.transform = ''; });
    });
  }
})();
