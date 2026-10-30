import json,sys,time,os,urllib.request,urllib.parse
UA={'User-Agent':'FormationAppleDeck/1.0 (training slides)'}
def api(params):
    params.update(format='json')
    u='https://commons.wikimedia.org/w/api.php?'+urllib.parse.urlencode(params)
    for i in range(10):
        try: return json.load(urllib.request.urlopen(urllib.request.Request(u,headers=UA),timeout=30))
        except Exception as e: print('retry',e,file=sys.stderr,flush=True); time.sleep(120*(i+1))
    raise SystemExit('fail')
queries=json.load(open(sys.argv[1])); outp=sys.argv[2]
out=json.load(open(outp)) if os.path.exists(outp) else {}
for k,q in queries.items():
    if k in out: continue
    r=api(dict(action='query',list='search',srsearch=q+' filetype:bitmap',srnamespace=6,srlimit=10))
    out[k]=[x['title'] for x in r['query']['search']]
    print(k,len(out[k]),flush=True); json.dump(out,open(outp,'w'),ensure_ascii=False,indent=1); time.sleep(90)
# batch metadata
titles=sorted({t for v in out.values() for t in v})
meta=json.load(open('meta.json')) if os.path.exists('meta.json') else {}
todo=[t for t in titles if t not in meta]
for i in range(0,len(todo),40):
    r=api(dict(action='query',titles='|'.join(todo[i:i+40]),prop='imageinfo',iiprop='url|extmetadata|size',iiurlwidth=400))
    norm={n['to']:n['from'] for n in r['query'].get('normalized',[])}
    for p in r['query']['pages'].values():
        if 'imageinfo' not in p: continue
        ii=p['imageinfo'][0]; m=ii.get('extmetadata',{})
        meta[norm.get(p['title'],p['title'])]=dict(thumb=ii.get('thumburl'),url=ii['url'],w=ii['width'],h=ii['height'],
          lic=m.get('LicenseShortName',{}).get('value',''),artist=m.get('Artist',{}).get('value',''),desc=m.get('ImageDescription',{}).get('value','')[:200])
    json.dump(meta,open('meta.json','w'),ensure_ascii=False,indent=1); print('meta',len(meta),flush=True); time.sleep(90)
print('DONE')
