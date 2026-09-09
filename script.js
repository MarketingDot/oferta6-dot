/* ============================================================
   DOT ENERGY — Oferta Dia do Consumidor
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Countdown ---------------------------------------
     A barra usa data-deadline. Dois modos:
       "end-of-day"                  -> zera às 23:59:59 de hoje
       "2026-03-15T23:59:59-03:00"   -> data fixa
  ------------------------------------------------------------- */
  function resolveDeadline(raw) {
    if (!raw || raw === 'end-of-day') {
      var end = new Date();
      end.setHours(23, 59, 59, 999);
      return end;
    }
    var parsed = new Date(raw);
    return isNaN(parsed) ? new Date(Date.now() + 864e5) : parsed;
  }

  var salebar = document.getElementById('salebar');
  var inline = document.getElementById('timerInline');
  var fields = {};

  document.querySelectorAll('#timer [data-t]').forEach(function (el) {
    fields[el.dataset.t] = el;
  });

  var deadline = resolveDeadline(salebar && salebar.dataset.deadline);
  var pad = function (n) { return String(n).padStart(2, '0'); };

  function tick() {
    var left = Math.max(0, deadline - Date.now());
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

  tick();
  setInterval(tick, 1000);

  /* ---------- Marquee -----------------------------------------
     Clona a faixa até cobrir o dobro da largura da tela; as cópias
     animam juntas, então o loop não tem emenda.
  ------------------------------------------------------------- */
  var track = document.getElementById('marqueeTrack');

  if (track) {
    var marquee = track.parentElement;
    var guard = 0;

    while (marquee.scrollWidth < window.innerWidth * 2 && guard < 12) {
      var clone = track.cloneNode(true);
      clone.removeAttribute('id');
      clone.setAttribute('aria-hidden', 'true');
      marquee.appendChild(clone);
      guard++;
    }
  }

  /* ---------- Carrosséis --------------------------------------- */
  if (typeof Swiper === 'undefined') return;

  // O navegador arrasta <img> nativamente e isso engole o swipe no desktop.
  document.querySelectorAll('.swiper img').forEach(function (img) {
    img.draggable = false;
    img.addEventListener('dragstart', function (e) { e.preventDefault(); });
  });

  // Depoimentos — espelha o comportamento da RYZE: centrado, com peek
  new Swiper('#reviewsSwiper', {
    slidesPerView: 1.2,
    spaceBetween: 10,
    centeredSlides: true,
    loop: true,
    grabCursor: true,
    pagination: { el: '#reviewsDots', clickable: true },
    breakpoints: {
      640:  { slidesPerView: 1.8, spaceBetween: 16 },
      992:  { slidesPerView: 2.6, spaceBetween: 16 },
      1280: { slidesPerView: 3.2, spaceBetween: 16 }
    }
  });

  // Brindes — só existe abaixo de 992px (acima vira grid)
  var giftsSwiper = null;

  function syncGiftsSwiper() {
    var shouldRun = window.matchMedia('(max-width: 991px)').matches;

    if (shouldRun && !giftsSwiper) {
      giftsSwiper = new Swiper('#giftsSwiper', {
        slidesPerView: 1.6,
        spaceBetween: 8,
        centeredSlides: true,
        grabCursor: true,
        pagination: { el: '#giftsDots', clickable: true }
      });
    } else if (!shouldRun && giftsSwiper) {
      giftsSwiper.destroy(true, true);
      giftsSwiper = null;
    }
  }

  syncGiftsSwiper();
  window.addEventListener('resize', syncGiftsSwiper);

  // Galeria do bloco de oferta
  var thumbs = new Swiper('#galleryThumbs', {
    slidesPerView: 5,
    spaceBetween: 8,
    watchSlidesProgress: true
  });

  new Swiper('#galleryMain', {
    slidesPerView: 1,
    spaceBetween: 0,
    grabCursor: true,
    thumbs: { swiper: thumbs }
  });
})();
