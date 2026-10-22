export default function ProductImage({src,alt='',className='',loading}:{src:string;alt?:string;className?:string;loading?:'lazy'|'eager'}){
 const crop=src.match(/^\/art\/collection-sheet\.png#([0-3])$/);
 if(!crop)return <img src={src} alt={alt} className={className} loading={loading} decoding="async"/>;
 const n=Number(crop[1]);return <img src={'/art/sample-'+n+'.webp'} width="800" height="800" alt={alt} className={className} loading={loading} decoding="async"/>;
}
