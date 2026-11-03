import {createHmac,timingSafeEqual,randomBytes} from 'node:crypto';
const alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
export function base32(bytes:Uint8Array){let bits=0,value=0,out='';for(const byte of bytes){value=(value<<8)|byte;bits+=8;while(bits>=5){out+=alphabet[(value>>>(bits-5))&31];bits-=5;}}if(bits)out+=alphabet[(value<<(5-bits))&31];return out;}
function decode(secret:string){let bits=0,value=0;const out=[];for(const c of secret){const n=alphabet.indexOf(c);if(n<0)throw Error('Invalid secret');value=(value<<5)|n;bits+=5;if(bits>=8){out.push((value>>>(bits-8))&255);bits-=8;}}return Buffer.from(out);}
export function newTotpSecret(){return base32(randomBytes(20));}
export function totp(secret:string,counter:number,digits=6){const b=Buffer.alloc(8);b.writeBigUInt64BE(BigInt(counter));const h=createHmac('sha1',decode(secret)).update(b).digest(),o=h[h.length-1]&15;return String((h.readUInt32BE(o)&0x7fffffff)%10**digits).padStart(digits,'0');}
export function matchTotp(secret:string,code:string,now=Date.now(),last=-1){if(!/^\d{6}$/.test(code))return -1;const t=Math.floor(now/30000);for(const n of [t,t-1,t+1])if(n>last&&timingSafeEqual(Buffer.from(totp(secret,n)),Buffer.from(code)))return n;return -1;}
