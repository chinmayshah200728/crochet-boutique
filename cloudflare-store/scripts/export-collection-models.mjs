import fs from 'node:fs';
import * as THREE from 'three';
import {GLTFExporter} from 'three/addons/exporters/GLTFExporter.js';
class FileReader {
 readAsArrayBuffer(blob){blob.arrayBuffer().then(result=>{this.result=result;this.onload?.();this.onloadend?.()})}
 readAsDataURL(blob){blob.arrayBuffer().then(result=>{this.result='data:application/octet-stream;base64,'+Buffer.from(result).toString('base64');this.onload?.();this.onloadend?.()})}
}
globalThis.FileReader=FileReader;
const original=fs.readFileSync('public/world/tactile-models.js','utf8');
const source=`import * as T from ${JSON.stringify(import.meta.resolve('three'))};const sphere=new T.SphereGeometry(1,32,20);function yarn(colour,repeat=3){const m=new T.MeshPhysicalMaterial({color:colour,roughness:.9,sheen:.7,sheenColor:new T.Color(colour)});m.userData.repeat=repeat*.42;return m;}\n`+original.slice(original.indexOf('export function mesh'));
const {makeProduct}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
const texture=fs.readFileSync('public/art/cotton-crochet.png'),align=n=>Math.ceil(n/4)*4;
fs.mkdirSync('public/models',{recursive:true});
for(const [index,type] of ['flower','bow','scrunchie','gift'].entries()){
 const model=makeProduct(type==='gift'?'flower':type,{main:type==='scrunchie'?'#F0E4CF':'#C38A91',accent:type==='scrunchie'?'#DAC27E':type==='bow'?'#C38A91':'#7A8862'});
 model.userData.materials.main.name='yarn_main';model.userData.materials.accent.name='accent';
 if(type==='gift'){const bow=makeProduct('bow',{main:'#C38A91',accent:'#C38A91'});bow.scale.setScalar(.38);bow.position.set(1.25,-.8,.1);bow.userData.materials.main.name='yarn_main';const renamed=new Set();bow.traverse(o=>{if(o.isMesh&&!renamed.has(o.material)){renamed.add(o.material);o.material.name=o.material.name.replace(/^part_/,'part_bow_')}});model.add(bow)}
 model.traverse(o=>{if(!o.isMesh)return;o.geometry=o.geometry.clone();const uv=o.geometry.attributes.uv;if(uv&&o.material.userData.repeat){for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)*o.material.userData.repeat,uv.getY(i)*o.material.userData.repeat)}});
 const gltf=await new GLTFExporter().parseAsync(model,{binary:false});
 const data=Buffer.from(gltf.buffers[0].uri.split(',')[1],'base64'),imageOffset=align(data.length),binary=Buffer.alloc(align(imageOffset+texture.length));data.copy(binary);texture.copy(binary,imageOffset);
 gltf.bufferViews.push({buffer:0,byteOffset:imageOffset,byteLength:texture.length});gltf.images=[{bufferView:gltf.bufferViews.length-1,mimeType:'image/png'}];gltf.samplers=[{magFilter:9729,minFilter:9987,wrapS:10497,wrapT:10497}];gltf.textures=[{sampler:0,source:0}];
 for(const m of gltf.materials){if((m.pbrMetallicRoughness?.metallicFactor||0)<.5)m.pbrMetallicRoughness.baseColorTexture={index:0};delete m.extras}
 gltf.buffers=[{byteLength:binary.length}];const json=Buffer.from(JSON.stringify(gltf)),jsonData=Buffer.alloc(align(json.length),32);json.copy(jsonData);const output=Buffer.alloc(12+8+jsonData.length+8+binary.length);output.writeUInt32LE(0x46546c67,0);output.writeUInt32LE(2,4);output.writeUInt32LE(output.length,8);output.writeUInt32LE(jsonData.length,12);output.writeUInt32LE(0x4e4f534a,16);jsonData.copy(output,20);const b=20+jsonData.length;output.writeUInt32LE(binary.length,b);output.writeUInt32LE(0x004e4942,b+4);binary.copy(output,b+8);fs.writeFileSync('public/models/collection-'+index+'.glb',output);console.log(type,Math.round(output.length/1024)+' KB');
}
