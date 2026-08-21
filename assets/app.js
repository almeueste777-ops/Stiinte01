/* Științe Sociale — PWA de studiu pentru liceu FR, profil umanist.
   Fără dependențe externe, fără build, funcționează 100% offline. */
(() => {
  'use strict';

  const KEY = 'stiinte01:v1';
  const view = document.getElementById('view');
  const title = document.getElementById('page-title');
  const backBtn = document.getElementById('btn-back');
  const netBadge = document.getElementById('net-badge');

  /* ---------- infrastructură de mișcare (stratul 3 din app.css) ---------- */
  const stage  = document.getElementById('stage');
  const tabbar = document.querySelector('.tabbar');
  const tabs   = Array.prototype.slice.call(document.querySelectorAll('.tab'));
  tabbar.style.setProperty('--tab-count', tabs.length);

  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const ROOT_ROUTES = ['acasa', 'materii', 'carduri', 'test', 'plan'];

  /* Stiva de navigație = semantica lui UINavigationController.
     Goală la start: prima randare iese mereu ca „fade” + cascadă. */
  let navStack = [];
  let ghost = null;
  let lastTabIdx = -1;

  /* Adâncimea rutei = numărul de argumente. Uniform pentru toate rutele:
     altfel `#/carduri/filosofie` (1 argument) ar ieși mai „puțin adânc” decât
     `#/materie/filosofie`, deși ambele sunt un pas în jos. */
  function routeDepth(hash) {
    const parts = String(hash).replace(/^#\/?/, '').split('/').filter(Boolean);
    return Math.max(0, parts.length - 1);
  }

  /* Direcția: 'push' | 'pop' | 'fade' | 'replace'.
     Stiva e mai fiabilă decât simpla comparație de adâncime, fiindcă prinde
     corect și butonul „înapoi” al browserului. Adâncimea rămâne plasă de
     siguranță pentru linkuri directe care nu există în stivă. */
  function navDirection(hash) {
    if (!navStack.length) { navStack = [hash]; return 'fade'; }        // prima randare
    const top = navStack[navStack.length - 1];
    if (hash === top) return 'replace';                                // re-randare
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
    if (view.querySelectorAll('*').length > 2000) return;   // plasă de siguranță; niciun ecran actual nu o atinge
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
  const STAGGER_SEL = ':scope > p, :scope > h2, :scope > .card, :scope > .chips, ' +
                      ':scope > .grid2, :scope > .btn, :scope > .flip, ' +
                      ':scope > #opt > .opt, :scope > #card-actions, ' +
                      ':scope > .grid-cards > *, :scope > .two-col > *, :scope > #clasa-panou > *';
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

  let DB = null;          // continut.json
  let CUR = null;         // curriculum.json
  let state = load();

  /* ---------- persistență ---------- */
  function load() {
    try {
      return Object.assign(
        { lectiiCitite: {}, carduri: {}, teste: {}, notite: {}, clasa: 'a XII-a' },
        JSON.parse(localStorage.getItem(KEY) || '{}')
      );
    } catch { return { lectiiCitite: {}, carduri: {}, teste: {}, notite: {}, clasa: 'a XII-a' }; }
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* quota/private mode */ }
  }

  /* ---------- utilitare ---------- */
  const esc = s => String(s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const totalLectii = () => DB.module.reduce((a, m) => a + m.lectii.length, 0);
  const citite = () => Object.keys(state.lectiiCitite).length;
  const modul = id => DB.module.find(m => m.id === id);

  function shuffle(a) {
    const r = a.slice();
    for (let i = r.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [r[i], r[j]] = [r[j], r[i]];
    }
    return r;
  }

  /* ---------- router ---------- */
  const routes = {
    acasa: viewAcasa,
    materii: viewMaterii,
    materie: viewMaterie,
    lectie: viewLectie,
    carduri: viewCarduri,
    test: viewTest,
    plan: viewPlan
  };

  function parseHash() {
    const raw = (location.hash || '#/acasa').replace(/^#\/?/, '');
    const parts = raw.split('/').filter(Boolean);
    /* O rută necunoscută cade pe „acasă” cu totul — inclusiv argumentele.
       Altfel bara de taburi rămânea cu pastila sub tabul anterior. */
    if (!parts.length || !routes[parts[0]]) return { name: 'acasa', args: [] };
    return { name: parts[0], args: parts.slice(1).map(decodeURIComponent) };
  }

  function render() {
    const hash = location.hash || '#/acasa';
    const dir = navDirection(hash);
    spawnGhost(dir);                        // ÎNAINTE de a goli #view

    /* Fără date nu există ecran de randat. Fără această gardă, o apăsare de tab
       după o încărcare eșuată golea #view și arunca pe `DB.module` — adică
       ștergea inclusiv mesajul de eroare și bloca aplicația până la reîncărcare. */
    if (!DB || !CUR) {
      view.innerHTML = '<div class="card"><h3>Nu s-au putut încărca datele</h3>' +
        '<p class="muted">Verifică fișierele din folderul <code>data/</code> ' +
        'și reîncarcă pagina.</p></div>';
      return;
    }

    const { name, args } = parseHash();
    const fn = routes[name] || viewAcasa;
    const prevTitle = title.textContent;

    view.innerHTML = '';
    fn(...args);

    const isRoot = ROOT_ROUTES.includes(name) && args.length === 0;
    backBtn.hidden = isRoot;

    tabs.forEach(t => {
      const active = t.dataset.route === name ||
        (name === 'materie' && t.dataset.route === 'materii') ||
        (name === 'lectie' && t.dataset.route === 'materii');
      t.setAttribute('aria-selected', String(active));
    });

    /* Pastila indicatoare + pocnitul iconiței pe tab-ul nou selectat. */
    const idx = tabs.findIndex(t => t.getAttribute('aria-selected') === 'true');
    if (idx > -1) {
      tabbar.style.setProperty('--tab-i', idx);
      if (idx !== lastTabIdx && !reduced()) {
        const ic = tabs[idx].querySelector('.ico');
        if (ic) { ic.classList.remove('pop'); void ic.offsetWidth; ic.classList.add('pop'); }
      }
      lastTabIdx = idx;
    }

    /* Titlul din topbar face fade doar dacă s-a schimbat efectiv. */
    if (title.textContent !== prevTitle) {
      title.classList.remove('swap'); void title.offsetWidth; title.classList.add('swap');
    }

    window.scrollTo(0, 0);                  // după ce --ghost-y a fost deja capturat
    playViewAnim(dir);
    paint();
    view.focus({ preventScroll: true });
  }

  /* ---------- ecrane ---------- */
  function viewAcasa() {
    title.textContent = 'Științe Sociale';
    const pct = Math.round(citite() / Math.max(1, totalLectii()) * 100);
    const testKeys = Object.keys(state.teste);
    const medie = testKeys.length
      ? Math.round(testKeys.reduce((a, k) => a + state.teste[k].procent, 0) / testKeys.length)
      : null;

    view.innerHTML = `
      <div class="card">
        <div class="row"><h3>Progres general</h3><span class="pill soft">${citite()}/${totalLectii()} lecții</span></div>
        <div class="bar"><i style="--p:${pct / 100}"></i></div>
        <p class="muted" style="margin-top:10px">
          ${CUR.parcurs.specializare} · ${CUR.parcurs.profil} · ${CUR.parcurs.forma}<br>
          ${esc(CUR.scoala.nume)}, ${esc(CUR.scoala.localitate)}
        </p>
      </div>

      <div class="grid2">
        <button class="card tap" data-go="#/carduri"><h3>Carduri</h3><p class="muted">Repetiție rapidă din toate materiile.</p></button>
        <button class="card tap" data-go="#/test"><h3>Test grilă</h3><p class="muted">${medie === null ? 'Niciun test dat încă.' : 'Medie: ' + medie + '%'}</p></button>
      </div>

      <h2>Continuă unde ai rămas</h2>
      <div class="grid-cards">${nextLectiiHTML()}</div>

      <h2>Materiile anului</h2>
      <div class="chips">${
        CUR.clase.map(c => `<button class="chip" data-clasa="${esc(c.clasa)}" aria-pressed="${c.clasa === state.clasa}">${esc(c.clasa)}</button>`).join('')
      }</div>
      <div id="clasa-panou">${materiiClasaHTML(state.clasa)}</div>
    `;
    /* Schimbarea clasei NU mai re-randează tot ecranul: se rescrie doar
       panoul cu tabelul. Răspuns instantaneu, fără repornirea animațiilor
       și fără pierderea poziției de derulare. */
    view.querySelectorAll('[data-clasa]').forEach(b => b.onclick = () => {
      if (state.clasa === b.dataset.clasa) return;
      state.clasa = b.dataset.clasa; save();
      view.querySelectorAll('[data-clasa]').forEach(x =>
        x.setAttribute('aria-pressed', String(x.dataset.clasa === state.clasa)));
      const panou = view.querySelector('#clasa-panou');
      if (panou) panou.innerHTML = materiiClasaHTML(state.clasa);
    });
  }

  function nextLectiiHTML() {
    const next = [];
    for (const m of DB.module) {
      for (const l of m.lectii) {
        if (!state.lectiiCitite[l.id]) { next.push({ m, l }); break; }
      }
      if (next.length >= 3) break;
    }
    if (!next.length) return `<div class="card"><p>Ai parcurs toate lecțiile disponibile. 🎓</p></div>`;
    return next.map(({ m, l }) => `
      <button class="card tap" data-go="#/lectie/${m.id}/${l.id}">
        <div class="row"><h3>${esc(l.titlu)}</h3><span class="pill soft">${esc(m.materie)}</span></div>
      </button>`).join('');
  }

  function materiiClasaHTML(clasa) {
    const c = CUR.clase.find(x => x.clasa === clasa);
    if (!c) return '';
    return `<div class="card"><table>
      <tr><th>Disciplina</th><th>Arie curriculară</th></tr>
      ${c.materii.map(m => `<tr><td>${esc(m.nume)} ${m.bac ? '<span class="pill">BAC</span>' : ''}</td><td class="muted">${esc(m.arie)}</td></tr>`).join('')}
    </table></div>
    <p class="muted">„BAC” marchează disciplinele care pot face obiectul unei probe de bacalaureat.</p>`;
  }

  function viewMaterii() {
    title.textContent = 'Materii';
    view.innerHTML = `
      <p class="muted">Module de studiu cu lecții, carduri și test pentru fiecare disciplină.</p>
      <div class="grid-cards">${DB.module.map(m => {
        const done = m.lectii.filter(l => state.lectiiCitite[l.id]).length;
        return `<button class="card tap" data-go="#/materie/${m.id}">
          <div class="row"><h3>${esc(m.materie)}</h3><span class="pill soft">${esc(m.clasa)}</span></div>
          <p class="muted">${esc(m.descriere)}</p>
          <div class="bar"><i style="--p:${m.lectii.length ? done / m.lectii.length : 0}"></i></div>
          <p class="muted" style="margin:8px 0 0">${done}/${m.lectii.length} lecții · ${m.flashcards.length} carduri · ${m.quiz.length} întrebări</p>
        </button>`;
      }).join('')}</div>`;
  }

  function viewMaterie(id) {
    const m = modul(id);
    if (!m) return viewMaterii();
    title.textContent = m.materie;
    view.innerHTML = `
      <div class="card"><p>${esc(m.descriere)}</p><p class="muted">Clasa ${esc(m.clasa)}</p></div>
      <h2>Lecții</h2>
      <div class="grid-cards">${m.lectii.map(l => `<button class="card tap" data-go="#/lectie/${m.id}/${l.id}">
        <div class="row"><h3>${esc(l.titlu)}</h3>${state.lectiiCitite[l.id] ? '<span class="pill soft">✓ citit</span>' : ''}</div>
      </button>`).join('')}</div>
      <div class="grid2" style="margin-top:12px">
        <button class="btn" data-go="#/carduri/${m.id}">Carduri</button>
        <button class="btn ghost" data-go="#/test/${m.id}">Test</button>
      </div>`;
  }

  function viewLectie(modId, lecId) {
    const m = modul(modId);
    const l = m && m.lectii.find(x => x.id === lecId);
    if (!l) return viewMaterii();
    title.textContent = m.materie;
    const nota = state.notite[l.id] || '';
    /* .two-col: pe telefon curge normal; ≥900px textul stă la stânga,
       notițele la dreapta (lipicioase), ca să nu derulezi ca să notezi. */
    view.innerHTML = `
      <div class="two-col">
        <div class="card">
          <h3>${esc(l.titlu)}</h3>
          <p>${esc(l.rezumat)}</p>
          <h3 style="margin-top:14px">Idei-cheie</h3>
          <ul class="clean">${l.ideiCheie.map(i => `<li>${esc(i)}</li>`).join('')}</ul>
        </div>
        <div class="two-col-side">
          <div class="card">
            <h3>Notițele mele</h3>
            <textarea id="nota" rows="4" placeholder="Scrie aici...">${esc(nota)}</textarea>
            <p class="muted" id="nota-stare" style="margin:6px 0 0">Salvate automat pe acest dispozitiv.</p>
          </div>
          <button class="btn" id="marcheaza">${state.lectiiCitite[l.id] ? '✓ Marcată ca citită — anulează' : 'Marchează drept citită'}</button>
        </div>
      </div>`;

    const ta = view.querySelector('#nota');
    const stare = view.querySelector('#nota-stare');
    let t;
    const salveazaNota = () => {
      if (ta.value.trim()) state.notite[l.id] = ta.value; else delete state.notite[l.id];
      save();
      /* Reținem NODUL, nu selectorul: dacă între timp s-a schimbat lecția,
         o re-interogare ar scrie „Salvat.” pe linia de stare a lecției
         următoare, care nu a salvat nimic. */
      if (stare.isConnected) stare.textContent = 'Salvat.';
    };
    ta.oninput = () => {
      clearTimeout(t);
      t = setTimeout(salveazaNota, 400);
    };
    /* La părăsirea câmpului se salvează IMEDIAT: debounce-ul se resetează la
       fiecare tastă, deci fără flush o reîncărcare (inclusiv cea automată,
       la update de SW) putea pierde ultimele secunde de tastare. */
    ta.onblur = () => { clearTimeout(t); salveazaNota(); };
    view.querySelector('#marcheaza').onclick = () => {
      clearTimeout(t);
      if (ta.value.trim()) state.notite[l.id] = ta.value; else delete state.notite[l.id];
      if (state.lectiiCitite[l.id]) delete state.lectiiCitite[l.id];
      else state.lectiiCitite[l.id] = Date.now();
      save(); render();
    };
  }

  /* ---------- carduri (repetiție) ---------- */
  let deck = [], deckPos = 0, flipped = false;

  function viewCarduri(modId) {
    title.textContent = 'Carduri';
    const surse = modId ? [modul(modId)].filter(Boolean) : DB.module;
    deck = shuffle(surse.flatMap(m => m.flashcards.map((f, i) => ({ ...f, key: m.id + ':' + i, materie: m.materie }))));
    deckPos = 0; flipped = false;
    if (!deck.length) { view.innerHTML = '<div class="card"><p>Niciun card disponibil.</p></div>'; return; }
    drawCard();
  }

  /* Ambele fețe există simultan în DOM și se suprapun în aceeași celulă de
     grid, altfel rotirea 3D e imposibilă (înainte, întoarcerea se făcea prin
     re-randare). `flipped` nu mai declanșează randare: e doar o gardă
     împotriva dublei apăsări. */
  function drawCard() {
    if (deckPos >= deck.length) {
      view.innerHTML = `<div class="card"><h3>Sesiune încheiată</h3>
        <p class="muted">Ai parcurs ${deck.length} carduri.</p>
        <button class="btn" id="din-nou">Încă o rundă</button></div>`;
      view.querySelector('#din-nou').onclick = () => {
        deck = shuffle(deck); deckPos = 0; flipped = false; drawCard();
      };
      paint(true);
      return;
    }

    const c = deck[deckPos];
    view.innerHTML = `
      <p class="muted">Cardul ${deckPos + 1} din ${deck.length} · ${esc(c.materie)}</p>
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
    paint(true);                                    // cardul următor intră cu cascadă proprie
  }

  /* ---------- test grilă ---------- */
  let quiz = [], qPos = 0, qScor = 0, qId = '';

  function viewTest(modId) {
    title.textContent = 'Test grilă';
    const surse = modId ? [modul(modId)].filter(Boolean) : DB.module;
    qId = modId || 'toate';
    quiz = shuffle(surse.flatMap(m => m.quiz.map(q => ({ ...q, materie: m.materie })))).slice(0, 12);
    qPos = 0; qScor = 0;
    if (!quiz.length) { view.innerHTML = '<div class="card"><p>Nicio întrebare disponibilă.</p></div>'; return; }
    drawQ();
  }

  function drawQ() {
    if (qPos >= quiz.length) {
      const procent = Math.round(qScor / quiz.length * 100);
      const prec = state.teste[qId];
      state.teste[qId] = { procent, cand: Date.now() }; save();
      view.innerHTML = `<div class="card score">
        <h3>Rezultat: ${qScor}/${quiz.length} (${procent}%)</h3>
        <div class="bar"><i style="--p:${procent / 100}"></i></div>
        ${prec ? `<p class="muted" style="margin-top:10px">Anterior: ${prec.procent}%</p>` : ''}
        <button class="btn" id="reia">Reia testul</button>
        <button class="btn ghost" data-go="#/acasa">Acasă</button>
      </div>`;
      view.querySelector('#reia').onclick = () => viewTest(qId === 'toate' ? undefined : qId);
      paint(true);
      return;
    }
    const q = quiz[qPos];
    view.innerHTML = `
      <p class="muted">Întrebarea ${qPos + 1} din ${quiz.length} · ${esc(q.materie)}</p>
      <div class="card"><h3>${esc(q.intrebare)}</h3></div>
      <div id="opt">${q.optiuni.map((o, i) => `<button class="opt" data-i="${i}">${esc(o)}</button>`).join('')}</div>
      <div id="fb"></div>`;
    view.querySelectorAll('.opt').forEach(b => b.onclick = () => {
      const i = Number(b.dataset.i);
      view.querySelectorAll('.opt').forEach((x, xi) => {
        x.disabled = true;
        /* .enter trebuie scos ÎNAINTE de .correct/.wrong: animația de cascadă,
           încă activă cu fill-mode both, ar bloca pulsul și scuturatul. */
        x.classList.remove('enter');
        if (xi === q.corect) x.classList.add('correct');
        else if (xi === i) x.classList.add('wrong');
      });
      if (i === q.corect) qScor++;
      view.querySelector('#fb').innerHTML =
        `<div class="card"><p>${i === q.corect ? '<strong>Corect.</strong> ' : '<strong>Greșit.</strong> '}${esc(q.explicatie)}</p>
         <button class="btn" id="next">${qPos + 1 === quiz.length ? 'Vezi rezultatul' : 'Următoarea'}</button></div>`;
      view.querySelector('#next').onclick = () => { qPos++; drawQ(); };
    });
    paint(true);          // întrebarea următoare intră în cascadă, fără schimbare de rută
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

  /* ---------- glue ---------- */
  /* UN SINGUR ascultător delegat pentru toată navigarea [data-go], atașat o
     dată la pornire: nicio muncă per-randare, niciun handler de uitat. */
  view.addEventListener('click', e => {
    const go = e.target.closest('[data-go]');
    if (go) location.hash = go.dataset.go;
  });

  tabs.forEach(t => t.onclick = () => { location.hash = '#/' + t.dataset.route; });
  backBtn.onclick = () => history.back();
  window.addEventListener('hashchange', render);

  const updNet = () => { netBadge.hidden = navigator.onLine; };
  window.addEventListener('online', updNet);
  window.addEventListener('offline', updNet);
  updNet();

  Promise.all([
    fetch('./data/curriculum.json').then(r => r.json()),
    fetch('./data/continut.json').then(r => r.json())
  ]).then(([cur, db]) => {
    CUR = cur; DB = db; render();
  }).catch(() => {
    view.innerHTML = '<div class="card"><h3>Nu s-au putut încărca datele</h3><p class="muted">Verifică fișierele din folderul <code>data/</code>.</p></div>';
  });

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
      /^#\/(test|carduri)/.test(location.hash || '') ||
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
