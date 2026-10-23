import * as T from 'three';
import {mesh,oval,tube,yarn} from './tactile-models.js';
export function crochetVillage({staticRoot,m,group,rod,flower,height,riverX,rnd}){
 const box=new T.BoxGeometry(1,1,1),roof=yarn('#a65e45',5),wall=yarn('#e8d6b3',5),soil=yarn('#65513b',7);
 const glass=new T.MeshStandardMaterial({color:'#edbd74',emissive:'#e9a95c',emissiveIntensity:.35,roughness:.5});
 function house(x,z,s,turn){const g=group(staticRoot,[x,height(x,z),z]);g.scale.setScalar(s);g.rotation.y=turn;
  mesh(g,box,wall,[0,1,0],[2.5,2,2]);
  for(const side of [-1,1]){mesh(g,box,roof,[side*.68,2.3,0],[1.85,.16,2.5],[0,0,-side*.6]);for(let row=0;row<8;row++)for(let col=0;col<12;col++)oval(g,roof,[side*(.05+row*.19),2.82-row*.13,(col-5.5)*.21],[.13,.055,.14],[0,0,-side*.6]);}
  mesh(g,box,m.bark,[0,.65,1.02],[.54,1.3,.06]);
  for(const side of [-1,1]){mesh(g,box,m.wood,[side*.8,1.2,1.03],[.57,.7,.08]);mesh(g,box,glass,[side*.8,1.2,1.08],[.43,.55,.03]);rod(g,[side*.8,.9,1.12],[side*.8,1.5,1.12],.025,m.ivory);rod(g,[side*.8-.22,1.2,1.12],[side*.8+.22,1.2,1.12],.025,m.ivory);mesh(g,box,m.wood,[side*.8,.78,1.17],[.7,.14,.24]);for(let j=0;j<4;j++)flower(g,[side*.8+(j-1.5)*.14,.85,1.2],.23,j%2?m.pink:m.gold,'daisy');}
  mesh(g,box,m.cream,[.7,2.65,-.4],[.3,1.2,.3]);
 }
 for(const [x,z,s,r] of [[-9,-11,.8,.2],[-12,-17,.65,.3],[-6,-21,.65,-.1],[9,-19,.75,-.25],[13,-26,.65,-.4],[-15,-27,.6,.4]])house(x,z,s,r);
 // Planted vegetable beds: stitched soil ridges, cabbages and carrots.
 for(let bed=0;bed<5;bed++){const x=-10+bed*1.6,z=-3;mesh(staticRoot,box,soil,[x,height(x,z)+.04,z],[1.3,.12,3.5]);for(let row=0;row<7;row++){const zz=z-1.4+row*.45,y=height(x,zz)+.15;for(let leaf=0;leaf<7;leaf++){const a=leaf*2.4;oval(staticRoot,leaf%2?m.sage:m.moss,[x+Math.sin(a)*.12,y+.12,zz+Math.cos(a)*.12],[.15,.1,.13],[.3,a,.2]);}if(bed%2)oval(staticRoot,m.clay,[x+.4,y,zz],[.06,.13,.06]);}}
 // Evergreen silhouettes built from layered needles, rather than stacked spheres.
 for(let i=0;i<32;i++){const x=-24+i*1.5,z=-25-rnd()*8;if(Math.abs(x-riverX(z))<3)continue;const g=group(staticRoot,[x,height(x,z),z]),h=2+rnd()*2;rod(g,[0,0,0],[0,h,0],.065,m.bark);for(let tier=0;tier<7;tier++){const y=.5+tier*h/8,r=(1-tier/8)*.65;mesh(g,new T.ConeGeometry(r,.8,9,1),tier%2?m.dark:m.moss,[0,y,0]);}}
}
