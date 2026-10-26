import HeroVideo from './HeroVideo';
import {Product,money} from '../lib/store';
import {productPath} from '../lib/seo';
export default function GardenJourney({products=[]}:{products?:Product[]}){
 const pieces=products.filter(p=>p.status==='active');
 return <div className="garden-experience">
  <div className="garden-backdrop" aria-hidden="true"><div className="garden-backdrop-sticky"><HeroVideo/></div></div>
  <section className="lavender-hero" id="home" aria-labelledby="welcome-title">
   <div className="lavender-copy garden-welcome"><span className="edition">♡ SMALL-BATCH GIFTS · MADE TO KEEP</span><span className="eyebrow">THE HAPPY HANDMADE EDIT</span><h1 id="welcome-title">Flowers that<br/><em>never fade.</em></h1><p>Pick a bloom. Pick a colour. Give someone a little piece of joy they can keep forever.</p><div className="lavender-actions"><a className="button" href="#collection">Explore the collection ↗</a></div><a className="mobile-garden-scroll" href={pieces.length?'#garden-pieces':'#collection'}>Scroll through the garden <span aria-hidden="true">↓</span></a></div>
  </section>
  {pieces.length>0&&<section id="garden-pieces" className="garden-pieces" aria-label="Discover our pieces in the garden">
   {pieces.map((p,i)=><article className="garden-piece-step" key={p.id} aria-labelledby={`garden-title-${p.id}`}>
    <a className="garden-piece-card" href={productPath(p)}>
     <img src={p.images[0]||'/art/garden.webp'} alt={p.name} loading="lazy" width="500" height="500"/>
     <div className="garden-piece-copy"><span className="eyebrow">{String(i+1).padStart(2,'0')} / {p.category}</span><h2 id={`garden-title-${p.id}`}>{p.name}</h2><p>{money(p.price)}</p><span className="button">View this piece ↗</span></div>
    </a>
   </article>)}
  </section>}
 </div>
}
