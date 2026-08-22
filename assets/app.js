/* Științe Sociale — PWA de studiu pentru liceu FR, profil umanist.
   Fără dependențe externe, fără build, funcționează 100% offline.

   Organizare:
     §1  mișcare și tranziții (perechea stratului 3 din app.css)
     §2  stare, setări, preferințe vizuale
     §3  date: indexul de conținut + fișierele de modul (încărcare leneșă)
     §4  rutare
     §5  ecrane
     §6  motorul de carduri
     §7  motorul de test
     §8  ecranul de setări
     §9  legături (evenimente, rețea, service worker)
*/
(() => {
  'use strict';

  const KEY = 'stiinte01:v1';
  const view = document.getElementById('view');
  const title = document.getElementById('page-title');
  const backBtn = document.getElementById('btn-back');
  const netBadge = document.getElementById('net-badge');
  const setariBtn = document.getElementById('btn-setari');
  const metaTema = document.getElementById('meta-tema');
  const doc = document.documentElement;

  /* ═══ §1  infrastructură de mișcare (stratul 3 din app.css) ═══════════ */
  const stage  = document.getElementById('stage');
  const tabbar = document.querySelector('.tabbar');
  const tabs   = Array.prototype.slice.call(document.querySelectorAll('.tab'));
  tabbar.style.setProperty('--tab-count', tabs.length);

  /* Preferința de mișcare NU se mai citește direct din matchMedia: ea poate fi
     forțată din Setări, iar sursa de adevăr e atributul de pe <html> — același
     pe care îl folosește și CSS-ul. Așa nu pot ajunge niciodată în dezacord. */
  const reduced = () => doc.getAttribute('data-miscare') === 'redusa';

  const ROOT_ROUTES = ['acasa', 'materii', 'carduri', 'test', 'plan'];

  /* Stiva de navigație = semantica lui UINavigationController.
     Goală la start: prima randare iese mereu ca „fade” + cascadă. */
  let navStack = [];
  let ghost = null;
  let lastTabIdx = -1;

  /* Adâncimea rutei = numărul de argumente. Uniform pentru toate rutele:
     altfel `#/carduri/materie/x` ar ieși mai „adânc” decât `#/materie/x`,
     deși ambele sunt un pas în jos. */
  function routeDepth(hash) {
    const parts = String(hash).replace(/^#\/?/, '').split('/').filter(Boolean);
    return Math.max(0, parts.length - 1);
  }

  /* Direcția: 'push' | 'pop' | 'fade' | 'replace'.
     Stiva e mai fiabilă decât simpla comparație de adâncime, fiindcă prinde
     corect și butonul „înapoi” al browserului. Adâncimea rămâne plasă de
     siguranță pentru linkuri directe care nu există în stivă. */
  /* Setările au adâncimea 0 (rută fără argumente), dar NU sunt o rădăcină: se
     deschid peste ecranul curent, din rotița barei de sus, și „înapoi” trebuie
     să întoarcă exact acolo. Tratate ca rădăcină, goleau stiva, iar ecranul de
     dinainte reintra alunecând dinspre dreapta — adică fix pe dos. */
  const esteSuprapunere = h => /^#\/setari(\/|$)/.test(String(h));

  function navDirection(hash) {
    if (!navStack.length) { navStack = [hash]; return 'fade'; }        // prima randare
    const top = navStack[navStack.length - 1];
    if (hash === top) return 'replace';                                // re-randare
    if (esteSuprapunere(hash)) { navStack.push(hash); return 'push'; }
    /* Rădăcina se testează PRIMA: un tab nu alunecă niciodată lateral, nici
       dacă ecranul lui se mai află undeva în stivă. */
    if (routeDepth(hash) === 0) { navStack = [hash]; return 'fade'; }
    const i = navStack.lastIndexOf(hash);
    if (i > -1) { navStack.length = i + 1; return 'pop'; }             // înapoi în stivă
    /* Mai sus în ierarhie, dar fără urmă în stivă: înlocuim vârful, nu golim
       stiva — altfel următorul „înapoi” al browserului ar ieși ca „push”. */
    if (routeDepth(hash) < routeDepth(top)) { navStack[navStack.length - 1] = hash; return 'pop'; }
    navStack.push(hash);
    if (navStack.length > 32) navStack.splice(0, navStack.length - 32);  // plafon de siguranță
    return 'push';
  }

  /* Clonează ecranul care pleacă și îl animează în paralel cu cel care intră.
     Fără clonă nu există parallax, iar parallaxul e jumătate din senzația iOS. */
  function spawnGhost(dir) {
    /* Curățarea vine ÎNAINTEA oricărui `return`: dacă utilizatorul activează
       „mișcare redusă” în timpul unei tranziții, `.view-ghost{display:none}`
       ANULEAZĂ animația, deci `animationend` nu mai vine niciodată, iar clona
       ar rămâne agățată în DOM la infinit. */
    if (ghost) { ghost.remove(); ghost = null; }
    if (dir === 'replace' || reduced() || !view.firstChild) return;
    if (view.querySelectorAll('*').length > 2000) return;   // plasă de siguranță
    const g = view.cloneNode(true);
    g.removeAttribute('id');
    g.querySelectorAll('[id]').forEach(n => n.removeAttribute('id'));  // fără ID-uri duble
    g.removeAttribute('tabindex');
    g.setAttribute('aria-hidden', 'true');
    g.inert = true;
    /* `inert` cere Safari 15.5+ / Firefox 112+. Pe motoare mai vechi atribuirea
       e o simplă proprietate inertă, iar butoanele clonei ar rămâne în ordinea
       Tab sub un `aria-hidden` — exact violarea clasică. Le scoatem explicit. */
    g.querySelectorAll('button,a,input,textarea,select,[tabindex]')
     .forEach(el => el.setAttribute('tabindex', '-1'));
    /* Barele de progres din clonă ar reporni `bar-grow` de la zero și s-ar
       vedea cum se golesc în timp ce ecranul pleacă. */
    g.querySelectorAll('.bar > i').forEach(el => { el.style.animation = 'none'; });
    /* Clasa de navigație a randării anterioare încă e pe #view în acest moment.
       Două clase `nav-*` pe același element se decid pe ordinea din CSS, nu pe
       intenție — deci trebuie scoase toate, nu doar `stagger`. */
    g.classList.remove('stagger', 'nav-push', 'nav-pop', 'nav-fade', 'nav-replace');
    g.classList.add('view-ghost', 'nav-' + dir);
    g.style.setProperty('--ghost-y', (-window.scrollY) + 'px');  // păstrează scrollul
    g.style.willChange = 'transform, opacity';
    ghost = g;
    stage.appendChild(g);
    const gata = e => {
      if (e && e.target !== g) return;      // `animationend` bulează din copii
      g.remove(); if (ghost === g) ghost = null;
    };
    g.addEventListener('animationend', gata, { once: true });
    g.addEventListener('animationcancel', gata, { once: true });
  }

  /* Repornește animația de intrare pe #view. Fără reflow-ul din mijloc,
     re-adăugarea aceleiași clase NU repornește animația. */
  function playViewAnim(dir) {
    view.classList.remove('nav-push', 'nav-pop', 'nav-fade', 'nav-replace', 'stagger');
    view.style.willChange = 'transform, opacity';
    void view.offsetWidth;                        // reflow forțat = restart
    view.classList.add('nav-' + dir);
    if (dir === 'fade') view.classList.add('stagger');   // cascadă doar la tab / prima randare
    view.addEventListener('animationend', () => { view.style.willChange = 'auto'; },
      { once: true });
  }

  /* Numerotează elementele de nivel 1 pentru cascadă (--i) și le marchează (.enter).
     `restagger` repornește cascada fără schimbare de rută (întrebarea următoare,
     cardul următor din pachet). */
  /* Elementele de nivel 1 ale ecranului. `#lista-materii` și `#clasa-panou`
     sunt containere care se rescriu singure la căutare/filtrare, deci copiii
     lor trebuie enumerați explicit: altfel ecranul Materii apărea dintr-o
     dată, fără cascadă — o regresie față de v02, când lista era direct în
     `#view`. */
  const STAGGER_SEL = ':scope > p, :scope > h2, :scope > .card, :scope > .chips, ' +
                      ':scope > .grid2, :scope > .btn, :scope > .flip, ' +
                      ':scope > .lista, :scope > .cap, :scope > .stats, ' +
                      ':scope > .crumb, :scope > .cauta, ' +
                      ':scope > #opt > .opt, :scope > #card-actions, ' +
                      ':scope > .grid-cards > *, :scope > .two-col > *, ' +
                      ':scope > #clasa-panou > *, ' +
                      ':scope > #lista-materii > h2, ' +
                      ':scope > #lista-materii > .card, ' +
                      ':scope > #lista-materii > .grid-cards > *';
  function paint(restagger) {
    view.querySelectorAll(STAGGER_SEL).forEach((el, i) => {
      el.style.setProperty('--i', i);
      el.classList.add('enter');
    });
    if (restagger) {
      view.classList.remove('stagger');
      void view.offsetWidth;
      view.classList.add('stagger');
    }
  }

  /* ═══ §2  stare, setări, preferințe vizuale ══════════════════════════ */

  const SETARI = {
    /* aspect */
    tema: 'auto',                 // auto | luminos | intunecat
    contrast: 'auto',             // auto | normal | ridicat
    miscare: 'auto',              // auto | completa | redusa
    transparenta: 'auto',         // auto | completa | redusa
    marimeText: 100,              // 85…140 (%)
    densitate: 'confortabil',     // compact | confortabil | spatios
    font: 'sistem',               // sistem | serif | lizibil
    haptic: true,
    /* studiu */
    ecranStart: 'acasa',          // acasa | materii | ultima
    obiectivZilnic: 2,            // lecții pe zi
    doarBac: false,               // ascunde materiile fără probă de bacalaureat
    /* test */
    nrIntrebari: 12,              // 0 = toate
    amestecaIntrebari: true,
    amestecaOptiuni: true,
    feedbackImediat: true,
    cronometru: 0,                // minute; 0 = fără
    /* carduri */
    nrCarduri: 20,                // 0 = toate
    ordineCarduri: 'aleatorie',   // aleatorie | ordine | grele
    autoIntoarce: false
  };

  const STARE_GOALA = () => ({
    lectiiCitite: {}, carduri: {}, teste: {}, notite: {},
    clasa: 'a XII-a', zile: {}, ultima: '', setari: Object.assign({}, SETARI)
  });

  /* Valorile admise pentru setările cu listă închisă. Orice altceva —
     dintr-un import, dintr-o versiune veche sau dintr-un `localStorage`
     stricat — cade pe implicit. Fără asta, `data-tema="banana"` nu potrivea
     niciun selector (paletă implicită, niciun segment aprins în Setări). */
  const VALORI = {
    tema: ['auto', 'luminos', 'intunecat'],
    contrast: ['auto', 'normal', 'ridicat'],
    miscare: ['auto', 'completa', 'redusa'],
    transparenta: ['auto', 'completa', 'redusa'],
    densitate: ['compact', 'confortabil', 'spatios'],
    font: ['sistem', 'serif', 'lizibil'],
    ecranStart: ['acasa', 'materii', 'ultima'],
    ordineCarduri: ['aleatorie', 'ordine', 'grele']
  };
  const LIMITE = {                       // [min, max] pentru setările numerice
    marimeText: [80, 150], obiectivZilnic: [1, 20], nrIntrebari: [0, 40],
    cronometru: [0, 60], nrCarduri: [0, 100]
  };

  /* Curăță o stare venită din afară (localStorage sau fișier de import).
     Întoarce ÎNTOTDEAUNA un obiect complet și valid — niciodată `null` pe
     câmpurile pe care restul codului le parcurge cu `Object.keys`. */
  function sanitizeaza(brut) {
    const s = STARE_GOALA();
    if (!brut || typeof brut !== 'object' || Array.isArray(brut)) return s;

    const obiect = v => (v && typeof v === 'object' && !Array.isArray(v)) ? v : {};
    s.lectiiCitite = obiect(brut.lectiiCitite);
    s.carduri = obiect(brut.carduri);
    s.teste = obiect(brut.teste);
    s.notite = obiect(brut.notite);
    s.zile = obiect(brut.zile);
    if (typeof brut.clasa === 'string' && brut.clasa) s.clasa = brut.clasa;
    if (typeof brut.ultima === 'string') s.ultima = brut.ultima;

    const st = Object.assign({}, SETARI, obiect(brut.setari));
    for (const k of Object.keys(SETARI)) {
      const implicit = SETARI[k];
      let v = st[k];
      if (VALORI[k]) { if (VALORI[k].indexOf(v) === -1) v = implicit; }
      else if (LIMITE[k]) {
        v = Number(v);
        if (!isFinite(v)) v = implicit;
        else v = Math.min(LIMITE[k][1], Math.max(LIMITE[k][0], Math.round(v)));
      } else if (typeof implicit === 'boolean') v = !!v;
      else if (typeof implicit === 'number') { v = Number(v); if (!isFinite(v)) v = implicit; }
      st[k] = v;
    }
    s.setari = st;
    return s;
  }

  function load() {
    try { return sanitizeaza(JSON.parse(localStorage.getItem(KEY) || '{}')); }
    catch { return STARE_GOALA(); }
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* quota/private mode */ }
  }

  let state = load();
  const set = k => state.setari[k];

  /* Preferințele vizuale devin atribute pe <html> — aceeași sursă de adevăr
     ca în bootstrap-ul din index.html și în CSS. „auto” se rezolvă aici. */
  const mq = q => { try { return matchMedia(q); } catch { return { matches: false, addEventListener() {} }; } };
  const MQ = {
    tema: mq('(prefers-color-scheme: dark)'),
    contrast: mq('(prefers-contrast: more)'),
    miscare: mq('(prefers-reduced-motion: reduce)'),
    transparenta: mq('(prefers-reduced-transparency: reduce)')
  };

  function aplicaPreferinte() {
    const s = state.setari;
    const tema = s.tema === 'auto' ? (MQ.tema.matches ? 'intunecat' : 'luminos') : s.tema;
    doc.setAttribute('data-tema', tema);
    doc.style.colorScheme = tema === 'intunecat' ? 'dark' : 'light';
    if (metaTema) metaTema.setAttribute('content', tema === 'intunecat' ? '#191310' : '#F7EEE2');

    doc.setAttribute('data-contrast',
      s.contrast === 'auto' ? (MQ.contrast.matches ? 'ridicat' : 'normal') : s.contrast);
    doc.setAttribute('data-miscare',
      s.miscare === 'auto' ? (MQ.miscare.matches ? 'redusa' : 'completa') : s.miscare);
    doc.setAttribute('data-transparenta',
      s.transparenta === 'auto' ? (MQ.transparenta.matches ? 'redusa' : 'completa') : s.transparenta);
    doc.setAttribute('data-densitate', s.densitate);
    doc.setAttribute('data-font', s.font);
    doc.style.setProperty('--fs-scale', (s.marimeText || 100) / 100);
  }
  /* Când preferința e „auto”, o schimbare de sistem trebuie să se vadă imediat
     — inclusiv trecerea automată zi/noapte de pe telefon. */
  Object.keys(MQ).forEach(k => {
    const m = MQ[k];
    const la = () => { if (state.setari[k] === 'auto') aplicaPreferinte(); };
    if (m.addEventListener) m.addEventListener('change', la);
    else if (m.addListener) m.addListener(la);
  });
  aplicaPreferinte();

  const bate = (ms) => { if (set('haptic') && navigator.vibrate) { try { navigator.vibrate(ms || 8); } catch {} } };

  /* ═══ §3  date ══════════════════════════════════════════════════════ */

  let IDX = null;          // data/continut.json — indexul ușor
  let CUR = null;          // data/curriculum.json
  const MOD = new Map();   // id -> corpul modulului (încărcat la cerere)
  const cereri = new Map();

  function ceriModul(id) {
    if (MOD.has(id)) return Promise.resolve(MOD.get(id));
    if (cereri.has(id)) return cereri.get(id);
    const p = fetch('./data/module/' + encodeURIComponent(id) + '.json')
      .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(m => { MOD.set(id, m); cereri.delete(id); return m; })
      .catch(e => { cereri.delete(id); throw e; });
    cereri.set(id, p);
    return p;
  }

  /* ═══ utilitare ═════════════════════════════════════════════════════ */
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const mod = id => IDX && IDX.module.find(m => m.id === id);
  const modAn = an => IDX.module.filter(m => m.an === an);
  /* Un singur drum de la clasă la module. Înainte, `moduleNecesare` filtra
     după `m.clasa`, iar `domeniu('clasa')` trecea prin `anClasa()`, care cade
     pe anul 4 pentru orice clasă necunoscută: la o denumire schimbată,
     preîncărcarea nu aducea nimic, domeniul cerea modulele altei clase, iar
     ecranul ieșea gol fără nicio eroare. */
  const modClasa = clasa => {
    const dupaNume = IDX.module.filter(m => m.clasa === clasa);
    if (dupaNume.length) return dupaNume;
    const an = Number(Object.keys(ROMAN).find(k => ROMAN[k] === clasa));
    return an ? modAn(an) : [];
  };
  const toateLectiile = m => m.capitole.reduce((a, c) => a.concat(c.lectii), []);
  const totalLectii = () => IDX.nrLectii || 0;
  const citite = () => Object.keys(state.lectiiCitite).length;

  /* v03 a schimbat COMPLET spațiul de id-uri: lecțiile au trecut de la
     `filo-01` la `filo12-01`, cheile de card de la `modul:i` la `lecție:i`,
     iar cheile de test de la `materie:filosofie` la `materie:filosofie-12`.
     Intersecția cu id-urile din v02 este zero. Fără curățare, un elev venit de
     pe versiunea veche vedea „20/580 lecții citite” și o medie calculată din
     teste care nu mai corespund niciunui domeniu, în timp ce fiecare lecție
     apărea necitită. Rulează o singură dată, după ce indexul e disponibil. */
  function curataProgresulOrfan() {
    if (!IDX) return;
    const lectii = new Set();
    IDX.module.forEach(m => m.capitole.forEach(c => c.lectii.forEach(l => lectii.add(l.id))));
    const module_ = new Set(IDX.module.map(m => m.id));

    let sters = 0;
    const taie = (obiect, tine) => {
      for (const k of Object.keys(obiect)) if (!tine(k)) { delete obiect[k]; sters++; }
    };
    taie(state.lectiiCitite, k => lectii.has(k));
    taie(state.notite, k => lectii.has(k));
    /* Cheia de card e `idLecție:index`. */
    taie(state.carduri, k => lectii.has(String(k).slice(0, String(k).lastIndexOf(':'))));
    /* Cheile de test: `lectie:<modul>:<lecție>`, `capitol:<modul>:<capitol>`,
       `materie:<modul>`, `teza:<modul>:<semestru>`, `an:<n>`. Ultima nu conține
       id-uri, deci se păstrează; restul trebuie să trimită la ceva existent. */
    taie(state.teste, k => {
      const p = String(k).split(':');
      if (p[0] === 'lectie') return module_.has(p[1]) && lectii.has(p[2]);
      if (p[0] === 'capitol' || p[0] === 'materie' || p[0] === 'teza') return module_.has(p[1]);
      return true;
    });
    if (sters) save();
  }
  const cititeDin = m => toateLectiile(m).filter(l => state.lectiiCitite[l.id]).length;
  const azi = () => new Date().toISOString().slice(0, 10);

  const ROMAN = { 1: 'a IX-a', 2: 'a X-a', 3: 'a XI-a', 4: 'a XII-a', 5: 'a XIII-a' };
  function shuffle(a) {
    const r = a.slice();
    for (let i = r.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [r[i], r[j]] = [r[j], r[i]];
    }
    return r;
  }

  const pct = (a, b) => Math.round(a / Math.max(1, b) * 100);

  /* Seria de zile consecutive cu cel puțin o lecție citită. */
  function serie() {
    let n = 0;
    const d = new Date();
    for (;;) {
      const k = d.toISOString().slice(0, 10);
      if (state.zile[k]) { n++; d.setDate(d.getDate() - 1); }
      else if (n === 0 && k === azi()) { d.setDate(d.getDate() - 1); }  // ziua de azi poate fi încă goală
      else break;
      if (n > 999) break;
    }
    return n;
  }

  function marcheazaZi() {
    const k = azi();
    state.zile[k] = (state.zile[k] || 0) + 1;
    /* Nu ținem un istoric infinit: 400 de zile acoperă un an școlar întreg
       plus vacanța, iar localStorage are o cotă mică. */
    const chei = Object.keys(state.zile).sort();
    while (chei.length > 400) delete state.zile[chei.shift()];
  }

  /* ═══ §4  rutare ════════════════════════════════════════════════════ */

  const routes = {
    acasa: viewAcasa,
    materii: viewMaterii,
    an: viewAn,
    materie: viewMaterie,
    capitol: viewCapitol,
    lectie: viewLectie,
    carduri: viewCarduri,
    test: viewTest,
    plan: viewPlan,
    setari: viewSetari
  };

  function parseHash() {
    const raw = (location.hash || '#/acasa').replace(/^#\/?/, '');
    const parts = raw.split('/').filter(Boolean);
    /* O rută necunoscută cade pe „acasă” cu totul — inclusiv argumentele.
       Altfel bara de taburi rămânea cu pastila sub tabul anterior. */
    if (!parts.length || !routes[parts[0]]) return { name: 'acasa', args: [] };
    return { name: parts[0], args: parts.slice(1).map(decodeURIComponent) };
  }

  /* Ce module trebuie să fie în memorie ca ecranul să se poată desena.
     Ecranele de listă (materii, materie, capitol) se mulțumesc cu indexul —
     titlurile sunt deja acolo, deci nu se așteaptă nicio rețea pentru ele. */
  function moduleNecesare(name, args) {
    if (name === 'lectie') return args[0] ? [args[0]] : [];
    if (name === 'test' || name === 'carduri') {
      const [tip, a, b] = args;
      if (!tip) return [];
      if (tip === 'an') {
        const an = Number(a);
        return IDX ? modAn(an).map(m => m.id) : [];
      }
      if (tip === 'clasa') return IDX ? modClasa(state.clasa).map(m => m.id) : [];
      return a ? [a] : [];
    }
    return [];
  }

  let renderToken = 0;
  let partialLipsa = 0;      // module care n-au ajuns la ultima randare

  async function render() {
    const token = ++renderToken;
    const hash = location.hash || '#/acasa';

    /* Fără date nu există ecran de randat. Fără această gardă, o apăsare de tab
       după o încărcare eșuată golea #view și arunca — adică ștergea inclusiv
       mesajul de eroare și bloca aplicația până la reîncărcare. */
    if (!IDX || !CUR) { navDirection(hash); eroareDate(); return; }

    const { name, args } = parseHash();
    const lipsa = moduleNecesare(name, args).filter(id => !MOD.has(id));
    if (lipsa.length) {
      /* Fișierele de modul sunt locale și precache-uite: de regulă sosesc în
         câteva milisecunde. Indicatorul apare doar dacă chiar durează, ca să
         nu clipească un spinner la fiecare deschidere de lecție. */
      const t = setTimeout(() => {
        if (token !== renderToken) return;
        view.innerHTML = '<div class="incarc">Se încarcă modulul…</div>';
      }, 400);
      /* `allSettled`, nu `all`: pentru „toată clasa” se cer 11-13 module
         deodată, iar `all` respinge la primul eșec — 10 module sosite complet
         ajungeau într-un ecran de eroare din cauza unuia singur. Randăm cu ce
         avem și spunem cinstit ce lipsește. */
      const rez = await Promise.allSettled(lipsa.map(ceriModul));
      clearTimeout(t);
      if (token !== renderToken) return;      // s-a schimbat ruta între timp
      const cazute = rez.filter(r => r.status === 'rejected').length;
      if (cazute === lipsa.length) {
        navDirection(hash);
        const offline = !navigator.onLine;
        view.innerHTML = '<div class="card"><h3>Conținutul nu s-a putut încărca</h3>' +
          '<p class="muted">' + (offline
            ? 'Ești offline, iar acest modul nu e încă salvat pe dispozitiv. Încearcă din nou când ai internet.'
            : 'Verifică legătura la internet și reîncearcă.') + '</p>' +
          '<button class="btn" data-act-rand="reincearca">Reîncearcă</button>' +
          '<button class="btn ghost" data-go="#/materii">Înapoi la materii</button></div>';
        const b = view.querySelector('[data-act-rand="reincearca"]');
        if (b) b.onclick = () => render();
        paint(true);
        return;
      }
      if (cazute) partialLipsa = cazute;      // banner discret, ecranul se randează
    }

    deseneaza(hash, name, args);

    if (partialLipsa) {
      const n = partialLipsa; partialLipsa = 0;
      const av = document.createElement('div');
      av.className = 'card';
      av.innerHTML = '<p class="muted">Conținut parțial: ' + n +
        (n === 1 ? ' modul nu s-a putut încărca' : ' module nu s-au putut încărca') +
        '. Ce vezi aici e complet, dar incomplet ca acoperire.</p>';
      view.insertBefore(av, view.firstChild);
    }
  }

  function eroareDate() {
    view.innerHTML = '<div class="card"><h3>Nu s-au putut încărca datele</h3>' +
      '<p class="muted">Verifică fișierele din folderul <code>data/</code> ' +
      'și reîncarcă pagina.</p></div>';
  }

  function deseneaza(hash, name, args) {
    opresteCronometru();          // orice ecran nou anulează un test în desfășurare
    const dir = navDirection(hash);
    spawnGhost(dir);                        // ÎNAINTE de a goli #view

    const fn = routes[name] || viewAcasa;
    const prevTitle = title.textContent;

    view.innerHTML = '';
    fn(...args);

    const isRoot = ROOT_ROUTES.includes(name) && args.length === 0;
    backBtn.hidden = isRoot;

    /* Tabul activ: rutele „adânci” rămân sub tabul din care au pornit. */
    const TAB_PENTRU = {
      an: 'materii', materie: 'materii', capitol: 'materii', lectie: 'materii'
    };
    const tabActiv = TAB_PENTRU[name] || name;
    tabs.forEach(t => t.setAttribute('aria-selected', String(t.dataset.route === tabActiv)));

    /* Pastila indicatoare + pocnitul iconiței pe tab-ul nou selectat. */
    const idx = tabs.findIndex(t => t.getAttribute('aria-selected') === 'true');
    if (idx > -1) {
      tabbar.style.setProperty('--tab-i', idx);
      if (idx !== lastTabIdx && !reduced()) {
        const ic = tabs[idx].querySelector('.ico');
        if (ic) { ic.classList.remove('pop'); void ic.offsetWidth; ic.classList.add('pop'); }
      }
      lastTabIdx = idx;
    } else {
      lastTabIdx = -1;                       // ecranul Setări nu are tab propriu
    }
    tabbar.classList.toggle('fara-tab', idx === -1);
    setariBtn.setAttribute('aria-current', String(name === 'setari'));

    /* Titlul din topbar face fade doar dacă s-a schimbat efectiv. */
    if (title.textContent !== prevTitle) {
      title.classList.remove('swap'); void title.offsetWidth; title.classList.add('swap');
    }

    window.scrollTo(0, 0);                  // după ce --ghost-y a fost deja capturat
    playViewAnim(dir);
    paint();
    view.focus({ preventScroll: true });
  }

  /* ═══ §5  ecrane ════════════════════════════════════════════════════ */

  function viewAcasa() {
    title.textContent = 'Științe Sociale';
    const p = pct(citite(), totalLectii());
    const testKeys = Object.keys(state.teste);
    const medie = testKeys.length
      ? Math.round(testKeys.reduce((a, k) => a + state.teste[k].procent, 0) / testKeys.length)
      : null;
    const stiute = Object.values(state.carduri).filter(c => c.usor > c.greu).length;
    const aziN = state.zile[azi()] || 0;
    const tinta = set('obiectivZilnic');
    const s = serie();

    view.innerHTML = `
      <div class="card">
        <div class="row"><h3>Progres general</h3><span class="pill soft">${citite()}/${totalLectii()} lecții</span></div>
        <div class="bar"><i style="--p:${p / 100}"></i></div>
        <p class="muted" style="margin-top:10px">
          ${esc(CUR.parcurs.specializare)} · ${esc(CUR.parcurs.profil)} · ${esc(CUR.parcurs.forma)}<br>
          ${esc(CUR.scoala.nume)}, ${esc(CUR.scoala.localitate)}
        </p>
      </div>

      <div class="card">
        <div class="row"><h3>Astăzi</h3><span class="pill soft">${aziN}/${tinta} lecții</span></div>
        <div class="bar"><i style="--p:${Math.min(1, aziN / Math.max(1, tinta))}"></i></div>
        <div class="stats">
          <div class="stat"><b>${s}</b><span>zile la rând</span></div>
          <div class="stat"><b>${stiute}</b><span>carduri știute</span></div>
          <div class="stat"><b>${testKeys.length}</b><span>teste date</span></div>
          <div class="stat"><b>${medie === null ? '—' : medie + '%'}</b><span>medie</span></div>
        </div>
      </div>

      <div class="grid2">
        <button class="card tap" data-go="#/carduri/clasa"><h3>Carduri</h3><p class="muted">Repetiție rapidă din materiile clasei.</p></button>
        <button class="card tap" data-go="#/test/clasa"><h3>Test grilă</h3><p class="muted">${medie === null ? 'Niciun test dat încă.' : 'Medie: ' + medie + '%'}</p></button>
      </div>

      <h2>Continuă unde ai rămas</h2>
      <div class="grid-cards">${nextLectiiHTML()}</div>

      <h2>Materiile anului</h2>
      <div class="chips">${
        CUR.clase.map(c => `<button class="chip" data-clasa="${esc(c.clasa)}" aria-pressed="${c.clasa === state.clasa}">${esc(c.clasa)}</button>`).join('')
      }</div>
      <div id="clasa-panou">${materiiClasaHTML(state.clasa)}</div>
    `;
    /* Schimbarea clasei NU re-randează tot ecranul: se rescrie doar panoul cu
       tabelul. Răspuns instantaneu, fără repornirea animațiilor și fără
       pierderea poziției de derulare. */
    view.querySelectorAll('[data-clasa]').forEach(b => b.onclick = () => {
      if (state.clasa === b.dataset.clasa) return;
      state.clasa = b.dataset.clasa; save();
      view.querySelectorAll('[data-clasa]').forEach(x =>
        x.setAttribute('aria-pressed', String(x.dataset.clasa === state.clasa)));
      const panou = view.querySelector('#clasa-panou');
      if (panou) panou.innerHTML = materiiClasaHTML(state.clasa);
    });
  }

  /* Următoarele lecții necitite: întâi din clasa curentă, apoi din rest. */
  function nextLectiiHTML() {
    const next = [];
    const ordine = modClasa(state.clasa).concat(IDX.module.filter(m => m.clasa !== state.clasa));
    for (const m of ordine) {
      for (const c of m.capitole) {
        const l = c.lectii.find(x => !state.lectiiCitite[x.id]);
        if (l) { next.push({ m, c, l }); break; }
      }
      if (next.length >= 3) break;
    }
    if (!next.length) return `<div class="card"><p>Ai parcurs toate lecțiile disponibile. 🎓</p></div>`;
    return next.map(({ m, c, l }) => `
      <button class="card tap" data-go="#/lectie/${encodeURIComponent(m.id)}/${encodeURIComponent(l.id)}">
        <div class="row"><h3>${esc(l.titlu)}</h3><span class="pill soft">${esc(m.materie)}</span></div>
        <p class="muted" style="margin:6px 0 0">${esc(m.clasa)} · ${esc(c.titlu)}</p>
      </button>`).join('');
  }

  function materiiClasaHTML(clasa) {
    const c = CUR.clase.find(x => x.clasa === clasa);
    if (!c) return '';
    const cuModul = new Map(modClasa(clasa).map(m => [m.materie, m]));
    return `<div class="lista">
      ${c.materii.map(m => {
        const mm = cuModul.get(m.nume);
        const gata = mm ? cititeDin(mm) : 0;
        const tot = mm ? mm.nrLectii : 0;
        const et = mm ? `${gata}/${tot} lecții` : 'în pregătire';
        return mm
          ? `<button class="rand" data-go="#/materie/${encodeURIComponent(mm.id)}">
               <div class="rand-txt"><strong>${esc(m.nume)} ${m.bac ? '<span class="pill">BAC</span>' : ''}</strong>
               <span>${esc(m.arie)} · ${et}</span></div>
               <span class="lec-sag" aria-hidden="true"></span></button>`
          : `<div class="rand"><div class="rand-txt"><strong>${esc(m.nume)} ${m.bac ? '<span class="pill">BAC</span>' : ''}</strong>
               <span>${esc(m.arie)} · ${et}</span></div></div>`;
      }).join('')}
    </div>
    <p class="muted">„BAC” marchează disciplinele care pot face obiectul unei probe de bacalaureat.</p>`;
  }

  /* ---------- Materii: filtru pe an + căutare ---------- */
  let filtruAn = 0;      // 0 = toți anii
  let cautare = '';

  function viewMaterii() {
    title.textContent = 'Materii';
    view.innerHTML = `
      <input class="cauta" id="q" type="search" placeholder="Caută o materie…"
             value="${esc(cautare)}" aria-label="Caută o materie">
      <div class="chips">
        <button class="chip" data-an="0" aria-pressed="${filtruAn === 0}">Toți anii</button>
        ${[1, 2, 3, 4, 5].map(a => `<button class="chip" data-an="${a}" aria-pressed="${filtruAn === a}">${esc(ROMAN[a])}</button>`).join('')}
      </div>
      <div id="lista-materii">${listaMateriiHTML()}</div>`;

    const q = view.querySelector('#q');
    q.oninput = () => {
      cautare = q.value;
      view.querySelector('#lista-materii').innerHTML = listaMateriiHTML();
    };
    view.querySelectorAll('[data-an]').forEach(b => b.onclick = () => {
      filtruAn = Number(b.dataset.an);
      view.querySelectorAll('[data-an]').forEach(x =>
        x.setAttribute('aria-pressed', String(Number(x.dataset.an) === filtruAn)));
      view.querySelector('#lista-materii').innerHTML = listaMateriiHTML();
    });
  }

  const faraDiacritice = s => String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

  function listaMateriiHTML() {
    const q = faraDiacritice(cautare.trim());
    let lista = IDX.module.filter(m => !filtruAn || m.an === filtruAn);
    if (set('doarBac')) lista = lista.filter(m => m.bac);
    if (q) lista = lista.filter(m =>
      faraDiacritice(m.materie).includes(q) ||
      faraDiacritice(m.descriere).includes(q) ||
      m.capitole.some(c => faraDiacritice(c.titlu).includes(q) ||
        c.lectii.some(l => faraDiacritice(l.titlu).includes(q))));
    if (!lista.length) {
      return `<div class="card"><h3>Nicio materie găsită</h3>
        <p class="muted">Încearcă alt cuvânt sau schimbă anul.</p></div>`;
    }
    /* Grupate pe ani, ca elevul să vadă în ce an se află fiecare disciplină. */
    const ani = [...new Set(lista.map(m => m.an))].sort((a, b) => a - b);
    return ani.map(an => `
      <h2>Clasa ${esc(ROMAN[an])}</h2>
      <div class="grid-cards">${lista.filter(m => m.an === an).map(cardMaterieHTML).join('')}</div>`).join('');
  }

  function cardMaterieHTML(m) {
    const done = cititeDin(m);
    return `<button class="card tap" data-go="#/materie/${encodeURIComponent(m.id)}">
      <div class="row"><h3>${esc(m.materie)}</h3>${m.bac ? '<span class="pill">BAC</span>' : ''}</div>
      <p class="muted">${esc(m.descriere)}</p>
      <div class="bar"><i style="--p:${m.nrLectii ? done / m.nrLectii : 0}"></i></div>
      <p class="muted" style="margin:8px 0 0">${done}/${m.nrLectii} lecții · ${m.capitole.length} capitole · ${m.nrCarduri} carduri · ${m.nrIntrebari} întrebări${m.nrIntrebariTeze ? ' (+' + m.nrIntrebariTeze + ' de teză)' : ''}</p>
    </button>`;
  }

  function viewAn(anStr) {
    const an = Number(anStr);
    const lista = modAn(an);
    if (!ROMAN[an]) return viewMaterii();
    title.textContent = 'Clasa ' + ROMAN[an];
    const clasa = CUR.clase.find(c => c.clasa === ROMAN[an]);
    view.innerHTML = `
      <p class="crumb"><b>Materii</b> › Clasa ${esc(ROMAN[an])}</p>
      ${lista.length ? `<div class="grid-cards">${lista.map(cardMaterieHTML).join('')}</div>`
                     : '<div class="card"><p>Niciun modul pregătit încă pentru acest an.</p></div>'}
      <h2>Toate disciplinele anului</h2>
      ${clasa ? materiiClasaHTML(clasa.clasa) : ''}`;
  }

  function viewMaterie(id) {
    const m = mod(id);
    if (!m) return viewMaterii();
    title.textContent = m.materie;
    const done = cititeDin(m);
    const semestre = [...new Set(m.capitole.map(c => c.semestru))].sort();

    view.innerHTML = `
      <p class="crumb"><b>Clasa ${esc(m.clasa)}</b> › ${esc(m.arie)}</p>
      <div class="card">
        <div class="row"><h3>${esc(m.materie)}</h3>${m.bac ? '<span class="pill">BAC</span>' : ''}</div>
        <p>${esc(m.descriere)}</p>
        <div class="bar"><i style="--p:${m.nrLectii ? done / m.nrLectii : 0}"></i></div>
        <div class="stats">
          <div class="stat"><b>${m.capitole.length}</b><span>capitole</span></div>
          <div class="stat"><b>${m.nrLectii}</b><span>lecții</span></div>
          <div class="stat"><b>${m.nrCarduri}</b><span>carduri</span></div>
          <div class="stat"><b>${m.nrIntrebari}</b><span>întrebări</span></div>
        </div>
      </div>

      <div class="grid2">
        <button class="btn" data-go="#/carduri/materie/${encodeURIComponent(m.id)}">Carduri</button>
        <button class="btn ghost" data-go="#/test/materie/${encodeURIComponent(m.id)}">Test din materie</button>
      </div>

      <h2>Teze semestriale</h2>
      <div class="lista">${semestre.map(s => {
        const t = (m.teze || []).find(x => x.semestru === s);
        const rez = state.teste['teza:' + m.id + ':' + s];
        return `<button class="rand" data-go="#/test/teza/${encodeURIComponent(m.id)}/${s}">
          <div class="rand-txt"><strong>Teza — semestrul ${s === 1 ? 'I' : 'al II-lea'}</strong>
          <span>${t ? t.nrIntrebari + ' întrebări de sinteză' : 'în pregătire'}${rez ? ' · ultimul rezultat ' + rez.procent + '%' : ''}</span></div>
          <span class="lec-sag" aria-hidden="true"></span></button>`;
      }).join('')}</div>

      ${semestre.map(s => `
        <h2>Semestrul ${s === 1 ? 'I' : 'al II-lea'}</h2>
        ${m.capitole.filter(c => c.semestru === s).map(c => capitolHTML(m, c, false)).join('')}
      `).join('')}`;
  }

  function capitolHTML(m, c, singur) {
    const gata = c.lectii.filter(l => state.lectiiCitite[l.id]).length;
    /* În ecranul materiei antetul e un link către capitol; în ecranul
       capitolului ar fi un link către el însuși, deci rămâne text. */
    const cap = singur
      ? `<div class="cap-head"><h3>${esc(c.titlu)}</h3>
           <span class="pill soft">${gata}/${c.lectii.length}</span></div>`
      : `<button class="cap-head" data-go="#/capitol/${encodeURIComponent(m.id)}/${encodeURIComponent(c.id)}">
           <h3>${esc(c.titlu)}</h3>
           <span class="pill soft">${gata}/${c.lectii.length}</span>
           <span class="lec-sag" aria-hidden="true"></span></button>`;
    return `<section class="cap">
      ${cap}
      <div class="lista">
        ${c.lectii.map((l, j) => `
          <button class="lec${state.lectiiCitite[l.id] ? ' citit' : ''}"
                  data-go="#/lectie/${encodeURIComponent(m.id)}/${encodeURIComponent(l.id)}">
            <span class="lec-nr" aria-hidden="true">${j + 1}</span>
            <span class="lec-txt"><strong>${esc(l.titlu)}</strong>
            <span>${state.lectiiCitite[l.id] ? 'citită' : 'de citit'}</span></span>
            <span class="lec-sag" aria-hidden="true"></span>
          </button>`).join('')}
        <button class="rand" data-go="#/test/capitol/${encodeURIComponent(m.id)}/${encodeURIComponent(c.id)}">
          <div class="rand-txt"><strong>Test din capitol</strong><span>toate lecțiile de mai sus</span></div>
          <span class="lec-sag" aria-hidden="true"></span></button>
      </div>
    </section>`;
  }

  function viewCapitol(modId, capId) {
    const m = mod(modId);
    const c = m && m.capitole.find(x => x.id === capId);
    if (!c) return viewMaterii();
    title.textContent = c.titlu;
    view.innerHTML = `
      <p class="crumb"><b>${esc(m.materie)}</b> › Semestrul ${c.semestru === 1 ? 'I' : 'al II-lea'}</p>
      ${capitolHTML(m, c, true)}
      <div class="grid2">
        <button class="btn" data-go="#/carduri/capitol/${encodeURIComponent(m.id)}/${encodeURIComponent(c.id)}">Carduri</button>
        <button class="btn ghost" data-go="#/test/capitol/${encodeURIComponent(m.id)}/${encodeURIComponent(c.id)}">Test</button>
      </div>`;
  }

  /* ---------- lecția ---------- */
  function gasesteLectie(modId, lecId) {
    const corp = MOD.get(modId);
    const ix = mod(modId);
    if (!corp || !ix) return null;
    for (const c of corp.capitole) {
      const i = c.lectii.findIndex(l => l.id === lecId);
      if (i > -1) return { ix, corp, cap: c, lec: c.lectii[i], poz: i };
    }
    return null;
  }

  /* Lecția următoare din același modul, în ordinea capitolelor. */
  function lectiaUrmatoare(modId, lecId) {
    const corp = MOD.get(modId);
    if (!corp) return null;
    const sir = corp.capitole.reduce((a, c) => a.concat(c.lectii.map(l => l.id)), []);
    const i = sir.indexOf(lecId);
    return i > -1 && i + 1 < sir.length ? sir[i + 1] : null;
  }

  function viewLectie(modId, lecId) {
    const g = gasesteLectie(modId, lecId);
    if (!g) return viewMaterii();
    const { ix, cap, lec } = g;
    title.textContent = ix.materie;
    const nota = state.notite[lec.id] || '';
    const urm = lectiaUrmatoare(modId, lecId);

    /* .two-col: pe telefon curge normal; ≥900px textul stă la stânga,
       notițele la dreapta (lipicioase), ca să nu derulezi ca să notezi. */
    view.innerHTML = `
      <div class="two-col">
        <div class="card">
          <p class="crumb" style="margin-bottom:10px"><b>${esc(ix.materie)}</b> › ${esc(cap.titlu)}</p>
          <h3>${esc(lec.titlu)}</h3>
          ${String(lec.rezumat).split('\n').filter(Boolean).map(t => `<p>${esc(t)}</p>`).join('')}
          <h3 style="margin-top:14px">Idei-cheie</h3>
          <ul class="clean">${lec.ideiCheie.map(i => `<li>${esc(i)}</li>`).join('')}</ul>
          ${lec.termeni && lec.termeni.length ? `
            <h3 style="margin-top:18px">Termeni</h3>
            <table><tr><th>Termen</th><th>Înțeles</th></tr>
            ${lec.termeni.map(t => `<tr><td><strong>${esc(t.t)}</strong></td><td class="muted">${esc(t.d)}</td></tr>`).join('')}
            </table>` : ''}
        </div>
        <div class="two-col-side">
          <div class="card">
            <h3>Notițele mele</h3>
            <textarea id="nota" rows="4" placeholder="Scrie aici...">${esc(nota)}</textarea>
            <p class="muted" id="nota-stare" style="margin:6px 0 0">Salvate automat pe acest dispozitiv.</p>
          </div>
          <button class="btn" id="marcheaza">${state.lectiiCitite[lec.id] ? '✓ Marcată ca citită — anulează' : 'Marchează drept citită'}</button>
          <div class="grid2" style="margin-top:12px">
            <button class="btn ghost" data-go="#/test/lectie/${encodeURIComponent(modId)}/${encodeURIComponent(lec.id)}">Test din lecție</button>
            <button class="btn ghost" data-go="#/carduri/lectie/${encodeURIComponent(modId)}/${encodeURIComponent(lec.id)}">Carduri</button>
          </div>
          ${urm ? `<button class="btn ghost" data-go="#/lectie/${encodeURIComponent(modId)}/${encodeURIComponent(urm)}">Lecția următoare →</button>` : ''}
        </div>
      </div>`;

    const ta = view.querySelector('#nota');
    const stare = view.querySelector('#nota-stare');
    let t;
    const salveazaNota = () => {
      if (ta.value.trim()) state.notite[lec.id] = ta.value; else delete state.notite[lec.id];
      save();
      /* Reținem NODUL, nu selectorul: dacă între timp s-a schimbat lecția,
         o re-interogare ar scrie „Salvat.” pe linia de stare a lecției
         următoare, care nu a salvat nimic. */
      if (stare.isConnected) stare.textContent = 'Salvat.';
    };
    ta.oninput = () => { clearTimeout(t); t = setTimeout(salveazaNota, 400); };
    /* La părăsirea câmpului se salvează IMEDIAT: debounce-ul se resetează la
       fiecare tastă, deci fără flush o reîncărcare (inclusiv cea automată,
       la update de SW) putea pierde ultimele secunde de tastare. */
    ta.onblur = () => { clearTimeout(t); salveazaNota(); };

    view.querySelector('#marcheaza').onclick = () => {
      clearTimeout(t);
      if (ta.value.trim()) state.notite[lec.id] = ta.value; else delete state.notite[lec.id];
      if (state.lectiiCitite[lec.id]) delete state.lectiiCitite[lec.id];
      else { state.lectiiCitite[lec.id] = Date.now(); marcheazaZi(); bate(12); }
      state.ultima = '#/lectie/' + encodeURIComponent(modId) + '/' + encodeURIComponent(lec.id);
      save(); render();
    };

    state.ultima = '#/lectie/' + encodeURIComponent(modId) + '/' + encodeURIComponent(lec.id);
    save();
  }

  /* ---------- adunarea conținutului dintr-un domeniu ---------- */
  /* `tip` = lectie | capitol | materie | an | clasa | (nimic = alegere) */
  function domeniu(tip, a, b) {
    const out = { titlu: '', cheie: '', carduri: [], intrebari: [] };
    const dinLectie = (ixm, l) => {
      (l.carduri || []).forEach((c, i) => out.carduri.push({ f: c.f, v: c.v, key: l.id + ':' + i, sursa: ixm.materie }));
      (l.test || []).forEach(q => out.intrebari.push(Object.assign({}, q, { sursa: ixm.materie + ' · ' + l.titlu })));
    };
    const dinModul = (id, filtruCap, filtruLec) => {
      const corp = MOD.get(id), ixm = mod(id);
      if (!corp || !ixm) return;
      for (const c of corp.capitole) {
        if (filtruCap && c.id !== filtruCap) continue;
        for (const l of c.lectii) {
          if (filtruLec && l.id !== filtruLec) continue;
          dinLectie(ixm, l);
        }
      }
    };

    if (tip === 'lectie') {
      const g = gasesteLectie(a, b);
      if (!g) return null;
      out.titlu = g.lec.titlu; out.cheie = 'lectie:' + a + ':' + b;
      dinModul(a, null, b);
    } else if (tip === 'capitol') {
      const ixm = mod(a); const c = ixm && ixm.capitole.find(x => x.id === b);
      if (!c) return null;
      out.titlu = c.titlu; out.cheie = 'capitol:' + a + ':' + b;
      dinModul(a, b, null);
    } else if (tip === 'materie') {
      const ixm = mod(a);
      if (!ixm) return null;
      out.titlu = ixm.materie; out.cheie = 'materie:' + a;
      dinModul(a, null, null);
    } else if (tip === 'teza') {
      const corp = MOD.get(a), ixm = mod(a);
      const s = Number(b);
      const t = corp && (corp.teze || []).find(x => x.semestru === s);
      if (!t) return null;
      out.titlu = 'Teza — semestrul ' + (s === 1 ? 'I' : 'al II-lea');
      out.cheie = 'teza:' + a + ':' + s;
      out.intrebari = (t.test || []).map(q => Object.assign({}, q, { sursa: ixm.materie }));
      /* Cardurile tezei = toate cardurile capitolelor semestrului. */
      for (const c of corp.capitole) if (c.semestru === s) for (const l of c.lectii) dinLectie(ixm, l);
    } else if (tip === 'an' || tip === 'clasa') {
      /* Aceeași funcție ca la preîncărcare (`moduleNecesare`), ca domeniul și
         modulele aduse să nu poată diverge niciodată. */
      const lista = tip === 'clasa' ? modClasa(state.clasa) : modAn(Number(a));
      if (!lista.length) return null;
      const an = lista[0].an;
      out.titlu = 'Clasa ' + ROMAN[an]; out.cheie = 'an:' + an;
      lista.forEach(m => dinModul(m.id, null, null));
    } else {
      return null;
    }
    return out;
  }

  /* Ecranul de alegere folosit și de Carduri, și de Test, când ruta n-are domeniu. */
  function alegereHTML(baza, subtitlu) {
    const lista = modClasa(state.clasa);
    return `
      <p class="muted">${esc(subtitlu)}</p>
      <div class="grid2">
        <button class="card tap" data-go="#/${baza}/clasa"><h3>Toată clasa</h3><p class="muted">${esc(state.clasa)} — toate materiile pregătite.</p></button>
        <button class="card tap" data-go="#/materii"><h3>Alege materia</h3><p class="muted">Deschide lista de materii.</p></button>
      </div>
      <h2>Materiile clasei ${esc(state.clasa)}</h2>
      ${lista.length ? `<div class="lista">${lista.map(m => `
        <button class="rand" data-go="#/${baza}/materie/${encodeURIComponent(m.id)}">
          <div class="rand-txt"><strong>${esc(m.materie)}</strong>
          <span>${m.nrLectii} lecții · ${baza === 'carduri' ? m.nrCarduri + ' carduri' : m.nrIntrebari + ' întrebări'}</span></div>
          <span class="lec-sag" aria-hidden="true"></span></button>`).join('')}</div>`
        : '<div class="card"><p>Niciun modul pregătit pentru clasa selectată. Schimbă clasa din Setări sau alege altă materie.</p></div>'}
      <h2>Alți ani</h2>
      <div class="chips">${[1, 2, 3, 4, 5].map(a =>
        `<button class="chip" data-go="#/${baza}/an/${a}">${esc(ROMAN[a])}</button>`).join('')}</div>`;
  }

  /* ═══ §6  motorul de carduri ════════════════════════════════════════ */
  let deck = [], deckPos = 0, flipped = false, deckTitlu = '';

  function viewCarduri(tip, a, b) {
    title.textContent = 'Carduri';
    if (!tip) { view.innerHTML = alegereHTML('carduri', 'Alege ce vrei să repeți.'); return; }
    const d = domeniu(tip, a, b);
    if (!d) { view.innerHTML = '<div class="card"><p>Niciun card disponibil aici.</p></div>'; return; }
    deckTitlu = d.titlu;

    let c = d.carduri;
    const ord = set('ordineCarduri');
    if (ord === 'grele') {
      /* „Cele grele” = cele la care ai apăsat „Mai repet” mai des decât „Știu”,
         plus cele nevăzute încă. Dacă nu iese nimic, cădem pe tot pachetul. */
      const grele = c.filter(x => {
        const st = state.carduri[x.key];
        return !st || st.greu >= st.usor;
      });
      c = grele.length ? grele : c;
    }
    c = ord === 'ordine' ? c : shuffle(c);
    const n = set('nrCarduri');
    deck = n > 0 ? c.slice(0, n) : c;
    deckPos = 0; flipped = false;
    if (!deck.length) { view.innerHTML = '<div class="card"><p>Niciun card disponibil aici.</p></div>'; return; }
    drawCard();
  }

  /* Ambele fețe există simultan în DOM și se suprapun în aceeași celulă de
     grid, altfel rotirea 3D e imposibilă. `flipped` nu declanșează randare:
     e doar o gardă împotriva dublei apăsări. */
  function drawCard() {
    if (deckPos >= deck.length) {
      view.innerHTML = `<div class="card"><h3>Sesiune încheiată</h3>
        <p class="muted">Ai parcurs ${deck.length} carduri din „${esc(deckTitlu)}”.</p>
        <button class="btn" id="din-nou">Încă o rundă</button>
        <button class="btn ghost" data-go="#/acasa">Acasă</button></div>`;
      view.querySelector('#din-nou').onclick = () => {
        deck = shuffle(deck); deckPos = 0; flipped = false; drawCard();
      };
      paint(true);
      return;
    }

    const c = deck[deckPos];
    view.innerHTML = `
      <p class="muted">Cardul ${deckPos + 1} din ${deck.length} · ${esc(c.sursa)}</p>
      <div class="flip" id="flip">
        <div class="flip-inner">
          <div class="card flash face front">${esc(c.f)}</div>
          <div class="card flash face back" aria-hidden="true">${esc(c.v)}</div>
        </div>
      </div>
      <div id="card-actions"><button class="btn" id="intoarce">Arată răspunsul</button></div>`;

    const flip    = view.querySelector('#flip');
    const actions = view.querySelector('#card-actions');
    const front   = view.querySelector('.face.front');
    const back    = view.querySelector('.face.back');

    const reveal = () => {
      if (flipped) return;
      flipped = true;
      bate(6);
      flip.classList.add('is-flipped');
      back.removeAttribute('aria-hidden');          // răspunsul devine citibil...
      front.setAttribute('aria-hidden', 'true');    // ...abia după întoarcere

      /* Butoanele se schimbă la jumătatea rotirii, când cardul e „pe muchie”. */
      const swapDelay = reduced() ? 0 : 190;
      setTimeout(() => {
        if (!flip.isConnected) return;              // ecranul a fost deja înlocuit
        actions.classList.add('swapped');
        actions.innerHTML = `
          <div class="grid2">
            <button class="btn ghost" data-ans="greu">Mai repet</button>
            <button class="btn" data-ans="usor">Știu</button>
          </div>`;
        actions.querySelectorAll('[data-ans]').forEach(b => b.onclick = () => {
          const st = state.carduri[c.key] || { usor: 0, greu: 0 };
          st[b.dataset.ans]++; state.carduri[c.key] = st; save();
          deckPos++; flipped = false; drawCard();
        });
      }, swapDelay);
    };

    /* Cardul rămâne apăsabil cu degetul, dar NU e un buton: `role="button"` ar
       face conținutul prezentațional, iar `aria-label` ar acoperi textul —
       adică întrebarea și răspunsul ar dispărea pentru cititoarele de ecran.
       Controlul accesibil e butonul `#intoarce`, care acoperă și tastatura. */
    view.querySelector('#intoarce').onclick = reveal;
    flip.onclick = reveal;
    if (set('autoIntoarce')) setTimeout(() => { if (flip.isConnected) reveal(); }, 4000);
    paint(true);                                    // cardul următor intră cu cascadă proprie
  }

  /* ═══ §7  motorul de test ═══════════════════════════════════════════ */
  let quiz = [], qPos = 0, qScor = 0, qCheie = '', qTitlu = '', qRasp = [];
  let qTimerId = null, qRamas = 0;

  function opresteCronometru() {
    if (qTimerId) { clearInterval(qTimerId); qTimerId = null; }
  }

  function viewTest(tip, a, b) {
    title.textContent = 'Test grilă';
    opresteCronometru();
    if (!tip) { view.innerHTML = alegereHTML('test', 'Alege din ce vrei să te testezi.'); return; }
    const d = domeniu(tip, a, b);
    if (!d || !d.intrebari.length) {
      view.innerHTML = '<div class="card"><p>Nicio întrebare disponibilă aici.</p></div>';
      return;
    }
    qCheie = d.cheie; qTitlu = d.titlu;

    let q = set('amestecaIntrebari') ? shuffle(d.intrebari) : d.intrebari.slice();
    /* Teza se dă întreagă: e o probă de semestru, nu o repetiție scurtă.
       Restul respectă numărul din Setări (0 = toate). */
    const n = tip === 'teza' ? 0 : set('nrIntrebari');
    if (n > 0) q = q.slice(0, n);
    quiz = q.map(amestecaOptiuni);
    qPos = 0; qScor = 0; qRasp = [];

    const minute = Number(set('cronometru')) || 0;
    if (minute > 0) {
      qRamas = minute * 60;
      qTimerId = setInterval(() => {
        qRamas--;
        const el = document.getElementById('cron');
        if (!el) { opresteCronometru(); return; }
        el.textContent = formatTimp(qRamas);
        el.classList.toggle('urgent', qRamas <= 30);
        if (qRamas <= 0) { opresteCronometru(); qPos = quiz.length; drawQ(); }
      }, 1000);
    }
    drawQ();
  }

  /* Amestecarea opțiunilor cere remaparea indicelui corect — altfel testul
     ar marca drept bun răspunsul aflat pe poziția veche. */
  function amestecaOptiuni(q) {
    if (!set('amestecaOptiuni')) return Object.assign({}, q);
    const per = shuffle(q.optiuni.map((o, i) => i));
    return Object.assign({}, q, {
      optiuni: per.map(i => q.optiuni[i]),
      corect: per.indexOf(q.corect)
    });
  }

  const formatTimp = s => {
    const t = Math.max(0, s);
    return String(Math.floor(t / 60)) + ':' + String(t % 60).padStart(2, '0');
  };

  function drawQ() {
    if (qPos >= quiz.length) { rezultatTest(); return; }

    const q = quiz[qPos];
    const cron = qTimerId ? `<span class="timer" id="cron">${formatTimp(qRamas)}</span>` : '';
    view.innerHTML = `
      <p class="muted">Întrebarea ${qPos + 1} din ${quiz.length} · ${esc(q.sursa || qTitlu)} ${cron}</p>
      <div class="card"><h3>${esc(q.intrebare)}</h3></div>
      <div id="opt">${q.optiuni.map((o, i) => `<button class="opt" data-i="${i}">${esc(o)}</button>`).join('')}</div>
      <div id="fb"></div>`;

    view.querySelectorAll('.opt').forEach(b => b.onclick = () => {
      const i = Number(b.dataset.i);
      const bun = i === q.corect;
      qRasp.push({ q, ales: i });
      if (bun) qScor++;
      bate(bun ? 8 : 18);

      if (!set('feedbackImediat')) {
        /* Fără feedback imediat: se marchează doar alegerea și se trece mai
           departe. Corectura completă vine la final, în recapitulare. */
        view.querySelectorAll('.opt').forEach((x, xi) => {
          x.disabled = true; x.classList.remove('enter');
          if (xi === i) x.classList.add('ales');
        });
        setTimeout(() => { qPos++; drawQ(); }, reduced() ? 0 : 160);
        return;
      }

      view.querySelectorAll('.opt').forEach((x, xi) => {
        x.disabled = true;
        /* .enter trebuie scos ÎNAINTE de .correct/.wrong: animația de cascadă,
           încă activă cu fill-mode both, ar bloca pulsul și scuturatul. */
        x.classList.remove('enter');
        if (xi === q.corect) x.classList.add('correct');
        else if (xi === i) x.classList.add('wrong');
      });
      view.querySelector('#fb').innerHTML =
        `<div class="card"><p>${bun ? '<strong>Corect.</strong> ' : '<strong>Greșit.</strong> '}${esc(q.explicatie)}</p>
         <button class="btn" id="next">${qPos + 1 === quiz.length ? 'Vezi rezultatul' : 'Următoarea'}</button></div>`;
      view.querySelector('#next').onclick = () => { qPos++; drawQ(); };
    });
    paint(true);          // întrebarea următoare intră în cascadă, fără schimbare de rută
  }

  function rezultatTest() {
    opresteCronometru();
    const total = quiz.length;
    const procent = pct(qScor, total);
    const prec = state.teste[qCheie];
    state.teste[qCheie] = { procent, cand: Date.now(), din: total };
    save();

    const gresite = qRasp.filter(r => r.ales !== r.q.corect);
    view.innerHTML = `<div class="card score">
        <h3>Rezultat: ${qScor}/${total} (${procent}%)</h3>
        <div class="bar"><i style="--p:${procent / 100}"></i></div>
        <p class="muted" style="margin-top:10px">${esc(qTitlu)}${prec ? ' · anterior ' + prec.procent + '%' : ''}</p>
        <button class="btn" id="reia">Reia testul</button>
        <button class="btn ghost" data-go="#/acasa">Acasă</button>
      </div>
      ${gresite.length ? `<h2>De recitit</h2>
      <ul class="rev">${gresite.map(r => `
        <li><strong>${esc(r.q.intrebare)}</strong>
          <div><span class="nu">${esc(r.q.optiuni[r.ales])}</span> → <span class="ok">${esc(r.q.optiuni[r.q.corect])}</span></div>
          <p class="muted" style="margin:6px 0 0">${esc(r.q.explicatie)}</p></li>`).join('')}</ul>`
        : '<div class="card"><p>Niciun răspuns greșit. 🎯</p></div>'}`;
    view.querySelector('#reia').onclick = () => { location.hash = location.hash; render(); };
    paint(true);
  }

  /* ---------- plan de învățământ ---------- */
  function viewPlan() {
    title.textContent = 'Plan de învățământ';
    view.innerHTML = `
      <div class="card">
        <h3>${esc(CUR.scoala.nume)}</h3>
        <p class="muted">${esc(CUR.scoala.adresa)}<br>Secretariat: ${esc(CUR.scoala.telefonSecretariat)} (${esc(CUR.scoala.programSecretariat)})</p>
        <p style="margin-top:10px">${esc(CUR.parcurs.filiera)} · ${esc(CUR.parcurs.profil)} · ${esc(CUR.parcurs.specializare)}<br>
        <span class="muted">${esc(CUR.parcurs.forma)} — ${esc(CUR.parcurs.durata)}</span></p>
      </div>
      <div class="card"><p class="muted">${esc(CUR.parcurs.observatie)}</p></div>
      <div class="grid-cards plan-grid">${CUR.clase.map(c => `
        <section class="plan-sec">
          <h2>Clasa ${esc(c.clasa)}</h2>
          <div class="card"><table>
            <tr><th>Disciplina</th><th>Arie</th></tr>
            ${c.materii.map(m => `<tr><td>${esc(m.nume)} ${m.bac ? '<span class="pill">BAC</span>' : ''}</td><td class="muted">${esc(m.arie)}</td></tr>`).join('')}
          </table></div>
        </section>`).join('')}</div>
      <h2>Probele de bacalaureat</h2>
      <div class="card"><table>
        ${Object.entries(CUR.bacalaureat).map(([k, v]) => `<tr><td><strong>${esc(k.replace('proba', 'Proba '))}</strong></td><td>${esc(v)}</td></tr>`).join('')}
      </table></div>`;
  }

  /* ═══ §8  ecranul de setări ═════════════════════════════════════════ */

  /* Construcție declarativă: fiecare control își poartă cheia din `setari`,
     iar un singur set de ascultători delegați o scrie înapoi. Așa nu există
     nicio listă paralelă „control → cheie” care să iasă din sincron. */
  const randTxt = (t, d) => `<div class="rand-txt"><strong>${esc(t)}</strong>${d ? `<span>${esc(d)}</span>` : ''}</div>`;

  const randSwitch = (k, t, d) => `
    <div class="rand">${randTxt(t, d)}
      <div class="rand-ctl"><button class="switch" role="switch" data-set="${k}"
        aria-checked="${!!set(k)}" aria-label="${esc(t)}"></button></div></div>`;

  const randSeg = (k, t, d, optiuni) => `
    <div class="rand col">${randTxt(t, d)}
      <div class="rand-ctl"><div class="seg" role="radiogroup" aria-label="${esc(t)}">
        ${optiuni.map(o => `<button role="radio" data-set="${k}" data-val="${esc(o.v)}"
          aria-checked="${String(set(k)) === String(o.v)}">${esc(o.e)}</button>`).join('')}
      </div></div></div>`;

  const randStepper = (k, t, d, min, max, pas, unitate) => `
    <div class="rand">${randTxt(t, d)}
      <div class="rand-ctl"><div class="stepper">
        <button data-step="${k}" data-delta="${-pas}" data-min="${min}" data-max="${max}" aria-label="Scade">−</button>
        <output data-out="${k}">${esc(etichetaVal(k, unitate))}</output>
        <button data-step="${k}" data-delta="${pas}" data-min="${min}" data-max="${max}" aria-label="Crește">+</button>
      </div></div></div>`;

  function etichetaVal(k, unitate) {
    const v = set(k);
    if (k === 'nrIntrebari' && v === 0) return 'toate';
    if (k === 'nrCarduri' && v === 0) return 'toate';
    if (k === 'cronometru' && v === 0) return 'fără';
    return v + (unitate ? ' ' + unitate : '');
  }

  const randActiune = (id, t, d, grav) => `
    <button class="rand${grav ? ' grav' : ''}" data-act="${id}">${randTxt(t, d)}
      <span class="lec-sag" aria-hidden="true"></span></button>`;

  function viewSetari() {
    title.textContent = 'Setări';
    const s = state.setari;
    view.innerHTML = `
      <h2>Aspect</h2>
      <div class="lista">
        ${randSeg('tema', 'Temă', 'Modul luminos, modul întunecat sau după setarea telefonului.',
          [{ v: 'auto', e: 'Automat' }, { v: 'luminos', e: 'Luminos' }, { v: 'intunecat', e: 'Întunecat' }])}
        ${randSeg('contrast', 'Contrast', 'Ridicat = margini de 1px în loc de umbre moi.',
          [{ v: 'auto', e: 'Automat' }, { v: 'normal', e: 'Normal' }, { v: 'ridicat', e: 'Ridicat' }])}
        ${randSeg('densitate', 'Densitate', 'Cât aer între elemente.',
          [{ v: 'compact', e: 'Compact' }, { v: 'confortabil', e: 'Confortabil' }, { v: 'spatios', e: 'Spațios' }])}
        ${randSeg('font', 'Litera', 'Lizibil = literă lată și rânduri rare.',
          [{ v: 'sistem', e: 'Sistem' }, { v: 'serif', e: 'Serif' }, { v: 'lizibil', e: 'Lizibil' }])}
        <div class="rand col">${randTxt('Mărimea textului', 'Se aplică peste mărimea din browser.')}
          <div class="rand-ctl">
            <input class="range" id="fs" type="range" min="85" max="140" step="5"
                   value="${esc(s.marimeText)}" aria-label="Mărimea textului">
            <output id="fs-out" style="min-width:4em;text-align:right">${esc(s.marimeText)}%</output>
          </div></div>
      </div>

      <h2>Mișcare și atingere</h2>
      <div class="lista">
        ${randSeg('miscare', 'Animații', 'Redusă = fără alunecări, doar estompări scurte.',
          [{ v: 'auto', e: 'Automat' }, { v: 'completa', e: 'Complete' }, { v: 'redusa', e: 'Reduse' }])}
        ${randSeg('transparenta', 'Sticlă', 'Redusă = suprafețe opace, fundal plat.',
          [{ v: 'auto', e: 'Automat' }, { v: 'completa', e: 'Completă' }, { v: 'redusa', e: 'Redusă' }])}
        ${randSwitch('haptic', 'Vibrație la atingere', 'Doar pe telefoanele care o permit.')}
      </div>

      <h2>Studiu</h2>
      <div class="lista">
        <div class="rand col">${randTxt('Clasa mea', 'Ce an apare primul pe ecranul Acasă.')}
          <div class="rand-ctl"><div class="chips" style="margin:0">
            ${CUR.clase.map(c => `<button class="chip" data-clasa="${esc(c.clasa)}" aria-pressed="${c.clasa === state.clasa}">${esc(c.clasa)}</button>`).join('')}
          </div></div></div>
        ${randSeg('ecranStart', 'Ecranul de pornire', 'Unde se deschide aplicația.',
          [{ v: 'acasa', e: 'Acasă' }, { v: 'materii', e: 'Materii' }, { v: 'ultima', e: 'Ultima lecție' }])}
        ${randStepper('obiectivZilnic', 'Obiectiv zilnic', 'Câte lecții pe zi îți propui.', 1, 10, 1, 'lecții')}
        ${randSwitch('doarBac', 'Doar materiile de bacalaureat', 'Ascunde disciplinele fără probă la BAC.')}
      </div>

      <h2>Test grilă</h2>
      <div class="lista">
        ${randStepper('nrIntrebari', 'Întrebări per test', '0 = toate întrebările din domeniu. Teza se dă mereu întreagă.', 0, 40, 4, '')}
        ${randSwitch('amestecaIntrebari', 'Amestecă întrebările', 'Altfel apar în ordinea din lecții.')}
        ${randSwitch('amestecaOptiuni', 'Amestecă variantele', 'Ca să nu memorezi poziția răspunsului.')}
        ${randSwitch('feedbackImediat', 'Corectură imediată', 'Oprit = corectura completă abia la final, ca la un examen.')}
        ${randStepper('cronometru', 'Cronometru', 'Minute pentru tot testul. 0 = fără limită.', 0, 60, 5, 'min')}
      </div>

      <h2>Carduri</h2>
      <div class="lista">
        ${randStepper('nrCarduri', 'Carduri per sesiune', '0 = tot pachetul.', 0, 60, 5, '')}
        ${randSeg('ordineCarduri', 'Ordinea', '„Cele grele” = cele la care ai cerut repetare.',
          [{ v: 'aleatorie', e: 'Aleatorie' }, { v: 'ordine', e: 'Din lecții' }, { v: 'grele', e: 'Cele grele' }])}
        ${randSwitch('autoIntoarce', 'Întoarcere automată', 'Răspunsul apare singur după 4 secunde.')}
      </div>

      <h2>Datele mele</h2>
      <div class="lista">
        ${randActiune('export', 'Salvează o copie', 'Descarcă progresul și notițele ca fișier JSON.')}
        ${randActiune('import', 'Încarcă o copie', 'Înlocuiește datele de pe acest dispozitiv.')}
        ${randActiune('reset-progres', 'Șterge progresul lecțiilor', 'Lecțiile devin din nou necitite.', true)}
        ${randActiune('reset-teste', 'Șterge rezultatele testelor', 'Media revine la zero.', true)}
        ${randActiune('reset-carduri', 'Șterge istoricul cardurilor', 'Se pierde ce ai marcat „știu”.', true)}
        ${randActiune('reset-notite', 'Șterge notițele', 'Toate notele din lecții.', true)}
        ${randActiune('reset-setari', 'Readu setările implicite', 'Doar setările, nu și progresul.', true)}
        ${randActiune('reset-tot', 'Șterge tot', 'Aplicația revine la starea de la prima pornire.', true)}
      </div>

      <h2>Despre</h2>
      <div class="lista">
        <div class="rand">${randTxt('Conținut', `versiunea ${IDX.version} · actualizat ${IDX.actualizat}`)}</div>
        <div class="rand">${randTxt('Module', `${IDX.nrModule} module · ${IDX.nrLectii} lecții · ${IDX.nrCarduri} carduri · ${IDX.nrIntrebari} întrebări de lecție + ${IDX.nrIntrebariTeze} de teză`)}</div>
        <div class="rand">${randTxt('Stare', navigator.onLine ? 'online' : 'offline — aplicația merge din memorie')}</div>
        ${randActiune('reimprospateaza', 'Caută o versiune nouă', 'Golește memoria locală a aplicației și reîncarcă.')}
      </div>
      <p class="muted">${esc(CUR.scoala.nume)} · ${esc(CUR.scoala.localitate)}</p>`;

    legaSetari();
  }

  function legaSetari() {
    /* Comutatoare și segmente. */
    view.querySelectorAll('[data-set]').forEach(el => el.onclick = () => {
      const k = el.dataset.set;
      if (el.classList.contains('switch')) {
        state.setari[k] = !state.setari[k];
        el.setAttribute('aria-checked', String(state.setari[k]));
      } else {
        const v = el.dataset.val;
        state.setari[k] = v;
        view.querySelectorAll(`[data-set="${k}"][data-val]`).forEach(x =>
          x.setAttribute('aria-checked', String(x.dataset.val === v)));
      }
      save(); aplicaPreferinte(); bate(6);
    });

    /* Incrementatoare. */
    view.querySelectorAll('[data-step]').forEach(b => b.onclick = () => {
      const k = b.dataset.step;
      const min = Number(b.dataset.min), max = Number(b.dataset.max);
      const v = Math.min(max, Math.max(min, Number(state.setari[k]) + Number(b.dataset.delta)));
      state.setari[k] = v; save(); bate(6);
      const out = view.querySelector(`[data-out="${k}"]`);
      const unitate = k === 'cronometru' ? 'min' : (k === 'obiectivZilnic' ? 'lecții' : '');
      if (out) out.textContent = etichetaVal(k, unitate);
    });

    /* Mărimea textului: se aplică LIVE, la fiecare pas al cursorului. */
    const fs = view.querySelector('#fs'), fsOut = view.querySelector('#fs-out');
    if (fs) fs.oninput = () => {
      state.setari.marimeText = Number(fs.value);
      fsOut.textContent = fs.value + '%';
      aplicaPreferinte(); save();
    };

    view.querySelectorAll('[data-clasa]').forEach(b => b.onclick = () => {
      state.clasa = b.dataset.clasa; save(); bate(6);
      view.querySelectorAll('[data-clasa]').forEach(x =>
        x.setAttribute('aria-pressed', String(x.dataset.clasa === state.clasa)));
    });

    view.querySelectorAll('[data-act]').forEach(b => b.onclick = () => actiune(b.dataset.act));
  }

  function actiune(id) {
    const cere = (mesaj) => confirm(mesaj);   // dialog nativ: nu inventăm un modal pentru o singură întrebare
    if (id === 'export') {
      const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'stiinte-sociale-' + azi() + '.json';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      return;
    }
    if (id === 'import') {
      const inp = document.createElement('input');
      inp.type = 'file'; inp.accept = 'application/json,.json';
      inp.onchange = () => {
        const f = inp.files && inp.files[0];
        if (!f) return;
        const fr = new FileReader();
        fr.onload = () => {
          /* Ordinea contează: parsăm, sanitizăm și abia apoi înlocuim starea.
             Varianta veche scria și `save()`-uia întâi, iar dacă randarea
             cădea (ex. `lectiiCitite: null`), starea coruptă rămânea în
             localStorage: la fiecare pornire ulterioară aplicația arăta
             „Nu s-au putut încărca datele”, un mesaj care trimitea spre
             fișierele aplicației, nu spre cauza reală. */
          let nou;
          try {
            const brut = JSON.parse(String(fr.result));
            if (!brut || typeof brut !== 'object' || Array.isArray(brut)) throw new Error('format');
            if (!('lectiiCitite' in brut) && !('setari' in brut) && !('teste' in brut))
              throw new Error('nu pare o copie a aplicației');
            nou = sanitizeaza(brut);
          } catch { alert('Fișierul nu conține o copie validă.'); return; }

          const precedent = state;
          try {
            state = nou;
            aplicaPreferinte();
            render();
            save();                       // abia după ce randarea a reușit
          } catch {
            state = precedent;
            aplicaPreferinte(); render();
            alert('Importul a eșuat; datele dinainte au rămas neatinse.');
          }
        };
        fr.readAsText(f);
      };
      inp.click();
      return;
    }
    if (id === 'reimprospateaza') {
      /* Acțiune distructivă: șterge TOT precache-ul (~2,8 MB, inclusiv cele 60
         de module) și dezînregistrează service worker-ul. Offline, reload-ul
         de după n-ar mai avea de unde încărca nimic — aplicația ar deveni de
         negăsit exact în situația în care era singura care mai mergea. */
      if (!navigator.onLine) {
        alert('Ești offline. Reîmprospătarea ar șterge lecțiile salvate pe dispozitiv și ' +
              'aplicația nu s-ar mai putea încărca. Încearcă din nou când ai internet.');
        return;
      }
      if (!cere('Se șterge tot conținutul salvat pe dispozitiv și se descarcă din nou ' +
                '(~3 MB). Progresul și setările NU se pierd. Continui?')) return;
      const gata = () => location.reload();
      const treburi = [];
      if (self.caches) treburi.push(caches.keys().then(k => Promise.all(k.map(x => caches.delete(x)))));
      if (navigator.serviceWorker && navigator.serviceWorker.getRegistrations)
        treburi.push(navigator.serviceWorker.getRegistrations().then(rs => Promise.all(rs.map(r => r.unregister()))));
      Promise.all(treburi).then(gata, gata);
      return;
    }
    const sters = {
      'reset-progres': ['Ștergi progresul tuturor lecțiilor?', () => { state.lectiiCitite = {}; state.zile = {}; }],
      'reset-teste': ['Ștergi toate rezultatele testelor?', () => { state.teste = {}; }],
      'reset-carduri': ['Ștergi istoricul cardurilor?', () => { state.carduri = {}; }],
      'reset-notite': ['Ștergi toate notițele din lecții?', () => { state.notite = {}; }],
      'reset-setari': ['Readuci toate setările la valorile implicite?', () => { state.setari = Object.assign({}, SETARI); }],
      'reset-tot': ['Ștergi TOT: progres, teste, carduri, notițe și setări?', () => { state = STARE_GOALA(); }]
    }[id];
    if (!sters) return;
    if (!cere(sters[0])) return;
    sters[1](); save(); aplicaPreferinte(); render();
  }

  /* ═══ §9  legături ══════════════════════════════════════════════════ */

  /* UN SINGUR ascultător delegat pentru toată navigarea [data-go], atașat o
     dată la pornire: nicio muncă per-randare, niciun handler de uitat. */
  view.addEventListener('click', e => {
    const go = e.target.closest('[data-go]');
    if (go) { bate(6); location.hash = go.dataset.go; }
  });

  tabs.forEach(t => t.onclick = () => { bate(6); location.hash = '#/' + t.dataset.route; });
  setariBtn.onclick = () => { bate(6); location.hash = '#/setari'; };
  backBtn.onclick = () => history.back();
  window.addEventListener('hashchange', () => { opresteCronometru(); render(); });

  const updNet = () => { netBadge.hidden = navigator.onLine; };
  window.addEventListener('online', updNet);
  window.addEventListener('offline', updNet);
  updNet();

  /* Ecranul de pornire ales de utilizator — doar dacă nu s-a intrat pe un
     link direct (un hash existent bate întotdeauna preferința). */
  function hashDePornire() {
    if (location.hash && location.hash !== '#/' && location.hash !== '#') return null;
    const e = set('ecranStart');
    if (e === 'materii') return '#/materii';
    if (e === 'ultima' && state.ultima) return state.ultima;
    return null;
  }

  Promise.all([
    fetch('./data/curriculum.json').then(r => r.json()),
    fetch('./data/continut.json').then(r => r.json())
  ]).then(([cur, idx]) => {
    CUR = cur; IDX = idx;
    curataProgresulOrfan();
    const start = hashDePornire();
    /* `replaceState`, nu `location.replace`: al doilea ar declanșa un
       `hashchange` și ecranul s-ar randa de două ori la fiecare pornire. */
    if (start) { try { history.replaceState(null, '', location.pathname + location.search + start); } catch { location.hash = start; } }
    render();
    /* Prefetch discret: modulele clasei curente, ca deschiderea unei lecții să
       fie instantanee. Rulează în timpul mort, nu concurează cu prima pictură. */
    const inactiv = window.requestIdleCallback || (f => setTimeout(f, 800));
    inactiv(() => { modClasa(state.clasa).slice(0, 8).forEach(m => ceriModul(m.id).catch(() => {})); });
  }).catch(() => { eroareDate(); });

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
    /* Când un SW NOU preia controlul (skipWaiting + claim), pagina curentă a
       fost randată cu resursele versiunii vechi — un amestec HTML nou/CSS vechi
       e posibil (s-a întâmplat în producție). O reîncărcare unică realiniază
       totul. Garda: la PRIMA instalare controller-ul trece din null în SW și
       nu trebuie reîncărcat nimic; iar flagul previne orice buclă.

       DAR nu aruncăm munca omului: un test în desfășurare, un pachet de
       carduri sau notițele în curs de tastare trăiesc doar în memorie. În
       aceste ecrane reload-ul se AMÂNĂ până la următoarea navigare sau până
       când tab-ul trece în fundal. */
    const stareNepersistata = () =>
      /^#\/(test|carduri)\/./.test(location.hash || '') ||
      (document.activeElement && document.activeElement.id === 'nota');
    let reloadAmanat = false;
    const incearcaReload = () => {
      if (!reloadAmanat) return;
      if (stareNepersistata() && document.visibilityState === 'visible') return;
      reloadAmanat = false;
      location.reload();
    };
    let aveaController = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!aveaController) { aveaController = true; return; }
      reloadAmanat = true;
      incearcaReload();
    });
    window.addEventListener('hashchange', incearcaReload);
    document.addEventListener('visibilitychange', incearcaReload);
  }
})();
