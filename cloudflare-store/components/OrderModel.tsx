'use client';
import {useState} from 'react';
import ModelPreview from './ModelPreview';
import {ColourSummary} from './PartColours';
import {OrderItem} from '../lib/store';
export default function OrderModel({item}:{item:OrderItem}){
 const [open,setOpen]=useState(false);
 return <div className="order-design"><ColourSummary colours={item.partColours}/>{item.model_snapshot&&<><button type="button" className="text-link" onClick={()=>setOpen(!open)}>{open?'Hide':'View'} ordered 3D design ↗</button>{open&&<div className="ordered-model"><ModelPreview title={'Ordered 3D design: '+item.name} url={item.model_snapshot} colour={item.colour} partColours={item.partColours}/><small>The saved model and colours from this order. Drag to rotate; scroll to zoom.</small></div>}</>}</div>;
}
