#!/usr/bin/env python3
"""Copy the <nav> and <footer> from the site's index.html into every other page,
re-basing relative links for page depth. Usage: python3 sync_chrome.py <site_dir> [--write]
Without --write it only reports which pages differ (dry run)."""
import sys,re,os,glob
root=os.path.abspath(sys.argv[1]); write='--write' in sys.argv
home=open(os.path.join(root,'index.html'),encoding='utf-8').read()
def chunk(s,tag): 
    m=re.search(r'<%s[ >].*?</%s>'%(tag,tag),s,re.S); return m.group(0)
def rebase(html,prefix):
    if not prefix: return html
    def f(m):
        u=m.group(2)
        if re.match(r'(https?:|mailto:|tel:|#|data:|javascript:)',u): return m.group(0)
        u=u[2:] if u.startswith('./') else u
        return f'{m.group(1)}="{prefix}{u}"'
    return re.sub(r'(href|src)="([^"]*)"',f,html)
src={t:chunk(home,t) for t in ('nav','footer')}
changed=[]
for p in sorted(glob.glob(root+'/**/*.html',recursive=True)):
    if os.path.abspath(p)==os.path.join(root,'index.html'): continue
    depth=os.path.relpath(p,root).count(os.sep); prefix='../'*depth
    s=open(p,encoding='utf-8').read(); n=s
    for t,h in src.items():
        # './' alone (logo) becomes the prefix
        new=rebase(h,prefix).replace('href=""','href="%s"'%(prefix or './'))
        n=n.replace(chunk(n,t),new,1)
    if n!=s:
        changed.append(os.path.relpath(p,root))
        if write: open(p,'w',encoding='utf-8').write(n)
print(('Updated' if write else 'Would update'),len(changed),'pages'); [print(' ',c) for c in changed]
