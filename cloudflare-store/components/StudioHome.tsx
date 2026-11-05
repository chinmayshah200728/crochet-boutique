import {Product,money,productAlt} from '../lib/store';
import {productPath} from '../lib/seo';
import ProductImage from './ProductImage';
import './StudioHome.css';
export default function StudioHome({products=[]}:{products?:Product[]}){
 const available=products.filter(p=>p.status==='active'&&p.images?.length);
 const featured=available.find(p=>/tulip|bouquet/i.test(p.name))||available[0];
 const extras=available.filter(p=>p.id!==featured?.id).slice(0,2);
 return <section id="home" className="atelier-home" aria-label="Welcome to crochetbyprisha">
  <div className="atelier-copy"><span className="atelier-kicker">THE CROCHETBYPRISHA STUDIO</span><h1>A little gift.<br/>A lot of <em>thought.</em></h1><p>Flowers that stay. Little things to wear and carry. Crochet pieces you can make personal, one colour at a time.</p><a className="atelier-shop" href="#collection">Shop the collection <span aria-hidden="true">↗</span></a><a className="atelier-story" href="#story">Meet Prisha, the maker →</a><div className="atelier-note"><span>Made by hand.<br/>Chosen by you.</span><small>Free delivery above ₹499<br/>₹40 on orders of ₹499 or less</small></div></div>
  {featured&&<a className="atelier-feature" href={productPath(featured)}><div className="atelier-photo"><ProductImage src={featured.images[0]} alt={productAlt(featured)} loading="eager"/><span className="atelier-photo-label">A PIECE TO KEEP</span></div><div className="atelier-caption"><span>{featured.name}</span><span>{money(featured.price)} ↗</span></div></a>}
  {extras.length>0&&<div className="atelier-discover"><div><span className="atelier-kicker">SMALL THINGS, WELL CHOSEN</span><p>Something for<br/><em>your everyday.</em></p></div>{extras.map(p=><a href={productPath(p)} key={p.id}><ProductImage src={p.images[0]} alt={productAlt(p)}/><span>{p.name}<small>{money(p.price)} · Take a closer look ↗</small></span></a>)}</div>}
 </section>
}
