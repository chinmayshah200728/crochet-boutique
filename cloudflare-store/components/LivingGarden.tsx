'use client';
import {useEffect,useRef,useState} from 'react';
export default function LivingGarden(){
 const [enabled,setEnabled]=useState(false);const ref=useRef<HTMLIFrameElement>(null);
 useEffect(()=>{setEnabled(!matchMedia('(max-width: 760px), (prefers-reduced-motion: reduce)').matches)},[]);
 useEffect(()=>{const frame=ref.current;if(!frame)return;const observer=new IntersectionObserver(entries=>frame.contentWindow?.postMessage({type:'garden-visibility',visible:entries[0].isIntersecting},location.origin),{rootMargin:'100px'});observer.observe(frame);return()=>observer.disconnect()},[enabled]);
 return <><button className="garden-quality" onClick={()=>setEnabled(v=>!v)} aria-pressed={enabled}>{enabled?'Still garden · save data':'Explore the live garden'}</button>{enabled?<iframe ref={ref} title="Explore the living 3D crochet garden" src="/world/index.html?embedded=1"/>:<img className="garden-still" src="/art/garden.webp" width="1536" height="1024" fetchPriority="high" alt="Illustrative crochet garden"/>}</>
}
