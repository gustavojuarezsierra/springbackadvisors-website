#!/usr/bin/env python3
"""Springback site validator. Usage: python3 validate_site.py <site_dir>
Checks every .html page: broken relative links/assets, explicit index.html in links,
i18n keys used vs defined (EN and ES), EN/ES key parity, single <h1>, title/description/canonical,
valid JSON-LD, sitemap URLs map to real files. Exit code 1 if any ERROR."""
import sys,re,json,os,glob
root=os.path.abspath(sys.argv[1] if len(sys.argv)>1 else '.')
errs=[];warns=[]
pages=sorted(glob.glob(root+'/**/*.html',recursive=True))
# Shared strings (const TC in assets/main.js) are available on every page
TC={'en':{},'es':{}}
_mj=os.path.join(root,'assets','main.js')
if os.path.exists(_mj):
    _m=re.search(r'const TC=(\{.*?\n\});',open(_mj,encoding='utf-8').read(),re.S)
    if _m:
        try: TC=json.loads(_m.group(1))
        except Exception as e: errs.append(f'assets/main.js: TC is not valid JSON ({e})')
    if set(TC['en'])^set(TC['es']): errs.append('assets/main.js: TC keys differ between EN and ES: '+', '.join(sorted(set(TC['en'])^set(TC['es']))))
def rel(p): return os.path.relpath(p,root)
for p in pages:
    s=open(p,encoding='utf-8').read(); r=rel(p); d=os.path.dirname(p)
    # links / assets
    for m in re.finditer(r'(?:href|src)="([^"]+)"',s):
        u=m.group(1)
        if re.match(r'(https?:|mailto:|tel:|#|data:|javascript:)',u): continue
        path=re.split(r'[?#]',u)[0]
        if not path: continue
        if path.endswith('index.html'): errs.append(f'{r}: explicit index.html in link {u}')
        t=os.path.normpath(os.path.join(d,path))
        if os.path.isdir(t): t=os.path.join(t,'index.html')
        if not os.path.exists(t): errs.append(f'{r}: broken link/asset {u}')
    # head basics
    if len(re.findall(r'<h1[ >]',s))!=1: errs.append(f'{r}: expected exactly 1 <h1>, found {len(re.findall(r"<h1[ >]",s))}')
    for tag,pat in (('title',r'<title[^>]*>[^<]+</title>'),('meta description',r'<meta name="description"'),('canonical',r'rel="canonical"')):
        if not re.search(pat,s): errs.append(f'{r}: missing {tag}')
    for i,j in enumerate(re.findall(r'<script type="application/ld\+json">(.*?)</script>',s,re.S)):
        try: json.loads(j)
        except Exception as e: errs.append(f'{r}: JSON-LD block {i} invalid ({e})')
    # i18n
    m=re.search(r'const T=(\{.*?\n\});?',s,re.S)
    if not m: warns.append(f'{r}: no T dictionary found'); continue
    try: T=json.loads(m.group(1))
    except Exception as e: warns.append(f'{r}: could not parse T as JSON ({e})'); continue
    en,es=set(T.get('en',{})),set(T.get('es',{}))
    for k in sorted(en^es): errs.append(f'{r}: i18n key only in one language: {k}')
    used=set(re.findall(r'data-i18n(?:-title|-desc|-placeholder|-alt)?="([^"]+)"',s))
    en|=set(TC['en']); es|=set(TC['es'])
    for k in sorted(used-en): errs.append(f'{r}: data-i18n key missing in EN: {k}')
    for k in sorted(used-es): errs.append(f'{r}: data-i18n key missing in ES: {k}')
# sitemap
sm=os.path.join(root,'sitemap.xml')
if os.path.exists(sm):
    for u in re.findall(r'<loc>([^<]+)</loc>',open(sm,encoding='utf-8').read()):
        path=re.sub(r'^https?://[^/]+/?','',u)
        t=os.path.join(root,path) if path else os.path.join(root,'index.html')
        if os.path.isdir(t): t=os.path.join(t,'index.html')
        if not os.path.exists(t): errs.append(f'sitemap.xml: {u} has no file')
print(f'{len(pages)} pages checked')
for w in warns: print('WARN ',w)
for e in errs: print('ERROR',e)
print(f'{len(errs)} errors, {len(warns)} warnings'); sys.exit(1 if errs else 0)
