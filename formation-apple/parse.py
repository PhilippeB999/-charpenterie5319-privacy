import re,json,sys
lines=open(sys.argv[1],encoding='utf-8').read().split('\n')
chs=[];prev=None
for raw in lines:
    if 'Tablettes et t' in raw or '(suite)' in raw or not raw.strip(): continue
    m=re.search(r'(\d+-\d+)\s*$',raw); page=m.group(1) if m else None
    t=re.sub(r'\s{2,}\d+-\d+\s*$','',raw.rstrip()); t=re.sub(r'[.…]{2,}.*$','',t).strip()
    if not t: continue
    mc=re.match(r'^(\d+)\.\s+(.*)',t); ms=re.match(r'^(\d+\.\d+)\.?\s*(.*)',t); mss=re.match(r'^(\d+\.\d+\.\d+)\.?\s*(.*)',t)
    if mss: chs[-1]['secs'][-1]['subs'].append({'n':mss[1],'t':mss[2],'p':page})
    elif ms: chs[-1]['secs'].append({'n':ms[1],'t':ms[2],'p':page,'subs':[]})
    elif mc: chs.append({'n':int(mc[1]),'t':mc[2].strip(),'p':page,'secs':[]})
    elif chs and t.isupper() and not chs[-1]['secs']:
        chs[-1]['t']+=' '+t
        if page: chs[-1]['p']=page
for c in chs:
    c['t']=re.sub(r'\s*:\s*',' : ',c['t'])
json.dump(chs,open('toc.json','w'),ensure_ascii=False,indent=1)
for c in chs:
    print(c['n'],c['t'],c['p'],len(c['secs']),sum(len(s['subs']) for s in c['secs']))
    for s in c['secs']: print('   ',s['n'],s['t'],s['p'],'|',' ; '.join(x['t'] for x in s['subs']))
