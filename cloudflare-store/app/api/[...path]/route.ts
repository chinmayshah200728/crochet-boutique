import {env} from 'cloudflare:workers';
import {ZodError,z} from 'zod';
import {owner} from '../../../lib/owner';
import {defaults,statuses} from '../../../lib/store';
import {productInput,reviewInput,settingsInput,orderInput} from '../../../lib/validation';
import {getMedia,putMedia} from '../../../lib/media';
import {customerRoute,customerIdentity} from '../../../lib/customer-auth';
import {collectionModels} from '../../../lib/collection-models';
import {normaliseReference,validReference} from '../../../lib/payments';
import {studioAuth} from '../../../lib/studio-auth';

const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
const decode=(p:any)=>({...p,images:JSON.parse(p.images),colours:JSON.parse(p.colours),model_colours:JSON.parse(p.model_colours||'{}')});
async function storeSettings(){const row=await env.DB.prepare('SELECT value FROM settings WHERE id=?').bind('store').first<{value:string}>();return {...defaults,...(row?JSON.parse(row.value):{})};}
async function body(request:Request){if(Number(request.headers.get('content-length'))>65536)throw new Error('Request is too large.');const text=await request.text();if(text.length>65536)throw new Error('Request is too large.');return JSON.parse(text);}
async function route(request:Request){
 try{
 const url=new URL(request.url),parts=url.pathname.split('/').filter(Boolean).slice(1),method=request.method;
 if(parts[0]==='customer')return await customerRoute(request,parts[1]);
 if(parts[0]==='auth')return studioAuth(request,parts[1]);
 const admin=parts[0]==='admin';
 if(method!=='GET'){const origin=request.headers.get('origin');if(!origin||origin!==url.origin)return json({error:'Please submit this form from the store website.'},403);}
 if(admin&&!(await owner()))return json({error:'Sign in with the store owner account to continue.'},401);
 if(parts[0]==='media'&&method==='GET'){
  if(parts.length!==2||!/^([a-z0-9-]+)\.(png|jpg|webp|glb)$/.test(parts[1]))return json({error:'File not found.'},404);
  return await getMedia(parts[1])||json({error:'File not found.'},404);
 }
 if(parts[0]==='store'&&method==='GET'){
  const [products,reviews,settings]=await Promise.all([env.DB.prepare("SELECT * FROM products WHERE status='active' ORDER BY created_at DESC").all(),env.DB.prepare('SELECT * FROM reviews WHERE published=1 ORDER BY date DESC LIMIT 50').all(),storeSettings()]);return json({products:products.results.map(decode),reviews:reviews.results,settings});
 }
 if(admin&&parts[1]==='data'&&method==='GET'){
  const [products,reviews,orders,items,settings]=await Promise.all([env.DB.prepare('SELECT * FROM products ORDER BY created_at DESC').all(),env.DB.prepare('SELECT * FROM reviews ORDER BY created_at DESC').all(),env.DB.prepare('SELECT * FROM orders ORDER BY created_at DESC LIMIT 500').all(),env.DB.prepare('SELECT * FROM order_items WHERE order_id IN (SELECT id FROM orders ORDER BY created_at DESC LIMIT 500)').all(),storeSettings()]);
  return json({products:products.results.map(decode),reviews:reviews.results,orders:orders.results.map(o=>({...o,items:items.results.filter(i=>i.order_id===o.id).map(i=>({...i,partColours:JSON.parse(String(i.part_colours||'{}'))}))})),settings});
 }
 if(admin&&parts[1]==='upload'&&method==='POST'){
  const limit=16*1024*1024;if(Number(request.headers.get('content-length'))>limit)return json({error:'File must be smaller than 15 MB.'},413);
  const data=await request.formData(),file=data.get('file');if(!(file instanceof File)||!file.size||file.size>15*1024*1024)return json({error:'Choose a file under 15 MB.'},400);
  const bytes=new Uint8Array(await file.arrayBuffer());let ext='',type='';
  if(bytes[0]===137&&bytes[1]===80&&bytes[2]===78&&bytes[3]===71){ext='png';type='image/png';}
  else if(bytes[0]===255&&bytes[1]===216&&bytes[2]===255){ext='jpg';type='image/jpeg';}
  else if(new TextDecoder().decode(bytes.slice(0,4))==='RIFF'&&new TextDecoder().decode(bytes.slice(8,12))==='WEBP'){ext='webp';type='image/webp';}
  else if(new TextDecoder().decode(bytes.slice(0,4))==='glTF'){
   if(bytes.length<20||new DataView(bytes.buffer).getUint32(4,true)!==2)return json({error:'Use a valid GLB version 2 model.'},400);
   const length=new DataView(bytes.buffer).getUint32(12,true);let gltf;try{gltf=JSON.parse(new TextDecoder().decode(bytes.slice(20,20+length)));}catch{return json({error:'This GLB file is damaged.'},400);}
   if([...(gltf.buffers||[]),...(gltf.images||[])].some((x:any)=>x.uri&&!x.uri.startsWith('data:')))return json({error:'Use a self-contained GLB with all textures embedded.'},400);
   ext='glb';type='model/gltf-binary';
  }else return json({error:'Choose a JPG, PNG, WebP image or a self-contained GLB model.'},400);
  if(ext!=='glb'&&file.size>5*1024*1024)return json({error:'Product photos must be under 5 MB.'},413);
  const key=crypto.randomUUID()+'.'+ext;try{await putMedia(key,bytes,type)}catch(e){if(String(e).includes('media_capacity'))return json({error:'Your 200 MB media storage is full. Contact your website administrator to expand it.'},409);throw e}return json({url:'/api/media/'+key});
 }
 if(admin&&parts[1]==='products'&&(method==='POST'||method==='PUT')){
  const p=productInput.parse(await body(request)),id=method==='POST'?crypto.randomUUID():z.string().uuid().parse(parts[2]),now=new Date().toISOString();
  if(method==='PUT'&&!await env.DB.prepare('SELECT id FROM products WHERE id=?').bind(id).first())return json({error:'Product not found.'},404);
  await env.DB.prepare('INSERT INTO products (id,name,description,category,price,stock,status,images,colours,model,model_colours,lead_time,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET name=excluded.name,description=excluded.description,category=excluded.category,price=excluded.price,stock=excluded.stock,status=excluded.status,images=excluded.images,colours=excluded.colours,model=excluded.model,model_colours=excluded.model_colours,lead_time=excluded.lead_time,updated_at=excluded.updated_at').bind(id,p.name,p.description,p.category,p.price,p.stock,p.status,JSON.stringify(p.images),JSON.stringify(p.colours),p.model,JSON.stringify(p.model_colours),p.lead_time,now,now).run();return json({id});
 }
 if(admin&&parts[1]==='reviews'){
  if(method==='DELETE'){const id=z.string().uuid().parse(parts[2]);await env.DB.prepare('DELETE FROM reviews WHERE id=?').bind(id).run();return json({ok:true});}
  if(method==='POST'||method==='PUT'){
   const r=reviewInput.parse(await body(request)),id=method==='POST'?crypto.randomUUID():z.string().uuid().parse(parts[2]);
   if(r.date>new Date().toISOString().slice(0,10))return json({error:'A review date cannot be in the future.'},400);
   if(r.product_id&&!await env.DB.prepare('SELECT id FROM products WHERE id=?').bind(r.product_id).first())return json({error:'Choose an existing product.'},400);
   await env.DB.prepare('INSERT INTO reviews (id,customer,body,rating,product_id,published,date,created_at) VALUES (?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET customer=excluded.customer,body=excluded.body,rating=excluded.rating,product_id=excluded.product_id,published=excluded.published,date=excluded.date').bind(id,r.customer,r.body,r.rating,r.product_id,r.published?1:0,r.date,new Date().toISOString()).run();return json({id});
  }
 }
 if(admin&&parts[1]==='settings'&&method==='PUT'){const s=settingsInput.parse(await body(request));await env.DB.prepare('INSERT INTO settings (id,value) VALUES (?,?) ON CONFLICT(id) DO UPDATE SET value=excluded.value').bind('store',JSON.stringify(s)).run();return json({ok:true});}
 if(admin&&parts[1]==='orders'&&method==='PUT'){
  const id=z.string().uuid().parse(parts[2]),data=z.object({status:z.enum(statuses as [string,...string[]]),tracking:z.string().trim().max(300),bankReference:z.string().max(80).optional(),receivedAmount:z.number().int().optional(),confirmCredit:z.boolean().optional()}).parse(await body(request));
  const order=await env.DB.prepare('SELECT status,total,verified_at FROM orders WHERE id=?').bind(id).first();if(!order)return json({error:'Order not found.'},404);
  if(order.status==='cancelled'&&data.status!=='cancelled')return json({error:'A cancelled order cannot be reopened. Create a new order instead.'},409);
  if(['paid','making','shipped','completed'].includes(data.status)&&!order.verified_at){
   const bankReference=normaliseReference(data.bankReference||'');
   if(!data.confirmCredit||!validReference(bankReference)||data.receivedAmount!==order.total)return json({error:'Check the credit in your bank, enter its transaction reference and the exact received amount, then confirm the check.'},400);
   try{const result=await env.DB.prepare('UPDATE orders SET status=?,tracking=?,bank_reference=?,verified_amount=?,verified_at=? WHERE id=? AND verified_at IS NULL').bind(data.status,data.tracking,bankReference,data.receivedAmount,new Date().toISOString(),id).run();if(result.meta.changes!==1)return json({error:'This order changed. Reopen it before confirming.'},409)}catch(e){if(String(e).includes('UNIQUE'))return json({error:'That bank transaction is already matched to another order. Check the reference in your bank.'},409);throw e}
  }else await env.DB.prepare('UPDATE orders SET status=?,tracking=? WHERE id=?').bind(data.status,data.tracking,id).run();return json({ok:true});
 }
 if(parts[0]==='orders'&&method==='POST'){
  const customer=await customerIdentity(request);if(!customer)return json({error:'Please sign in before placing an order.'},401);
  const raw=await body(request),o=orderInput.parse({...raw,email:customer.email}),id=z.string().uuid().parse(raw.requestId),s=await storeSettings();
  const existing=await env.DB.prepare('SELECT id,total,customer_id FROM orders WHERE id=?').bind(id).first();if(existing){if(existing.customer_id!==customer.id)return json({error:'Please start a new checkout.'},409);return json({id,total:existing.total});}
  if(!s.acceptingOrders)return json({error:'The studio is not accepting orders yet. Please check back soon.'},409);
  const ip=request.headers.get('cf-connecting-ip')||'local',now=Date.now(),digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(ip)),key=Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join('');
  const rate=await env.DB.prepare('INSERT INTO rate_limits(id,count,expires) VALUES (?,1,?) ON CONFLICT(id) DO UPDATE SET count=CASE WHEN expires<? THEN 1 ELSE count+1 END,expires=CASE WHEN expires<? THEN ? ELSE expires END RETURNING count').bind(key,now+3600000,now,now,now+3600000).first<{count:number}>();if(rate&&rate.count>12)return json({error:'Too many order attempts. Please try again in an hour.'},429);
  const lines=[];let total=s.shipping;
  for(const i of o.items){const p=await env.DB.prepare("SELECT * FROM products WHERE id=? AND status='active'").bind(i.productId).first<any>();if(!p||p.stock<i.quantity)return json({error:'An item is no longer available in this quantity. Please refresh your bag.'},409);const model=/^\/models\/collection-[0-3]\.glb$/.test(p.model)?collectionModels[Number(p.model.match(/collection-(\d)/)[1])]:p.model;if(model&&i.modelVersion!==model)return json({error:'This product’s 3D design has changed. Remove it from your bag, reopen the product and confirm your colours.'},409);if(model&&!Object.keys(i.partColours).length)return json({error:'Open the product’s 3D view and confirm its part colours before ordering.'},400);total+=p.price*i.quantity;lines.push({...i,name:p.name,price:p.price,model_snapshot:model});}
  const statements=[env.DB.prepare('INSERT INTO orders(id,customer,email,phone,address,total,shipping,status,payment_ref,tracking,created_at,customer_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)').bind(id,o.customer,o.email,o.phone,o.address,total,s.shipping,'awaiting_payment',o.payment_ref,'',new Date().toISOString(),customer.id),...lines.map(i=>env.DB.prepare('INSERT INTO order_items(id,order_id,product_id,name,price,quantity,colour,note,part_colours,model_snapshot) VALUES (?,?,?,?,?,?,?,?,?,?)').bind(crypto.randomUUID(),id,i.productId,i.name,i.price,i.quantity,i.colour,i.note,JSON.stringify(i.partColours),i.model_snapshot))];
  try{await env.DB.batch(statements);}catch{return json({error:'One of these items was just reserved. Refresh your bag and try again.'},409);}return json({id,total},201);
 }
 return json({error:'Not found.'},404);
 }catch(error){if(error instanceof ZodError)return json({error:error.issues.map(i=>`${i.path.join(' ')} ${i.message}`).join('. ')},400);if(error instanceof SyntaxError)return json({error:'Please check the submitted information.'},400);console.error('Store request failed',error instanceof Error?error.message:'Unknown error');return json({error:'The studio could not complete this request. Please try again shortly.'},500);}
}
export const GET=route;export const POST=route;export const PUT=route;export const DELETE=route;
