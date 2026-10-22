import {getChatGPTUser} from '../app/chatgpt-auth';
import {env} from 'cloudflare:workers';
import {studioIdentity} from './studio-auth';
// The owner address was confirmed by the Sites access configuration.
export async function owner(){
 if(env.AUTH_MODE==='password')return !!(await studioIdentity());
 const user=await getChatGPTUser();if(!user)return false;
 if(import.meta.env.DEV&&user.userId==='local_seedy'&&user.email==='seedy@sites.test')return true;
 const saved=await env.DB.prepare('SELECT value FROM settings WHERE id=?').bind('owner').first<{value:string}>();
 if(saved)return saved.value===user.userId;
 if(user.email.toLowerCase()!=='chinmayshah200728@gmail.com')return false;
 await env.DB.prepare('INSERT INTO settings(id,value) VALUES (?,?) ON CONFLICT(id) DO NOTHING').bind('owner',user.userId).run();
 const bound=await env.DB.prepare('SELECT value FROM settings WHERE id=?').bind('owner').first<{value:string}>();
 return bound?.value===user.userId;
}
