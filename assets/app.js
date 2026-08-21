/* Științe Sociale — PWA de studiu pentru liceu FR, profil umanist.
   Fără dependențe externe, fără build, funcționează 100% offline. */
(() => {
  'use strict';

  const KEY = 'stiinte01:v1';
  const view = document.getElementById('view');
  const title = document.getElementById('page-title');
  const backBtn = document.getElementById('btn-back');
  const netBadge = document.getElementById('net-badge');

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
    return { name: parts[0] || 'acasa', args: parts.slice(1).map(decodeURIComponent) };
  }

  function render() {
    const { name, args } = parseHash();
    const fn = routes[name] || viewAcasa;
    view.innerHTML = '';
    fn(...args);
    const isRoot = ['acasa', 'materii', 'carduri', 'test', 'plan'].includes(name);
    backBtn.hidden = isRoot;
    document.querySelectorAll('.tab').forEach(t => {
      const active = t.dataset.route === name ||
        (name === 'materie' && t.dataset.route === 'materii') ||
        (name === 'lectie' && t.dataset.route === 'materii');
      t.setAttribute('aria-selected', String(active));
    });
    window.scrollTo(0, 0);
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
        <div class="bar"><i style="width:${pct}%"></i></div>
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
      ${nextLectiiHTML()}

      <h2>Materiile anului</h2>
      <div class="chips">${
        CUR.clase.map(c => `<button class="chip" data-clasa="${esc(c.clasa)}" aria-pressed="${c.clasa === state.clasa}">${esc(c.clasa)}</button>`).join('')
      }</div>
      ${materiiClasaHTML(state.clasa)}
    `;
    bindGo();
    view.querySelectorAll('[data-clasa]').forEach(b => b.onclick = () => {
      state.clasa = b.dataset.clasa; save(); render();
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
      ${DB.module.map(m => {
        const done = m.lectii.filter(l => state.lectiiCitite[l.id]).length;
        return `<button class="card tap" data-go="#/materie/${m.id}">
          <div class="row"><h3>${esc(m.materie)}</h3><span class="pill soft">${esc(m.clasa)}</span></div>
          <p class="muted">${esc(m.descriere)}</p>
          <div class="bar"><i style="width:${Math.round(done / m.lectii.length * 100)}%"></i></div>
          <p class="muted" style="margin:8px 0 0">${done}/${m.lectii.length} lecții · ${m.flashcards.length} carduri · ${m.quiz.length} întrebări</p>
        </button>`;
      }).join('')}`;
    bindGo();
  }

  function viewMaterie(id) {
    const m = modul(id);
    if (!m) return viewMaterii();
    title.textContent = m.materie;
    view.innerHTML = `
      <div class="card"><p>${esc(m.descriere)}</p><p class="muted">Clasa ${esc(m.clasa)}</p></div>
      <h2>Lecții</h2>
      ${m.lectii.map(l => `<button class="card tap" data-go="#/lectie/${m.id}/${l.id}">
        <div class="row"><h3>${esc(l.titlu)}</h3>${state.lectiiCitite[l.id] ? '<span class="pill soft">✓ citit</span>' : ''}</div>
      </button>`).join('')}
      <div class="grid2" style="margin-top:12px">
        <button class="btn" data-go="#/carduri/${m.id}">Carduri</button>
        <button class="btn ghost" data-go="#/test/${m.id}">Test</button>
      </div>`;
    bindGo();
  }

  function viewLectie(modId, lecId) {
    const m = modul(modId);
    const l = m && m.lectii.find(x => x.id === lecId);
    if (!l) return viewMaterii();
    title.textContent = m.materie;
    const nota = state.notite[l.id] || '';
    view.innerHTML = `
      <div class="card">
        <h3>${esc(l.titlu)}</h3>
        <p>${esc(l.rezumat)}</p>
        <h3 style="margin-top:14px">Idei-cheie</h3>
        <ul class="clean">${l.ideiCheie.map(i => `<li>${esc(i)}</li>`).join('')}</ul>
      </div>
      <div class="card">
        <h3>Notițele mele</h3>
        <textarea id="nota" rows="4" style="width:100%;font:inherit;padding:10px;border-radius:10px;border:1px solid var(--line);background:transparent;color:inherit" placeholder="Scrie aici...">${esc(nota)}</textarea>
        <p class="muted" id="nota-stare" style="margin:6px 0 0">Salvate automat pe acest dispozitiv.</p>
      </div>
      <button class="btn" id="marcheaza">${state.lectiiCitite[l.id] ? '✓ Marcată ca citită — anulează' : 'Marchează drept citită'}</button>`;

    const ta = view.querySelector('#nota');
    let t;
    ta.oninput = () => {
      clearTimeout(t);
      t = setTimeout(() => {
        if (ta.value.trim()) state.notite[l.id] = ta.value; else delete state.notite[l.id];
        save();
        // ecranul poate fi deja înlocuit când se scurge temporizatorul
        const stare = view.querySelector('#nota-stare');
        if (stare) stare.textContent = 'Salvat.';
      }, 400);
    };
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

  function drawCard() {
    if (deckPos >= deck.length) {
      view.innerHTML = `<div class="card"><h3>Sesiune încheiată</h3>
        <p class="muted">Ai parcurs ${deck.length} carduri.</p>
        <button class="btn" id="din-nou">Încă o rundă</button></div>`;
      view.querySelector('#din-nou').onclick = () => { deck = shuffle(deck); deckPos = 0; flipped = false; drawCard(); };
      return;
    }
    const c = deck[deckPos];
    view.innerHTML = `
      <p class="muted">Cardul ${deckPos + 1} din ${deck.length} · ${esc(c.materie)}</p>
      <div class="card flash" id="fata">${esc(flipped ? c.v : c.f)}</div>
      ${flipped
        ? `<div class="grid2">
             <button class="btn ghost" data-ans="greu">Mai repet</button>
             <button class="btn" data-ans="usor">Știu</button>
           </div>`
        : `<button class="btn" id="intoarce">Arată răspunsul</button>`}`;
    if (!flipped) {
      const go = () => { flipped = true; drawCard(); };
      view.querySelector('#intoarce').onclick = go;
      view.querySelector('#fata').onclick = go;
    } else {
      view.querySelectorAll('[data-ans]').forEach(b => b.onclick = () => {
        const st = state.carduri[c.key] || { usor: 0, greu: 0 };
        st[b.dataset.ans]++; state.carduri[c.key] = st; save();
        deckPos++; flipped = false; drawCard();
      });
    }
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
      view.innerHTML = `<div class="card">
        <h3>Rezultat: ${qScor}/${quiz.length} (${procent}%)</h3>
        <div class="bar"><i style="width:${procent}%"></i></div>
        ${prec ? `<p class="muted" style="margin-top:10px">Anterior: ${prec.procent}%</p>` : ''}
        <button class="btn" id="reia">Reia testul</button>
        <button class="btn ghost" data-go="#/acasa">Acasă</button>
      </div>`;
      view.querySelector('#reia').onclick = () => viewTest(qId === 'toate' ? undefined : qId);
      bindGo();
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
        if (xi === q.corect) x.classList.add('correct');
        else if (xi === i) x.classList.add('wrong');
      });
      if (i === q.corect) qScor++;
      view.querySelector('#fb').innerHTML =
        `<div class="card"><p>${i === q.corect ? '<strong>Corect.</strong> ' : '<strong>Greșit.</strong> '}${esc(q.explicatie)}</p>
         <button class="btn" id="next">${qPos + 1 === quiz.length ? 'Vezi rezultatul' : 'Următoarea'}</button></div>`;
      view.querySelector('#next').onclick = () => { qPos++; drawQ(); };
    });
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
      ${CUR.clase.map(c => `
        <h2>Clasa ${esc(c.clasa)}</h2>
        <div class="card"><table>
          <tr><th>Disciplina</th><th>Arie</th></tr>
          ${c.materii.map(m => `<tr><td>${esc(m.nume)} ${m.bac ? '<span class="pill">BAC</span>' : ''}</td><td class="muted">${esc(m.arie)}</td></tr>`).join('')}
        </table></div>`).join('')}
      <h2>Probele de bacalaureat</h2>
      <div class="card"><table>
        ${Object.entries(CUR.bacalaureat).map(([k, v]) => `<tr><td><strong>${esc(k.replace('proba', 'Proba '))}</strong></td><td>${esc(v)}</td></tr>`).join('')}
      </table></div>`;
  }

  /* ---------- glue ---------- */
  function bindGo() {
    view.querySelectorAll('[data-go]').forEach(b => b.onclick = () => { location.hash = b.dataset.go; });
  }

  document.querySelectorAll('.tab').forEach(t => t.onclick = () => { location.hash = '#/' + t.dataset.route; });
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
  }
})();
