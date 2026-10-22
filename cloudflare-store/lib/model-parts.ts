export type ModelPart={id:string;label:string;colour:string};
export type PartColours=Record<string,string>;
export const partLabel=(id:string)=>id.replace(/^part_/,'').replaceAll('_',' ').replace(/^./,c=>c.toUpperCase());
export const validPartColours=(value:unknown):value is PartColours=>!!value&&typeof value==='object'&&!Array.isArray(value)&&Object.keys(value).length<=64&&Object.entries(value).every(([k,v])=>/^[a-zA-Z0-9_-]{1,80}$/.test(k)&&typeof v==='string'&&/^#[a-fA-F0-9]{6}$/.test(v));
