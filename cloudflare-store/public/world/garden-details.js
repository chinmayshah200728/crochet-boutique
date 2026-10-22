import * as T from 'three';
import {yarn,mesh,oval,tube} from './tactile-models.js';
export function gardenDetails({scene,staticRoot,m,group,rod,flower,height,riverX,rnd}){
 // Each meadow patch has several heights: low moss, leaves and taller blooms.
 const moss=yarn('#829075',5),lavender=yarn('#9e8fa5',3),bloom=yarn('#cf9c9f',3),cream=yarn('#eee1c7',3);
 const leafGeometry=new T.SphereGeometry(1,12,8);
 for(let i=0;i<220;i++){
  const x=-14+rnd()*29,z=-19+rnd()*32;if(Math.abs(x-riverX(z))<2.9||Math.abs(x+3.8)<1.3||(x>4&&x<8&&z<-4&&z>-10))continue;
  const y=height(x,z),s=.25+rnd()*.4;
  for(let j=0;j<4;j++){const a=j*2.4;mesh(staticRoot,leafGeometry,i%3?moss:m.sage,[x+Math.cos(a)*s*.4,y+.13,z+Math.sin(a)*s*.4],[s*.65,s*.36,s*.6],[.2,a,.15]);}
  if(i%3===0){for(let j=0;j<3;j++){const a=j*2.4,h=.65+rnd()*.25;rod(staticRoot,[x,y,z],[x+Math.cos(a)*.14,y+h,z+Math.sin(a)*.14],.012,m.dark);for(let k=0;k<5;k++)oval(staticRoot,lavender,[x+Math.cos(a)*.14,y+h-k*.055,z+Math.sin(a)*.14],[.045,.07,.05]);}}
 }
 // Foreground flowers make their curled, stitched petals readable at eye level.
 for(let i=0;i<13;i++){const x=i<7?-8.8+i*.46:7.5+(i-7)*.44,z=7+(i%3)*.58;flower(staticRoot,[x,height(x,z),z],.9+(i%3)*.2,i%3?bloom:cream,i%2?'tulip':'daisy');}
 // Roses climbing the cottage, rather than flowers floating in front of it.
 for(let side of [-1,1]){const x=6+side*1.7;const vine=[];for(let i=0;i<15;i++)vine.push([x+Math.sin(i*.6)*.15,.5+i*.22,-5.3]);tube(staticRoot,vine,.045,m.dark,32);for(let i=0;i<12;i++){const y=.8+i*.21;oval(staticRoot,moss,[x+(i%2?-.18:.18),y,-5.25],[.16,.085,.045],[0,0,i%2?.5:-.5]);if(i%2===0)flower(staticRoot,[x,y-.34,-5.1],.46,bloom,'rose');}}
 const clouds=[];for(let i=0;i<3;i++){const g=group(scene,[-18+i*17,11+i*.8,-32-i*5]);for(let j=0;j<5;j++)oval(g,cream,[(j-2)*.8,Math.sin(j*.8)*.25,0],[.95,.36+(j%2)*.12,.42]);clouds.push({g,x:g.position.x,phase:i*2});}
 const butterflies=[];for(let i=0;i<4;i++){const g=group(scene),wings=[];oval(g,m.bark,[0,0,0],[.025,.12,.025]);for(const side of [-1,1]){const w=group(g);oval(w,i%2?lavender:bloom,[side*.12,.07,0],[.14,.16,.025],[0,0,-side*.3]);oval(w,cream,[side*.09,-.1,0],[.1,.12,.02],[0,0,side*.35]);wings.push(w)}butterflies.push({g,wings,phase:i*1.7});}
 return {animate(t){clouds.forEach(({g,x,phase})=>g.position.x=x+Math.sin(t*.015+phase)*2);butterflies.forEach(({g,wings,phase},i)=>{const a=t*.24+phase;g.position.set(-5+i*3+Math.sin(a)*.7,1.8+Math.sin(a*1.8)*.35,2+Math.cos(a)*2);g.rotation.y=-a;g.rotation.z=Math.sin(a)*.15;wings.forEach((w,j)=>w.rotation.y=(j?1:-1)*(.35+Math.sin(t*8+phase)*.65))})}};
}
