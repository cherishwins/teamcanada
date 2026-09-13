#!/usr/bin/env python3
"""Remove leading masthead furniture from the migrated reads.

Each source page carried its own site chrome — a wordmark, a nav row, a
document number, a meridian decoration, and a repeat of the title, imprint and
standfirst. The Read layout already prints imprint, title and standfirst, so
those blocks are duplicates; and three of them still carried the RETIRED
"Team Canada" wordmark, which the rebrand removed deliberately.

Only LEADING blocks are considered, and only until the first real paragraph of
prose. Nothing in the body is touched.
"""
import re, glob, sys

RETIRED = re.compile(
    r'^(team canada.*|.*strong\s*[·.]\s*proud\s*[·.]\s*free.*|'
    r'home\s*about\s*engage|homeaboutengage|'
    r'north pacific strategy initiative|fit for gov|'
    r'[A-Z0-9-]{3,}-(?:WP|DOSSIER)-\d+.*|'
    r'(?:npsi|ffg)[- ].*|'
    r'victoria mid-pacific busan|'
    r'a (?:governance reading|fit for gov dossier.*)|the record, set straight|'
    r'an honest account.*|abstract)$',
    re.I)

def plain(html):
    return re.sub(r'\s+', ' ', re.sub(r'<[^>]*>', '', html)).strip()

def strip(path, standfirst, title):
    src = open(path).read()
    head, body = src.split('>\n', 1) if '>\n' in src else (src, '')
    blocks = re.findall(r'^\s*<(?:p|h2|h3|div)[^>]*>.*?</(?:p|h2|h3|div)>\s*$',
                        body, re.M | re.S)
    removed = []
    for b in blocks[:8]:
        t = plain(b)
        dup = (t[:60].lower() in standfirst.lower() or
               t.lower() in title.lower() or
               standfirst.lower()[:60] in t.lower())
        if RETIRED.match(t) or (dup and len(t) > 4):
            body = body.replace(b + '\n', '', 1)
            removed.append(t[:56])
        elif len(t) > 180:
            break            # first real paragraph — stop here
    if removed:
        open(path, 'w').write(head + '>\n' + body)
    return removed

if __name__ == '__main__':
    total = 0
    for f in sorted(glob.glob('src/pages/read/*.astro')):
        if f.endswith('index.astro'):
            continue
        s = open(f).read()
        sf = (re.search(r'standfirst=\{"(.*?)"\}', s, re.S) or [None, ''])[1]
        ti = (re.search(r'title=\{"(.*?)"\}', s, re.S) or [None, ''])[1]
        gone = strip(f, sf, ti)
        total += len(gone)
        print(f"  {f.split('/')[-1][:-6]:<24} removed {len(gone)}")
        for g in gone:
            print(f"      − {g}")
    print(f"\n  {total} masthead blocks removed")
