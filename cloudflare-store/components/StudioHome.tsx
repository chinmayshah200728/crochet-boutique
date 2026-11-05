import './StudioHome.css';
export default function StudioHome(){
 return <section id="home" className="atelier-home" aria-label="The crochet atelier">
  <img className="atelier-backdrop" src="/art/atelier-lavender-v1.webp" alt="" fetchPriority="high" width="1672" height="941"/>
  <div className="atelier-shade"/>
  <div className="atelier-rail" aria-hidden="true"><span>01</span><i/><span>THE ATELIER</span></div>
  <div className="atelier-copy">
   <span className="atelier-eyebrow">THE CROCHET ATELIER</span>
   <h1>Made slowly.<br/><em>Loved for longer.</em></h1>
   <p>A little yarn. A very personal kind of magic.<br/>Thoughtful crochet, made by hand and close to the heart.</p>
   <a className="atelier-cta" href="#collection">Explore the collection <span aria-hidden="true">↗</span></a>
   <a className="atelier-maker" href="#story">Meet the hands behind the thread →</a>
  </div>
  <aside className="atelier-note"><span>A NOTE FROM THE STUDIO</span><p>Small stitches.<br/><em>Bigger feelings.</em></p><a href="#story">With love, Prisha ↗</a></aside>
  <div className="atelier-foot"><span>HANDMADE WITH CARE</span><a href="#collection">A LITTLE WORLD TO DISCOVER <b aria-hidden="true">↓</b></a><span>ALWAYS A LITTLE PERSONAL</span></div>
 </section>
}
