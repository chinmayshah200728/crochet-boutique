'use client';
import {useEffect,useRef} from 'react';
export default function HeroVideo(){
 const ref=useRef<HTMLImageElement>(null);
 useEffect(()=>{
  const media=matchMedia('(prefers-reduced-motion: reduce)');
  let frame=0;
  const update=()=>{
   frame=0;
   const image=ref.current,hero=image?.closest('.lavender-hero');
   if(!image||!hero)return;
   const rect=hero.getBoundingClientRect();
   const offset=media.matches?0:Math.max(0,Math.min(-rect.top,rect.height))*.18;
   image.style.setProperty('--garden-scroll',`${offset}px`);
  };
  const scroll=()=>{if(!frame)frame=requestAnimationFrame(update)};
  update();
  media.addEventListener('change',scroll);
  window.addEventListener('scroll',scroll,{passive:true});
  window.addEventListener('resize',scroll);
  return()=>{cancelAnimationFrame(frame);media.removeEventListener('change',scroll);window.removeEventListener('scroll',scroll);window.removeEventListener('resize',scroll)};
 },[]);
 return <img ref={ref} className="crochet-hero-video" src="/art/garden.webp" alt="A handmade crochet garden" fetchPriority="high"/>;
}
