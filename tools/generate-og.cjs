// Playwright is not in package.json (see verify.cjs); resolve whichever copy is
// installed. This used to require one sandbox's absolute path and nothing else,
// so the cards could only be redrawn on that one machine.
const { chromium } = (() => {
  for (const id of ['playwright', '@playwright/test', '/opt/node22/lib/node_modules/playwright']) {
    try { return require(id); } catch {}
  }
  throw new Error('generate-og: Playwright not found. Install it without saving: npm i --no-save playwright');
})();
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const ROOT=process.argv[2] || 'public', OUT=process.argv[3] || 'public/og';

// Every figure a card prints comes from the module the page prints it from:
// the record's compute(), getWater(), getTrade(), getProvinces(), the
// calculator's bill(), figures.ts and reads.ts. Cards used to type them, so
// rerunning this redrew the old numbers: the calculator card said $253B beside
// a page printing $254B, and the home card's 8.7x could never move with
// AQUASTAT. A figure from a moving source is DATED on the card, because a PNG
// cannot update itself and a dated figure stays true after the page moves on.
const loadTs = require('./load-ts.cjs');
const record = require('./record/load.cjs')();
const { getWater, getTrade, getProvinces, tradeLead, tradeName } = loadTs('sources');
const { bill, big } = loadTs('calculator');
const { C5_RETAINED_GDP, N_RESORPTION } = loadTs('figures');
const { READS } = loadTs('reads');

const CP_MONTHS=['Jan','Feb','Mar','Apr','May','June','July','Aug','Sept','Oct','Nov','Dec'];
const cpDate = iso => { const [y,m,d]=iso.split('-').map(Number); return `${d} ${CP_MONTHS[m-1]} ${y}`; };
const cpMonth = iso => { const [y,m]=iso.split('-').map(Number); return `${CP_MONTHS[m-1]} ${y}`; };
const quarter = iso => `Q${Math.floor((+iso.slice(5, 7) - 1) / 3) + 1} ${iso.slice(0, 4)}`;
const one = loc => new Intl.NumberFormat(loc, { minimumFractionDigits: 1, maximumFractionDigits: 1 });

/**
 * `live: false` marks a card whose source did not answer. Its last card is
 * kept rather than redrawn from a fallback, which could put an older figure on
 * the card than the one the page has shown since.
 */
async function buildCards(){
  const [water, trade, prov] = await Promise.all([getWater(), getTrade(), getProvinces()]);
  const ratio = one('en-CA').format(water.ratio), ratioFr = one('fr-CA').format(water.ratio);
  const lead = tradeLead(trade);
  const ab = prov.provinces.find(p => p.code === 'AB');
  const abDayOne = big(bill(ab.population, ab.gdp, { canadaPopulation: prov.canadaPopulation, buildBasePop: ab.population }).totLow);
  const words = READS.reduce((sum, r) => sum + r.words, 0).toLocaleString('en-CA');
  const frLine = 'Ce que nous détenons, et ce dont nous ne nous sommes jamais servis contre un voisin.';
  const frStatk = `l’eau douce, par personne, ${water.year}`;

  return [
 {slug:'home',      label:'A statement of Canadian character', title:'Northern\nTemper', live:water.live,
  line:'What we hold, and what we have never once used against a neighbour.', stat:`${ratio}×`, statk:`the fresh water, per person, ${water.year}`},
 {slug:'hand',      label:'Two · The Hand', title:'Look at\nthe hand',
  line:'170 billion barrels. 360 TWh. A hundred times the world uranium grade.', stat:'100×', statk:'uranium grade, Athabasca'},
 {slug:'math',      label:'Three · The Math', title:'The math of\nstaying together',
  line:'Both separation scenarios, costed against official figures.', stat:C5_RETAINED_GDP.display, statk:'per Canadian, per year'},
 {slug:'bloc',      label:'Four · The Bloc', title:'We are not\nleaving.', live:trade.allLive,
  line:'We are widening. And Statistics Canada can prove it, monthly.',
  stat: lead ? `+${Math.round(lead.changePct)}%` : `${Math.round(trade.usSharePct)}%`,
  statk: lead ? `exports to ${tradeName(lead.name)}, y/y, ${cpMonth(trade.asOf)}` : `to the US, ${cpMonth(trade.asOf)}`},
 {slug:'build',     label:'Five · The Build', title:'Not a\ndefensive crouch',
  line:'Refine our own crude. Power our own compute. Open the corridor.', stat:C5_RETAINED_GDP.display, statk:'per Canadian, already law'},
 {slug:'calculator',label:'Run the numbers yourself', title:'Pick a province.\nSee the bill.', live:prov.allLive,
  line:'Arithmetic on published figures. Every line shows its working.', stat:abDayOne, statk:`Alberta, day one, ${quarter(prov.popAsOf)}`},
 // Counted from the committed snapshot and dated: the snapshot moves after
 // every sitting day. Rerun this generator when the card should catch up.
 {slug:'record',    label:'The record', title:'How they\nactually voted',
  line:'Every division. Every ballot. Counted, not characterised.',
  stat:`${(record.summary.partyLine*100).toFixed(1)}%`, statk:`party-line, ${record.summary.divisions} divisions to ${cpDate(record.last)}`},
 // The sum of every read's counted length (check-figures holds each to its article).
 {slug:'read',      label:'The reads', title:"Read the\nhomework",
  line:'Every claim, laid out in full, with sources.', stat:words, statk:'words, sourced'},
 {slug:'support',   label:'The colophon', title:'What this cost.\nWhat it is for.',
  line:'Public domain. Nothing here is behind a payment.', stat:'CC0', statk:'no permission needed'},
 {slug:'join',      label:'The coalition', title:'Put your name\nbehind one country',
  line:'No account. No fee. Free to leave whenever you like.', stat:'∅', statk:'nothing to sign'},
 {slug:'the-red-is-the-work', label:'A reading of the leaf', title:'The red\nis the work',
  line:'Not a leaf giving up. A tree getting ready for a long winter, on purpose.', stat:N_RESORPTION.display, statk:'of the nitrogen, taken back first'},
 {slug:'the-closed-loop', label:'NPSI · Working Paper No. 6', title:'The Closed\nLoop',
  line:'Korea holds the silicon. Canada holds the power.', stat:'37 GW', statk:'Hydro-Québec capacity'},
 {slug:'the-vertical-squeeze', label:'Fit For Gov · Dossier', title:'The Vertical\nSqueeze',
  line:'The most responsibility, the least revenue.', stat:'8¢', statk:'of every tax dollar'},
 {slug:'changed-my-mind', label:'An honest account', title:'I campaigned\nagainst this man',
  line:'A Conservative campaigner did the homework and changed his mind.', stat:'1', statk:'mind changed'},
 {slug:'two-leaders', label:'A governance reading', title:'Two leaders\nbeat the wave',
  line:'Anti-incumbent anger flattened the West. Two are the exceptions.', stat:'2/7', statk:'G7 exceptions'},
 {slug:'honest-answer', label:'The record, set straight', title:'One question.\nSeven leaders.',
  line:'The viral recession quiz, answered with every official figure.', stat:'7', statk:'statistics offices'},
 {slug:'sources',   label:'The receipts', title:'Every figure.\nEvery source.',
  line:'Table number, reference period, and the endpoint serving it. Open them yourself.',
  stat:'0', statk:'keys or logins needed'},
 // The French page is not a translation, so it does not get the English card.
 // Typographic apostrophes throughout — a straight quote is the fastest tell.
 {slug:'fr',        label:'Une affirmation du caractère canadien', title:'La trempe\ndu Nord', live:water.live,
  line:frLine, stat:`${ratioFr}×`, statk:frStatk,
  alt:'Carte de partage Northern Temper, sur fond noir, avec la marque aux deux ours : '
    + `« La trempe du Nord ». ${frLine} ${ratioFr}× ${frStatk}.`},
  ];
}

const bear = fs.readFileSync(path.join(ROOT,'marks/nt-bear-dual.svg'),'utf8');
const fontCss = ['Oswald-700','Oswald-600','Inter-400','Inter-500'].map(f=>{
  const b=fs.readFileSync(path.join(ROOT,'fonts',f+'.woff2')).toString('base64');
  const [fam,w]=f.split('-');
  return `@font-face{font-family:'${fam}';font-weight:${w};font-display:block;src:url(data:font/woff2;base64,${b}) format('woff2')}`;
}).join('\n');

const page = c => `<!doctype html><meta charset="utf-8"><style>
${fontCss}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1200px;height:630px;background:#000;color:#fff;font-family:'Inter',sans-serif;overflow:hidden;position:relative}
.grain{position:absolute;inset:0;opacity:.16;mix-blend-mode:overlay;pointer-events:none;
 background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.82' numOctaves='3'/></filter><rect width='160' height='160' filter='url(%23n)' opacity='.55'/></svg>")}
.aurora{position:absolute;inset:-20% -10% auto -10%;height:75%;filter:blur(40px);
 background:radial-gradient(60% 60% at 20% 20%,rgba(122,155,176,.20),transparent 70%),radial-gradient(50% 50% at 78% 12%,rgba(200,16,46,.16),transparent 72%)}
.wrap{position:relative;z-index:2;padding:62px 68px;height:100%;display:flex;flex-direction:column}
.lbl{font-family:'Oswald';font-weight:600;font-size:19px;letter-spacing:.3em;text-transform:uppercase;color:#D4425A}
.rule{height:4px;width:72px;background:#C8102E;margin:22px 0 30px}
h1{font-family:'Oswald';font-weight:700;font-size:${c.title.length>26?76:92}px;line-height:.92;text-transform:uppercase;letter-spacing:-.005em;white-space:pre-line}
.line{font-size:25px;line-height:1.35;color:#D8D8D8;margin-top:26px;max-width:22ch;font-weight:500}
.foot{margin-top:auto;display:flex;align-items:flex-end;justify-content:space-between;gap:40px}
.mark{display:flex;flex-direction:column;gap:16px}
.bear{width:250px;color:#fff;opacity:.95}
.bear svg{width:100%;height:auto;display:block}
.stat{text-align:right}
.sn{font-family:'Oswald';font-weight:700;font-size:78px;line-height:.84;color:#C8102E;letter-spacing:-.02em}
.sk{font-family:'Oswald';font-weight:600;font-size:16px;letter-spacing:.2em;text-transform:uppercase;color:#9A9A9A;margin-top:12px}
.url{font-family:'Oswald';font-weight:600;font-size:17px;letter-spacing:.28em;text-transform:uppercase;color:#9A9A9A}
</style>
<div class="aurora"></div><div class="grain"></div>
<div class="wrap">
  <div class="lbl">${c.label}</div>
  <div class="rule"></div>
  <h1>${c.title}</h1>
  <div class="line">${c.line}</div>
  <div class="foot">
    <div class="mark">
      <div class="bear">${bear}</div>
      <div class="url">northerntemper.ca</div>
    </div>
    <div class="stat"><div class="sn">${c.stat}</div><div class="sk">${c.statk}</div></div>
  </div>
</div>`;


/**
 * og:image:alt, derived from the card rather than written twice.
 *
 * Every card carries a headline, a sentence of argument and a figure. A
 * screen reader that is handed only "two polar bears" gets the branding and
 * none of the point, so the alt text says what the card actually says. It is
 * generated here because hand-maintained alt text drifts from the image the
 * moment a card is re-worded, and nothing would catch it.
 */
function altFor(c){
  if (c.alt) return c.alt;                       // a card may override, e.g. to stay in French
  const title = c.title.replace(/\n/g, ' ');
  const stop = /[.!?\u2026]$/.test(title) ? '' : '.';   // no doubled full stop after the quote
  return `Northern Temper share card, black with the two-bear mark \u2014 ${c.label}: `
       + `\u201c${title}\u201d${stop} ${c.line} ${c.stat}, ${c.statk}.`;
}

/** slug -> hashed public path, filled in as each card is written. */
const hashed = {};
/** slug -> alt text of a card kept from the last run because its source was down. */
const kept = {};
const MANIFEST = path.join(__dirname, '..', 'src', 'lib', 'og-manifest.json');
const previous = fs.existsSync(MANIFEST) ? JSON.parse(fs.readFileSync(MANIFEST, 'utf8')) : {};

/**
 * One manifest carrying both the hashed URL and the alt text, keyed by the
 * stable path a page asks for. Pages keep writing ogImage="/og/home.png" and
 * never learn about the hash; Base.astro resolves it. Generated, so neither
 * half can drift from the card it describes.
 */
function writeManifest(CARDS){
  const manifest = { '/og.png': {
    src: '/og.png',
    alt: 'Northern Temper share card, black with the two-bear mark, beneath the words Northern Temper.',
  } };
  for (const c of CARDS) {
    manifest['/og/' + c.slug + '.png'] = { src: hashed[c.slug] || ('/og/' + c.slug + '.png'), alt: kept[c.slug] ?? altFor(c) };
  }
  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
  console.log('  src/lib/og-manifest.json'.padEnd(34) + Object.keys(manifest).length + ' entries');
}

(async()=>{
  const CARDS=await buildCards();
  const b=await chromium.launch();
  const ctx=await b.newContext({viewport:{width:1200,height:630},deviceScaleFactor:1});
  const p=await ctx.newPage();
  for(const c of CARDS){
    const last = previous['/og/' + c.slug + '.png'];
    if (c.live === false && last && last.src !== '/og/' + c.slug + '.png' && fs.existsSync(path.join(ROOT, last.src))) {
      hashed[c.slug] = last.src;
      kept[c.slug] = last.alt;
      console.log(`  ${last.src.slice(1)}`.padEnd(34) + 'kept: its source is not responding');
      continue;
    }
    await p.setContent(page(c),{waitUntil:'load'});
    await p.evaluate(()=>document.fonts.ready);
    await p.waitForTimeout(120);
    // Write the canonical name first, then a COPY under a content hash.
    //
    // LinkedIn — and every platform that mirrors OG images rather than hot-
    // linking them — caches by URL and rehosts the bytes on its own CDN. Post
    // Inspector proved it: re-scraping northerntemper.ca refreshed the title
    // and description but kept serving an 11× card from media.licdn.com, at a
    // path that had not changed. Re-scraping cannot fix that; only a different
    // URL can. Hashing the filename means the URL changes exactly when the
    // image does, which is the only version of this that nobody has to
    // remember to do.
    //
    // The unhashed copy stays so that links already in the wild keep resolving
    // to something rather than 404ing. Nothing on the site references it.
    const base = path.join(OUT, c.slug + '.png');
    await p.screenshot({ path: base });
    const bytes = fs.readFileSync(base);
    const hash = crypto.createHash('sha256').update(bytes).digest('hex').slice(0, 8);
    hashed[c.slug] = `/og/${c.slug}.${hash}.png`;
    fs.writeFileSync(path.join(OUT, `${c.slug}.${hash}.png`), bytes);
    console.log(`  og/${c.slug}.${hash}.png`.padEnd(34) + Math.round(bytes.length / 1024) + 'KB');
  }
  await b.close();
  pruneStaleHashes();
  writeManifest(CARDS);
})();

/** Drop hashed cards from earlier runs so the folder does not accumulate. */
function pruneStaleHashes(){
  const keep = new Set(Object.values(hashed).map((u) => path.basename(u)));
  let dropped = 0;
  for (const f of fs.readdirSync(OUT)) {
    if (/^.+\.[0-9a-f]{8}\.png$/.test(f) && !keep.has(f)) { fs.unlinkSync(path.join(OUT, f)); dropped++; }
  }
  if (dropped) console.log('  pruned stale hashed cards'.padEnd(34) + dropped);
}
