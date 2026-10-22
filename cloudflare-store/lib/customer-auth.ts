import {env} from 'cloudflare:workers';
import {z} from 'zod';
import {timingSafeEqual} from 'node:crypto';
import {normaliseReference,validReference} from './payments';
import {digest,passwordHash} from './studio-auth';
export type Customer={id:string;name:string;email:string};
type RecordRow=Customer&{password_hash:string;salt:string;recovery_hash:string;credential_version:number};
const equal=(a:string,b:string)=>a.length===b.length&&timingSafeEqual(new TextEncoder().encode(a),new TextEncoder().encode(b));
const secret=()=>Array.from(crypto.getRandomValues(new Uint8Array(32)),b=>b.toString(16).padStart(2,'0')).join('');
const cookieName=(r:Request)=>new URL(r.url).protocol==='https:'?'__Host-prisha-customer':'prisha-customer-dev';
const token=(r:Request)=>r.headers.get('cookie')?.split(';').map(s=>s.trim()).find(s=>s.startsWith(cookieName(r)+'='))?.slice(cookieName(r).length+1)||'';
const cookie=(r:Request,value:string,age=604800)=>`${cookieName(r)}=${value}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${age}${new URL(r.url).protocol==='https:'?'; Secure':''}`;
const json=(data:unknown,status=200,headers:Record<string,string>={})=>Response.json(data,{status,headers:{'Cache-Control':'no-store',...headers}});
export async function customerIdentity(request:Request):Promise<Customer|null>{const value=token(request);if(!/^[a-f0-9]{64}$/.test(value))return null;return env.DB.prepare('SELECT c.id,c.name,c.email FROM customers c JOIN customer_sessions s ON s.customer_id=c.id WHERE s.token_hash=? AND s.expires>? AND s.credential_version=c.credential_version').bind(await digest(value),Date.now()).first<Customer>()}
async function session(request:Request,customer:Customer&{credential_version?:number},extra:object={}){const value=secret();await env.DB.batch([env.DB.prepare('DELETE FROM customer_sessions WHERE expires<?').bind(Date.now()),env.DB.prepare('INSERT INTO customer_sessions(token_hash,customer_id,expires,credential_version) VALUES (?,?,?,?)').bind(await digest(value),customer.id,Date.now()+604800000,customer.credential_version||1)]);return json({customer:{id:customer.id,name:customer.name,email:customer.email},...extra},200,{'Set-Cookie':cookie(request,value)})}
export async function customerRoute(request:Request,action:string){
 if(request.method==='GET'&&action==='me')return json({customer:await customerIdentity(request)});
 if(request.method==='GET'&&action==='orders'){
  const customer=await customerIdentity(request);if(!customer)return json({error:'Please sign in to see your orders.'},401);
  const orders=await env.DB.prepare('SELECT * FROM orders WHERE customer_id=? ORDER BY created_at DESC LIMIT 100').bind(customer.id).all();
  const items=await env.DB.prepare('SELECT i.* FROM order_items i JOIN orders o ON o.id=i.order_id WHERE o.customer_id=? AND o.id IN (SELECT id FROM orders WHERE customer_id=? ORDER BY created_at DESC LIMIT 100)').bind(customer.id,customer.id).all();
  return json({orders:orders.results.map(o=>({...o,items:items.results.filter(i=>i.order_id===o.id).map(i=>({...i,partColours:JSON.parse(String(i.part_colours||'{}'))}))}))});
 }
 if(request.method!=='POST')return json({error:'Not found.'},404);
 if(request.headers.get('origin')!==new URL(request.url).origin)return json({error:'Use the form on this website.'},403);
 if(action==='reference'){
  const customer=await customerIdentity(request);if(!customer)return json({error:'Please sign in.'},401);
  const text=await request.text();if(text.length>2048)return json({error:'Request is too large.'},400);
  const data=z.object({orderId:z.string().uuid(),reference:z.string().trim().min(3).max(80)}).parse(JSON.parse(text));
  const reference=normaliseReference(data.reference);if(!validReference(reference))return json({error:'Enter the transaction reference shown in your payment app (8–64 letters or digits).'},400);
  const result=await env.DB.prepare("UPDATE orders SET payment_ref=? WHERE id=? AND customer_id=? AND status='awaiting_payment'").bind(reference,data.orderId,customer.id).run();
  return result.meta.changes===1?json({ok:true}):json({error:'This order is unavailable or its payment is already being processed.'},404);
 }
 if(action==='logout'){await env.DB.prepare('DELETE FROM customer_sessions WHERE token_hash=?').bind(await digest(token(request))).run();return json({ok:true},200,{'Set-Cookie':cookie(request,'',0)})}
 if(!['register','login','recover','password'].includes(action))return json({error:'Not found.'},404);
 const text=await request.text();if(text.length>4096)return json({error:'Request is too large.'},400);
 let raw;try{raw=JSON.parse(text)}catch{return json({error:'Please check your details.'},400)}
 const email=z.string().trim().toLowerCase().email().max(200).parse(raw.email);
 const now=Date.now();for(const dimension of [request.headers.get('cf-connecting-ip')||'local',email]){const key='customer:'+await digest(dimension);const rate=await env.DB.prepare('INSERT INTO rate_limits(id,count,expires) VALUES (?,1,?) ON CONFLICT(id) DO UPDATE SET count=CASE WHEN expires<? THEN 1 ELSE count+1 END,expires=CASE WHEN expires<? THEN ? ELSE expires END RETURNING count').bind(key,now+900000,now,now,now+900000).first<{count:number}>();if((rate?.count||0)>15)return json({error:'Too many attempts. Please try again in 15 minutes.'},429)}
 const password=z.string().min(12).max(128).parse(raw.password);
 const row=await env.DB.prepare('SELECT * FROM customers WHERE email=?').bind(email).first<RecordRow>();
 if(action==='register'){
  const name=z.string().trim().min(2).max(100).parse(raw.name);if(row)return json({error:'Unable to create this account. Try signing in or using your recovery code.'},409);
  const recoveryCode=secret(),salt=crypto.randomUUID(),id=crypto.randomUUID();
  try{await env.DB.prepare('INSERT INTO customers(id,name,email,password_hash,salt,recovery_hash,created_at) VALUES (?,?,?,?,?,?,?)').bind(id,name,email,await passwordHash(password,salt),salt,await digest(recoveryCode),new Date().toISOString()).run()}catch{return json({error:'Unable to create this account. Please try signing in.'},409)}
  return session(request,{id,name,email},{recoveryCode});
 }
 if(action==='login'){
  // Perform the expensive hash even for an unknown address.
  const hash=await passwordHash(password,row?.salt||'unknown-account-salt');
  if(!row||!equal(hash,row.password_hash))return json({error:'Incorrect email or password.'},401);
  return session(request,row);
 }
 if(action==='password'){
  const current=await customerIdentity(request);if(!current||!row||current.id!==row.id)return json({error:'Please sign in again.'},401);
  if(typeof raw.currentPassword!=='string'||raw.currentPassword.length>128||!equal(await passwordHash(raw.currentPassword,row.salt),row.password_hash))return json({error:'Current password is incorrect.'},401);
 }else if(!row||typeof raw.recoveryCode!=='string'||!equal(await digest(raw.recoveryCode.trim()),row.recovery_hash))return json({error:'Incorrect email or recovery code.'},401);
 const salt=crypto.randomUUID(),recoveryCode=secret();
 const updated=await env.DB.prepare('UPDATE customers SET password_hash=?,salt=?,recovery_hash=?,credential_version=credential_version+1 WHERE id=? AND credential_version=? RETURNING credential_version').bind(await passwordHash(password,salt),salt,await digest(recoveryCode),row!.id,row!.credential_version).first<{credential_version:number}>();
 if(!updated)return json({error:'Account details changed. Please sign in again.'},409);
 await env.DB.prepare('DELETE FROM customer_sessions WHERE customer_id=? AND credential_version<?').bind(row!.id,updated.credential_version).run();
 return session(request,{...row!,credential_version:updated.credential_version},{recoveryCode});
}
