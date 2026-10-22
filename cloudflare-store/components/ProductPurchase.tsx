'use client';
import {useState} from 'react';
import {ProductView} from './Storefront';
import {Product,Settings,CartItem} from '../lib/store';
import {validPartColours} from '../lib/model-parts';
export default function ProductPurchase({product,settings}:{product:Product;settings:Settings}){
 const [error,setError]=useState('');
 function save(item:CartItem,buy=false){try{let bag:CartItem[]=[];try{const parsed=JSON.parse(localStorage.getItem('prisha-bag')||'[]');if(Array.isArray(parsed))bag=parsed.filter(i=>typeof i.productId==='string'&&Number.isInteger(i.quantity)&&i.quantity>0&&i.quantity<=10&&/^#[0-9a-fA-F]{6}$/.test(i.colour)&&typeof i.note==='string'&&(!i.partColours||validPartColours(i.partColours)))}catch{}localStorage.setItem('prisha-bag',JSON.stringify([...bag,item]));location.assign('/?bag=1'+(buy?'&checkout=1':'')+'#collection')}catch{setError('Your browser could not save the bag. Enable local storage and try again.')}}
 return <><ProductView product={product} settings={settings} embedded onClose={()=>{}} onAdd={i=>save(i)} onBuyNow={i=>save(i,true)}/>{error&&<p role="alert">{error}</p>}</>
}
