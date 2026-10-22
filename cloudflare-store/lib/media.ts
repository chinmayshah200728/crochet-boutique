import {env} from 'cloudflare:workers';
import {Buffer} from 'node:buffer';
export async function putMedia(key:string,bytes:Uint8Array,type:string){
 if(env.MEDIA_STORAGE!=='d1'){await env.BUCKET.put(key,bytes,{httpMetadata:{contentType:type}});return}
 const chunkSize=384*1024,count=Math.ceil(bytes.length/chunkSize);
 const statements=[env.DB.prepare('INSERT INTO media_files(id,type,size,chunks) VALUES (?,?,?,?)').bind(key,type,bytes.length,count)];
 for(let part=0;part<count;part++)statements.push(env.DB.prepare('INSERT INTO media_chunks(file_id,part,data) VALUES (?,?,?)').bind(key,part,Buffer.from(bytes.subarray(part*chunkSize,(part+1)*chunkSize)).toString('base64')));
 await env.DB.batch(statements);
}
export async function getMedia(key:string){
 const headers=new Headers({'X-Content-Type-Options':'nosniff','Cache-Control':'public,max-age=31536000,immutable'});
 if(env.MEDIA_STORAGE!=='d1'){const object=await env.BUCKET.get(key);if(!object)return null;object.writeHttpMetadata(headers);headers.set('ETag',object.httpEtag);return new Response(object.body,{headers})}
 const file=await env.DB.prepare('SELECT type,size,chunks FROM media_files WHERE id=?').bind(key).first<{type:string;size:number;chunks:number}>();if(!file)return null;
 headers.set('Content-Type',file.type);headers.set('Content-Length',String(file.size));headers.set('ETag','"'+key+'"');
 let part=0;const stream=new ReadableStream({async pull(controller){try{if(part>=file.chunks){controller.close();return}const chunk=await env.DB.prepare('SELECT data FROM media_chunks WHERE file_id=? AND part=?').bind(key,part++).first<{data:string}>();if(!chunk)throw Error('Missing media chunk');controller.enqueue(new Uint8Array(Buffer.from(chunk.data,'base64')))}catch(e){controller.error(e)}}});return new Response(stream,{headers});
}
