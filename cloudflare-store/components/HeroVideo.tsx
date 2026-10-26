'use client';
import {useEffect,useRef,useState} from 'react';
export default function HeroVideo(){
 const ref=useRef<HTMLVideoElement>(null),[playing,setPlaying]=useState(false);
 useEffect(()=>{
  const media=matchMedia('(prefers-reduced-motion: reduce)');
  const sync=()=>{if(media.matches)ref.current?.pause();else ref.current?.play().catch(()=>{})};
  let frame=0;
  const update=()=>{
   frame=0;
   const video=ref.current,hero=video?.closest('.lavender-hero');
   if(!video||!hero)return;
   const rect=hero.getBoundingClientRect();
   const offset=media.matches?0:Math.max(0,Math.min(-rect.top,rect.height))*.18;
   video.style.setProperty('--garden-scroll',`${offset}px`);
  };
  const scroll=()=>{if(!frame)frame=requestAnimationFrame(update)};
  const change=()=>{sync();scroll()};
  sync();update();
  media.addEventListener('change',change);
  window.addEventListener('scroll',scroll,{passive:true});
  window.addEventListener('resize',scroll);
  return()=>{cancelAnimationFrame(frame);media.removeEventListener('change',change);window.removeEventListener('scroll',scroll);window.removeEventListener('resize',scroll)};
 },[]);
 return <><video ref={ref} className="crochet-hero-video" muted loop playsInline preload="metadata" poster="/art/garden.webp" aria-label="An animated crochet garden" onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)}><source src="/art/crochet-world.mp4" type="video/mp4"/></video><button className="hero-video-toggle" onClick={()=>{if(playing)ref.current?.pause();else ref.current?.play().catch(()=>{})}} aria-label={playing?'Pause crochet video':'Play crochet video'}>{playing?'Pause motion':'Play motion'}</button></>;
}
