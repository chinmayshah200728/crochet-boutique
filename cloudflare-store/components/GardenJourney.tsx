'use client';
import {useEffect,useRef,useState} from 'react';
import LivingGarden from './LivingGarden';
import {ArrowRight,Sparkles,Flower2,Palette,ShieldCheck} from 'lucide-react';

export default function GardenJourney(){
 const root=useRef<HTMLElement>(null);
 const [progress,setProgress]=useState(0);
 const [reduced,setReduced]=useState(false);

 useEffect(()=>{
  const query=matchMedia('(prefers-reduced-motion: reduce), (max-width: 600px)');
  setReduced(query.matches);
  const handler=(e:MediaQueryListEvent)=>setReduced(e.matches);
  query.addEventListener('change',handler);
  return ()=>query.removeEventListener('change',handler);
 },[]);

 useEffect(()=>{
  let frame=0;
  const update=()=>{
   frame=0;
   const el=root.current;
   if(!el)return;
   const isReduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
   const rect=el.getBoundingClientRect();
   const totalScroll=Math.max(1,el.offsetHeight-innerHeight);
   const current=-rect.top;
   const p=isReduced?0:Math.max(0,Math.min(1,current/totalScroll));
   setProgress(p);
   el.style.setProperty('--journey',String(p));
   el.querySelector('iframe')?.contentWindow?.postMessage({type:'garden-scroll',progress:p},location.origin);
  };
  const scroll=()=>{
   if(!frame)frame=requestAnimationFrame(update);
  };
  addEventListener('scroll',scroll,{passive:true});
  addEventListener('resize',scroll);
  update();
  return ()=>{
   removeEventListener('scroll',scroll);
   removeEventListener('resize',scroll);
   cancelAnimationFrame(frame);
  };
 },[]);

 return (
  <section ref={root} className={'garden-journey '+(reduced?'is-static-journey':'')} id="home">
   <div className="restored-world journey-sticky">
    <LivingGarden/>

    {/* Moment 1 — Enter the Garden */}
    <div
     className="garden-editorial journey-phase journey-phase-1"
     style={{
      opacity: reduced ? 1 : Math.max(0, 1 - progress * 2.8),
      transform: reduced ? 'none' : `translateY(${progress * -40}px)`,
      pointerEvents: progress < 0.28 || reduced ? 'auto' : 'none'
     }}
    >
     <div className="hero-featured-pill">
      <Sparkles size={13}/>
      <span>FEATURED · THE FOREVER TULIP BOUQUET</span>
     </div>
     <span className="eyebrow">CROCHET BY PRISHA · HANDMADE IN INDIA</span>
     <h1>A little world.<br/><em>A lot of heart.</em></h1>
     <p>Flowers that stay. Keepsakes with meaning.<br/>Handmade crochet, in colours that feel like you.</p>
     <div className="hero-actions">
      <a className="button hero-shop" href="#collection">Shop the collection ↗</a>
      <a className="button secondary hero-custom" href="#colour-studio">Customise a piece</a>
     </div>
     <p className="hero-trust">
      <ShieldCheck size={14}/>
      <span>Handmade in India · Custom colours · Thoughtfully packed</span>
     </p>
     {!reduced && (
      <div className="scroll-indicator" aria-hidden="true">
       <span className="scroll-arrow">↓</span>
       <span>Scroll to explore the garden</span>
      </div>
     )}
    </div>

    {/* Moment 2 — Craft Becomes Product */}
    {!reduced && (
     <div
      className="journey-phase journey-phase-2"
      style={{
       opacity: progress >= 0.28 && progress <= 0.68
        ? Math.min(1, (progress - 0.28) * 4.5) * Math.min(1, (0.68 - progress) * 4.5)
        : 0,
       transform: `translateY(${(0.48 - progress) * 35}px)`,
       pointerEvents: progress >= 0.32 && progress <= 0.64 ? 'auto' : 'none'
      }}
     >
      <div className="phase-card">
       <div className="phase-badge">
        <Flower2 size={13}/>
        <span>02 / CRAFT BECOMES PRODUCT</span>
       </div>
       <h2>From a single thread,<br/><em>to a keepsake with soul.</em></h2>
       <p>Soft combed milk cotton yarn, guided by hand petal-by-petal into everlasting bouquets, heirloom bow charms, and everyday happiness.</p>
       <div className="yarn-progress-track">
        <div
         className="yarn-progress-bar"
         style={{width: `${Math.max(0, Math.min(100, (progress - 0.28) / 0.4 * 100))}%`}}
        />
       </div>
      </div>
     </div>
    )}

    {/* Moment 3 — Choose Your Colour */}
    {!reduced && (
     <div
      className="journey-phase journey-phase-3"
      style={{
       opacity: progress >= 0.64
        ? Math.min(1, (progress - 0.64) * 4)
        : 0,
       transform: `translateY(${(0.85 - progress) * 25}px)`,
       pointerEvents: progress >= 0.68 ? 'auto' : 'none'
      }}
     >
      <div className="phase-card">
       <div className="phase-badge">
        <Palette size={13}/>
        <span>03 / CHOOSE YOUR COLOUR</span>
       </div>
       <h2>Your colour story.<br/><em>Woven to order.</em></h2>
       <p>Select individual parts in 3D to explore custom colour pairings before our needles even begin. Every shade made personal.</p>
       <a className="button hero-shop phase-cta" href="#collection">
        Explore the collection <ArrowRight size={15}/>
       </a>
      </div>
     </div>
    )}

    <a className="skip-journey" href="#collection">Skip animation · Shop ↗</a>
    <span className="garden-caption">A WORLD WOVEN WITH CARE · CROCHETBYPRISHA</span>
   </div>
  </section>
 );
}
