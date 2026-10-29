(function () {
  var btn = document.querySelector('.burger');
  var nav = document.getElementById('nav');
  if (!btn || !nav) return;
  function set(open) {
    nav.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  }
  btn.addEventListener('click', function () { set(!nav.classList.contains('is-open')); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) set(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) { set(false); btn.focus(); }
  });
  window.addEventListener('resize', function () { if (window.innerWidth > 980) set(false); });
})();

(function () {
  var form = document.getElementById('devis-form');
  if (!form) return;
  var TEL = '+33610214660', MAIL = '';
  var rules = {
    'f-nom': ['e-nom', function (v) { return v.trim().length >= 2 ? '' : 'Indiquez votre nom.'; }],
    'f-tel': ['e-tel', function (v) { return /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.\-]*\d{2}){4}$/.test(v.trim()) ? '' : 'Indiquez un numéro de téléphone français valide.'; }],
    'f-com': ['e-com', function (v) { return v.trim().length >= 2 ? '' : 'Indiquez votre commune.'; }],
    'f-besoin': ['e-besoin', function (v) { return v ? '' : 'Choisissez votre besoin.'; }]
  };
  function check(id) {
    var el = document.getElementById(id), r = rules[id], err = document.getElementById(r[0]), m = r[1](el.value);
    err.textContent = m; err.hidden = !m; el.setAttribute('aria-invalid', m ? 'true' : 'false');
    return !m;
  }
  Object.keys(rules).forEach(function (id) {
    document.getElementById(id).addEventListener('blur', function () { check(id); });
  });
  var recap = document.getElementById('recap'), txt = document.getElementById('recap-text'), msg = document.getElementById('r-msg');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true, first = null;
    Object.keys(rules).forEach(function (id) { if (!check(id)) { ok = false; if (!first) first = id; } });
    if (!ok) { document.getElementById(first).focus(); return; }
    var v = function (id) { return document.getElementById(id).value.trim(); };
    var t = 'Bonjour, je souhaite un devis.\nBesoin : ' + v('f-besoin') + '\nNom : ' + v('f-nom') + '\nTéléphone : ' + v('f-tel') + '\nCommune : ' + v('f-com') + (v('f-msg') ? '\nMessage : ' + v('f-msg') : '');
    txt.value = t;
    document.getElementById('r-sms').href = 'sms:' + TEL + '?&body=' + encodeURIComponent(t);
    document.getElementById('r-mail').href = 'mailto:' + MAIL + '?subject=' + encodeURIComponent('Demande de devis : ' + v('f-besoin')) + '&body=' + encodeURIComponent(t);
    form.hidden = true; recap.hidden = false; msg.textContent = ''; txt.focus();
  });
  document.getElementById('r-edit').addEventListener('click', function () { recap.hidden = true; form.hidden = false; document.getElementById('f-nom').focus(); });
  document.getElementById('r-copy').addEventListener('click', function () {
    function done(ok) { msg.textContent = ok ? 'Récapitulatif copié.' : 'Copie impossible : sélectionnez le texte ci-dessus.'; if (!ok) { txt.select(); } }
    if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(txt.value).then(function () { done(true); }, function () { done(false); }); }
    else { txt.select(); try { done(document.execCommand('copy')); } catch (x) { done(false); } }
  });
})();
