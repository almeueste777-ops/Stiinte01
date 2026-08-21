/* Generator de iconițe PWA.
   Randează SVG-ul de mai jos în Chromium și salvează PNG-urile la dimensiune exactă,
   deci iconițele se pot reface oricând, la orice dimensiune, fără editor grafic.

   Rulare:
     npm i -D playwright && npx playwright install chromium
     node tools/genereaza-iconite.mjs            # scrie în icons/
     node tools/genereaza-iconite.mjs alt/folder

   Scrie și `icons/icon-source.svg` — sursa vectorială, versionată în depozit. */
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const radacina = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = process.argv[2] || path.join(radacina, 'icons');

// Paleta caldă a aplicației (se sincronizează cu tokenurile din app.css)
const C = {
  bg1:   '#F3C79B',  // nisip cald (capătul luminos al gradientului)
  bg2:   '#D97B3E',  // teracotă deschisă
  bg3:   '#9E4119',  // --brand: teracotă arsă
  bg4:   '#6E2A0E',  // teracotă adâncă
  ink:   '#2A1C12',  // --ink: espresso
  amber: '#E9B45C',  // chihlimbar (--accent, deschis pentru vizibilitate)
  cream: '#FFF7EF',  // --brand-ink: smântână
};

/* Simbolul: trei coloane care cresc — cunoașterea acumulată — pe un soclu.
   Păstrează silueta iconiței vechi, dar o duce în paleta caldă, cu volum și luciu de sticlă. */
const svg = (size, maskable) => {
  const s = size;
  /* La varianta maskable, colțurile cutiei de conținut trebuie să încapă în
     cercul de siguranță de 80%, nu doar laturile ei. Cutia are semi-lățimea
     1,04·u și semi-înălțimea u, cu u = 0,5 − p; din (1,04u)² + u² ≤ 0,4²
     rezultă p ≥ 0,2227. Folosim 0,226 ca să rămână și o margine. */
  const pad = maskable ? s * 0.226 : s * 0.115;
  const inner = s - pad * 2;
  const r = maskable ? 0 : s * 0.2237;         // squircle-ul iOS ≈ 22.37% din latură
  const bars = [
    { x: 0.075, y: 0.480, w: 0.215, h: 0.520, fill: C.cream },
    { x: 0.390, y: 0.235, w: 0.215, h: 0.765, fill: C.amber },
    { x: 0.705, y: 0.045, w: 0.215, h: 0.955, fill: C.cream },
  ];
  const px = v => (pad + v * inner).toFixed(2);
  const pw = v => (v * inner).toFixed(2);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0.35" y2="1">
      <stop offset="0"    stop-color="${C.bg1}"/>
      <stop offset="0.38" stop-color="${C.bg2}"/>
      <stop offset="0.78" stop-color="${C.bg3}"/>
      <stop offset="1"    stop-color="${C.bg4}"/>
    </linearGradient>
    <radialGradient id="sheen" cx="0.28" cy="0.16" r="0.72">
      <stop offset="0"   stop-color="#FFFFFF" stop-opacity="0.40"/>
      <stop offset="0.5" stop-color="#FFFFFF" stop-opacity="0.07"/>
      <stop offset="1"   stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
    <filter id="sh" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="${(s*0.012).toFixed(2)}" stdDeviation="${(s*0.016).toFixed(2)}"
                    flood-color="${C.ink}" flood-opacity="0.28"/>
    </filter>
  </defs>
  ${maskable
    ? `<rect width="${s}" height="${s}" fill="url(#g)"/>`
    : `<rect x="0" y="0" width="${s}" height="${s}" rx="${r}" ry="${r}" fill="url(#g)"/>`}
  ${maskable
    ? `<rect width="${s}" height="${s}" fill="url(#sheen)"/>`
    : `<rect x="0" y="0" width="${s}" height="${s}" rx="${r}" ry="${r}" fill="url(#sheen)"/>`}
  ${maskable ? '' : `<rect x="${(s*0.004).toFixed(2)}" y="${(s*0.004).toFixed(2)}"
      width="${(s*0.992).toFixed(2)}" height="${(s*0.992).toFixed(2)}"
      rx="${(r-s*0.004).toFixed(2)}" ry="${(r-s*0.004).toFixed(2)}"
      fill="none" stroke="#FFFFFF" stroke-opacity="0.30" stroke-width="${(s*0.008).toFixed(2)}"/>`}
  <g filter="url(#sh)">
    ${bars.map(b => `<rect x="${px(b.x)}" y="${px(b.y)}" width="${pw(b.w)}" height="${pw(b.h - 0.055)}"
      rx="${pw(0.045)}" fill="${b.fill}"/>`).join('\n    ')}
    <rect x="${px(-0.02)}" y="${px(0.905)}" width="${pw(1.04)}" height="${pw(0.095)}"
      rx="${pw(0.042)}" fill="${C.cream}"/>
  </g>
</svg>`;
};

fs.mkdirSync(out, { recursive: true });

(async () => {
  const browser = await chromium.launch();
  const jobs = [
    ['icon-192.png', 192, false],
    ['icon-512.png', 512, false],
    ['icon-maskable-512.png', 512, true],
  ];
  for (const [name, size, maskable] of jobs) {
    const page = await browser.newPage({ viewport: { width: size, height: size }, deviceScaleFactor: 1 });
    await page.setContent(
      `<body style="margin:0;background:transparent">${svg(size, maskable)}</body>`,
      { waitUntil: 'load' });
    await page.screenshot({ path: `${out}/${name}`, omitBackground: true });
    await page.close();
    console.log('generat', name, size + 'px', maskable ? '(maskable)' : '');
  }
  fs.writeFileSync(path.join(out, 'icon-source.svg'), svg(512, false));
  await browser.close();
})();
