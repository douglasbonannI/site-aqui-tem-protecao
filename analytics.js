/* Analytics + cookies (LGPD) — Aqui Tem Proteção
   Regra: nada de rastreio antes do visitante aceitar. Google Analytics 4 e Pixel da Meta só ligam depois do "Aceitar".
   Código do Google fica em config.js (GA_ID). */
(function () {
  var C = window.ATP_CONFIG || {};
  var KEY = 'atp_cookies_v1';
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  // 1) Começa NEGADO (modo de consentimento do Google)
  gtag('consent', 'default', {
    ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
    analytics_storage: 'denied', wait_for_update: 500
  });

  var gaOn = C.GA_ID && !/X{6,}/.test(C.GA_ID);
  if (gaOn) {
    var s = document.createElement('script');
    s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + C.GA_ID;
    document.head.appendChild(s);
    gtag('js', new Date());
    gtag('config', C.GA_ID, { anonymize_ip: true });
  }

  var pixelLoaded = false;
  function loadPixel() {
    if (pixelLoaded || !C.META_PIXEL_ID) return;
    pixelLoaded = true;
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', C.META_PIXEL_ID);
    window.fbq('track', 'PageView');
  }

  function apply(status) {
    if (status === 'granted') {
      gtag('consent', 'update', { analytics_storage: 'granted', ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted' });
      loadPixel();
    } else {
      gtag('consent', 'update', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    }
  }
  function saved() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function save(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  // 2) Evento padrão para todo o site: atpTrack('nome', {dados})
  window.atpTrack = function (name, params) {
    try { if (gaOn) gtag('event', name, params || {}); } catch (e) {}
    try {
      if (window.fbq) {
        if (name === 'generate_lead') window.fbq('track', 'Lead');
        else if (name === 'click_whatsapp') window.fbq('track', 'Contact');
      }
    } catch (e) {}
  };

  // 3) Aviso de cookies
  function init() {
    var bar = document.getElementById('cookie-bar');
    var s0 = saved();
    if (s0) apply(s0);
    else if (bar) bar.hidden = false;

    function choose(v) {
      save(v); apply(v);
      if (bar) bar.hidden = true;
      // este evento mostra quantos aceitaram ou recusaram (sem identificar ninguém)
      if (gaOn) gtag('event', 'cookie_consent', { status: v });
    }
    var a = document.getElementById('cookie-accept'), r = document.getElementById('cookie-reject');
    if (a) a.addEventListener('click', function () { choose('granted'); });
    if (r) r.addEventListener('click', function () { choose('denied'); });
    document.querySelectorAll('[data-cookie-open]').forEach(function (el) {
      el.addEventListener('click', function (e) { e.preventDefault(); if (bar) bar.hidden = false; });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
