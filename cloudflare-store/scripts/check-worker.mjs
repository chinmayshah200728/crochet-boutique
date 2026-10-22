import {Miniflare} from 'miniflare';
import fs from 'node:fs';
const config=JSON.parse(fs.readFileSync('wrangler.launch-qa.json','utf8'));
const mf=new Miniflare({modules:[{type:'ESModule',path:'dist/server/index.js'},...fs.readdirSync('dist/server',{recursive:true}).filter(p=>p!=='index.js'&&p.endsWith('.js')&&!p.split(/[\\/]/).some(s=>s.startsWith('.'))).map(p=>({type:'ESModule',path:'dist/server/'+p}))],modulesRoot:'dist/server',modulesRules:[{type:'ESModule',include:['**/*.js','**/*.mjs'],fallthrough:true}],compatibilityDate:'2026-05-15',compatibilityFlags:['nodejs_compat'],bindings:config.vars,d1Databases:{DB:'launch-tests'},cf:false});
try{
 const db=await mf.getD1Database('DB');
 for(const f of fs.readdirSync('drizzle').filter(f=>f.endsWith('.sql')).sort()){
  const sql=fs.readFileSync('drizzle/'+f,'utf8');
  // Drizzle separators retain complete trigger bodies.
  const statements=sql.includes('--> statement-breakpoint')?sql.split('--> statement-breakpoint'):sql.split(/;\s*(?=(?:CREATE|ALTER|INSERT|DROP|UPDATE)\b)/i);
  for(const statement of statements)if(statement.trim())await db.prepare(statement).run();
 }
 for(const statement of fs.readFileSync('.wrangler/launch-qa-seed.sql','utf8').split(';').filter(s=>s.trim()))await db.prepare(statement).run();
 const realFetch=globalThis.fetch;
 globalThis.fetch=(url,options)=>String(url).startsWith('http://127.0.0.1:5176/')?mf.dispatchFetch(url,options):realFetch(url,options);
 await import('./check-launch.mjs');
 await import('./check-discovery.mjs');
}finally{await mf.dispose()}

