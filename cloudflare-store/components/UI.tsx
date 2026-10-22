'use client';
import {useEffect,useRef,ReactNode} from 'react';
import {X,ArrowUpRight,Flower2} from 'lucide-react';
export function Brand(){return <a className="wordmark" href="/">crochetbyprisha<span>A LITTLE WORLD, HANDMADE</span></a>}
export function Modal({title,children,onClose,wide=false}:{title:string;children:ReactNode;onClose:()=>void;wide?:boolean}){
 const ref=useRef<HTMLDialogElement>(null);useEffect(()=>{const previous=document.activeElement as HTMLElement;ref.current?.showModal();const overflow=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{document.body.style.overflow=overflow;previous?.focus();}},[]);
 return <dialog ref={ref} className={'modal '+(wide?'wide':'')} onCancel={onClose} onClick={e=>{if(e.target===e.currentTarget)onClose()}}><div className="modal-inner"><header className="modal-top"><span className="eyebrow">{title}</span><button className="icon-button" onClick={onClose} aria-label="Close"><X size={20}/></button></header>{children}</div></dialog>;
}
export function Empty({title,body,children}:{title:string;body:string;children?:ReactNode}){return <div className="empty"><Flower2 size={34} strokeWidth={1}/><h3>{title}</h3><p>{body}</p>{children}</div>}
export function Arrow(){return <ArrowUpRight size={17}/>}
export function Field({label,children,hint}:{label:string;children:ReactNode;hint?:string}){return <label className="field"><span>{label}</span>{children}{hint&&<small>{hint}</small>}</label>}
export function Alert({children}:{children:ReactNode}){return children?<div className="alert" role="alert">{children}</div>:null}
