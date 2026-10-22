import {partLabel,PartColours as Colours,ModelPart} from '../lib/model-parts';
export function PartSelector({parts,selected,onSelect}:{parts:ModelPart[];selected:string;onSelect:(id:string)=>void}){
 return parts.length?<label className="field part-selector"><span>Choose a part to colour</span><select aria-label="Choose a part to colour" value={selected} onChange={e=>onSelect(e.target.value)}>{parts.map(p=><option value={p.id} key={p.id}>{p.label}</option>)}</select><small>Choose here, or tap a part of the 3D model.</small></label>:null;
}
export function ColourSummary({colours}:{colours?:Colours}){return colours&&Object.keys(colours).length?<div className="part-summary" aria-label="Your part colours">{Object.entries(colours).map(([id,c])=><span key={id}><i style={{background:c}}/>{partLabel(id)}: {c.toUpperCase()}</span>)}</div>:null;}
