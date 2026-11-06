import type {Product} from '../lib/store';
import {productPath} from '../lib/seo';
import './StudioHome.css';
export default function StudioHome({products}:{products:Product[]}){
 return <section id="home" className="atelier-home" aria-label="The crochet atelier">
  <img className="atelier-backdrop" src="/art/crochet-yarn-hero.webp" alt="" fetchPriority="high" width="2560" height="1440"/>
  <div className="atelier-shade"/>
  <div className="atelier-atmosphere" aria-hidden="true"><svg className="atelier-threads" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice"><g><path className="yarn-line" d="M720 -40 C1150 170 650 200 960 410 S700 640 1050 860"/><path className="yarn-spark" d="M720 -40 C1150 170 650 200 960 410 S700 640 1050 860"/></g><g><path className="yarn-line" d="M1250 90 C800 -30 1120 370 780 490 S1000 690 680 850"/><path className="yarn-spark" d="M1250 90 C800 -30 1120 370 780 490 S1000 690 680 850"/></g></svg><div className="atelier-light"/><div className="atelier-glow"/>{Array.from({length:24},(_,i)=><i className="atelier-mote" key={i} style={{left:`${3+(i*19)%94}%`,top:`${4+(i*23)%90}%`,animationDelay:`-${i*1.7}s`,animationDuration:`${12+(i%5)*3}s`}}/>)}</div>
  <label className="atelier-motion-control"><input type="checkbox" defaultChecked className="atelier-motion-toggle" aria-label="Enable background motion"/> Background motion</label>
  <div className="atelier-rail" aria-hidden="true"><span>01</span><i/><span>THE ATELIER</span></div>
  <div className="atelier-copy">
   <span className="atelier-eyebrow">THE CROCHET ATELIER</span>
   <h1>Made slowly.<br/><em>Loved for longer.</em></h1>
   <p>A little yarn. A very personal kind of magic.<br/>Thoughtful crochet, made by hand and close to the heart.</p>
   <a className="atelier-cta" href="#collection">Explore the collection <span aria-hidden="true">↗</span></a>
   <a className="atelier-maker" href="#story">Meet the hands behind the thread →</a>
  </div>
  <div className="atelier-hanging" aria-label="Discover handmade pieces">{products.filter(p=>p.images?.length).slice(0,2).map(p=><a className="atelier-hanging-piece" href={productPath(p)} key={p.id}><img src={p.images[0]} alt={p.alt||p.name} width="220" height="240"/><span>{p.name}</span></a>)}</div>
  <div className="atelier-foot"><span>HANDMADE WITH CARE</span><a href="#collection">A LITTLE WORLD TO DISCOVER <b aria-hidden="true">↓</b></a><span>ALWAYS A LITTLE PERSONAL</span></div>
 </section>
}
