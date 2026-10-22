'use client';
import LivingGarden from './LivingGarden';

export default function GardenJourney(){
 return (
  <section className="garden-journey" id="home">
   <div className="restored-world journey-sticky">
    <LivingGarden/>
    <div className="garden-editorial sr-only" aria-hidden="true">
     <span className="eyebrow">CROCHET BY PRISHA · HANDMADE IN INDIA</span>
     <h1>Handmade Crochet Flowers</h1>
     <p>A little world. A lot of heart.</p>
     <a href="#collection">Shop the collection ↗</a>
    </div>
   </div>
  </section>
 );
}
