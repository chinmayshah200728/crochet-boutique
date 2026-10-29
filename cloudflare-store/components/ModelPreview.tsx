'use client';
import {useEffect,useRef} from 'react';
import {ModelPart,PartColours} from '../lib/model-parts';
export default function ModelPreview({url,colour,title,partColours={},onParts,onSelect}:{url:string;colour:string;title:string;partColours?:PartColours;onParts?:(parts:ModelPart[])=>void;onSelect?:(id:string)=>void}){
 const frame=useRef<HTMLIFrameElement>(null),latest=useRef({url,colour,partColours}),callbacks=useRef({onParts,onSelect});latest.current={url,colour,partColours};callbacks.current={onParts,onSelect};
 const load=()=>frame.current?.contentWindow?.postMessage({type:'load',...latest.current},location.origin);
 useEffect(()=>{const ready=(e:MessageEvent)=>{if(e.origin!==location.origin||e.source!==frame.current?.contentWindow)return;if(e.data?.type==='viewer-ready')load();if(e.data?.type==='model-parts')callbacks.current.onParts?.(e.data.parts);if(e.data?.type==='select-part')callbacks.current.onSelect?.(e.data.id)};window.addEventListener('message',ready);return()=>window.removeEventListener('message',ready)},[]);
 useEffect(()=>{frame.current?.contentWindow?.postMessage({type:'colour',colour,partColours},location.origin)},[colour,partColours]);
 useEffect(load,[url]);
 return <iframe ref={frame} title={title} src="/model-viewer.html?v=rose-20261029" onLoad={load}/>;
}

