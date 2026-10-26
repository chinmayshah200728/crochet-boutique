import {Product,money} from '../lib/store';
import {productPath} from '../lib/seo';
export default function GardenJourney({products=[]}:{products?:Product[]}){
 const pieces=products.filter(p=>p.status==='active').slice(0,3);
 return <div className="landing-garden stacked-garden" id="home">
  <section className="landing-garden-stage" aria-label="Welcome to crochetbyprisha">
   <img className="landing-garden-background" src="/art/garden.webp" alt="A handmade crochet garden" fetchPriority="high"/>
   <div className="landing-garden-shade"/>
   <div className="landing-garden-intro"><span className="eyebrow">CROCHETBYPRISHA · MADE WITH LOVE</span><h1>Flowers that<br/><em>never fade.</em></h1><p>Pick a bloom. Pick a colour. Give someone a little piece of joy they can keep forever.</p><a className="button" href="#collection">Shop the collection ↗</a></div>
   <div className="landing-garden-bottom"><span>Scroll to discover ↓</span><a href="#collection">Go straight to the shop ↗</a></div>
  </section>
  {pieces.map((piece,i)=><section key={piece.id} className="landing-garden-stage garden-layer" aria-label={piece.name}>
   <img className="landing-garden-background" src="/art/garden.webp" alt="" loading="lazy" style={{objectPosition:`${40+i*15}% center`}}/>
   <div className="landing-garden-shade"/>
   <a className="landing-feature" href={productPath(piece)}><img src={piece.images[0]||'/art/garden.webp'} alt={piece.name} width="400" height="400" loading="lazy"/><div><span className="eyebrow">{piece.category}</span><h2>{piece.name}</h2><p>{money(piece.price)}</p><span className="button">View this piece ↗</span></div></a>
   <div className="landing-garden-bottom"><span>{i+1} / {pieces.length} · {i===pieces.length-1?'Your shop is just below':'Keep scrolling'} ↓</span><a href="#collection">Shop all pieces ↗</a></div>
  </section>)}
 </div>
}
