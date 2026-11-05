import {Product,money,productAlt} from '../lib/store';
import {productPath} from '../lib/seo';
import ProductImage from './ProductImage';
import './StudioHome.css';
export default function StudioHome({products=[]}:{products?:Product[]}){
 const pieces=products.filter(p=>p.status==='active'&&p.images?.some(src=>src.includes('/api/media/'))).slice(0,4);
 return <section id="home" className="thread-home" aria-label="Welcome to crochetbyprisha">
 <div className="thread-heading"><span className="thread-label">CROCHETBYPRISHA / HANDMADE IN INDIA</span><h1>A little knot.<br/><em>A lot of joy.</em></h1><div className="thread-intro"><p>A bow for their bag. Flowers for their desk.<br/>Something small that says, “I thought of you.”</p><a href="#collection" className="thread-cta">Find their thing <span aria-hidden="true">↗</span></a></div></div>
 <div className="thread-doodle" aria-hidden="true"><svg viewBox="0 0 1200 100"><path d="M-20 65 C180 -40 200 130 390 60 S620 -10 760 55 S1000 130 1220 30"/></svg><span>pick your favourite ↓</span></div><div className="thread-window" aria-label="Explore handmade pieces">{pieces.map((p,i)=><a className={'thread-piece thread-piece-'+i} key={p.id} href={productPath(p)}><span className="thread-pin" aria-hidden="true"/><span className="thread-number" aria-hidden="true">0{i+1}</span><div className="thread-image"><ProductImage src={p.images.find(src=>src.includes('/api/media/'))!} alt={productAlt(p)} loading={i<2?'eager':'lazy'}/></div><div className="thread-caption"><span>{p.name}</span><span>{money(p.price)} <b aria-hidden="true">↗</b></span></div></a>)}</div>
 <div className="thread-footer"><span>Yours to make personal. <a href="#collection">Explore colours →</a></span><span>Free delivery above ₹499 · ₹40 otherwise</span></div>
 </section>
}
