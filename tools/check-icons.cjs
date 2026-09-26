#!/usr/bin/env node
/**
 * The generated icons must still match public/favicon.svg.
 *
 * tools/generate-favicons.cjs is deliberately NOT in the build — icons change
 * about once a year and rasterising them on every deploy produces identical
 * bytes for no reason. But "run this by hand when you change the art" is the
 * kind of instruction this repo has watched fail repeatedly, and the last time
 * it failed here the result was two different favicons: the .ico carried the
 * ringed LeafSeal, favicon.svg carried a ringless leaf, and which mark a
 * reader saw depended on whether their browser preferred .ico or .svg. Nobody
 * noticed for months, because a binary does not show up in a diff you can read.
 *
 * So this re-renders from the source and compares. If someone edits the SVG
 * and forgets the generator, the build fails and says which command to run.
 *
 * It also checks the two things about the icon markup that are easy to get
 * wrong and invisible until someone pins a tab in Safari:
 *   · mask-icon must point at a monochrome, transparent file — never at
 *     favicon.svg, which has an opaque <rect> that Safari will happily fill.
 *   · no icon may be referenced that the deploy does not contain.
 * And the manifest: every icon at its stated size, and each maskable icon its
 * own file with the mark inside the safe zone.
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = process.argv[2] || '.vercel/output/static';
const SRC = path.join('public', 'favicon.svg');
const fail = [];

if (!fs.existsSync(SRC) || !fs.existsSync(ROOT)) {
  console.error(`check-icons: ${!fs.existsSync(SRC) ? SRC : ROOT} not found — run \`astro build\` first`);
  process.exit(1);
}

(async () => {
  const svg = fs.readFileSync(SRC);

  // ---- 1. The PNG outputs still match the source drawing.
  for (const size of [16, 32]) {
    const file = path.join(ROOT, `favicon-${size}.png`);
    if (!fs.existsSync(file)) {
      fail.push(`favicon-${size}.png is missing from the build`);
      continue;
    }
    // PIXELS, not bytes. Two libvips versions encode the same pixels into
    // different deflate streams (measured: sharp 0.34.5 against 0.35.4, 288
    // bytes each, maximum pixel difference 0), and a byte comparison would
    // fail the build on a dependency bump while claiming the art had changed.
    const raw = (input) => sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const want = await raw(await sharp(svg, { density: 512 }).resize(size, size, { fit: 'contain' }).png().toBuffer());
    const got = await raw(fs.readFileSync(file));
    let worst = want.info.width === got.info.width && want.info.height === got.info.height ? 0 : Infinity;
    for (let i = 0; worst !== Infinity && i < want.data.length; i++) worst = Math.max(worst, Math.abs(want.data[i] - got.data[i]));
    if (worst > 1) {
      fail.push(
        `favicon-${size}.png no longer matches ${SRC} (${worst === Infinity ? 'size differs' : `a channel differs by ${worst}`}) — run \`node tools/generate-favicons.cjs\``,
      );
    }
  }

  // ---- 2. The .ico carries the same frames.
  const ico = path.join(ROOT, 'favicon.ico');
  if (!fs.existsSync(ico)) {
    fail.push('favicon.ico is missing from the build');
  } else {
    const d = fs.readFileSync(ico);
    const count = d.readUInt16LE(4);
    const sizes = [];
    for (let i = 0; i < count; i++) {
      const o = 6 + i * 16;
      sizes.push(d.readUInt8(o) || 256);
      const off = d.readUInt32LE(o + 12);
      if (!d.subarray(off, off + 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
        fail.push(`favicon.ico frame ${i} is not a PNG payload — regenerate it`);
      }
    }
    for (const want of [16, 32, 48]) {
      if (!sizes.includes(want)) fail.push(`favicon.ico has no ${want}x${want} frame (has ${sizes.join(', ') || 'none'})`);
    }
  }

  // ---- 3. mask-icon is monochrome and transparent.
  const mask = path.join(ROOT, 'mask-icon.svg');
  if (!fs.existsSync(mask)) {
    fail.push('mask-icon.svg is missing from the build');
  } else {
    const m = fs.readFileSync(mask, 'utf8');
    if (/<rect\b/i.test(m) || /\bfill="(?!none)[^"]+"/i.test(m)) {
      fail.push(
        'mask-icon.svg has a background rect or a fill colour. Safari fills a mask icon itself, ' +
          'so an opaque shape renders the pinned tab as a solid block.',
      );
    }
  }

  // ---- 4. Every icon the pages reference actually shipped.
  const home = path.join(ROOT, 'index.html');
  if (fs.existsSync(home)) {
    const html = fs.readFileSync(home, 'utf8');
    for (const m of html.matchAll(/<link[^>]+rel="(?:icon|apple-touch-icon|mask-icon)"[^>]*href="(\/[^"]+)"/gi)) {
      const href = m[1];
      if (!fs.existsSync(path.join(ROOT, href.replace(/^\//, '')))) {
        fail.push(`the pages reference ${href}, which is not in the deploy`);
      }
      if (/rel="mask-icon"/i.test(m[0]) && href === '/favicon.svg') {
        fail.push('mask-icon points at favicon.svg — it needs the monochrome mask-icon.svg');
      }
    }
  }

  // ---- 5. The manifest's icons exist at their stated sizes, and a maskable
  // icon keeps its mark inside the safe zone. The manifest once reused the
  // full-bleed icon-512.png as its maskable icon: the seal's ring sat wholly
  // outside the W3C safe zone (a circle of radius 0.4 x the width), so a
  // launcher's circle mask cut it to a bare leaf and a squircle left red
  // wedges in the corners. Nothing read the manifest, so nothing could tell.
  let maskables = 0;
  const manifestFile = path.join(ROOT, 'site.webmanifest');
  if (!fs.existsSync(manifestFile)) {
    fail.push('site.webmanifest is missing from the build');
  } else {
    const icons = JSON.parse(fs.readFileSync(manifestFile, 'utf8')).icons || [];
    const anySrc = new Set(icons.filter((i) => (i.purpose || 'any').split(/\s+/).includes('any')).map((i) => i.src));
    for (const icon of icons) {
      const file = path.join(ROOT, icon.src.replace(/^\//, ''));
      if (!fs.existsSync(file)) { fail.push(`site.webmanifest lists ${icon.src}, which is not in the deploy`); continue; }
      const { data, info } = await sharp(fs.readFileSync(file)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
      if (`${info.width}x${info.height}` !== icon.sizes) fail.push(`${icon.src} is ${info.width}x${info.height}; the manifest says ${icon.sizes}`);
      if (!(icon.purpose || '').split(/\s+/).includes('maskable')) continue;
      maskables++;
      if (anySrc.has(icon.src)) {
        fail.push(`${icon.src} is both the 'any' and the 'maskable' icon; a maskable icon needs its own padded file (\`node tools/generate-favicons.cjs\`)`);
        continue;
      }
      const W = info.width, c = (W - 1) / 2, r = 0.4 * W;
      let outside = 0, clear = 0;
      for (let y = 0; y < info.height; y++) {
        for (let x = 0; x < W; x++) {
          const i = (y * W + x) * 4;
          if (data[i + 3] < 255) clear++;
          else if (Math.hypot(x - c, y - c) > r && Math.max(data[i], data[i + 1], data[i + 2]) > 8) outside++;
        }
      }
      if (clear) fail.push(`${icon.src} has ${clear} transparent pixels; a maskable icon must fill its square, or launchers fill it for you`);
      if (outside) fail.push(`${icon.src} draws ${outside} pixels outside the safe zone (radius 0.4 x width); masks will cut them off`);
    }
    if (!maskables) fail.push('site.webmanifest has no maskable icon; Android draws the site inside a white disc without one');
  }

  if (fail.length) {
    console.error('check-icons: the icons and their source have come apart\n');
    for (const f of fail) console.error(`  ✗ ${f}`);
    console.error('');
    process.exit(1);
  }
  console.log(`check-icons: favicon.ico (16/32/48), favicon-16/32.png and mask-icon.svg all match public/favicon.svg; ${maskables} maskable icons inside the safe zone`);
})();
