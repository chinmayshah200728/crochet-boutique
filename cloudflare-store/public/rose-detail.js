import * as THREE from 'three';
export function refineRose(root){
 let material;root.traverse(o=>{if(o.isMesh&&/rose_petals/.test(o.material?.name))material=o.material});if(!material)return;root.clear();material.side=THREE.DoubleSide;material.roughness=.82;
 const green=new THREE.MeshStandardMaterial({color:'#365f2c',roughness:1,side:THREE.DoubleSide});green.name='part_leaves';const metal=new THREE.MeshStandardMaterial({color:'#c4b9a3',metalness:.85,roughness:.24});metal.name='part_clasp';
 const tube=(p,r,m)=>root.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(p),80,r,8,false),m));
 const patch=(fn,mat,nu=56,nv=32)=>{const p=[],uv=[],ix=[];for(let j=0;j<=nv;j++)for(let i=0;i<=nu;i++){p.push(...fn(i/nu,j/nv));uv.push(i/nu,j/nv)}for(let j=0;j<nv;j++)for(let i=0;i<nu;i++){let a=j*(nu+1)+i;ix.push(a,a+1,a+nu+1,a+1,a+nu+2,a+nu+1)}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(ix);g.computeVertexNormals();const mesh=new THREE.Mesh(g,mat);root.add(mesh);return mesh};
 // Petals grow from the cup, wrapping their neighbours rather than radiating as flat discs.
 const layers=[{n:3,r:.085,h:.38,w:1.3,flare:.035},{n:5,r:.16,h:.35,w:1.03,flare:.09},{n:6,r:.25,h:.29,w:.89,flare:.14},{n:7,r:.34,h:.21,w:.78,flare:.15}];
 for(let k=3;k>=0;k--){const l=layers[k];for(let i=0;i<l.n;i++){
  const a=i*Math.PI*2/l.n+k*.72;
  patch((u,v)=>{const t=u*2-1,round=Math.sqrt(Math.max(0,1-t*t)),theta=a+t*l.w*(.55+.45*v);
   const r=l.r*(.5+.5*v)+l.flare*Math.pow(v,3)*round+.015*Math.sin(Math.PI*v);
   const curl=.045*Math.pow(v,7)*round*(k/3);
   const z=-.13+l.h*Math.sin(v*Math.PI/2)*(.6+.4*round)-curl+.024*t*v+.008*Math.sin(t*8+a)*v*v;
   return [r*Math.cos(theta),r*Math.sin(theta),z];},material);
 }}
 const base=new THREE.Mesh(new THREE.SphereGeometry(.26,48,32),material);base.scale.z=.38;base.position.z=-.13;root.add(base);
 patch((u,v)=>{const a=u*Math.PI*4.8,r=.006+.066*u+.012*v;return [Math.cos(a)*r,Math.sin(a)*r,.10+.17*v-.035*u]},material,120,20);
 const core=new THREE.Mesh(new THREE.SphereGeometry(.025,24,16),material);core.position.z=.17;root.add(core);
 const leaf=(angle,x,y)=>{const m=patch((u,v)=>{const t=(u-.5)*2;return [t*Math.sin(v*Math.PI)*.10,.35*v,.035*Math.sin(v*Math.PI)*(1-t*t)]},green,24,32);m.position.set(x,y,-.15);m.rotation.z=angle};leaf(.72,-.16,.19);leaf(-1.1,.23,.02);
 const hook=[new THREE.Vector3(0,.35,-.1),new THREE.Vector3(0,.51,-.1)];for(let i=0;i<=50;i++){const a=-Math.PI/2+i/50*Math.PI*1.75;hook.push(new THREE.Vector3(.10*Math.cos(a),.61+.10*Math.sin(a),-.1))}tube(hook,.014,metal);
}
