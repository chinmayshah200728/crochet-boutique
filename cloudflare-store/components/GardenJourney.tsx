'use client';
import {useEffect,useState} from 'react';
import LivingGarden from './LivingGarden';

export default function GardenJourney(){
 const [open,setOpen]=useState(false);
 useEffect(()=>{
  const timer=setTimeout(()=>setOpen(true),matchMedia('(prefers-reduced-motion: reduce)').matches?600:3200);
  return()=>clearTimeout(timer);
 },[]);
 return <section className={'garden-journey branded-garden'+(open?' garden-revealed':'')} id="home">
  <div className="restored-world journey-sticky">
   <LivingGarden/>
   <div className="garden-welcome">
    <span className="eyebrow">A LITTLE WORLD, HANDMADE</span>
    <h1>Small stitches.<br/><em>Extraordinary feelings.</em></h1>
    <p>Find a little wonder. Take a little love home.</p>
   </div>
   <div className={'grand-landing-curtains'+(open?' open':'')} aria-hidden={open}>
    <div className="grand-drape grand-drape-left"/><div className="grand-drape grand-drape-right"/>
    <div className="curtain-brand">
     <span className="eyebrow">WELCOME TO</span>
     <div className="curtain-wordmark">crochetbyprisha</div>
     <p>Some things are made by hand.<br/><em>The best things are made with heart.</em></p>
     <span className="curtain-flourish" aria-hidden="true">✧</span>
    </div>
   </div>
  </div>
 </section>;
}
