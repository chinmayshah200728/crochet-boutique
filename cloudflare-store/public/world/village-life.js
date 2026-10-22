import * as T from 'three';
import {yarn,mesh,oval,tube} from './tactile-models.js';
export function villageLife({scene,m,group,rod,height}){
 const skin=yarn('#b89777',2),apron=yarn('#718794',5),shirt=yarn('#d9ccaf',3),boots=yarn('#655344',2);
 const gardener=group(scene,[4.8,height(4.8,1),1]);gardener.rotation.y=-.65;
 oval(gardener,apron,[0,.7,0],[.2,.35,.14]);oval(gardener,skin,[0,1.22,0],[.14,.19,.13]);oval(gardener,m.bark,[0,1.34,-.02],[.15,.09,.13]);oval(gardener,m.cream,[0,1.38,0],[.24,.035,.21]);oval(gardener,m.cream,[0,1.45,0],[.13,.09,.12]);
 for(const side of [-1,1]){tube(gardener,[[side*.11,.5,0],[side*.13,.15,.02]],.075,shirt);oval(gardener,boots,[side*.13,.07,.09],[.09,.07,.16]);}
 const arm=group(gardener,[.18,.9,0]);tube(arm,[[0,0,0],[.2,-.2,.08],[.31,-.22,.18]],.06,shirt);oval(arm,skin,[.32,-.22,.18],[.06,.06,.07]);tube(gardener,[[-.18,.9,0],[-.23,.6,.05]],.06,shirt);
 const can=group(arm,[.42,-.32,.23]);oval(can,m.sage,[0,0,0],[.17,.2,.13]);tube(can,[[.1,-.03,0],[.24,.05,0],[.38,.08,0]],.035,m.sage);tube(can,[[-.1,.05,0],[-.24,.17,0],[-.12,.29,0],[.05,.2,0]],.025,m.sage);

 // Hand-finished details: embroidered face, hat band, pinafore and stitched pockets.
 const eye=new T.MeshPhysicalMaterial({color:'#211c18',roughness:.22,clearcoat:1});
 for(const side of [-1,1]){
  oval(gardener,eye,[side*.055,1.25,.122],[.018,.022,.012]);
  oval(gardener,m.rose,[side*.085,1.195,.12],[.025,.013,.008]);
  tube(gardener,[[side*.12,1.01,.10],[side*.12,.85,.145],[side*.12,.68,.145]],.023,apron);
  oval(gardener,m.gold,[side*.12,.85,.17],[.025,.025,.012]);
 }
 tube(gardener,[[-.04,1.17,.126],[0,1.15,.14],[.04,1.17,.126]],.006,m.bark,12);
 tube(gardener,[[-.07,.68,.15],[-.07,.57,.16],[.07,.57,.16],[.07,.68,.15]],.009,m.ivory,16);
 const hatBand=[];for(let i=0;i<=40;i++){const a=i/40*Math.PI*2;hatBand.push([Math.sin(a)*.132,1.43,Math.cos(a)*.123]);}tube(gardener,hatBand,.016,m.bark,40);
 for(let i=0;i<7;i++){const a=i*Math.PI/6; tube(gardener,[[Math.cos(a)*.13,1.32,.02],[Math.cos(a)*.15,1.23,.015],[Math.cos(a)*.17,1.15,.025]],.019,m.bark,10);}
 const drops=[];const dropMat=new T.MeshBasicMaterial({color:'#d9ece2',transparent:true,opacity:.7});for(let i=0;i<16;i++){const d=mesh(can,new T.SphereGeometry(.012,6,4),dropMat);drops.push(d)}
 // Yarn smoke curls from the chimney instead of blinking or moving the cottage.
 const smoke=[];for(let i=0;i<7;i++){const mat=new T.MeshBasicMaterial({color:'#ddd6c7',transparent:true,opacity:.12,depthWrite:false});const puff=mesh(scene,new T.SphereGeometry(1,10,8),mat);smoke.push(puff)}
 const line=group(scene,[-8.7,height(-8.7,-2),-2]);for(const x of [0,2.4])rod(line,[x,0,0],[x,1.9,0],.045,m.wood);tube(line,[[0,1.8,0],[1.2,1.64,0],[2.4,1.8,0]],.012,m.ivory);
 const cloth=[];for(let i=0;i<3;i++){const g=group(line,[.4+i*.75,1.7,0]),geo=new T.PlaneGeometry(.46,.65,8,10);geo.translate(0,-.325,0);const mat=yarn(['#c49597','#dad0b6','#8b9b86'][i],2);mat.side=T.DoubleSide;const fabric=mesh(g,geo,mat);cloth.push({g,fabric,base:new Float32Array(geo.attributes.position.array),phase:i});}
 return {animate(t){const tilt=.13+Math.sin(t*.7)*.09;gardener.rotation.x=Math.sin(t*.7)*.025;arm.rotation.z=-tilt;can.rotation.z=-.2-tilt;drops.forEach((d,i)=>{const p=(t*.8+i/16)%1;d.position.set(.38+p*.15,.08-p*.75,(i%3-1)*.025);d.visible=Math.sin(t*.7)>-.5});smoke.forEach((p,i)=>{const a=(t*.12+i/7)%1;p.position.set(5.1+Math.sin(a*4+t*.1)*a*.6,5.9+a*2,-7.4+a*.5);p.scale.setScalar(.12+a*.32);p.material.opacity=(1-a)*.12});cloth.forEach(({g,fabric,base,phase})=>{g.rotation.x=Math.sin(t*.85+phase*.2)*.12;const pos=fabric.geometry.attributes.position;for(let i=0;i<pos.count;i++){const y=base[i*3+1];pos.setZ(i,Math.sin(t*1.6+base[i*3]*5+phase)*(-y)*.12)}pos.needsUpdate=true;fabric.geometry.computeVertexNormals()})}};
}
