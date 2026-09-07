/* Test de ciclu de viață al service worker-ului, cu SW ACTIV (bateria de capturi
   îl blochează — exact de aceea bug-ul „HTML nou + CSS vechi" nu fusese prins).

   Verifică:
     1. prima instalare NU reîncarcă pagina (garda din app.js);
     2. aplicația e stilizată și funcțională sub SW;
     3. un release nou (bump de CACHE în sw.js servit) => EXACT o reîncărcare
        automată pe un ecran fără stare, apoi stabilitate (fără buclă);
     4. zero erori JS pe tot parcursul.

   Rulare (din rădăcina repo-ului, cu serverul local pornit):
     python3 -m http.server 8765 &
     npm i playwright   # oriunde în PATH-ul de rezolvare Node
     node tools/test-sw.mjs

   Config prin variabile de mediu:
     BAZA      — URL-ul serverului (implicit http://localhost:8765)
     CHROMIUM  — calea executabilului (implicit cel din PLAYWRIGHT_BROWSERS_PATH)

   Modifică temporar sw.js pe disc (simulează release-ul) și îl RESTAUREAZĂ
   garantat în finally. */
import { chromium } from 'playwright';
import fs from 'node:fs';

const BAZA = process.env.BAZA || 'http://localhost:8765';
const EXE = process.env.CHROMIUM || undefined;
const SW = new URL('../sw.js', import.meta.url).pathname;

const browser = await chromium.launch(EXE ? { executablePath: EXE } : {});
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
/* De la v06 există o foaie de onboarding la prima pornire, care ar intercepta
   click-urile testului. O sărim marcând-o ca văzută înainte de prima randare —
   testul verifică ciclul SW, nu onboarding-ul. */
await ctx.addInitScript(() => {
  try { localStorage.setItem('stiinte01:v1', JSON.stringify({ vazutIntro: true })); } catch (e) {}
});
const page = await ctx.newPage();

let navigari = 0;
page.on('framenavigated', f => { if (f === page.mainFrame()) navigari++; });
const erori = [];
page.on('pageerror', e => erori.push('pageerror: ' + e.message));

let esec = false;
const orig = fs.readFileSync(SW, 'utf8');
try {
  // 1) Prima vizită: SW se instalează; nicio reîncărcare.
  await page.goto(BAZA + '/', { waitUntil: 'networkidle' });
  await page.waitForFunction(() => navigator.serviceWorker && navigator.serviceWorker.controller,
    null, { timeout: 15000 });
  const navDupaControl = navigari;
  await page.waitForTimeout(2500);
  console.log(`prima instalare: navigări ${navDupaControl} -> ${navigari} (așteptat: egale)`);
  if (navigari !== navDupaControl) { console.error('EȘEC: reload la prima instalare'); esec = true; }

  // 2) Stilizat și funcțional sub SW.
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  console.log('fundal body (așteptat: NU implicitul browserului):', bg);
  await page.click('.tab[data-route="materii"]');
  await page.waitForTimeout(500);
  const carduri = await page.$$eval('.grid-cards .card.tap', els => els.length);
  console.log('carduri de materii sub SW:', carduri);
  if (!carduri) { console.error('EȘEC: materii nefuncțional sub SW'); esec = true; }
  // înapoi pe un ecran FĂRĂ stare nepersistată (acasă), unde reload-ul e permis
  await page.click('.tab[data-route="acasa"]');
  await page.waitForTimeout(400);

  // 3) Release simulat: bump de CACHE => exact o reîncărcare, apoi stabil.
  const m = orig.match(/stiinte01-v(\d+)/);
  fs.writeFileSync(SW, orig.replace(m[0], `stiinte01-v${Number(m[1]) + 1}00test`));
  const inainte = navigari;
  await page.evaluate(() => navigator.serviceWorker.getRegistration().then(r => r.update()));
  await page.waitForTimeout(4000);
  const dupa = navigari;
  console.log(`reîncărcări după update (așteptat exact 1): ${dupa - inainte}`);
  await page.waitForTimeout(3000);
  console.log(`stabil după încă 3s (așteptat 0 în plus): ${navigari - dupa}`);
  if (dupa - inainte !== 1 || navigari !== dupa) { console.error('EȘEC: comportament de reload greșit'); esec = true; }

  const bg2 = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  console.log('fundal după update:', bg2);
} finally {
  fs.writeFileSync(SW, orig);
  await browser.close();
}

if (erori.length) { console.error('erori JS:', erori.join(' | ')); esec = true; }
else console.log('erori JS: zero');
console.log(esec ? 'TEST SW: PICAT' : 'TEST SW: TRECUT');
process.exit(esec ? 1 : 0);
