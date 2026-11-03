// Disabled until a verified sender and secret API key are supplied in Cloudflare.
export type EmailConfig={EMAIL_ENABLED?:string;RESEND_API_KEY?:string;EMAIL_FROM?:string};
export function emailReady(env:EmailConfig){return env.EMAIL_ENABLED==='true'&&!!env.RESEND_API_KEY&&!!env.EMAIL_FROM;}
export async function sendTransactionalEmail(env:EmailConfig,to:string,subject:string,text:string){if(!emailReady(env))return {sent:false,reason:'not_configured'};const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+env.RESEND_API_KEY,'Content-Type':'application/json'},body:JSON.stringify({from:env.EMAIL_FROM,to:[to],subject,text}),signal:AbortSignal.timeout(10000)});if(!response.ok)throw Error('Email delivery unavailable');return {sent:true};}
