import * as THREE from 'three';
// Cupped, overlapping petals with raised yarn stitches instead of flat ovals.
export function refineRose(root){
 const old=[];let material;
 root.traverse(o=>{if(o.isMesh&&/rose_petals/.test(o.material.name)){material=o.material;old.push(o)}});
 if(!material)return;
 old.forEach(o=>o.removeFromParent());
 material.roughness=1;
 const group=new THREE.Group();root.add(group);
 const stitchGeometry=new THREE.TorusGeometry(.012,.004,4,8,Math.PI*1.65);
 for(let ring=0;ring<4;ring++){
  const count=ring===0?3:5+ring;
  for(let petal=0;petal<count;petal++){
   const angle=petal*Math.PI*2/count+ring*.61;
   const width=.105+ring*.055,height=.16+ring*.065,radius=.035+ring*.086;
   const point=(u,v)=>new THREE.Vector3(width*u*Math.sin(Math.PI*(.12+.78*v)),radius+height*v,.22-ring*.045+.12*(1-u*u)-.15*v*v);
   const positions=[],uv=[],indices=[],n=16;
   for(let y=0;y<=n;y++)for(let x=0;x<=n;x++){const u=x/n*2-1,v=y/n,p=point(u,v);positions.push(p.x,p.y,p.z);uv.push(x/n,y/n)}
   for(let y=0;y<n;y++)for(let x=0;x<n;x++){const a=y*(n+1)+x;indices.push(a,a+1,a+n+1,a+1,a+n+2,a+n+1)}
   const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geo.setIndex(indices);geo.computeVertexNormals();
   const layer=new THREE.Group();layer.rotation.z=angle;layer.position.y=.02;group.add(layer);layer.add(new THREE.Mesh(geo,material));
   const stitches=new THREE.InstancedMesh(stitchGeometry,material,48),dummy=new THREE.Object3D();let index=0;
   for(let row=0;row<8;row++)for(let col=0;col<6;col++){const p=point((col+.5)/6*1.7-.85,(row+.5)/8);dummy.position.copy(p);dummy.position.z+=.006;dummy.rotation.set(0,0,Math.PI/2);dummy.updateMatrix();stitches.setMatrixAt(index++,dummy.matrix)}
   layer.add(stitches);
  }
 }
}
