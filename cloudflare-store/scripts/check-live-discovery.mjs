import assert from 'node:assert/strict';
const base='https://crochetbyprisha.pages.dev';
for(const path of ['/','/about','/help','/sitemap.xml','/robots.txt','/admin','/products/little-bow-charm--71000000-0000-4000-8000-000000000002']){
 const r=await fetch(base+path),s=await r.text();assert.equal(r.status,200,path);console.log(path,r.status,r.headers.get('content-type'));
 if(path==='/'){assert(s.includes('The Forever Bouquet'));assert(s.includes('Organization'));const assets=[...s.matchAll(/(?:src|href)="([^" ]+\.(?:js|css))"/g)].map(m=>m[1]);for(const p of assets.filter(p=>p.startsWith('/'))){const a=await fetch(base+p);assert.equal(a.status,200,p)}console.log('HTML contains products and all referenced JS/CSS respond.');}
 if(path==='/sitemap.xml'){assert(!s.includes('/products/'));assert(s.includes('/help'));}
 if(path.startsWith('/products/')){assert(s.includes('noindex'));assert(!s.includes('"@type":"Offer"'));}
 if(path==='/admin')assert.equal(r.headers.get('x-robots-tag'),'noindex, nofollow');
}
console.log('Live search checks passed: sample exclusions, page metadata and server rendering.');
