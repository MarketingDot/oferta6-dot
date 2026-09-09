/* ============================================================
   DOT ENERGY — Oferta Dia do Consumidor · V2
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Countdown -----------------------------------------
     data-deadline aceita "end-of-day" (zera às 23:59:59 de hoje) ou
     uma data ISO. Quando zera, a barra troca o contador por
     "Precisa de mais tempo? Sim" — o mesmo recurso da RYZE.
  ---------------------------------------------------------------- */
  var EXTRA_MINUTES = 15;

  var salebar = document.getElementById('salebar');
  var inline = document.getElementById('timerInline');
  var fields = {};

  document.querySelectorAll('.salebar [data-t]').forEach(function (el) {
    fields[el.dataset.t] = el;
  });

  function endOfDay() {
    var d = new Date();
    d.setHours(23, 59, 59, 999);
    return d;
  }

  function resolveDeadline(raw) {
    if (!raw || raw === 'end-of-day') return endOfDay();
    var parsed = new Date(raw);
    return isNaN(parsed) ? endOfDay() : parsed;
  }

  var deadline = resolveDeadline(salebar && salebar.dataset.deadline);
  var pad = function (n) { return String(n).padStart(2, '0'); };

  function tick() {
    var left = Math.max(0, deadline - Date.now());
    var expired = left === 0;

    document.body.classList.toggle('is-expired', expired);

    var s = Math.floor(left / 1000);
    var parts = {
      d: Math.floor(s / 86400),
      h: Math.floor(s / 3600) % 24,
      m: Math.floor(s / 60) % 60,
      s: s % 60
    };

    Object.keys(parts).forEach(function (k) {
      if (fields[k]) fields[k].textContent = pad(parts[k]);
    });

    if (inline) {
      inline.textContent = pad(parts.d) + ':' + pad(parts.h) + ':' + pad(parts.m) + ':' + pad(parts.s);
    }
  }

  document.querySelectorAll('[data-reset-timer]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      deadline = new Date(Date.now() + EXTRA_MINUTES * 60000);
      tick();
    });
  });

  tick();
  setInterval(tick, 1000);

  /* ---------- Carrosséis ----------------------------------------- */
  if (typeof Swiper === 'undefined') return;

  // O navegador arrasta <img> nativamente e isso engole o swipe no desktop.
  document.querySelectorAll('.swiper img').forEach(function (img) {
    img.draggable = false;
    img.addEventListener('dragstart', function (e) { e.preventDefault(); });
  });

  // Galeria do produto: principal + miniaturas (5 por vez, como na RYZE)
  var thumbs = new Swiper('#galleryThumbs', {
    slidesPerView: 5,
    spaceBetween: 8,
    watchSlidesProgress: true,
    slideToClickedSlide: true
  });

  new Swiper('#galleryMain', {
    slidesPerView: 1,
    spaceBetween: 0,
    grabCursor: true,
    watchOverflow: true,
    keyboard: { enabled: true, onlyInViewport: true },
    navigation: { prevEl: '#galleryPrev', nextEl: '#galleryNext' },
    thumbs: { swiper: thumbs }
  });

  // Brindes: só roda abaixo de 992px (acima o CSS mostra o grid)
  var giftsSwiper = null;

  function syncGifts() {
    var isMobile = window.matchMedia('(max-width: 991px)').matches;

    if (isMobile && !giftsSwiper) {
      giftsSwiper = new Swiper('#giftsSwiper', {
        slidesPerView: 1.6,
        spaceBetween: 8,
        centeredSlides: true,
        grabCursor: true,
        watchOverflow: true,
        keyboard: { enabled: true, onlyInViewport: true },
        pagination: { el: '#giftsDots', clickable: true }
      });
    } else if (!isMobile && giftsSwiper) {
      giftsSwiper.destroy(true, true);
      giftsSwiper = null;
    }
  }

  syncGifts();
  window.addEventListener('resize', syncGifts);
})();
