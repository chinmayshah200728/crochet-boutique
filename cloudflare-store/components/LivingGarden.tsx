'use client';
import {useEffect,useRef} from 'react';

export default function LivingGarden(){
 const ref=useRef<HTMLIFrameElement>(null);
 useEffect(()=>{
  const frame=ref.current;
  if(!frame)return;
  const observer=new IntersectionObserver(
   entries=>frame.contentWindow?.postMessage({type:'garden-visibility',visible:entries[0].isIntersecting},location.origin),
   {rootMargin:'100px'}
  );
  observer.observe(frame);
  return()=>observer.disconnect();
 },[]);

 return <iframe ref={ref} title="Living 3D crochet garden" src="/world/index.html?embedded=1"/>;
}
