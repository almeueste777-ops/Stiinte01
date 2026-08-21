# Plan de creare și publicare a aplicației

Ghid complet: de la cont de GitHub până la aplicația instalată pe telefon.
Timp estimat pentru prima publicare: **30–45 de minute**.

---

## Arhitectura, pe scurt

```
    tu editezi fișierele
            │
            ▼
   ┌─────────────────┐   git push    ┌──────────────────┐  build automat  ┌───────────────────┐
   │ calculatorul tău │ ───────────► │  GitHub (repo)   │ ──────────────► │ Cloudflare Pages  │
   └─────────────────┘               └──────────────────┘                 └───────────────────┘
                                              │                                     │
                                       istoricul + backup              https://numele-tau.pages.dev
                                                                                    │
                                                                                    ▼
                                                                      telefon / laptop → „Instalează aplicația”
```

**Ce face fiecare piesă:**

| Componentă | Rol | Cost |
|---|---|---|
| GitHub | păstrează codul, istoricul modificărilor, copia de siguranță | gratuit |
| Cloudflare Pages | găzduiește site-ul, HTTPS, CDN global, rebuild la fiecare push | gratuit |
| PWA (manifest + service worker) | face site-ul instalabil și funcțional offline | — |

Nu există server, nu există bază de date, nu există costuri lunare. Datele elevului
(notițe, progres, scoruri) rămân **doar în browserul lui**, în `localStorage`.

---

## Etapele proiectului

| Etapă | Ce faci | Stare |
|---|---|---|
| 1 | Pregătești conturile (GitHub, Cloudflare) | de făcut de tine |
| 2 | Creezi depozitul pe GitHub | de făcut de tine |
| 3 | Aduci codul pe calculatorul tău | de făcut de tine |
| 4 | Rulezi aplicația local și verifici | de făcut de tine |
| 5 | Conectezi Cloudflare Pages la GitHub | de făcut de tine |
| 6 | Instalezi aplicația pe telefon | de făcut de tine |
| 7 | Adaugi conținut și republici | continuu |
| 8 | (Opțional) domeniu propriu | opțional |

Codul aplicației este **deja scris și testat** în acest depozit.

---

## Etapa 1 — Conturi și unelte

1. **Cont GitHub** — <https://github.com/signup>. Confirmă adresa de e-mail.
2. **Cont Cloudflare** — <https://dash.cloudflare.com/sign-up>. Confirmă adresa de e-mail.
   Planul gratuit este suficient: 500 de build-uri pe lună, trafic nelimitat.
3. **Git**, pe calculator:
   - Windows: <https://git-scm.com/download/win> (lasă opțiunile implicite)
   - macOS: în Terminal, `xcode-select --install`
   - Linux: `sudo apt install git`
4. **Un editor de text** — recomandat [Visual Studio Code](https://code.visualstudio.com/).
5. **Python 3** (doar pentru serverul local de test) — <https://www.python.org/downloads/>.
   Pe Windows bifează „Add Python to PATH” la instalare.

Configurează Git o singură dată:

```bash
git config --global user.name "Numele Tău"
git config --global user.email "adresa@ta.ro"
```

---

## Etapa 2 — Depozitul pe GitHub

1. Intră pe <https://github.com/new>.
2. **Repository name**: `stiinte01` (sau alt nume, fără spații și diacritice).
3. **Public**. Necesar pentru planul gratuit de Cloudflare Pages și oricum util —
   aplicația nu conține date personale.
4. **Nu** bifa „Add a README file” dacă vei încărca proiectul existent.
5. Apasă **Create repository**.

GitHub îți arată apoi adresa depozitului, de forma
`https://github.com/utilizatorul-tau/stiinte01.git`. Ține-o la îndemână.

---

## Etapa 3 — Codul pe calculatorul tău

Deschide un terminal (Windows: „Git Bash”) și rulează:

```bash
git clone https://github.com/utilizatorul-tau/stiinte01.git
cd stiinte01
```

La prima clonare GitHub îți va cere autentificarea. La cererea parolei **nu** introduce parola
contului, ci un *Personal Access Token*: GitHub → Settings → Developer settings →
Personal access tokens → Tokens (classic) → **Generate new token**, bifează scope-ul `repo`,
copiază tokenul și folosește-l în loc de parolă.

Dacă lucrezi pe ramura de dezvoltare a acestui proiect:

```bash
git checkout claude/pwa-social-sciences-app-yzli16
```

---

## Etapa 4 — Rulare și verificare locală

```bash
python3 -m http.server 8765
```

Deschide <http://localhost:8765> în browser și verifică:

- [ ] Ecranul **Acasă** arată bara de progres și materiile clasei alese.
- [ ] **Materii** → intri într-o materie → intri într-o lecție → apeși „Marchează drept citită”.
- [ ] **Carduri** → „Arată răspunsul” → „Știu” / „Mai repet”.
- [ ] **Test** → răspunzi la întrebări → primești scorul.
- [ ] **Plan** → apar toate clasele, de la a IX-a la a XIII-a.

Verifică apoi că funcționează offline: `F12` → tab-ul **Application** → **Service Workers**
(trebuie să apară `sw.js` ca „activated and running”) → bifează **Offline** → reîncarcă pagina.
Aplicația trebuie să se încarce în continuare.

Oprești serverul cu `Ctrl+C`.

---

## Etapa 5 — Publicarea pe Cloudflare Pages

1. Intră în <https://dash.cloudflare.com/> → în meniul din stânga, **Workers & Pages**.
2. **Create** → tab-ul **Pages** → **Connect to Git**.
3. **Connect GitHub** → autorizezi Cloudflare → alegi
   „Only select repositories” → bifezi `stiinte01` → **Install & Authorize**.
4. Selectezi depozitul `stiinte01` → **Begin setup**.
5. Completezi ecranul de configurare **exact așa**:

   | Câmp | Valoare |
   |---|---|
   | Project name | `stiinte01` (devine adresa `stiinte01.pages.dev`) |
   | Production branch | `main` |
   | Framework preset | **None** |
   | Build command | *(lasă gol)* |
   | Build output directory | `/` |
   | Root directory | *(lasă gol)* |

   Aplicația nu are pas de build — de aceea comanda rămâne goală, iar folderul publicat
   este chiar rădăcina depozitului.

6. **Save and Deploy**. Primul deploy durează sub un minut.
7. Primești adresa **`https://stiinte01.pages.dev`**. Deschide-o — aplicația e live.

De acum, **fiecare `git push` pe `main` republică automat aplicația.** Push-urile pe alte
ramuri generează câte un „preview deployment” cu adresă proprie, util pentru teste.

---

## Etapa 6 — Instalarea pe telefon

**Android (Chrome):** deschizi adresa `.pages.dev` → meniul ⋮ → **Adaugă la ecranul de pornire** /
**Instalează aplicația**.

**iPhone / iPad (Safari — obligatoriu Safari, nu Chrome):** deschizi adresa → butonul **Partajare**
(pătratul cu săgeată) → **Adaugă la ecranul principal**.

**Desktop (Chrome / Edge):** pictograma de instalare din bara de adrese, în dreapta.

După instalare aplicația pornește fără bara browserului și funcționează **fără internet**.

---

## Etapa 7 — Ciclul de lucru zilnic

Adaugi o lecție nouă, un card sau o întrebare:

```bash
# 1. editezi data/continut.json în editor

# 2. crești versiunea cache-ului în sw.js:
#    const CACHE = 'stiinte01-v1';  →  'stiinte01-v2'
#    (pas obligatoriu, altfel telefoanele rămân pe versiunea veche)

# 3. verifici local
python3 -m http.server 8765

# 4. publici
git add .
git commit -m "Adaug lecții noi la Filosofie"
git push -u origin main
```

În 30–60 de secunde modificarea e live. Aplicațiile instalate se actualizează
singure la următoarea deschidere.

**Verificarea automată** din `.github/workflows/verificare.yml` rulează la fiecare push și
îți semnalează dacă ai stricat un fișier JSON, sintaxa JavaScript sau ai șters un fișier
la care service worker-ul încă face referire. Rezultatul apare în tab-ul **Actions** de pe GitHub.

---

## Etapa 8 — Domeniu propriu (opțional)

1. Cumperi un domeniu (`.ro` ≈ 20–30 lei/an, `.com` ≈ 50 lei/an) — de la Cloudflare Registrar
   e cel mai simplu, fiindcă DNS-ul se configurează automat.
2. În proiectul Pages → **Custom domains** → **Set up a custom domain**.
3. Introduci domeniul și urmezi instrucțiunile DNS afișate.
4. Certificatul HTTPS se emite automat, în câteva minute.

---

## Ce poți adăuga mai departe

| Idee | Efort | Ce presupune |
|---|---|---|
| Mai mult conținut la fiecare materie | mic | doar `data/continut.json` |
| Căutare în toate lecțiile | mic | un câmp de căutare + filtrare în `app.js` |
| Repetiție la intervale (SRS) | mediu | folosești `state.carduri` pentru a programa recapitulările |
| Export / import al notițelor | mic | serializezi `localStorage` într-un fișier `.json` |
| Simulare completă de bacalaureat | mediu | un mod „examen” cu cronometru și subiecte pe modele oficiale |
| Sincronizare între dispozitive | mare | necesită backend (Cloudflare D1 + Workers) și autentificare |

---

## Probleme frecvente

| Simptom | Cauză și rezolvare |
|---|---|
| Pagină albă pe `.pages.dev` | „Build output directory” nu e `/`. Corectezi în Settings → Builds & deployments, apoi **Retry deployment**. |
| Modificările nu apar pe telefon | Ai uitat să crești versiunea din `sw.js`. Crește-o și dă push din nou. |
| Aplicația nu se poate instala | Adresa trebuie să fie HTTPS (`.pages.dev` este) și `manifest.webmanifest` trebuie să se încarce fără eroare — verifică în `F12` → Application → Manifest. |
| „Failed to fetch data” la deschidere | Ai deschis `index.html` prin `file://`. Folosește serverul local. |
| `git push` cere parola la nesfârșit | Folosește un Personal Access Token în loc de parolă (vezi Etapa 3). |
| Deploy eșuat pe Cloudflare | Deschizi deployment-ul → **View build log**. Cu „Build command” gol, eroarea e aproape sigur un director de output greșit. |
