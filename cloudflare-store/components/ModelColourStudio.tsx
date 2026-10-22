'use client';
import {useState} from 'react';
import ModelPreview from './ModelPreview';
import {PartSelector} from './PartColours';
import {ModelPart,PartColours} from '../lib/model-parts';
export default function ModelColourStudio({url,palette,value,onChange}:{url:string;palette:string[];value:PartColours;onChange:(v:PartColours)=>void}){
 const [parts,setParts]=useState<ModelPart[]>([]),[selected,setSelected]=useState('');
 const colours=value,colour=colours[selected]||parts.find(p=>p.id===selected)?.colour||'#C38A91';
 function receive(list:ModelPart[]){setParts(list);onChange(Object.fromEntries(list.map(p=>[p.id,colours[p.id]||p.colour])));setSelected(current=>list.some(p=>p.id===current)?current:list[0]?.id||'')}
 function change(c:string){if(selected)onChange({...colours,[selected]:c})}
 return <><ModelPreview url={url} colour={colour} title="Preview your product in 3D" partColours={colours} onParts={receive} onSelect={setSelected}/><PartSelector parts={parts} selected={selected} onSelect={setSelected}/><div className="colour-plate">{palette.map((c,i)=><button type="button" key={i} style={{background:c}} aria-label={'Preview '+c} aria-pressed={colour===c} onClick={()=>change(c)}/>)}</div><label className="custom-colour">Try any yarn colour <input type="color" value={colour} onChange={e=>change(e.target.value)}/></label><small>These starting colours are stored when you save the product. Customers can change each part.</small></>;
}
