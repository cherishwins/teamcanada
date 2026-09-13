const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs=require('fs'),path=require('path');
const ROOT=process.argv[2] || 'public', OUT=process.argv[3] || 'public/og';

const CARDS=[
 {slug:'home',      label:'A statement of Canadian character', title:'Northern\nTemper',
  line:'What we hold, and what we have never once used against a neighbour.', stat:'11×', statk:'the fresh water, per person'},
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
 {slug:'read',      label:'The reads', title:"Read the\nhomework",
  line:'Every claim, laid out in full, with sources.', stat:'9,162', statk:'words, sourced'},
 {slug:'support',   label:'The colophon', title:'What this cost.\nWhat it is for.',
  line:'Public domain. Nothing here is behind a payment.', stat:'CC0', statk:'no permission needed'},
 {slug:'join',      label:'The coalition', title:'Put your name\nbehind one country',
  line:'No account. No fee. Free to leave whenever you like.', stat:'∅', statk:'nothing to sign'},
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

(async()=>{
  const b=await chromium.launch();
  const ctx=await b.newContext({viewport:{width:1200,height:630},deviceScaleFactor:1});
  const p=await ctx.newPage();
  for(const c of CARDS){
    await p.setContent(page(c),{waitUntil:'load'});
    await p.evaluate(()=>document.fonts.ready);
    await p.waitForTimeout(120);
    await p.screenshot({path:path.join(OUT,c.slug+'.png')});
    const kb=Math.round(fs.statSync(path.join(OUT,c.slug+'.png')).size/1024);
    console.log(`  og/${c.slug}.png`.padEnd(34)+kb+'KB');
  }
  await b.close();
})();
