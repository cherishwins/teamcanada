/**
 * A paper's PDF edition, drawn from the page's own modules.
 *
 *   node tools/generate-paper-pdf.cjs the-protein-leaves-as-water [out.pdf]
 *
 * The owner posts each paper on LinkedIn as a PDF, and LinkedIn shows a PDF
 * as a deck: one page at a time, at phone width. The PDFs the papers came
 * from were printed from a browser with every figure typed, and a typed
 * figure is the thing this site exists to stop: the whey PDF said "under 6
 * months" for a payback its own inputs put at 6.0, and called a provincial
 * fund open that had closed. This draws the deck from src/lib/whey.ts,
 * figures.ts and reads.ts through tools/load-ts.cjs, the same modules the
 * page renders from, so the PDF and the page cannot print different numbers.
 * The words are the page's, which are the author's.
 *
 * US Letter, portrait, in the design system: Oswald 700 uppercase display,
 * Inter body, red, black, white, and frost in one chart strip only. Square
 * corners, no shadows, no gradients. One full-bleed red field (the ask).
 * The fonts are the site's own WOFF2 files, inlined so the deck renders
 * the same on every machine. Every page is checked for overflow before
 * the PDF is written: a page that clips its own last line fails the run.
 *
 * The output is not committed and not deployed. It is a file for the
 * owner to post; the page is the edition of record and the deck's last
 * page says so.
 */
const fs = require('fs');
const path = require('path');
const { chromium } = (() => {
  for (const id of ['playwright', '@playwright/test', '/opt/node22/lib/node_modules/playwright']) {
    try { return require(id); } catch {}
  }
  throw new Error('generate-paper-pdf: Playwright not found. Install it without saving: npm i --no-save playwright');
})();
const loadTs = require('./load-ts.cjs');

const ROOT = path.join(__dirname, '..');
const slug = process.argv[2];
const out = process.argv[3] || path.join(ROOT, 'pdf', `${slug}.pdf`);

const DECKS = { 'the-protein-leaves-as-water': whey };
if (!DECKS[slug]) {
  console.error(`generate-paper-pdf: no deck for "${slug}". Decks: ${Object.keys(DECKS).join(', ')}`);
  process.exit(2);
}

/* ---------- shared ---------- */

const font = (file) => `data:font/woff2;base64,${fs.readFileSync(path.join(ROOT, 'public', 'fonts', file)).toString('base64')}`;
const FONTS = `
@font-face{font-family:'Oswald';src:url(${font('Oswald-600.woff2')}) format('woff2');font-weight:600}
@font-face{font-family:'Oswald';src:url(${font('Oswald-700.woff2')}) format('woff2');font-weight:700}
@font-face{font-family:'Inter';src:url(${font('Inter-400.woff2')}) format('woff2');font-weight:400}
@font-face{font-family:'Inter';src:url(${font('Inter-500.woff2')}) format('woff2');font-weight:500}
@font-face{font-family:'Inter';src:url(${font('Inter-600.woff2')}) format('woff2');font-weight:600}`;

/** The marks are inline SVG components; take the path data from the file itself. */
function mark(name) {
  const src = fs.readFileSync(path.join(ROOT, 'src', 'components', 'marks', `${name}.astro`), 'utf8');
  const viewBox = src.match(/viewBox="([^"]+)"/)[1];
  const body = src.slice(src.indexOf('<g '), src.lastIndexOf('</g>') + 4).replace(/fill="currentColor"/g, '');
  return (klass) => `<svg class="${klass}" viewBox="${viewBox}" fill="currentColor" aria-hidden="true">${body}</svg>`;
}
const LeafSeal = mark('LeafSeal');
const BearDual = mark('BearDual');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* The design system's tokens, the few the deck uses, copied not reinterpreted. */
const CSS = `
${FONTS}
:root{--red:#C8102E;--frost:#7A9BB0;--n260:#CFCFCF;--n340:#AEAEAE;--n460:#767676;--ink-muted:#4A4A4A;--lift:#D95A6F}
@page{size:8.5in 11in;margin:0}
*{box-sizing:border-box}
html,body{margin:0;padding:0}
body{font-family:'Inter',system-ui,sans-serif;font-weight:400;color:#000;background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.p{position:relative;width:8.5in;height:11in;padding:.72in .78in .9in;overflow:hidden;background:#fff;color:#000;page-break-after:always;display:flex;flex-direction:column}
.p:last-child{page-break-after:auto}
.p.black{background:#000;color:#fff}
.p.red{background:var(--red);color:#fff}
.k{font-family:'Oswald';font-weight:600;font-size:10.5pt;letter-spacing:.2em;text-transform:uppercase;margin:0 0 10pt}
.k span{color:var(--red)}
.black .k span,.red .k span{color:#fff}
.k.rule{padding-bottom:10pt;border-bottom:2pt solid var(--red)}
.red .k.rule{border-color:#fff}
.black .k.rule{border-color:var(--red)}
h1,h2{font-family:'Oswald';font-weight:700;text-transform:uppercase;margin:0;letter-spacing:.005em}
h1{font-size:58pt;line-height:.92}
h2{font-size:38pt;line-height:.96;margin:14pt 0 12pt}
h3{font-family:'Oswald';font-weight:700;text-transform:uppercase;font-size:19pt;line-height:1.05;margin:0 0 5pt;letter-spacing:.01em}
p{font-size:15.5pt;line-height:1.4;margin:0 0 9pt}
.lede{font-size:19pt;line-height:1.3;font-weight:500}
.black .lede{color:#fff}
.muted{color:var(--ink-muted)}
.black .muted{color:var(--n340)}
.red .muted{color:#fff}
.big{font-family:'Oswald';font-weight:700;font-size:56pt;line-height:.95;color:var(--red);margin:0 0 6pt;letter-spacing:0}
.black .big{color:#fff}
.red .big{color:#fff}
.big small{display:block;font-family:'Inter';font-weight:500;font-size:12pt;color:#000;margin-top:4pt;letter-spacing:0}
.black .big small{color:var(--n340)}
.pull{font-family:'Oswald';font-weight:700;font-size:24pt;line-height:1.08;text-transform:uppercase;margin:auto 0 0;padding-top:12pt;border-top:2pt solid var(--red)}
.black .pull{border-color:var(--red)}
.red .pull{border-color:#fff}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:18pt 28pt}
.grid3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:18pt 22pt}
.card{border-top:1pt solid #000;padding-top:9pt}
.black .card{border-color:#fff}
.red .card{border-color:#fff}
.card p{font-size:14.5pt;line-height:1.38;margin:0 0 7pt}
.card p.big{font-size:50pt;line-height:.95;margin:0 0 6pt}
.card p.big small{font-size:12.5pt}
.facts{display:grid;grid-template-columns:repeat(3,1fr);gap:0 22pt;margin-top:auto;padding-top:12pt;border-top:2pt solid var(--red)}
.black .facts{border-color:var(--red)}
.facts .big{font-size:38pt}
.facts p{font-size:12.5pt;line-height:1.35}
ul.brief{list-style:none;padding:0;margin:0}
ul.brief li{position:relative;padding-left:22pt;font-size:13.8pt;line-height:1.36;margin:0 0 8pt}
ul.brief li::before{content:'';position:absolute;left:0;top:7pt;width:10pt;height:4pt;background:var(--red)}
table{width:100%;border-collapse:collapse;font-size:13pt;line-height:1.3}
th,td{text-align:left;vertical-align:top;padding:5pt 8pt 5pt 0;border-bottom:1pt solid var(--n260)}
thead th{font-family:'Oswald';font-weight:600;font-size:9.5pt;letter-spacing:.14em;text-transform:uppercase;border-bottom:1pt solid #000;padding-bottom:4pt}
tbody th{font-weight:600}
td.n,th.n{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}
tr.sum th,tr.sum td{border-top:2pt solid #000;border-bottom:0;font-weight:600}
.bars{margin:0}
.bar{display:grid;grid-template-columns:2.3in 1fr 1.1in;gap:0 10pt;align-items:center;padding:8pt 0;border-bottom:1pt solid var(--n260);font-size:13pt}
.bar .lab{font-weight:500}
.bar .trk{height:12pt;background:#F2F2F2;position:relative}
.bar .trk i{position:absolute;left:0;top:0;height:100%;background:#000}
.bar .trk i.red{background:var(--red)}
.bar .trk i.frost{background:var(--frost)}
.bar .val{text-align:right;font-variant-numeric:tabular-nums;font-weight:600}
.fig{font-size:11.5pt;line-height:1.35;color:var(--ink-muted);margin:8pt 0 0}
.black .fig{color:var(--n340)}
.foot{position:absolute;left:.78in;right:.78in;bottom:.45in;display:flex;justify-content:space-between;font-family:'Oswald';font-weight:600;font-size:9pt;letter-spacing:.18em;text-transform:uppercase;color:var(--n460)}
.red .foot{color:#fff}
.black .foot{color:var(--n460)}
.foot b{font-weight:600;color:inherit}
svg.d{display:block;width:100%;height:auto;overflow:visible}
svg.d .name{font-family:'Oswald';font-weight:600;font-size:12px;letter-spacing:.08em;fill:#000}
svg.d .sub{font-family:'Inter';font-size:9.8px;fill:var(--ink-muted)}
svg.d .ey{font-family:'Oswald';font-weight:600;font-size:10px;letter-spacing:.2em;fill:var(--ink-muted)}
svg.d .focal-t{fill:var(--red)}
svg.d .box{fill:#fff;stroke:#000;stroke-width:1}
svg.d .box.focal{stroke:var(--red);stroke-width:2}
svg.d .line{stroke:#000;stroke-width:1;fill:none}
svg.d .flow{stroke-dasharray:5 5}
svg.d .head{fill:#000}
svg.d .hair{stroke:var(--n260);stroke-width:1}
svg.d .grid{stroke:var(--n260);stroke-width:1;fill:none}
svg.d .track{fill:var(--n260)}
svg.d .sw-p{fill:var(--frost)}
svg.d .sw-r{fill:#000}
svg.d .sw-c{fill:var(--n460)}
.seal{width:.95in;height:auto;margin-top:auto}
.bear{width:2.4in;height:auto;margin:0 0 10pt}
.cover h1{font-size:62pt;margin-top:18pt}
.cover .lede{margin-top:16pt;max-width:5.6in}
.cover .url{font-family:'Oswald';font-weight:600;letter-spacing:.12em;text-transform:uppercase;font-size:11pt;margin-top:12pt}
dl{margin:0}
dl.steps div{display:grid;grid-template-columns:1.2in 1fr;gap:0 12pt;padding:7pt 0;border-top:1pt solid var(--n260)}
dl.steps dt{font-family:'Oswald';font-weight:700;text-transform:uppercase;font-size:15pt;margin:0}
dl.steps dd{margin:0;font-size:14pt;line-height:1.38}
ol.file{list-style:none;counter-reset:f;padding:0;margin:0;display:grid;grid-template-columns:1fr 1fr;gap:16pt 26pt}
ol.file li{counter-increment:f;border-top:1pt solid #000;padding-top:8pt}
ol.file li::before{content:counter(f,decimal-leading-zero);display:block;font-family:'Oswald';font-weight:700;font-size:30pt;color:var(--red);line-height:1;margin-bottom:4pt}
ol.file p{font-size:14.5pt;line-height:1.38}
ol.notes{padding-left:16pt;margin:0;columns:2;column-gap:22pt;font-size:8.3pt;line-height:1.28}
ol.notes li{margin:0 0 5pt;break-inside:avoid}
ol.notes cite{font-style:normal;font-weight:600}
.ask{display:grid;grid-template-columns:1fr 1fr 1fr;gap:0 22pt;margin-top:12pt}
.ask .big{font-size:48pt;margin-bottom:2pt}
.ask h3{margin-top:0}
.ask p{font-size:14.5pt}
.red p,.red h3,.red .k{color:#fff}
.carry{margin-top:auto;padding-top:12pt;border-top:1pt solid #fff}
.carry p{font-size:13.5pt;margin:0 0 5pt}
.timeline dl div{display:grid;grid-template-columns:1.35in 1fr;gap:0 12pt;padding:6pt 0;border-top:1pt solid var(--n260)}
.timeline dt{font-family:'Oswald';font-weight:700;text-transform:uppercase;font-size:13pt;margin:0}
.timeline dd{margin:0;font-size:12.6pt;line-height:1.34}
`;

function page(klass, body, n, total) {
  return `<section class="p ${klass}">${body}<div class="foot"><span>Northern Temper · The Protein Leaves as Water</span><span>${n} / ${total}</span></div></section>`;
}

/* ---------- Paper No. 05 ---------- */

function whey() {
  const { WHEY_US_SHARE, WHEY_SURTAX, WPC_AUG_2026, WPC_AUG_2023, WPC_RATIO, SMPIF_CAP, SMPIF_BUDGET } = loadTs('figures');
  const { MODEL, day, cases, plant, landed, netCapital, grantAmount, skidTotal, dollars, kg } = loadTs('whey');
  const { READS, paperImprint } = loadTs('reads');
  const read = READS.find((r) => r.slug === slug);
  const SITE = { origin: 'https://northerntemper.ca' };
  const url = `${SITE.origin}/read/${slug}`;

  const d = day();
  const c = cases();
  const pl = plant();
  const fx = 1.40;
  const surtax = WHEY_SURTAX.value / 100;
  const lo = landed(10, fx, surtax);
  const hi = landed(11, fx, surtax);
  const skid = skidTotal();
  const grant = grantAmount();
  const net = netCapital();
  const m = dollars;
  const millions = (v) => `$${(v / 1_000_000).toFixed(1)} million`;
  const months = (v) => `${v.toFixed(1)} months`;
  const cap = (t) => t[0].toUpperCase() + t.slice(1);
  const noCents = (s) => s.replace(/\.\d+$/, '');
  const tonneSurtax = Math.floor(lo.surtaxPerKg * 1000 / 1000) * 1000;
  const strip = { permeate: (d.permeateLitres / MODEL.litresPerDay) * 352, retentate: (d.retentateLitres / MODEL.litresPerDay) * 352, cream: (d.creamKg / MODEL.litresPerDay) * 352 };
  const bar = (label, v, max, klass = '', val = m(v)) => `<div class="bar"><span class="lab">${esc(label)}</span><span class="trk"><i class="${klass}" style="width:${Math.max(0.6, (v / max) * 100).toFixed(1)}%"></i></span><span class="val">${esc(val)}</span></div>`;
  const pages = [];

  // 1 · Cover. Opens on what Canada holds: the nine litres and the skid; the surtax third.
  pages.push(['black cover', `
    <p class="k rule"><span>${esc(paperImprint(read.paper))}</span></p>
    <h1>The protein leaves as water. It comes back as a bill.</h1>
    <p class="lede">A plan to dry Canadian whey in Canada. Not a new factory. One skid, beside a vat that already has the milk, the licence and the waste.</p>
    <p class="url">northerntemper.ca</p>
    <div class="facts">
      <div><p class="big">9 L</p><p>of whey for every kilogram of Canadian cheese. The protein is in the nine.</p></div>
      <div><p class="big">${esc(m(MODEL.capex).replace(',800,000', '.8M'))}</p><p>the skid we model, beside a vat. Not a new factory.</p></div>
      <div><p class="big">${esc(WHEY_SURTAX.display)}</p><p>surtax on the powder we have been buying back, since 8 September 2026.</p></div>
    </div>`]);

  // 2 · In brief.
  pages.push(['', `
    <p class="k rule"><span>In brief</span></p>
    <h2>Canada already makes the protein.</h2>
    <ul class="brief">
      <li>Every kilogram of Canadian cheese leaves nine or ten litres of whey behind, and the protein is in the nine. The milk is paid for. The plant is licensed. Nothing new has to be grown.</li>
      <li>The plan is one skid beside one vat: about ${esc(millions(MODEL.capex))} installed, on the floor of a plant that already has the licence, the milk and the waste. Not a new factory. Not a new cow. Not a new quota.</li>
      <li>One skid on one day: ${esc(MODEL.litresPerDay.toLocaleString('en-CA'))} litres of sweet whey in; ${esc(kg(d.creamKg))} of cream sold first, about ${esc(MODEL.retentateLitres.toLocaleString('en-CA'))} litres of protein to a dryer we rent, and the water back to the plant. ${esc(kg(MODEL.basePowderKgDay))} of powder a day in the cautious case.</li>
      <li>The year returns about ${esc(millions(c.base.ebitda))} before interest and tax in the base case. Cream alone covers drying, freight and power. At $14 a kilogram it still clears about ${esc(millions(c.downside.ebitda))}.</li>
      <li>Until now that whey left as water and came back as powder: ${esc(WHEY_US_SHARE.display)} of the high-protein whey Canada imports has been American. In September both doors closed in one month: a ${esc(WHEY_SURTAX.display)} surtax on the return from 8 September, and listed Canadian whey stopped at the American border from the 29th. The loop no longer pays, which is the moment to stop running it.</li>
      <li>The money: one federal door is open to a licensed cheese plant, up to ${esc(SMPIF_CAP.display)}, non-repayable. The plant-protein fund will say no, and the interest-free loan is closed. Eight desks can stop it, and this deck says what each is shown.</li>
      <li>No cheese plant, dryer or brand has agreed to any of this. The sequence is the work.</li>
    </ul>
    <p class="fig" style="margin-top:auto">A planning model, October 2026, not a term sheet. Every published figure is sourced on the last page; every figure of the plan's own is computed from the model's inputs, not typed.</p>`]);

  // 3 · 01 The loop.
  pages.push(['', `
    <p class="k rule"><span>01 · The loop</span></p>
    <h2>We already milked it.</h2>
    <svg class="d" viewBox="0 0 400 248" style="max-width:6.2in;margin:6pt auto 10pt">
      <text x="8" y="20" class="ey">CANADA</text>
      <text x="8" y="240" class="ey">UNITED STATES</text>
      <line x1="8" y1="124" x2="392" y2="124" class="hair" stroke-dasharray="4 4"/>
      <rect x="24" y="32" width="128" height="48" class="box"/>
      <text x="88" y="52" text-anchor="middle" class="name">THE VAT</text>
      <text x="88" y="68" text-anchor="middle" class="sub">sweet whey, mostly water</text>
      <rect x="248" y="32" width="128" height="48" class="box"/>
      <text x="312" y="52" text-anchor="middle" class="name">THE BLENDER</text>
      <text x="312" y="68" text-anchor="middle" class="sub">powder, bought back</text>
      <rect x="136" y="168" width="128" height="48" class="box"/>
      <text x="200" y="188" text-anchor="middle" class="name">A U.S. DRYER</text>
      <text x="200" y="204" text-anchor="middle" class="sub">not ours</text>
      <path d="M88 80 V192 H128" class="line flow"/>
      <polygon points="128,188 136,192 128,196" class="head"/>
      <text x="96" y="156" class="sub">whey, south, as water</text>
      <path d="M264 192 H312 V88" class="line flow"/>
      <polygon points="308,88 312,80 316,88" class="head"/>
      <rect x="272" y="108" width="80" height="32" class="box focal"/>
      <text x="312" y="128" text-anchor="middle" class="name focal-t">${esc(WHEY_SURTAX.display)} SURTAX</text>
    </svg>
    <dl class="steps">
      <div><dt>Vat</dt><dd>A Canadian cheese plant separates curd from sweet whey. The milk was already bought. No new cow. No new quota.</dd></div>
      <div><dt>South</dt><dd>The whey, mostly water, has been shipped to be dried in the United States, then sold back to Canada as powder.</dd></div>
      <div><dt>Back</dt><dd>${esc(cap(WHEY_US_SHARE.display))} of the high-protein whey Canada imports still comes from the United States.</dd></div>
    </dl>
    <p class="pull">The return is now taxed. Since 8 September 2026 that powder carries a ${esc(WHEY_SURTAX.display)} surtax. The loop no longer pays.</p>`]);

  // 4 · 02 The border.
  pages.push(['', `
    <p class="k rule"><span>02 · The border</span></p>
    <h2>Both doors closed in September.</h2>
    <div class="grid2">
      <div class="card"><p class="big">8 Sept</p><h3>Canada</h3><p>A ${esc(WHEY_SURTAX.display)} surtax on United States whey. Customs Notice 26-23.</p></div>
      <div class="card"><p class="big">29 Sept</p><h3>United States</h3><p>Listed Canadian whey stopped at the border.</p></div>
    </div>
    <h3 style="margin-top:26pt">Average US whey protein concentrate, a tonne</h3>
    <div class="bars">
      ${bar(WPC_AUG_2023.period, WPC_AUG_2023.value, WPC_AUG_2026.value, '', WPC_AUG_2023.display)}
      ${bar(WPC_AUG_2026.period, WPC_AUG_2026.value, WPC_AUG_2026.value, 'red', WPC_AUG_2026.display)}
    </div>
    <p class="fig">Vesper, cited by the Financial Post. ${esc(WPC_AUG_2026.period)} is ${esc(WPC_RATIO.toFixed(1))} times ${esc(WPC_AUG_2023.period)}. The surtax sits on top of that price. The pair could not be re-opened at the Post where this edition was prepared and stands as the author's cited claim; USDA via CNN has a record US$13 a pound in June 2026 and US$10 to $11 since.</p>
    <p class="pull">The powder was already scarce. The surtax sits on top.</p>`]);

  // 5 · 03 The penalty.
  pages.push(['', `
    <p class="k rule"><span>03 · The penalty</span></p>
    <h2>What a kilogram costs now.</h2>
    <h3>A kilogram of US powder, landed in Canada, before freight</h3>
    <div class="bars">
      ${bar(`In Canadian dollars, at $${fx.toFixed(2)}, US$10 a pound`, lo.cadPerKg, hi.withSurtax, '', `$${lo.cadPerKg.toFixed(2)}`)}
      ${bar(`With the ${WHEY_SURTAX.display} surtax`, lo.withSurtax, hi.withSurtax, 'red', `$${lo.withSurtax.toFixed(2)}`)}
      ${bar(`At US$11 a pound, with the surtax`, hi.withSurtax, hi.withSurtax, 'red', `$${hi.withSurtax.toFixed(2)}`)}
      ${bar('What we model, Canadian powder', MODEL.pricePerKg, hi.withSurtax, '', `$${MODEL.pricePerKg.toFixed(2)}`)}
    </div>
    <p class="fig">The worked line, late-September low: US$10 a pound is US$${lo.usdPerKg.toFixed(2)} a kilogram, times $${fx.toFixed(2)} is $${lo.cadPerKg.toFixed(2)}, times the ${esc(WHEY_SURTAX.display)} surtax is $${lo.withSurtax.toFixed(2)} Canadian. The surtax is charged on the value for duty, so this is the low end of the bill. The $${MODEL.pricePerKg.toFixed(2)} is our asking price in the model, not a contract.</p>
    <div class="facts">
      <div><p class="big">${esc(noCents(m(lo.withSurtax)))}–${esc(noCents(m(hi.withSurtax)))}</p><p>a kilogram, landed, Canadian, before freight. Duty-free before September.</p></div>
      <div><p class="big">$${MODEL.pricePerKg.toFixed(2)}</p><p>what we model for Canadian powder. A little over a third of that landed price.</p></div>
      <div><p class="big">${esc(m(tonneSurtax))}</p><p>of the bill on one tonne of powder is the surtax alone.</p></div>
    </div>`]);

  // 6 · 04 Not this. This.
  pages.push(['', `
    <p class="k rule"><span>04 · Not this. This.</span></p>
    <h2>Do not build a factory. Sit beside the vat.</h2>
    <div class="grid2" style="margin-top:10pt">
      <div class="card">
        <h3>Not this</h3>
        <p>Raw whey is about 93% water. It spoils in hours. A tanker of it is a tanker of water.</p>
        <p>A greenfield spray dryer is the $15 to $30 million machine, inside a $50 to $100 million plant, and two or three years of permits.</p>
        <p class="big" style="margin-top:14pt">$50–100M<small>Years.</small></p>
      </div>
      <div class="card">
        <h3>This</h3>
        <p>Phase one is a skid on the floor of a plant that already has the licence, the milk, and the waste.</p>
        <p>Sweet whey only. Cheddar, mozzarella, gouda. pH 6.0 to 6.5. Acid whey from cottage cheese or Greek yogurt is refused. It scales the membranes.</p>
        <p class="big" style="margin-top:14pt">${esc(m(skid.low).replace(',100,000', '.1'))}–${esc(m(skid.high).replace(',200,000', '.2M'))}<small>We model ${esc(m(MODEL.capex).replace(',800,000', '.8M'))}.</small></p>
      </div>
    </div>
    <p class="pull">The milk is already there. So is the licence. So is the waste.</p>`]);

  // 7 · 05 One day, the figure.
  pages.push(['', `
    <p class="k rule"><span>05 · One day</span></p>
    <h2>One hundred thousand litres.</h2>
    <svg class="d" viewBox="0 0 400 304" style="max-width:6.2in;margin:4pt auto 8pt">
      <rect x="8" y="8" width="384" height="48" class="box"/>
      <text x="200" y="28" text-anchor="middle" class="name">${esc(MODEL.litresPerDay.toLocaleString('en-CA'))} L SWEET WHEY IN</text>
      <text x="200" y="44" text-anchor="middle" class="sub">a day, ${MODEL.days} days a year</text>
      <rect x="40" y="60" width="352" height="6" class="track"/>
      <rect x="40" y="60" width="${strip.permeate.toFixed(1)}" height="6" class="sw-p"/>
      <rect x="${(40 + strip.permeate).toFixed(1)}" y="60" width="${strip.retentate.toFixed(1)}" height="6" class="sw-r"/>
      <rect x="${(40 + strip.permeate + strip.retentate).toFixed(1)}" y="60" width="${Math.max(2, strip.cream).toFixed(1)}" height="6" class="sw-c"/>
      <path d="M24 56 V196 M24 92 H32 M24 144 H32 M24 196 H32" class="line"/>
      <polygon points="32,88 40,92 32,96" class="head"/>
      <polygon points="32,140 40,144 32,148" class="head"/>
      <polygon points="32,192 40,196 32,200" class="head"/>
      <rect x="40" y="72" width="352" height="40" class="box"/>
      <rect x="376" y="80" width="8" height="8" class="sw-c"/>
      <text x="52" y="89" class="name">${esc(kg(d.creamKg).toUpperCase())} WHEY CREAM</text>
      <text x="52" y="105" class="sub">40% fat, off the clarifier, sold first</text>
      <rect x="40" y="124" width="352" height="40" class="box"/>
      <rect x="376" y="132" width="8" height="8" class="sw-p"/>
      <text x="52" y="141" class="name">~${esc(MODEL.permeateLitres.toLocaleString('en-CA'))} L PERMEATE</text>
      <text x="52" y="157" class="sub">lactose and minerals; the water goes back to the plant’s wash</text>
      <rect x="40" y="176" width="352" height="40" class="box"/>
      <rect x="376" y="184" width="8" height="8" class="sw-r"/>
      <text x="52" y="193" class="name">~${esc(MODEL.retentateLitres.toLocaleString('en-CA'))} L PROTEIN RETENTATE</text>
      <text x="52" y="209" class="sub">25% solids, volume down ${d.volumeCutPct.toFixed(0)}%, hauled cold to a dryer we rent</text>
      <path d="M216 216 V240" class="line"/>
      <polygon points="212,240 216,248 220,240" class="head"/>
      <rect x="40" y="248" width="352" height="48" class="box focal"/>
      <text x="216" y="268" text-anchor="middle" class="name focal-t">${esc(kg(MODEL.basePowderKgDay).toUpperCase())} POWDER OUT</text>
      <text x="216" y="284" text-anchor="middle" class="sub">a day, the cautious case; the membranes could yield ${esc(kg(d.maxPowderKg))}</text>
    </svg>
    <p class="fig">The strip under the top box is to scale: about ${Math.round(d.permeateLitres / MODEL.litresPerDay * 100)} of every 100 litres leave as water, and the protein is the thin dark band. The clarifier sees the whole volume whether the powder yield is cautious or not. Planning model, October 2026.</p>
    <p class="pull">Mostly water. The protein is the thin dark band, and it is worth the whole day.</p>`]);

  // 8 · 05 One day, the four numbers.
  pages.push(['', `
    <p class="k rule"><span>05 · One day</span></p>
    <h2>Four numbers, one day.</h2>
    <div class="grid2" style="margin-top:10pt">
      <div class="card"><p class="big">${esc(kg(d.creamKg))}</p><p>Whey cream, 40% fat. About ${esc(m(c.base.cream))} a year. This cheque arrives before a kilogram of powder is sold.</p></div>
      <div class="card"><p class="big">~${esc(MODEL.retentateLitres.toLocaleString('en-CA'))} L</p><p>Protein retentate at 25% solids. Volume down ${d.volumeCutPct.toFixed(0)}%. This is what gets hauled, cold, to a dryer we rent.</p></div>
      <div class="card"><p class="big">${esc(kg(MODEL.basePowderKgDay))}</p><p>Powder a day. The cautious case. ${Math.round(c.base.powderKg / 1000)} tonnes a year. This is the number in the ledger.</p></div>
      <div class="card"><p class="big">${esc(kg(d.maxPowderKg))}</p><p>What the membranes could yield. Shown so it is not hidden. Not used in the base case.</p></div>
    </div>
    <p class="fig" style="margin-top:14pt">~${esc(MODEL.permeateLitres.toLocaleString('en-CA'))} litres of permeate, lactose and minerals, go back as water recovered for the plant’s own wash. The waste load leaves with it. Cream revenue is held flat because it comes off the clarifier, not the dryer. Toll drying is $${MODEL.tollPerKg.toFixed(2)} a kilogram and moves with the powder.</p>
    <p class="pull">The cream pays for the dryer, the truck and most of the power before a bag is sold.</p>`]);

  // 9 · 06 Three cases: the ledger.
  const row = (label, f, klass = '') => `<tr class="${klass}"><th>${esc(label)}</th><td class="n">${esc(f(c.downside))}</td><td class="n">${esc(f(c.base))}</td><td class="n">${esc(f(c.max))}</td></tr>`;
  const neg = (k) => (y) => `−${m(y[k])}`;
  pages.push(['', `
    <p class="k rule"><span>06 · Three cases</span></p>
    <h2>The year, three ways.</h2>
    <table>
      <thead><tr><th>Line</th><th class="n">Downside</th><th class="n">Base</th><th class="n">If yield holds</th></tr></thead>
      <tbody>
        ${row('Powder a day', (y) => kg(y.powderKgDay))}
        ${row('Price a kilogram', (y) => `$${y.pricePerKg.toFixed(2)}`)}
        ${row('Powder revenue', (y) => m(y.powderRevenue))}
        ${row('Whey cream', (y) => m(y.cream))}
        ${row('Revenue', (y) => m(y.revenue), 'sum')}
        ${row(`Toll drying, $${MODEL.tollPerKg.toFixed(2)} a kilogram`, neg('toll'))}
        ${row('Chilled freight', neg('freight'))}
        ${row('Labour, five people', neg('labour'))}
        ${row('Power and wash', neg('power'))}
        ${row('Membranes, enzymes', neg('membranes'))}
        ${row('Licence, lab, insurance', neg('licence'))}
        ${row('EBITDA', (y) => m(y.ebitda), 'sum')}
        ${row('Loan, if it is made', neg('loan'))}
        ${row('Left to split', (y) => m(y.left), 'sum')}
        ${row(`Payback on ${m(net)}`, (y) => months(y.paybackMonths))}
      </tbody>
    </table>
    <p class="fig">Planning model, October 2026. Cream is the same in every column because it comes off the clarifier. The right-hand column is what the membranes could yield. It is not the plan. AgriInnovate, the interest-free loan in that row, is closed.</p>
    <p class="pull">At $${MODEL.downsidePricePerKg.toFixed(2)} a kilogram the same skid still clears about ${esc(millions(c.downside.ebitda))}. The ${Math.round(MODEL.grantShare * 100)}% grant is not in hand.</p>`]);

  // 10 · 07 The plant.
  pages.push(['', `
    <p class="k rule"><span>07 · The plant</span></p>
    <h2>What the cheese plant is paid.</h2>
    <div class="grid2" style="margin-top:10pt">
      <div class="card"><h3>$0 a litre up front</h3><p>The whey is not purchased. It is the stream the plant already separates, and used to pay to haul away.</p></div>
      <div class="card"><h3>Hot water back</h3><p>Polished water returns warm, into the plant’s own wash. Less city water. Less gas.</p></div>
      <div class="card"><h3>The cream first</h3><p>${esc(m(c.base.cream))} a year from whey cream, before a kilogram of powder is sold. It covers drying, freight, and most of the power.</p></div>
      <div class="card"><h3>${pl.centsPerLitre.toFixed(1)}¢ a litre after</h3><p>On the base case, ${Math.round(MODEL.plantShare * 100)}% of what is left goes back to the member plant. About ${esc(m(Math.round(pl.share / 1000) * 1000))} a year. A split in the model, not a promise.</p></div>
    </div>
    <p class="fig" style="margin-top:14pt">${(pl.litres / 1_000_000).toFixed(0)} million litres a year. ${esc(m(pl.share))} is ${Math.round(MODEL.plantShare * 100)}% of the ${esc(m(c.base.left))} left after costs and the loan in the base case. The other ${Math.round((1 - MODEL.plantShare) * 100)}% is a reserve and the operator’s share. Nothing here is agreed.</p>
    <p class="pull">Nothing up front. Hot water back. A share of the year, if the year makes money.</p>`]);

  // 11 · 08 The skid.
  pages.push(['', `
    <p class="k rule"><span>08 · The skid</span></p>
    <h2>Where the ${esc(m(MODEL.capex).replace(',800,000', '.8 million'))} goes.</h2>
    <table style="margin-top:6pt">
      <thead><tr><th>Line</th><th class="n">Low</th><th class="n">High</th></tr></thead>
      <tbody>
        ${MODEL.skid.map((r) => `<tr><th>${esc(r.label)}</th><td class="n">${esc(m(r.low))}</td><td class="n">${esc(m(r.high))}</td></tr>`).join('')}
        <tr class="sum"><th>Installed, no spray dryer</th><td class="n">${esc(m(skid.low))}</td><td class="n">${esc(m(skid.high))}</td></tr>
      </tbody>
    </table>
    <p class="fig">Ranges are equipment estimates for a ${esc(MODEL.litresPerDay.toLocaleString('en-CA'))}-litre-a-day loop, October 2026. The ${esc(m(MODEL.capex).replace(',800,000', '.8 million'))} is the middle.</p>
    <div class="facts">
      <div><p class="big">${esc(m(MODEL.capex).replace(',800,000', '.8M'))}</p><p>installed capital in the model. No spray dryer: the retentate goes to one we rent.</p></div>
      <div><p class="big">${esc(m(grant))}</p><p>if a grant covered ${Math.round(MODEL.grantShare * 100)}% of the skid. The ask, not a published rate. Not in hand.</p></div>
      <div><p class="big">${esc(m(net))}</p><p>the rest, earned back in ${esc(months(c.base.paybackMonths))} in the base case, ${esc(months(c.downside.paybackMonths))} in the downside.</p></div>
    </div>`]);

  // 12 · 09 Where it goes.
  pages.push(['', `
    <p class="k rule"><span>09 · Where it goes</span></p>
    <h2>Feed, or a sewer. Not a powder.</h2>
    <div class="grid2" style="margin-top:10pt">
      <div class="card"><h3>Nine litres</h3><p>Nine or ten litres of whey leave the vat for every kilogram of cheese. The milk was already paid for. The protein is in the nine, not the one.</p></div>
      <div class="card"><h3>The small plant sells it as feed</h3><p>For the plant without a dryer, livestock feed is the option that clears. Research by Julien Chamberland’s team at Université Laval, presented at an Ontario symposium in 2024, found it the only viable option for the smallest plants. The same group’s 2026 Quebec study found the same thing.</p></div>
      <div class="card"><h3>The surplus is not small</h3><p>Dairy Farmers of Ontario’s chair said the province needed another billion litres of processing capacity for the solids-not-fat surplus. That is capacity, not a count of litres poured out.</p></div>
      <div class="card"><h3>When feed will not take it</h3><p>Cheese whey carries 30,000 to 50,000 milligrams of oxygen demand per litre, and more. A municipal sewer is built for a few hundred. We will not claim a national figure for how much is flushed. The failure mode is the drain.</p></div>
    </div>
    <p class="pull">The protein is in the nine. Today the nine goes to feed, or down the drain.</p>`]);

  // 13 · 10 The money.
  pages.push(['', `
    <p class="k rule"><span>10 · The money</span></p>
    <h2>One door is open. One will say no.</h2>
    <table style="margin-top:6pt;font-size:12.5pt">
      <thead><tr><th style="width:1.45in">Door</th><th>What it actually funds</th><th style="width:2.1in">Us</th></tr></thead>
      <tbody>
        <tr><th>SMPIF</th><td>Dairy processors. New equipment. Non-repayable, up to ${esc(SMPIF_CAP.display)}. Intake open. Ends 31 March 2028.</td><td>Yes, if the cheese plant applies. A new company cannot.</td></tr>
        <tr><th>Protein Industries Canada</th><td>Plant protein. Its own line is “a global leader in plant protein.” Consortium, up to about 45%. It has funded a brewery byproduct.</td><td>No. We do not qualify, and we will not pretend to. The argument is that the policy stops at the plant door.</td></tr>
        <tr><th>AgriInnovate</th><td>Repayable. Interest-free when it is open. Normally up to $5 million.</td><td>Closed. The earlier stack that leaned on it is withdrawn.</td></tr>
        <tr><th>Provincial dairy funds</th><td>Ontario’s modernization stream paid up to $200,000 a plant. Its intake closed 13 February 2025. Real money, when it is open. Not a skid.</td><td>A top-up if a successor opens, after the federal file. Not the plan.</td></tr>
        <tr><th>BC Manufacturing Jobs Fund</th><td>Capital for B.C. manufacturers, when an intake is open: up to 20% of a project, $100,000 to $10 million.</td><td>The last capital intake closed in 2024. A $30 million renewal was announced in October 2026 with no intake date. Watch it. Do not book it.</td></tr>
      </tbody>
    </table>
    <p class="pull">${esc(m(net))} has to be found without AgriInnovate. Some of it from us.</p>`]);

  // 14 · 11 Who can stop it.
  pages.push(['', `
    <p class="k rule"><span>11 · Who can stop it</span></p>
    <h2>Eight desks. Any one of them.</h2>
    <table style="margin-top:6pt;font-size:11.4pt">
      <thead><tr><th style="width:1.3in">Who</th><th>How they stop us</th><th>What we put in front of them</th></tr></thead>
      <tbody>
        <tr><th>The cheese plant</th><td>No letter, no whey, no file.</td><td>Nothing up front. Hot water back. A share of the year, if the year makes money.</td></tr>
        <tr><th>The milk board</th><td>If this looks like milk moving around the board.</td><td>No new cow. No new quota. Whey only, after the vat. In B.C., the BC Milk Marketing Board. In Ontario, Dairy Farmers of Ontario.</td></tr>
        <tr><th>The Dairy Commission</th><td>If the solids get reclassified and the pool objects.</td><td>The milk was already paid as cheese milk. We are not buying a new class.</td></tr>
        <tr><th>CFIA</th><td>A new activity that is not on the licence or the preventive control plan.</td><td>The plant amends its plan. Bulk sacks under section 247. Not a new food company.</td></tr>
        <tr><th>Health Canada</th><td>A tub that claims to build muscle. That is a natural health product, and it needs a number before sale.</td><td>We do not sell a tub. The buyer already holds the product licence.</td></tr>
        <tr><th>Environment, and the sewer</th><td>Permeate dumped, or a new outfall. Lactose still has an oxygen demand.</td><td>Protein and cream leave the drain. Lactose goes to a feed or fermentation buyer. Recovered water is reuse, not a discharge.</td></tr>
        <tr><th>The blender</th><td>No purchase order, no lender.</td><td>A certificate of analysis first. Then a take-or-pay. Not a handshake.</td></tr>
        <tr><th>Our own members</th><td>If we treat a closed program as cash.</td><td>${esc(m(net))} has to be found without AgriInnovate. Some of it from us.</td></tr>
      </tbody>
    </table>
    <p class="fig">Safe Food for Canadians Regulations, section 247, is the bulk-dairy label. The natural health product line is Health Canada’s boundary, not a slogan. Nothing in this deck is a consent from any of these desks.</p>`]);

  // 15 · 12 Who can file.
  pages.push(['', `
    <p class="k rule"><span>12 · Who can file</span></p>
    <h2>The cheese plant applies.</h2>
    <ol class="file" style="margin-top:10pt">
      <li><h3>The plant</h3><p>A licensed dairy processor, with books. A new company cannot carry this file. The fund wants the licence and the history: two complete financial statements covering three years of revenue, at least two of them from processing.</p></li>
      <li><h3>Stage 1</h3><p>A project summary to the dairy desk at Agriculture and Agri-Food Canada. Non-repayable, up to ${esc(SMPIF_CAP.display)}, program open to 31 March 2028. An application is not an approval.</p></li>
      <li><h3>The skid</h3><p>We bring the equipment, the offtake, and the reason the file is worth writing. Installed capital in the model, ${esc(m(MODEL.capex))}.</p></li>
      <li><h3>The buyer</h3><p>Bulk powder to a Canadian blender who already holds a product licence. Not a claim on a tub. Not a school program. Plant-protein funds do not cover dairy whey.</p></li>
    </ol>
    <p class="fig" style="margin-top:14pt">Agriculture and Agri-Food Canada, Supply Management Processing Investment Fund. Dairy intake open. Budget ${esc(SMPIF_BUDGET.display)}. Stage 1: aafc.smpif-fitpgo.aac@agr.gc.ca.</p>
    <p class="pull">An application is not an approval. No plant has signed this.</p>`]);

  // 16 · 13 The ask. The document's one red field.
  pages.push(['red', `
    <p class="k rule"><span>13 · The ask</span></p>
    <h2>Fund the equipment that stops a waste and a surtax.</h2>
    <div class="ask">
      <div><p class="big">01</p><h3>One plant</h3><p>A licensed cheese plant, already separating sweet whey, willing to be the applicant.</p></div>
      <div><p class="big">02</p><h3>One skid</h3><p>Beside the vat. Not a new factory. Not a new cow. Not a new quota.</p></div>
      <div><p class="big">03</p><h3>One powder</h3><p>Sold in Canada, as an ingredient. Schools and the Forces can buy it once a plant is actually making it.</p></div>
    </div>
    <p class="pull">We are not asking for a set-aside. We are asking that protein we already milked be dried here, instead of poured out and bought back.</p>
    <div class="carry">
      <h3>Carry it</h3>
      <p>This plan needs a few people who already hold a piece of it: a cheese plant with a corner of floor, a dryer with a toll rate, a blender with a product licence, a milk board or the Dairy Commission, the dairy desk, and anyone who knows what breaks first.</p>
      <p>One line to each desk, from the page: <b>northerntemper.ca/read/the-protein-leaves-as-water</b></p>
    </div>`]);

  // 17 · 14 Twelve months.
  pages.push(['timeline', `
    <p class="k rule"><span>14 · Twelve months</span></p>
    <h2>The order of work.</h2>
    <svg class="d" viewBox="0 0 400 204" style="max-width:5.8in;margin:2pt auto 6pt">
      <path d="M8 16 V176 M40 16 V176 M72 16 V176 M104 16 V176 M136 16 V176 M168 16 V176 M200 16 V176 M232 16 V176 M264 16 V176 M296 16 V176 M328 16 V176 M360 16 V176 M392 16 V176" class="grid"/>
      <text x="8" y="24" class="name focal-t">A PLANT SAYS YES</text>
      <rect x="8" y="28" width="64" height="24" class="box focal"/>
      <text x="72" y="64" class="name">PILOT POWDER, THEN THE FILE</text>
      <rect x="72" y="68" width="64" height="24" class="box"/>
      <text x="136" y="104" class="name">TAKE-OR-PAY, THEN BUILD</text>
      <rect x="136" y="108" width="128" height="24" class="box"/>
      <text x="392" y="144" text-anchor="end" class="name">TIE-IN, LICENCE, FIRST SACKS</text>
      <rect x="264" y="148" width="128" height="24" class="box"/>
      <text x="8" y="192" class="ey">MONTH 1</text>
      <text x="104" y="192" text-anchor="middle" class="ey">4</text>
      <text x="232" y="192" text-anchor="middle" class="ey">8</text>
      <text x="392" y="192" text-anchor="end" class="ey">12</text>
    </svg>
    <dl>
      <div><dt>Months 1 to 2</dt><dd>Three directors. A letter from one host plant for about ${esc(MODEL.litresPerDay.toLocaleString('en-CA'))} litres a day and a corner of the floor. Five litres of sweet whey, cold, the same week. No co-op until a plant says yes.</dd></div>
      <div><dt>Months 3 to 4</dt><dd>A pilot powder and a certificate of analysis. Then the Stage 1 summary. A toll-dry term sheet before anyone welds a frame.</dd></div>
      <div><dt>Months 5 to 8</dt><dd>A take-or-pay from one blender, about $16.50 to $${MODEL.pricePerKg.toFixed(2)} a kilogram, 24 months. That contract is what a lender can read. Then the skid is built.</dd></div>
      <div><dt>Months 9 to 12</dt><dd>Stainless into the existing vat. The preventive control plan. Bulk sacks, not a retail tub. Cream one way. Retentate the other. Powder back.</dd></div>
    </dl>
    <p class="pull">No cheese plant, dryer, or brand has agreed to any of this. The sequence is the work. It is not a list of partners.</p>`]);

  // 18 · Sources, and the edition note.
  pages.push(['', `
    <p class="k rule"><span>Sources</span></p>
    <h2>Every figure, named.</h2>
    <ol class="notes" style="margin-top:6pt">
      <li><cite>Financial Post</cite>, “How Canada's 50% whey tariff is backfiring on Canadian protein makers,” 21 September 2026: roughly 1,000 tonnes of high-protein whey a month imported, about 90% from the U.S.; the U.S. prohibition from 29 September. The prohibition is Proclamation 11062 (8 September 2026); the 50% American duty on Canadian dairy before it is Proclamation 11047 (in effect 22 August 2026). whitehouse.gov · govinfo.gov</li>
      <li>Canada Border Services Agency, <cite>Customs Notice 26-23: United States Surtax Order (2026)</cite>, 7 September 2026: from 8 September, Schedule 3 goods carry a surtax of 50% of the value for duty. SOR/2026-186, <cite>Canada Gazette</cite> Part II, 23 September 2026: 0404.10.10 to 0404.90.20 at 50%. cbsa-asfc.gc.ca · gazette.gc.ca</li>
      <li>Vesper, as the Financial Post cited it: more than ${esc(WPC_AUG_2026.display)} a tonne in ${esc(WPC_AUG_2026.period)}, from about ${esc(WPC_AUG_2023.display)} in ${esc(WPC_AUG_2023.period)}; the author's cited claim, not re-opened for this edition. <cite>CNN</cite>, 27 September 2026, on USDA data: a record US$13 a pound by June, 250% up on the year, and US$10 to $11 since. USDA <cite>Dairy Market News</cite>, 19 to 23 October 2026: WPC 80 “in the $9s and $10s.” <cite>NutraIngredients</cite>, 19 June 2026: US$32,000 a tonne against US$5,500 in 2023.</li>
      <li>Bank of Canada, annual average exchange rates: 1.3698 for 2024, 1.3978 for 2025. The planning rate is the 2025 average, rounded. bankofcanada.ca</li>
      <li>Pires et al., “Dairy By-Products: A Review on the Valorization of Whey and Second Cheese Whey,” <cite>Foods</cite> 10(5):1067, 2021: 9 to 10 L of whey per kilogram of cheese. Tetra Pak, <cite>Dairy Processing Handbook</cite>, ch. 18: cheese whey about 94% water, sweet whey pH 5.9 to 6.6.</li>
      <li>Agriculture and Agri-Food Canada, <cite>AgriInnovate Program</cite>: intake closed; repayable; interest not charged; normally up to $5,000,000. agriculture.canada.ca</li>
      <li>Agriculture and Agri-Food Canada, <cite>Supply Management Processing Investment Fund</cite>: intake open for dairy processors; ${esc(SMPIF_BUDGET.display)} to 31 March 2028; up to ${esc(SMPIF_CAP.display)}, non-repayable; an active processing licence and two complete financial statements covering three years of revenue; Stage 1 to aafc.smpif-fitpgo.aac@agr.gc.ca. Confirm with the department before it is quoted as an offer.</li>
      <li><cite>Farmtario</cite>, Stew Slater, “Dairy processors are challenged to find viable options,” 8 March 2024: Chamberland on the equipment; feed “the only viable option” for the very small plants; Mark Hamel on an additional billion litres of processing capacity.</li>
      <li>Kpadé, Chamberland, Singbo, Pouliot and Doyen, <cite>Waste and Biomass Valorization</cite> 17:8127, 2026: for small plants, whey to animal feed is “the only viable option.”</li>
      <li>FAO, Thivend, “Use of whey in feeding ruminants”: BOD5 of 30 to 40 g of oxygen a litre; Pires et al. about 50 g for second cheese whey. Wisconsin DNR, 1998: dairy-plant wastewater at 2,000 to 3,000 mg/L is ten times domestic sewage.</li>
      <li>Protein Industries Canada: “a global leader in plant protein”; projects must connect to plant protein; 45% for a consortium of three or more. Terra Bioindustries and Great Western Brewing, 27 May 2026: $1.1 million into a brewery byproduct.</li>
      <li>Ontario, <cite>Dairy Processing Modernization Initiative</cite> guidelines: at most $200,000 a plant; intake closed 13 February 2025.</li>
      <li>British Columbia, <cite>BC Manufacturing Jobs Fund</cite>: intake closed; $30M renewal announced (page updated 6 October 2026); the 2024 guide set $100,000 to $10 million at up to 20%.</li>
      <li><cite>Safe Food for Canadians Regulations</cite>, SOR/2018-108, s. 247: prepackaged dairy products, not consumer prepackaged. CFIA on whey cream.</li>
      <li>Health Canada, <cite>Classification of Products at the Food-Natural Health Product Interface</cite>: powdered protein sold on “muscle building” or in measured doses is typically a natural health product; <cite>Natural Health Products Regulations</cite>, s. 4: no sale without a product licence.</li>
    </ol>
    <p class="fig" style="margin-top:auto"><b>A note on this edition.</b> The skid cost, the daily yields, the $${MODEL.pricePerKg.toFixed(2)} price, the cream, the operating lines and the EBITDA are our planning model, October 2026, computed from its inputs. Six details were corrected against their sources before the web edition was published, among them a provincial fund an earlier draft called open that closed in February 2025. Programs and prices move; check each source before any of this is quoted as an offer. The edition of record, with every link live and two panels that run the model on your own numbers, is <b>${esc(url.replace('https://', ''))}</b>. Public domain, CC0. Copy it, quote it in full, post it without a link back.</p>`]);

  const total = pages.length;
  const body = pages.map(([k, html], i) => page(k, html, i + 1, total)).join('\n');
  return { title: 'The protein leaves as water. It comes back as a bill.', body };
}

/* ---------- render ---------- */

(async () => {
  const deck = DECKS[slug]();
  const html = `<!doctype html><html lang="en-CA"><head><meta charset="utf-8"><title>${esc(deck.title)}</title><style>${CSS}</style></head><body>${deck.body}</body></html>`;
  fs.mkdirSync(path.dirname(out), { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  // Every page must hold its own content: a clipped last line is a failure, not a style.
  const over = await page.evaluate(() => [...document.querySelectorAll('.p')].map((p, i) => {
    const r = p.getBoundingClientRect();
    const foot = p.querySelector('.foot').getBoundingClientRect();
    let low = 0;
    for (const el of p.querySelectorAll('*')) {
      if (el.closest('.foot') || el.closest('svg')) continue;
      const b = el.getBoundingClientRect();
      if (b.height) low = Math.max(low, b.bottom);
    }
    return { page: i + 1, over: low > foot.top - 2 ? Math.round(low - (foot.top - 2)) : 0, wide: p.scrollWidth > p.clientWidth };
  }));
  const bad = over.filter((o) => o.over || o.wide);
  if (bad.length) {
    await browser.close();
    for (const b of bad) console.error(`  page ${b.page}: ${b.over ? `content runs ${b.over}px into the footer` : 'content wider than the page'}`);
    console.error(`generate-paper-pdf: ${bad.length} page(s) overflow`);
    process.exit(1);
  }
  await page.pdf({ path: out, width: '8.5in', height: '11in', printBackground: true, preferCSSPageSize: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
  await browser.close();
  const kb = Math.round(fs.statSync(out).size / 1024);
  console.log(`${path.relative(ROOT, out)}: ${over.length} pages, ${kb} kB`);
})().catch((e) => { console.error(e); process.exit(1); });
