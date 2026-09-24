const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const ROOT=process.argv[2] || 'public', OUT=process.argv[3] || 'public/og';

// The record's headline figure, from the same compute() the pages use.
const record = require('./record/load.cjs')();
const CP_MONTHS=['Jan','Feb','Mar','Apr','May','June','July','Aug','Sept','Oct','Nov','Dec'];
const cpDate = iso => { const [y,m,d]=iso.split('-').map(Number); return `${d} ${CP_MONTHS[m-1]} ${y}`; };
const recordStat = () => `${(record.summary.partyLine*100).toFixed(1)}%`;
const recordStatk = () => `party-line, ${record.summary.divisions} divisions to ${cpDate(record.last)}`;

const CARDS=[
 // NOTE: home and fr carry a figure derived from live AQUASTAT data. If the
 // reference year moves and the ratio shifts, RERUN this generator — a PNG
 // cannot update itself, and a card disagreeing with the page it links to is
 // worse than no card. /api/water.json is the number of record.
 {slug:'home',      label:'A statement of Canadian character', title:'Northern\nTemper',
  line:'What we hold, and what we have never once used against a neighbour.', stat:'8.7×', statk:'the fresh water, per person'},
 {slug:'hand',      label:'Two · The Hand', title:'Look at\nthe hand',
  line:'170 billion barrels. 360 TWh. A hundred times the world uranium grade.', stat:'100×', statk:'uranium grade, Athabasca'},
 {slug:'math',      label:'Three · The Math', title:'The math of\nstaying together',
  line:'Both separation scenarios, costed against official figures.', stat:'$5,100', statk:'per Canadian, per year'},
 {slug:'bloc',      label:'Four · The Bloc', title:'We are not\nleaving.',
  line:'We are widening. And Statistics Canada can prove it, monthly.', stat:'+112%', statk:'exports to the UK, y/y'},
 {slug:'build',     label:'Five · The Build', title:'Not a\ndefensive crouch',
  line:'Refine our own crude. Power our own compute. Open the corridor.', stat:'$5,100', statk:'per Canadian, already law'},
 {slug:'calculator',label:'Run the numbers yourself', title:'Pick a province.\nSee the bill.',
  line:'Arithmetic on published figures. Every line shows its working.', stat:'$253B', statk:'Alberta, day one'},
 // The stat is the party-line rate computed by src/lib/record.ts. Typed here
 // like the water ratio on the home card: a PNG cannot update itself. Rerun
 // this generator if it moves — at 99.9% it will not move soon.
 // The record card's figure is COUNTED from the committed snapshot at the moment
 // this runs, and DATED, because the snapshot moves after every sitting day and
 // a PNG cannot. A dated figure is true forever; an undated one is true until
 // the next division. Rerun this generator when the card should catch up.
 {slug:'record',    label:'The record', title:'How they\nactually voted',
  line:'Every division. Every ballot. Counted, not characterised.',
  stat:recordStat(), statk:recordStatk()},
 // The stat is the sum of `words` in src/pages/read/index.astro. Typed here
 // because this generator is standalone CJS and the index is Astro; update it
 // when a read is added.
 {slug:'read',      label:'The reads', title:"Read the\nhomework",
  line:'Every claim, laid out in full, with sources.', stat:'10,316', statk:'words, sourced'},
 {slug:'support',   label:'The colophon', title:'What this cost.\nWhat it is for.',
  line:'Public domain. Nothing here is behind a payment.', stat:'CC0', statk:'no permission needed'},
 {slug:'join',      label:'The coalition', title:'Put your name\nbehind one country',
  line:'No account. No fee. Free to leave whenever you like.', stat:'∅', statk:'nothing to sign'},
 {slug:'the-red-is-the-work', label:'A reading of the leaf', title:'The red\nis the work',
  line:'Not a leaf giving up. A tree getting ready for a long winter, on purpose.', stat:'62%', statk:'of the nitrogen, taken back first'},
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
 {slug:'fr',        label:'Une affirmation du caractère canadien', title:'La trempe\ndu Nord',
  line:'Ce que nous détenons, et ce dont nous ne nous sommes jamais servis contre un voisin.',
  stat:'8,7\u00d7', statk:'l\u2019eau douce, par personne',
  alt:'Carte de partage Northern Temper, sur fond noir, avec la marque aux deux ours\u202f: '
    + '\u00ab\u202fLa trempe du Nord\u202f\u00bb. Ce que nous détenons, et ce dont nous ne nous '
    + 'sommes jamais servis contre un voisin. 8,7\u00d7 l\u2019eau douce, par personne.'},
];

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

/**
 * One manifest carrying both the hashed URL and the alt text, keyed by the
 * stable path a page asks for. Pages keep writing ogImage="/og/home.png" and
 * never learn about the hash; Base.astro resolves it. Generated, so neither
 * half can drift from the card it describes.
 */
function writeManifest(){
  const manifest = { '/og.png': {
    src: '/og.png',
    alt: 'Northern Temper share card, black with the two-bear mark, beneath the words Northern Temper.',
  } };
  for (const c of CARDS) {
    manifest['/og/' + c.slug + '.png'] = { src: hashed[c.slug] || ('/og/' + c.slug + '.png'), alt: altFor(c) };
  }
  const dest = path.join(__dirname, '..', 'src', 'lib', 'og-manifest.json');
  fs.writeFileSync(dest, JSON.stringify(manifest, null, 2) + '\n');
  console.log('  src/lib/og-manifest.json'.padEnd(34) + Object.keys(manifest).length + ' entries');
}

(async()=>{
  const b=await chromium.launch();
  const ctx=await b.newContext({viewport:{width:1200,height:630},deviceScaleFactor:1});
  const p=await ctx.newPage();
  for(const c of CARDS){
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
  writeManifest();
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
