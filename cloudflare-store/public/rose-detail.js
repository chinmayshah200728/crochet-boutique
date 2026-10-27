import * as THREE from 'three';
// A continuous curled ribbon forms the tight centre; cupped petals wrap around it.
export function refineRose(root){
 const old=[];let material;
 root.traverse(o=>{if(o.isMesh&&/rose_petals/.test(o.material.name)){material=o.material;old.push(o)}});
 if(!material)return;old.forEach(o=>o.removeFromParent());material.roughness=1;
 const bloom=new THREE.Group();bloom.position.y=.02;root.add(bloom);
 const surface=(point,nu,nv)=>{const p=[],uv=[],ix=[];for(let v=0;v<=nv;v++)for(let u=0;u<=nu;u++){const q=point(u/nu,v/nv);p.push(q.x,q.y,q.z);uv.push(u/nu,v/nv)}for(let v=0;v<nv;v++)for(let u=0;u<nu;u++){const a=v*(nu+1)+u;ix.push(a,a+1,a+nu+1,a+1,a+nu+2,a+nu+1)}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(ix);g.computeVertexNormals();return new THREE.Mesh(g,material)};
 const centre=(u,v)=>{const a=u*Math.PI*5.5,r=.018+.15*u+.025*v;return new THREE.Vector3(Math.cos(a)*r,Math.sin(a)*r,.12+v*(.24-.07*u))};bloom.add(surface(centre,128,12));
 const base=new THREE.Mesh(new THREE.SphereGeometry(.34,40,24),material);base.scale.z=.42;base.position.z=-.07;bloom.add(base);
 for(let row=0;row<3;row++){
  const count=5+row,rad=.16+row*.09;
  for(let i=0;i<count;i++){
   const angle=i*Math.PI*2/count+row*.57;
   const point=(u,v)=>{const t=(u-.5)*1.65;const r=rad+v*(.025+.06*row)+.035*Math.sin(v*Math.PI);const z=-.10+v*(.39-.055*row)-.055*Math.pow(2*u-1,2)*v;return new THREE.Vector3(Math.sin(angle+t)*r,Math.cos(angle+t)*r,z)};
   bloom.add(surface(point,28,20));
   const edge=[];for(let j=0;j<=36;j++)edge.push(point(j/36,1));bloom.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(edge),36,.009,6,false),material));
   const stitchGeo=new THREE.TorusGeometry(.009,.003,4,8,Math.PI*1.7),stitches=new THREE.InstancedMesh(stitchGeo,material,80),dummy=new THREE.Object3D();let k=0;
   for(let y=0;y<8;y++)for(let x=0;x<10;x++){const u=(x+.5)/10,v=(y+.5)/8,q=point(u,v);const normal=new THREE.Vector3(q.x,q.y,.22).normalize();dummy.position.copy(q).addScaledVector(normal,.004);dummy.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),normal);dummy.updateMatrix();stitches.setMatrixAt(k++,dummy.matrix)}bloom.add(stitches);
  }
 }
}
