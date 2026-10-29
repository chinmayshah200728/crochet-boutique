'use client';
import {useEffect,useRef,useState} from 'react';
import {Product,money} from '../lib/store';
import {productPath} from '../lib/seo';
export default function GardenJourney({products=[]}:{products?:Product[]}){
 const pieces=products.filter(p=>p.status==='active').slice(0,3);
 const ref=useRef<HTMLDivElement>(null);
 const [step,setStep]=useState(0);
 useEffect(()=>{
  let frame=0;
  const media=matchMedia('(prefers-reduced-motion: reduce)');
  const update=()=>{frame=0;const el=ref.current;if(!el)return;const r=el.getBoundingClientRect();const travel=el.offsetHeight-window.innerHeight;const progress=travel>0?Math.max(0,Math.min(1,-r.top/travel)):0;setStep(media.matches?0:Math.min(pieces.length,Math.floor(progress*(pieces.length+1))))};
  const scroll=()=>{if(!frame)frame=requestAnimationFrame(update)};
  update();window.addEventListener('scroll',scroll,{passive:true});window.addEventListener('resize',scroll);media.addEventListener('change',scroll);
  return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',scroll);window.removeEventListener('resize',scroll);media.removeEventListener('change',scroll)};
 },[pieces.length]);
 const piece=pieces[step-1];
 return <div className={`landing-garden ${pieces.length?'has-pieces':''}`} ref={ref} id="home">
  <section className="landing-garden-stage" aria-label="Welcome to crochetbyprisha">
   <img className="landing-garden-background" src="/art/garden.webp" alt="A handmade crochet garden" fetchPriority="high"/>
   <div className="landing-garden-shade"/><div className="garden-sunlight" aria-hidden="true"/><div className="garden-sparks" aria-hidden="true">{Array.from({length:9},(_,i)=><i key={i} style={{left:`${15+i*9}%`,top:`${20+(i*17)%65}%`,animationDelay:`${-i*1.3}s`}}/>)}</div>
   <div className="landing-garden-intro" hidden={!!piece}>
    <span className="garden-pill">A little world, made by hand</span><span className="eyebrow">THE CROCHETBYPRISHA COLLECTION</span><h1>Flowers that<br/><em>never fade.</em></h1><p>Pick a bloom. Pick a colour. Give someone a little piece of joy they can keep forever.</p><a className="button" href="#collection">Find your little joy ↗</a><div className="garden-promises"><span>Made by hand</span><span>Colours chosen by you</span></div>
   </div>
   {!piece&&<div className="garden-keepsakes" aria-label="Discover handmade pieces">{pieces.slice(0,2).map((p,i)=><a className={`garden-keepsake keepsake-${i}`} key={p.id} href={productPath(p)}><img src={p.images[0]} alt={p.name}/><span>{p.name}</span><small>{money(p.price)} · Take a closer look ↗</small></a>)}<span className="garden-handnote">Little things.<br/>Big feelings.</span></div>}
   {piece&&<a key={piece.id} className="landing-feature" href={productPath(piece)}><img src={piece.images[0]||'/art/garden.webp'} alt={piece.name} width="400" height="400"/><div><span className="eyebrow">{piece.category}</span><h2>{piece.name}</h2><p>{money(piece.price)}</p><span className="button">View this piece ↗</span></div></a>}
   <div className="landing-garden-bottom"><span>Scroll to discover {step>0?`· ${step} / ${pieces.length}`:''} ↓</span><a href="#collection">Go straight to the shop ↗</a></div>
  </section>
 </div>
}
