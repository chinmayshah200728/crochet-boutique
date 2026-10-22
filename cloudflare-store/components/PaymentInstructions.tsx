'use client';
import {useEffect,useState} from 'react';
import {Settings,money} from '../lib/store';
import {Arrow} from './UI';
export default function PaymentInstructions({settings:s,amount,reference}:{settings:Settings;amount:number;reference:string}){
 const [device,setDevice]=useState('');useEffect(()=>setDevice(/Android/i.test(navigator.userAgent)?'android':/iPhone|iPad|iPod/i.test(navigator.userAgent)?'ios':''),[]);
 const query=new URLSearchParams({pa:s.upiId,pn:s.payee,am:(amount/100).toFixed(2),cu:'INR',tr:reference,tn:'Order '+reference.slice(0,8)}).toString(),upi='upi://pay?'+query;
 const googlePay=device==='android'?'intent://pay?'+query+'#Intent;scheme=upi;package=com.google.android.apps.nbu.paisa.user;end':'gpay://upi/pay?'+query;
 return <div className="payment-card"><span className="eyebrow">YOUR ORDER IS SAVED · PAYMENT PENDING</span><h3>{money(amount)}</h3>{s.qr&&<><img className="studio-payment-qr" src={s.qr} alt={'UPI QR for '+s.payee}/><a className="text-link" href={s.qr} download>Save QR to your phone</a></>}<p>{s.payee}</p>{s.upiId&&<><code>{s.upiId}</code><div className="payment-buttons">{device&&<a className="button" href={googlePay}>Open Google Pay <Arrow/></a>}<a className="button secondary" href={upi}>Pay with a UPI app <Arrow/></a></div></>}<small>Check the recipient is {s.payee}. Pay exactly {money(amount)} once. If the app does not open, scan this QR or import the saved image in Google Pay. The static QR may ask you to enter the amount.</small><small>Return to My account → Your orders to submit the UPI transaction reference. Payment remains pending until the studio matches the credit in its bank account. A screenshot or app redirect is not payment confirmation.</small>{s.email&&<a className="text-link" href={'mailto:'+s.email+'?subject='+encodeURIComponent('Payment reference for order '+reference)}>Payment help <Arrow/></a>}</div>;
}
