/* ============================================================
   DOT ENERGY — Oferta Dia do Consumidor · V2
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Countdown -----------------------------------------
     Tres estados, na ordem em que o visitante os ve:
       1. rodando      conta data-minutes (7) para baixo
       2. is-expired   zerou: "Precisa de mais tempo? Sim"
       3. is-reserved  clicou em Sim, ganhou data-extra-minutes (5)
                       e zerou de novo: "Oferta reservada"

     O estado vai para o sessionStorage. Sem isso um F5 devolveria os
     7 minutos e "reservada" nunca significaria nada -- o visitante
     recarregaria de volta para o comeco.
  ---------------------------------------------------------------- */
  var salebar = document.getElementById('salebar');
  var inline = document.getElementById('timerInline');
  var data = (salebar && salebar.dataset) || {};

  var START_MINUTES = Number(data.minutes) || 7;
  var EXTRA_MINUTES = Number(data.extraMinutes) || 5;
  var STORE_KEY = 'dot-oferta-timer';

  var fields = {};
  document.querySelectorAll('.salebar [data-t]').forEach(function (el) {
    fields[el.dataset.t] = el;
  });

  // sessionStorage lanca em aba anonima / cookies bloqueados: sem ele a
  // pagina continua funcionando, so perde a memoria entre recargas.
  function load() {
    try {
      var saved = JSON.parse(sessionStorage.getItem(STORE_KEY));
      return saved && typeof saved.deadline === 'number' ? saved : null;
    } catch (e) { return null; }
  }

  function save() {
    try { sessionStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {}
  }

  var state = load() || { deadline: Date.now() + START_MINUTES * 60000, extended: false };
  save();

  var pad = function (n) { return String(n).padStart(2, '0'); };

  function tick() {
    var left = Math.max(0, state.deadline - Date.now());
    var over = left === 0;

    document.body.classList.toggle('is-expired', over && !state.extended);
    document.body.classList.toggle('is-reserved', over && state.extended);

    var s = Math.floor(left / 1000);
    var parts = { h: Math.floor(s / 3600), m: Math.floor(s / 60) % 60, s: s % 60 };

    Object.keys(parts).forEach(function (k) {
      if (fields[k]) fields[k].textContent = pad(parts[k]);
    });

    if (inline) {
      inline.textContent = pad(parts.h) + ':' + pad(parts.m) + ':' + pad(parts.s);
    }
  }

  document.querySelectorAll('[data-reset-timer]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (state.extended) return;   // a prorrogacao e uma so
      state.deadline = Date.now() + EXTRA_MINUTES * 60000;
      state.extended = true;
      save();
      tick();
    });
  });

  tick();
  setInterval(tick, 1000);

  /* ---------- Popup de sabores -----------------------------------
     3 etapas: sabor do pouch 1, sabor do pouch 2, brindes.
     Escolher avanca sozinho; a seta volta; a barra marca o progresso.

     A escolha sai por dois caminhos, iguais aos de antes:
       - data-pouch1 / data-pouch2 no botao de checkout
       - query string, quando o botao tiver data-checkout com a URL real
  ---------------------------------------------------------------- */
  var modal = document.getElementById('flavorModal');

  if (modal) {
    var sheet    = modal.querySelector('.modal__sheet');
    var titulo   = document.getElementById('modalTitle');
    var voltar   = modal.querySelector('[data-back]');
    var cta      = document.getElementById('modalCta');
    var passos   = [].slice.call(modal.querySelectorAll('.modal__step'));
    var paineis  = [].slice.call(modal.querySelectorAll('.modal__panel'));
    var track    = document.getElementById('modalTrack');
    var picks    = [].slice.call(modal.querySelectorAll('.pick input'));
    var checkout = document.getElementById('checkoutBtn');
    var unlocked = document.getElementById('modalUnlocked');
    var giroImgs = unlocked ? [].slice.call(unlocked.querySelectorAll('img')) : [];
    var giroTimer = null;
    var giroIdx = 0;

    var TITULOS = ['Escolha seu 1º sabor', 'Escolha seu 2º sabor', 'Você ganhou os brindes!'];
    var etapa = 1;
    var anterior = null;   // quem tinha o foco antes de abrir

    function escolhido(grupo) {
      return modal.querySelector('input[name="' + grupo + '"]:checked');
    }

    function render() {
      titulo.textContent = TITULOS[etapa - 1];
      voltar.hidden = etapa === 1;

      paineis.forEach(function (p) {
        var ativo = Number(p.dataset.step) === etapa;
        // inert em vez de hidden: o painel precisa continuar ocupando coluna
        // no trilho, mas sai do Tab e do leitor de tela quando nao e o da vez
        p.inert = !ativo;
        p.setAttribute('aria-hidden', ativo ? 'false' : 'true');
      });
      passos.forEach(function (p, i) { p.classList.toggle('is-done', i < etapa); });

      // o botao de finalizar so existe na etapa dos brindes; antes dela o
      // rodape mostra o que ja esta garantido
      cta.hidden = etapa < 3;
      if (unlocked) {
        unlocked.hidden = etapa === 3;
        if (unlocked.hidden) desligaGiro(); else ligaGiro();
      }

      desliza();

      picks.forEach(function (i) {
        i.parentNode.classList.toggle('is-on', i.checked);
      });

      var a = escolhido('pouch1');
      var b = escolhido('pouch2');

      if (checkout) {
        checkout.dataset.pouch1 = a ? a.value : '';
        checkout.dataset.pouch2 = b ? b.value : '';

        var base = checkout.dataset.checkout;
        if (base && a && b) {
          try {
            var url = new URL(base, location.href);
            url.searchParams.set('pouch1', a.value);
            url.searchParams.set('pouch2', b.value);
            checkout.href = url.toString();
          } catch (e) {}
        }
      }
    }

    /* rodizio das miniaturas: uma de cada vez.
       O timer so roda com a barra a vista -- nao ha porque girar imagem
       em popup fechado ou na etapa dos brindes.                          */
    function pintaGiro() {
      giroImgs.forEach(function (img, i) { img.classList.toggle('is-on', i === giroIdx); });
    }

    function ligaGiro() {
      if (giroTimer || giroImgs.length < 2) return;
      pintaGiro();
      giroTimer = setInterval(function () {
        giroIdx = (giroIdx + 1) % giroImgs.length;
        pintaGiro();
      }, 1700);
    }

    function desligaGiro() {
      clearInterval(giroTimer);
      giroTimer = null;
    }

    function desliza(px) {
      var base = -(etapa - 1) * 100;
      track.style.transform = px
        ? 'translateX(calc(' + base + '% + ' + px + 'px))'
        : 'translateX(' + base + '%)';
    }

    // ate onde da para avancar: so passa da etapa se ela ja foi respondida
    function limite() {
      if (!escolhido('pouch1')) return 1;
      if (!escolhido('pouch2')) return 2;
      return 3;
    }

    function ir(n) {
      etapa = Math.min(limite(), Math.max(1, n));
      render();
      sheet.scrollTop = 0;
    }

    function abrir() {
      anterior = document.activeElement;
      modal.hidden = false;
      document.body.style.overflow = 'hidden';
      ir(1);
      // reflow entre o hidden sair e a classe entrar, senao nao ha transicao
      void modal.offsetWidth;
      modal.classList.add('is-open');
      var alvo = modal.querySelector('.pick input') || cta;
      if (alvo) alvo.focus();
    }

    function fechar() {
      modal.classList.remove('is-open');
      desligaGiro();
      document.body.style.overflow = '';
      if (anterior && anterior.focus) anterior.focus();

      // so esconde quando a animacao termina; o timer cobre o caso de o
      // transitionend nao disparar (aba em segundo plano, motion reduzido)
      var pronto = false;
      var esconde = function () {
        if (pronto) return;
        pronto = true;
        if (!modal.classList.contains('is-open')) modal.hidden = true;
      };
      sheet.addEventListener('transitionend', esconde, { once: true });
      setTimeout(esconde, 340);
    }

    /* ---- arraste horizontal para trocar de sabor ----
       Nao usei o Swiper da pagina de proposito: aqui o avanco depende de o
       sabor ter sido escolhido, e mandar no allowSlideNext dele daria mais
       codigo do que o gesto inteiro.                                        */
    var x0 = null, y0 = null, dx = 0, arrastando = false;

    track.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      x0 = e.clientX; y0 = e.clientY; dx = 0; arrastando = false;
    });

    track.addEventListener('pointermove', function (e) {
      if (x0 === null) return;
      var mx = e.clientX - x0;
      var my = e.clientY - y0;

      // so vira arraste depois de 8px e se for mais horizontal que vertical,
      // senao rouba a rolagem da folha
      if (!arrastando) {
        if (Math.abs(mx) < 8 || Math.abs(mx) <= Math.abs(my)) return;
        arrastando = true;
        track.classList.add('is-dragging');
        track.setPointerCapture(e.pointerId);
      }

      dx = mx;
      // resistencia nas pontas, para o gesto avisar que nao tem para onde ir
      if ((etapa === 1 && dx > 0) || (etapa >= limite() && dx < 0)) dx *= .25;
      desliza(dx);
    });

    function soltar() {
      if (x0 === null) return;
      var largura = track.offsetWidth || 1;
      var passou = Math.abs(dx) > Math.min(70, largura * .18);

      if (arrastando && passou) ir(etapa + (dx < 0 ? 1 : -1));
      else desliza();

      track.classList.remove('is-dragging');
      x0 = null; y0 = null; dx = 0;
      setTimeout(function () { arrastando = false; }, 0);
    }

    track.addEventListener('pointerup', soltar);
    track.addEventListener('pointercancel', soltar);

    // um arraste que terminou em cima de um cartao nao pode virar escolha
    track.addEventListener('click', function (e) {
      if (arrastando) { e.preventDefault(); e.stopPropagation(); }
    }, true);

    // escolher avanca sozinho -- o atraso deixa o selo aparecer antes de trocar
    modal.addEventListener('change', function (e) {
      if (!e.target.name) return;
      render();
      var salto = e.target.name === 'pouch1' ? 2 : 3;
      setTimeout(function () { if (!modal.hidden) ir(salto); }, 320);
    });

    cta.addEventListener('click', function () {
      if (etapa === 1 && !escolhido('pouch1')) return;
      if (etapa === 2 && !escolhido('pouch2')) return;
      if (etapa < 3) { ir(etapa + 1); return; }
      // navega pela URL, nao por checkout.click(): aquele botao abre o
      // popup, entao clicar nele aqui reabriria tudo na etapa 1
      var destino = checkout && checkout.getAttribute('href');
      if (destino && destino !== '#') location.href = destino;
    });

    voltar.addEventListener('click', function () { ir(etapa - 1); });

    modal.querySelectorAll('[data-close]').forEach(function (el) {
      el.addEventListener('click', fechar);
    });

    // o input real esta fora da tela, entao o anel de foco vai no cartao
    picks.forEach(function (input) {
      input.addEventListener('focus', function () { input.parentNode.classList.add('has-focus'); });
      input.addEventListener('blur',  function () { input.parentNode.classList.remove('has-focus'); });
    });

    document.addEventListener('keydown', function (e) {
      if (modal.hidden) return;

      if (e.key === 'Escape') { fechar(); return; }
      if (e.key !== 'Tab') return;

      // prende o foco: sem isso o Tab passeia pela pagina atras do overlay
      var focaveis = [].slice.call(
        sheet.querySelectorAll('button, [href], input:not([hidden])')
      ).filter(function (el) { return el.offsetParent !== null || el.tagName === 'INPUT'; });

      if (!focaveis.length) return;
      var primeiro = focaveis[0];
      var ultimo = focaveis[focaveis.length - 1];

      if (e.shiftKey && document.activeElement === primeiro) { e.preventDefault(); ultimo.focus(); }
      else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primeiro.focus(); }
    });

    // os dois CTAs da pagina abrem o popup em vez de ir direto para o
    // checkout -- o do card e o do fim da secao de beneficios
    document.querySelectorAll('[data-open-flavors]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        if (btn.dataset.checkout && escolhido('pouch1') && escolhido('pouch2')) return;
        e.preventDefault();
        abrir();
      });
    });

    render();
  }

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
