/* Extras do site — Aqui Tem Proteção
   bolhas de avaliações reais do Google, barra fixa no celular, barra de leitura, medição de cliques. */
(function () {
  var C = window.ATP_CONFIG || {};
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Barra de progresso de leitura
  var prog = document.getElementById('read-progress');
  function onScroll() {
    var h = document.documentElement;
    var p = h.scrollTop / Math.max(1, (h.scrollHeight - h.clientHeight));
    if (prog) prog.style.transform = 'scaleX(' + Math.min(1, Math.max(0, p)) + ')';
    var bar = document.getElementById('mobile-bar');
    if (bar) bar.classList.toggle('on', h.scrollTop > 500);
  }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // ---- Medição de cliques (vira "eventos" no Google Analytics)
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (href.indexOf('wa.me') > -1) window.atpTrack && atpTrack('click_whatsapp', { local: a.dataset.local || (a.className.indexOf('whatsapp-float') > -1 ? 'botao_flutuante' : 'link') });
    else if (href === '#cotacao') window.atpTrack && atpTrack('click_cotar', { local: a.dataset.local || 'link' });
    else if (href.indexOf('google.com/maps') > -1) window.atpTrack && atpTrack('click_avaliacoes_google', {});
    else if (href.indexOf('instagram.com') > -1) window.atpTrack && atpTrack('click_instagram', {});
  });
  var form = document.getElementById('whatsappForm');
  if (form) form.addEventListener('submit', function () {
    window.atpTrack && atpTrack('generate_lead', { tipo_veiculo: (document.getElementById('veiculo') || {}).value || '' });
  });
  document.querySelectorAll('.faq details').forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (d.open && window.atpTrack) atpTrack('faq_aberta', { pergunta: (d.querySelector('summary') || {}).textContent.trim().slice(0, 80) });
    });
  });

  // ---- Bolhas de avaliações reais
  var box = document.getElementById('rbubble');
  var pool = (window.ATP_REVIEWS || []).filter(function (r) {
    // só avaliações com texto de verdade; fora emoji solto
    return r.s >= 4 && r.t && r.t.replace(/[^\p{L}]/gu, '').length >= 18;
  });
  if (!box || !pool.length || reduce) return;
  var order = [], idx = 0, timer;
  function shuffle() { order = pool.slice().sort(function () { return Math.random() - .5; }); idx = 0; }
  function esc(s) { return s.replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function show() {
    if (document.hidden) { timer = setTimeout(show, 1500); return; }
    var bar = document.getElementById('cookie-bar');
    if (bar && !bar.hidden) { timer = setTimeout(show, 2000); return; }
    if (idx >= order.length) shuffle();
    var r = order[idx++];
    var t = r.t.replace(/\s+/g, ' ').trim();
    var cut = t.length > 150 ? t.slice(0, 147).replace(/\s+\S*$/, '') + '…' : t;
    var stars = '★★★★★'.slice(0, r.s);
    box.innerHTML = '<div class="rb-top"><span class="rb-av">' + esc(r.n[0].toUpperCase()) + '</span><div><b>' + esc(r.n) + '</b><small>' + esc(r.w) + ' · Google</small></div></div>' +
      '<div class="rb-st">' + stars + '</div><p>' + esc(cut) + '</p>';
    box.classList.add('on');
    var ms = Math.max(5500, Math.min(9000, cut.length * 55));
    timer = setTimeout(function () { box.classList.remove('on'); timer = setTimeout(show, 2500); }, ms);
  }
  shuffle();
  setTimeout(show, 7000);
  var close = document.getElementById('rbubble-close');
  if (close) close.addEventListener('click', function () { box.classList.remove('on'); clearTimeout(timer); box.remove(); close.remove(); });
})();
