export const normaliseReference=(value:string)=>value.trim().toUpperCase().replace(/[\s-]/g,'');
export const validReference=(value:string)=>/^[A-Z0-9]{8,64}$/.test(value);
