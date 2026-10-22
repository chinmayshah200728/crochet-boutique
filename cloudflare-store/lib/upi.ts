export function parseUpiQr(text:string){
 try{const url=new URL(text);if(url.protocol!=='upi:'||url.hostname!=='pay')return null;
 const upiId=url.searchParams.get('pa')||'',payee=url.searchParams.get('pn')||'';
 if(!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/.test(upiId)||upiId.length>120)return null;
 return {upiId,payee:payee.slice(0,100)};
 }catch{return null}
}
export async function readUpiQr(file:File){
 const {default:jsQR}=await import('jsqr');const bitmap=await createImageBitmap(file);
 try{const scale=Math.min(1,1600/Math.max(bitmap.width,bitmap.height)),canvas=document.createElement('canvas');canvas.width=Math.round(bitmap.width*scale);canvas.height=Math.round(bitmap.height*scale);const ctx=canvas.getContext('2d');if(!ctx)return null;ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);const image=ctx.getImageData(0,0,canvas.width,canvas.height);const qr=jsQR(image.data,image.width,image.height);return qr?parseUpiQr(qr.data):null;
 }finally{bitmap.close()}
}
