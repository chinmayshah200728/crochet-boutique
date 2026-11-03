import {limitedText} from './request-security';
import {newTotpSecret,matchTotp} from './totp';
import {env} from 'cloudflare:workers';
import {cookies} from 'next/headers';
import {SignJWT,jwtVerify} from 'jose';
import {timingSafeEqual} from 'node:crypto';
const encoder=new TextEncoder(),cookieName='__Host-prisha-session';
type Credentials={salt:string;hash:string;sessionKey:string;totpSecret?:string;totpLast?:number;pendingTotp?:string;pendingExpires?:number};
const hex=(bytes:ArrayBuffer)=>Array.from(new Uint8Array(bytes),b=>b.toString(16).padStart(2,'0')).join('');
export async function digest(value:string){return hex(await crypto.subtle.digest('SHA-256',encoder.encode(value)))}
export async function passwordHash(password:string,salt:string){const key=await crypto.subtle.importKey('raw',encoder.encode(password),'PBKDF2',false,['deriveBits']);return hex(await crypto.subtle.deriveBits({name:'PBKDF2',salt:encoder.encode(salt),iterations:100000,hash:'SHA-256'},key,256))}
const equal=(a:string,b:string)=>a.length===b.length&&timingSafeEqual(encoder.encode(a),encoder.encode(b));
async function credentials(){const row=await env.DB.prepare("SELECT value FROM settings WHERE id='admin_credentials'").first<{value:string}>();return row?JSON.parse(row.value) as Credentials:null}
export async function studioIdentity(){
 const token=(await cookies()).get(cookieName)?.value;if(!token)return null;const auth=await credentials();if(!auth)return null;
 try{const {payload}=await jwtVerify(token,encoder.encode(auth.sessionKey),{issuer:'crochetbyprisha',audience:'studio',algorithms:['HS256'],requiredClaims:['exp','sub']});return payload.sub==='owner'?{userId:'owner',email:env.OWNER_EMAIL||'',displayName:'Prisha',fullName:'Prisha'}:null}catch{return null}
}
export async function studioAuth(request:Request,action:string){
 const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
 if(env.AUTH_MODE!=='password')return json({error:'Not found.'},404);
 if(request.method!=='POST')return json({error:'Use the sign-in form.'},405);
 if(request.headers.get('origin')!==new URL(request.url).origin)return json({error:'Please sign in from your store.'},403);
 if(action==='logout'){if(!await studioIdentity())return json({error:'Please sign in.'},401);await env.DB.prepare("UPDATE settings SET value=json_set(value,'$.sessionKey',?) WHERE id='admin_credentials'").bind(hex(crypto.getRandomValues(new Uint8Array(32)).buffer)).run();return new Response(null,{status:303,headers:{Location:'/admin','Set-Cookie':cookieName+'=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0'}});}
 const key='login:'+await digest(request.headers.get('cf-connecting-ip')||'local'),now=Date.now();
 const rate=await env.DB.prepare('INSERT INTO rate_limits(id,count,expires) VALUES (?,1,?) ON CONFLICT(id) DO UPDATE SET count=CASE WHEN expires<? THEN 1 ELSE count+1 END,expires=CASE WHEN expires<? THEN ? ELSE expires END RETURNING count').bind(key,now+900000,now,now,now+900000).first<{count:number}>();
 if((rate?.count||0)>10)return json({error:'Too many attempts. Please wait 15 minutes.'},429);
 const text=await limitedText(request,4096);if(text.length>4096)return json({error:'Invalid request.'},400);
 let data;try{data=JSON.parse(text)}catch{return json({error:'Invalid request.'},400)}
 if(typeof data.password!=='string'||data.password.length<(action==='setup'?12:1)||data.password.length>128)return json({error:'Use a password of 12–128 characters.'},400);
 if(typeof data.username!=='string'||data.username.trim().toLowerCase()!==(env.OWNER_USERNAME||'prishashah2809'))return json({error:'Incorrect username or password.'},401);
 let auth=await credentials();
 if(action==='change-password'){
  if(!auth||!await studioIdentity()||!equal(await passwordHash(data.password,auth.salt),auth.hash))return json({error:'Confirm your current password.'},401);
  if(typeof data.newPassword!=='string'||data.newPassword.trim().length<16||data.newPassword.length>128||data.newPassword===data.password)return json({error:'Choose a different password of 16–128 characters.'},400);
  const passwordStep=auth.totpSecret?matchTotp(auth.totpSecret,String(data.otp||''),Date.now(),auth.totpLast??-1):-1;if(auth.totpSecret&&passwordStep<0)return json({error:'Enter a new authenticator code.'},401);
  const before=JSON.stringify(auth);if(passwordStep>=0)auth.totpLast=passwordStep;auth.salt=crypto.randomUUID();auth.hash=await passwordHash(data.newPassword,auth.salt);auth.sessionKey=hex(crypto.getRandomValues(new Uint8Array(32)).buffer);delete auth.pendingTotp;delete auth.pendingExpires;
  const changed=await env.DB.prepare("UPDATE settings SET value=? WHERE id='admin_credentials' AND value=?").bind(JSON.stringify(auth),before).run();if(!changed.meta.changes)return json({error:'Security settings changed. Sign in again.'},409);return json({ok:true});
 }
 if(['mfa-start','mfa-confirm'].includes(action)){
  if(!auth||!await studioIdentity()||!equal(await passwordHash(data.password,auth.salt),auth.hash))return json({error:'Sign in and confirm your current password.'},401);
  if(auth.totpSecret)return json({error:'Two-factor authentication is already enabled.'},409);
  if(action==='mfa-start'){const before=JSON.stringify(auth);auth.pendingTotp=newTotpSecret();auth.pendingExpires=Date.now()+600000;const result=await env.DB.prepare("UPDATE settings SET value=? WHERE id='admin_credentials' AND value=?").bind(JSON.stringify(auth),before).run();if(!result.meta.changes)return json({error:'Security settings changed. Try again.'},409);return json({secret:auth.pendingTotp});}
  const step=auth.pendingTotp&&auth.pendingExpires!>Date.now()?matchTotp(auth.pendingTotp,String(data.otp||'')):-1;
  if(step<0)return json({error:'Enter a current authenticator code. Setup expires after 10 minutes.'},400);
  const before=JSON.stringify(auth);auth.totpSecret=auth.pendingTotp;auth.totpLast=step;delete auth.pendingTotp;delete auth.pendingExpires;auth.sessionKey=hex(crypto.getRandomValues(new Uint8Array(32)).buffer);
  const changed=await env.DB.prepare("UPDATE settings SET value=? WHERE id='admin_credentials' AND value=?").bind(JSON.stringify(auth),before).run();if(!changed.meta.changes)return json({error:'Security settings changed. Start again.'},409);
  return json({ok:true,signInAgain:true});
 }

 if(action==='setup'){
  if(auth)return json({error:'The owner password is already set. Please sign in.'},409);
  if(typeof data.code!=='string'||!env.ADMIN_SETUP_HASH||!equal(await digest(data.code),env.ADMIN_SETUP_HASH))return json({error:'Invalid private setup link.'},403);
  const salt=crypto.randomUUID();auth={salt,hash:await passwordHash(data.password,salt),sessionKey:hex(crypto.getRandomValues(new Uint8Array(32)).buffer)};
  const result=await env.DB.prepare("INSERT INTO settings(id,value) VALUES ('admin_credentials',?) ON CONFLICT(id) DO NOTHING").bind(JSON.stringify(auth)).run();if(result.meta.changes!==1)return json({error:'Password already set. Please sign in.'},409);
 }else if(action==='login'){
  if(!auth)return json({error:'Use your private setup link to create the owner password first.'},403);
  if(!equal(await passwordHash(data.password,auth.salt),auth.hash))return json({error:'Incorrect username or password.'},401);
  if(auth.totpSecret){const step=matchTotp(auth.totpSecret,String(data.otp||''),Date.now(),auth.totpLast??-1);if(step<0)return json({error:'Enter a new code from your authenticator app.'},401);const changed=await env.DB.prepare("UPDATE settings SET value=json_set(value,'$.totpLast',?) WHERE id='admin_credentials' AND json_extract(value,'$.sessionKey')=? AND COALESCE(json_extract(value,'$.totpLast'),-1)<?").bind(step,auth.sessionKey,step).run();if(!changed.meta.changes)return json({error:'This code was already used. Wait for a new code.'},401);}

 }else return json({error:'Not found.'},404);
 const token=await new SignJWT({}).setSubject('owner').setIssuer('crochetbyprisha').setAudience('studio').setProtectedHeader({alg:'HS256'}).setIssuedAt().setExpirationTime('8h').sign(encoder.encode(auth.sessionKey));
 return Response.json({ok:true},{headers:{'Cache-Control':'no-store','Set-Cookie':cookieName+'='+token+'; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=28800'}});
}
