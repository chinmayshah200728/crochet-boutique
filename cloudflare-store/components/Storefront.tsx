'use client';
import {deliveryCharge} from '../lib/shipping';
import ShippingProgress from './ShippingProgress';
import MakerStory from './MakerStory';
import {Announcement,HomeFaq} from './HomeDelights';
import {useHomeMotion} from '../lib/home-motion';
import {wiggleProduct} from '../lib/product-motion';
import {useEffect,useState,lazy,Suspense} from 'react';
import {ShoppingBag,ArrowRight,Heart,Flower2,Gift,Sparkles,Minus,Plus,Trash2,Search,Box,ShieldCheck,Check,Layers,User} from 'lucide-react';
import ProductImage from './ProductImage';
import {Brand,Modal,Empty,Field,Alert,Arrow} from './UI';
import {ModelPart,PartColours,validPartColours} from '../lib/model-parts';
import {PartSelector,ColourSummary} from './PartColours';
import StudioHome from './StudioHome';
import CustomerAccount from './CustomerAccount';
import type {Customer} from '../lib/customer-auth';
const ModelPreview=lazy(()=>import('./ModelPreview'));
import PaymentInstructions from './PaymentInstructions';
import {api,Product,Review,Settings,CartItem,defaults,money,palette,categories,dispatchText,productAlt} from '../lib/store';
import {testimonials,returnsPolicy,extraFaqs} from '../lib/shop-content';
import {productPath} from '../lib/seo';

type StoreData={products:Product[];reviews:Review[];settings:Settings};

export default function Storefront({initialData}:{initialData?:StoreData}){
 const [data,setData]=useState<StoreData>(initialData||{products:[],reviews:[],settings:defaults});
 const [loading,setLoading]=useState(!initialData);
 const [error,setError]=useState('');
 const [category,setCategory]=useState('All little things');
 const [search,setSearch]=useState('');
 const [sort,setSort]=useState('new');
 const [product,setProduct]=useState<Product|null>(null);
 const [cart,setCart]=useState<CartItem[]>([]);
 const [bag,setBag]=useState(false);
 const [toast,setToast]=useState('');
 const [customer,setCustomer]=useState<Customer|null>(null);
 const [account,setAccount]=useState(false);
 useEffect(()=>{if(new URLSearchParams(location.search).get('account')==='1')setAccount(true)},[]);
 const [accountChecked,setAccountChecked]=useState(false);
 const [menu,setMenu]=useState(false);
 const [mobileAction,setMobileAction]=useState('shop');
 const [wishlist,setWishlist]=useState<string[]>([]);
 const [savedOnly,setSavedOnly]=useState(false);

 useEffect(()=>{
  try{
   const w=JSON.parse(localStorage.getItem('prisha-wishlist')||'[]');
   if(Array.isArray(w))setWishlist(w.filter(x=>typeof x==='string'));
  }catch{}
  if(new URLSearchParams(location.search).has('bag'))setBag(true);
 },[]);

 function toggleWish(id:string){
  const exists=wishlist.includes(id);
  const next=exists?wishlist.filter(x=>x!==id):[...wishlist,id];
  setWishlist(next);
  try{
   localStorage.setItem('prisha-wishlist',JSON.stringify(next));
   setToast(exists?'Removed from your saved favourites.':'Saved to your favourites.');
  }catch{
   setToast('Saved for this visit.');
  }
 }

 function findProducts(){
  location.hash='collection';
  setTimeout(()=>document.querySelector<HTMLInputElement>('[aria-label="Search products"]')?.focus(),60);
 }

 useEffect(()=>{
  api<{customer:Customer|null}>('customer/me')
   .then(r=>setCustomer(r.customer))
   .finally(()=>setAccountChecked(true))
   .catch(()=>{});
 },[]);

 const load=()=>{
  setLoading(true);
  setError('');
  api<StoreData>('store')
   .then(setData)
   .catch(e=>setError(e.message))
   .finally(()=>setLoading(false));
 };

 useEffect(()=>{
  if(!initialData)load();
  const requested=new URLSearchParams(location.search).get('product');
  if(requested&&initialData)setProduct(initialData.products.find(p=>p.id===requested)||null);
  try{
   const saved=JSON.parse(localStorage.getItem('prisha-bag')||'[]');
   if(Array.isArray(saved))setCart(saved.filter(i=>typeof i.productId==='string'&&Number.isInteger(i.quantity)&&i.quantity>0&&i.quantity<=10&&/^#[0-9a-fA-F]{6}$/.test(i.colour)&&typeof i.note==='string'&&(!i.partColours||validPartColours(i.partColours))));
  }catch{}
 },[]);

 useEffect(()=>{
  if(toast){
   const t=setTimeout(()=>setToast(''),4000);
   return()=>clearTimeout(t);
  }
 },[toast]);

 function updateCart(items:CartItem[]){
  setCart(items);
  localStorage.setItem('prisha-bag',JSON.stringify(items));
 }

 function add(item:CartItem){
  const next=[...cart];
  const index=next.findIndex(i=>i.productId===item.productId&&i.colour===item.colour&&i.note===item.note&&i.modelVersion===item.modelVersion&&JSON.stringify(i.partColours||{})===JSON.stringify(item.partColours||{}));
  if(index>=0)next[index]={...next[index],quantity:Math.min(10,next[index].quantity+item.quantity)};
  else next.push(item);
  updateCart(next);
  setToast('A little happiness, added to your bag.');
  setProduct(null);
 }

 function quickAdd(p:Product){
  if(p.stock<=0){
   setToast('This item is currently sold out.');
   return;
  }
  add({
   productId:p.id,
   quantity:1,
   colour:p.colours[0]||palette[0],
   note:'',
   partColours:p.model_colours||{},
   modelVersion:p.model
  });
 }

 const products=data.products
  .filter(p=>(!savedOnly||wishlist.includes(p.id))&&(category==='All little things'||p.category===category)&&((p.name+' '+p.description).toLowerCase().includes(search.toLowerCase())))
  .sort((a,b)=>sort==='low'?a.price-b.price:sort==='high'?b.price-a.price:0);

 const motion=useHomeMotion(category+'|'+sort+'|'+search+'|'+savedOnly+'|'+products.map(p=>p.id).join(','));
 const [newsletterReady,setNewsletterReady]=useState(false);
 const totalCount=cart.reduce((a,i)=>a+i.quantity,0);

 return (
  <div className="home-experience">
   <Announcement/>
   <header className={`store-nav ${motion.scrolled?'nav-scrolled':''} ${motion.hidden&&!menu?'nav-hidden':''}`}><button className="home-menu-toggle" aria-label="Open information menu" aria-expanded={menu} onClick={()=>setMenu(!menu)}>☰</button>
    <nav className="desktop-nav">
     <a href="#collection">Shop</a>
     <a href="#trust-information">Why handmade</a>
     <a href="#story">About</a>
    </nav>
    <Brand/>
    <div className="nav-right">
     <button className="saved-nav-btn" onClick={()=>{setSavedOnly(!savedOnly);location.hash='collection'}} aria-pressed={savedOnly} aria-label="View saved wishlist">
      <Heart size={16} fill={wishlist.length>0?'#a46e7d':'none'} color={wishlist.length>0?'#a46e7d':'currentColor'}/>

     </button>
     <button className="account-button" aria-label="Your account" onClick={()=>setAccount(true)}><User size={18}/></button>
     <button className="bag-button" onClick={()=>setBag(true)} aria-label={'Open shopping bag, '+totalCount+' items'}>
      <ShoppingBag size={18}/>
      <span key={totalCount} className="bag-count">{totalCount}</span>
     </button>
    </div>
   </header>

   {menu&&(
    <nav className="mobile-menu" aria-label="Mobile navigation">
     <div className="mobile-menu-head">
      <span className="eyebrow">CROCHETBYPRISHA</span>
      <button aria-label="Close menu" className="mobile-close" onClick={()=>setMenu(false)}>✕</button>
     </div>

     <a href="#trust-information" onClick={()=>setMenu(false)}>Handmade & shipping trust</a>
     <a href="/about">Meet Prisha & our story</a>
     <a href="/help">Delivery, UPI & FAQs</a>

    </nav>
   )}

   <main id="main-content">
    <StudioHome products={products}/>

    {/* The Collection */}
    <section className="collection section" id="collection">
     <div className="section-heading">
      <div>
       <span className="eyebrow">01 — THE HANDMADE CATALOGUE</span>
       <h2>A garden full of<br/><em>little happy things.</em></h2>
      </div>
      <p>Pick a piece, tap a part, choose any colour. See it in 3D before you order.</p>
     </div>

     <div className="collection-controls">
      <div className="tabs" aria-label="Product categories">
       {['All little things',...Array.from(new Set(data.products.map(p=>p.category))).sort()].map(c=>(
        <button className={category===c?'active':''} key={c} onClick={()=>setCategory(c)}>
         {c}
        </button>
       ))}
      </div>
      <div className="search-sort">
       <label className="search">
        <Search size={14}/>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search bouquets, bows, scrunchies…" aria-label="Search products"/>
       </label>
       <select aria-label="Sort products" value={sort} onChange={e=>setSort(e.target.value)}>
        <option value="new">Featured / Newest</option>
        <option value="low">Price: low to high</option>
        <option value="high">Price: high to low</option>
       </select>
      </div>
     </div>

     {loading?(
      <div className="product-grid" aria-label="Loading products" aria-busy="true">{[1,2,3].map(i=><div className="product-skeleton" key={i}/>)}</div>
     ):error?(
      <Empty title="The garden is taking a moment" body={error}>
       <button className="button secondary" onClick={load}>Try again</button>
      </Empty>
     ):products.length?(
      <div className="product-grid">
       {products.map((p,index)=>(
        <article className="product-card editorial-card" key={p.id} data-product-id={p.id}>
         <a className="card-cover-link" href={productPath(p)} aria-label={"View "+p.name}/>
         <div className="card-media">
          <a className="product-photo" href={productPath(p)} onPointerEnter={e=>{if(e.pointerType==='mouse')wiggleProduct(e.currentTarget)}} onPointerDown={e=>wiggleProduct(e.currentTarget)}>
           <ProductImage src={p.images[0]} alt={productAlt(p)} loading="lazy"/>{p.images[1]&&<span className="home-alternate-photo"><ProductImage src={p.images[1]} alt={productAlt(p)+' — another view'} loading="lazy"/></span>}
           {p.model&&(
            <span className="photo-model-badge">
             <Box size={11}/> Customisable
            </span>
           )}
          </a>

          <button
           className="wish-button"
           aria-label={(wishlist.includes(p.id)?'Remove from':'Add to')+' wishlist: '+p.name}
           aria-pressed={wishlist.includes(p.id)}
           onClick={()=>toggleWish(p.id)}
          >
           <Heart size={18} fill={wishlist.includes(p.id)?'#a46e7d':'none'} color={wishlist.includes(p.id)?'#a46e7d':'currentColor'}/>
          </button>

          <div className="card-hover-actions">
           <button className="quick-add-btn" onClick={()=>quickAdd(p)} aria-label={'Quick add '+p.name+' to bag'}>
            <ShoppingBag size={14}/> Quick add
           </button>
           <button className="quick-view" onClick={()=>setProduct(p)}>
            {p.model?'View in 3D':'Quick view'} <Plus size={14}/>
           </button>
          </div>
         </div>

         <div className="card-index">
          <strong>{String(index+1).padStart(2,'0')} / {String(products.length).padStart(2,'0')}</strong>
          <span>{p.category}</span>
         </div>

         <div className="product-card-title">
          <h3><a href={productPath(p)}>{p.name}</a></h3>
          <span className="card-price">{money(p.price)}</span>
         </div>

         <div className="product-meta">
          <div className="mini-swatches" title="Available yarn palette">
           {p.colours.slice(0,5).map(c=><i key={c} style={{background:c}}/>)}
          </div>
          <span className="meta-lead">{p.stock>0&&<i className="stock-dot"/>}{dispatchText(p)}</span>
         </div>

        </article>
       ))}
      </div>
     ):(
      <div className="collection-empty">
       <div className="thread-flower"><Flower2 size={76} strokeWidth={.7}/></div>
       <span className="eyebrow">{search?'NO MATCHES YET':'A LITTLE SOMETHING IS GROWING'}</span>
       <h3>{search?'Let’s try another little thing.':'Good things take a little yarn.'}</h3>
       <p>{search?'Try a different search or collection category.':'Our collection is being lovingly prepared. Soon, you’ll find your favourite handmade things right here.'}</p>
       {search&&<button className="text-link" onClick={()=>{setSearch('');setCategory('All little things')}}>See all little things <Arrow/></button>}
      </div>
     )}
    </section>


    {/* Craft Values */}
    <section className="values">
     <div>
      <Flower2/>
      <h3>Hands, not machines.</h3>
      <p>A human touch in every stitch.</p>
     </div>
     <div>
      <Gift/>
      <h3>A gift with feeling.</h3>
      <p>Their favourite colour, made with care.</p>
     </div>
     <div>
      <Heart/>
      <h3>Made to be kept.</h3>
      <p>Little keepsakes to love for longer.</p>
     </div>
    </section>

    {/* Craftsmanship Story */}
    <MakerStory settings={data.settings}/>

    {/* Trust & Purchase Transparency Section */}
    <section className="trust-section section" id="trust-information">
     <div className="trust-header">
      <span className="eyebrow">PURCHASE TRANSPARENCY · SINCERE SERVICE</span>
      <h2>Handmade with heart.<br/><em>Clear and honest from studio to doorstep.</em></h2>
      <p>Every order is handled directly by Prisha. Here is everything you need to know before you choose your piece.</p>
     </div>
     <div className="trust-grid">
      <article className="trust-card">
       <div className="trust-icon"><Flower2 size={24}/></div>
       <h3>100% Handcrafted in India</h3>
       <p>No factory assembly or mass production. Every petal and leaf is hand-crocheted in small batches using premium combed cotton yarn.</p>
       <span className="trust-badge">Pure Cotton Craft</span>
      </article>

      <article className="trust-card">
       <div className="trust-icon"><Gift size={24}/></div>
       <h3>Thoughtful Keepsake Packaging</h3>
       <p>Arrives gift-ready in a recycled kraft box, wrapped in butter paper with natural dried botanicals and a personalized handwritten message.</p>
       <span className="trust-badge">Complimentary Gifting</span>
      </article>

      <article className="trust-card">
       <div className="trust-icon"><Sparkles size={24}/></div>
       <h3>Paced & Tracked Dispatch</h3>
       <p>Ready pieces dispatch in 24–48 hours; custom pieces in 3–5 days. Insured delivery across all Indian pin codes with live tracking notifications.</p>
       <span className="trust-badge">All-India Delivery</span>
      </article>

      <article className="trust-card">
       <div className="trust-icon"><ShieldCheck size={24}/></div>
       <h3>Simple UPI & Direct Care</h3>
       <p>Pay easily via Google Pay, PhonePe, Paytm or direct UPI ID with zero gateway fees. Transit damaged pieces are happily replaced within 48 hours.</p>
       <span className="trust-badge">Guaranteed Support</span>
      </article>
     </div>
    </section>

    {/* Customer Reviews (if approved) */}
    {data.reviews.length>0&&(
     <section className="reviews section">
      <span className="eyebrow">WORDS FROM YOUR WORLD</span>
      <h2>Little things.<em> Lovely feelings.</em></h2>
      <div className="review-grid">
       {data.reviews.map(r=>(
        <blockquote key={r.id}>
         <span className="stars" aria-label={r.rating+' out of 5 stars'}>{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</span>
         <p>“{r.body}”</p>
         <footer>{r.customer}<span>{new Date(r.date).toLocaleDateString('en-IN',{month:'long',year:'numeric'})}</span></footer>
        </blockquote>
       ))}
      </div>
     </section>
    )}

    <HomeFaq/>

    <section className="section ordering-section"><span className="eyebrow">04 · FROM OUR HANDS TO YOURS</span><h2>How ordering works</h2><ol className="ordering-steps">{['Choose and customise','Pay by UPI','Prisha confirms and starts crafting'].map((text,i)=><li key={text}><span>{i+1}</span><h3>{text}</h3></li>)}</ol></section>

    {/* Newsletter Section */}
    <section className="newsletter-section">
     <div className="newsletter-card">
      <span className="eyebrow">A CORNER OF WONDER</span>
      <h2>Join the studio circle.</h2>
      <p>Receive occasional love notes from Prisha featuring new seasonal bloom drops, limited yarn palettes, and holiday gift releases.</p>
      <form className="newsletter-form" onSubmit={e=>{e.preventDefault();const email=new FormData(e.currentTarget).get('email');location.href='mailto:crochetbyprisha@gmail.com?subject=Join%20the%20studio%20circle&body='+encodeURIComponent('Please send studio updates to '+email+'.');setNewsletterReady(true);}}>
       <input type="email" name="email" required placeholder="Enter your email address" aria-label="Your email address"/>
       <button type="submit" className="button">Join with heart <ArrowRight size={15}/></button>
      </form>{newsletterReady&&<p className="newsletter-result" role="status">♡ Your email draft is ready. Send it to request studio updates.</p>}<p className="fine">Opens your email app. Your address is used only for requested studio updates; unsubscribe anytime.</p>
     </div>
    </section>

    <div className="help-invitation">
     <span>A question, a custom colour, or a tiny idea?</span>
     <a className="text-link" href="/help">Find your answer in our guide <Arrow/></a>
    </div>
   </main>

   <footer className="store-footer"><svg className="footer-wave" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true"><path d="M0 30 Q180 0 360 30 T720 30 T1080 30 T1440 30 V60 H0Z"/></svg><a className="back-to-top" href="#home">Back to top ↑</a>
    <div>
     <Brand/>
     <p>A little world, made with love in India.</p>
    </div>
    <div>
     <a href="#collection">Shop</a>
     <a href="#trust-information">Why handmade</a>
     <a href="/about">Meet Prisha</a>
     <a href="/help">Orders & questions</a><a href="/crochet-guide">Crochet gift & care guide</a>
     {data.settings.email&&<a href={'mailto:'+data.settings.email}>Say hello <Arrow/></a>}
     {data.settings.instagram&&(
      <a href={'https://www.instagram.com/'+data.settings.instagram+'/'} target="_blank" rel="noreferrer">
       Instagram @{data.settings.instagram}
      </a>
     )}
    </div>
    <div className="footer-bottom">
     <span>© {new Date().getFullYear()} crochetbyprisha · Handcrafted in Gujarat, India</span>
     <span>MADE WITH HEART · INR ₹ · SUSTAINABLE SLOW CRAFT</span>
    </div>
   </footer>

   {/* Fixed Mobile Bottom Navigation */}
   <nav className="mobile-bottom" aria-label="Shopping shortcuts">
    <a href="#collection" aria-current={mobileAction==='shop'&&!account&&!bag?'page':undefined} onClick={()=>setMobileAction('shop')}><Flower2 size={18}/>Shop</a>
    <button aria-pressed={mobileAction==='search'&&!account&&!bag} onClick={()=>{setMobileAction('search');findProducts()}}><Search size={18}/>Search</button>
    <button aria-pressed={account} onClick={()=>setAccount(true)}><User size={18}/>Account</button>
    <button aria-pressed={bag} onClick={()=>setBag(true)}>
     <ShoppingBag size={18}/>
     Bag {totalCount>0&&<span className="mobile-badge">{totalCount}</span>}
    </button>
   </nav>

   {product&&<Suspense fallback={<div role="status">Opening your piece…</div>}><ProductView settings={data.settings} product={product} onClose={()=>setProduct(null)} onAdd={add}/></Suspense>}
   {account&&<Modal title="YOUR ACCOUNT" onClose={()=>setAccount(false)}><CustomerAccount customer={customer} onChange={setCustomer} settings={data.settings}/></Modal>}
   {bag&&<Bag customer={customer} accountChecked={accountChecked} signIn={()=>{setBag(false);setAccount(true)}} items={cart} products={data.products} settings={data.settings} update={updateCart} onClose={()=>setBag(false)} refresh={load}/>}
   {toast&&<div className="toast" role="status"><Heart size={16}/><span>{toast}</span></div>}
  </div>
 );
}

export function ProductView({
 product:p,
 onClose,
 onAdd,
 onBuyNow,
 embedded=false,
 settings
}:{
 product:Product;
 onClose:()=>void;
 onAdd:(i:CartItem)=>void;
 onBuyNow?:(i:CartItem)=>void;
 embedded?:boolean;
 settings?:Settings;
}){
 const [colour,setColour]=useState(p.colours[0]||palette[0]);
 const [hex,setHex]=useState(colour);
 const [note,setNote]=useState('');
 const [quantity,setQuantity]=useState(1);
 const [photo,setPhoto]=useState(0);
 const [view,setView]=useState(p.model?'3d':'photo');
 const multiPart=/collection-2/.test(p.model||'')||/scrunchie|screnchie|scrunchy|hamper|gift set|bouquet|flower|soft toy|plush|amigurumi|teddy|doll|bunny/i.test(p.name+' '+p.category)&&!/key.?chain|charm|bow/i.test(p.name);
 const [parts,setParts]=useState<ModelPart[]>([]);
 const [selected,setSelected]=useState('');
 const [partColours,setPartColours]=useState<PartColours>(p.model_colours||{});

 function selectPart(id:string){
  if(!multiPart)return;
  setSelected(id);
  const c=partColours[id]||parts.find(p=>p.id===id)?.colour||colour;
  setColour(c);
  setHex(c);
 }

 function receiveParts(list:ModelPart[]){
  setParts(list);
  if(!multiPart)return;
  setPartColours(current=>Object.fromEntries(list.map(part=>[part.id,current[part.id]||part.colour])));
  if(!selected&&list[0]){
   setSelected(list[0].id);
   setColour(partColours[list[0].id]||list[0].colour);
   setHex(partColours[list[0].id]||list[0].colour);
  }
 }

 function changeColour(c:string){
  setColour(c);
  setHex(c);
  if(!multiPart)setPartColours({whole_product:c});
  else if(selected)setPartColours(current=>({...current,[selected]:c}));
 }

 const item=()=>({productId:p.id,quantity,colour,note,partColours,modelVersion:p.model});
 const canOrder=p.stock>0&&settings?.acceptingOrders!==false;

 function purchase(buy=false){
  if(!canOrder)return;
  if(p.model&&!parts.length&&view!=='3d'){
   // allow ordering or switch view
  }
  if(buy&&onBuyNow)onBuyNow(item());
  else onAdd(item());
 }

 const content=(
  <div className={'product-detail '+(embedded?'full-product-detail':'')}>
   <div className="product-media-column">
    <div className="detail-media">
     {view==='3d'&&p.model?(
      <Suspense fallback={<p role="status">Loading your 3D preview…</p>}><ModelPreview title={'Interactive 3D model of '+p.name} url={p.model} colour={p.colours[0]||palette[0]} partColours={partColours} onParts={receiveParts} onSelect={selectPart}/></Suspense>
     ):(
      <ProductImage src={p.images[photo]||p.images[0]} alt={productAlt(p)}/>
     )}
    </div>

    <div className="gallery">
     {p.images.map((src,i)=>(
      <button key={src} onClick={()=>{setPhoto(i);setView('photo');}} aria-label={'View photo '+(i+1)} className={photo===i&&view==='photo'?'selected':''}>
       <ProductImage src={src} alt=""/>
      </button>
     ))}
     {p.model&&(
      <button className={'model-tab '+(view==='3d'?'selected':'')} onClick={()=>setView('3d')} aria-label="Interactive 3D model">
       <Box size={18}/>
       <span>3D view</span>
      </button>
     )}
    </div>

    {view==='3d'&&(
     <small className="model-tip">
      {multiPart?"Drag to rotate. Tap a part to change its colour.":"Drag to rotate. Your selected shade applies to the whole piece."}
     </small>
    )}
   </div>

   <div className="detail-copy">
    <span className="eyebrow">{p.category}</span>
    {embedded?<h1>{p.name}</h1>:<h2>{p.name}</h2>}
    <p className="detail-price">{money(p.price)}</p>
    <div className="purchase-actions"><div className="purchase-total"><small>Item total</small><strong>{money(p.price*quantity)}</strong></div>    <div className="buy-row">
     <div className="quantity">
      <button aria-label="Decrease quantity" disabled={quantity<=1} onClick={()=>setQuantity(quantity-1)}><Minus size={14}/></button>
      <span>{quantity}</span>
      <button aria-label="Increase quantity" disabled={quantity>=Math.min(10,p.stock||1)} onClick={()=>setQuantity(quantity+1)}><Plus size={14}/></button>
     </div>
     <button className="button" disabled={!canOrder} onClick={()=>purchase(false)}>
      {!canOrder?'Currently unavailable':'Add to my bag'}
      <ShoppingBag size={17}/>
     </button>
    </div>

    <button className="button secondary full buy-now-btn" disabled={!canOrder} onClick={()=>purchase(true)}>
     Buy now with UPI →
    </button>



</div>

    <details className="optional-colours" open><summary>Customise colours (optional)</summary><p className="fine">Keep the original, or choose a shade below.</p>{multiPart&&p.model&&parts.length>0&&<PartSelector parts={parts} selected={selected} onSelect={selectPart}/>}

    <div className="colour-label">
     <span>Your chosen colour</span>
     <strong>{colour.toUpperCase()}</strong>
    </div>

    <div className="colour-plate" aria-label="Available colour palette">
     {Array.from(new Set([...p.colours,...palette])).map(c=>(
      <button aria-label={'Choose '+c} aria-pressed={colour===c} key={c} className={colour===c?'selected':''} onClick={()=>changeColour(c)} style={{background:c}}/>
     ))}
    </div>

    <div className="custom-colour">
     <label>Pick any custom shade <input type="color" value={colour} onChange={e=>changeColour(e.target.value)}/></label>
     <input aria-label="Custom hex colour code" maxLength={7} value={hex} onChange={e=>{setHex(e.target.value);if(/^#[0-9a-fA-F]{6}$/.test(e.target.value))changeColour(e.target.value);}} onBlur={()=>setHex(colour)}/>
    </div>
    <small className="colour-hint">Choose from our curated studio palette or pick any custom shade. Actual dyed cotton yarn may vary slightly.</small>

    {Object.keys(partColours).length>0&&<details className="chosen-colours"><summary>View selected colours</summary><ColourSummary colours={partColours}/></details>}</details>

    <details className="gift-note"><summary>Add a gift note (optional)</summary><Field label="Your message or custom detail">
     <textarea value={note} maxLength={400} onChange={e=>setNote(e.target.value)} placeholder="E.g. A gift message for the recipient, specific colour placement idea…" rows={2}/>
    </Field></details>

    <p className="detail-description">{p.description}</p>

    <p className="availability-note">
     <span className={'status-dot '+(p.stock>0?'green':'red')}/>
     {dispatchText(p)}
    </p>

    <div className="product-accordions">
     <details className="accordion-item" open>
      <summary>Materials & Dimensions</summary>
      <div className="accordion-content">
       <p><strong>Dimensions:</strong> {p.dimensions||'Approx. 15–20 cm handcrafted proportions.'}</p>
       <p><strong>Materials:</strong> {p.materials||'100% soft combed milk cotton yarn, florist core.'}</p>
      </div>
     </details>

     <details className="accordion-item">
      <summary>Care Instructions</summary>
      <div className="accordion-content">
       <p>{p.care||'Dust gently with a soft makeup brush. Keep away from direct water. Spot clean if necessary.'}</p>
       <p>Made from combed cotton that retains its shape and texture for years.</p>
      </div>
     </details>

     <details className="accordion-item">
      <summary>Handmade Making & Packaging</summary>
      <div className="accordion-content">
       <p>{settings?.dispatch||'Each piece is crafted by Prisha in Gujarat, India.'}</p>
       <p>Every order arrives in an eco-friendly recyclable kraft box, wrapped in butter paper with natural dried botanicals and a personalized handwritten message.</p>
      </div>
     </details>
    </div>

    <p className="fine">Your colour choices and gift notes are saved securely with your order. Simple UPI checkout verified directly by the studio.</p>
    {!embedded&&<a className="text-link" href={productPath(p)}>Full dedicated product page →</a>}
   </div>
  </div>
 );

 return embedded ? content : (
  <Modal title="A CLOSER LOOK" onClose={onClose} wide>
   {content}
  </Modal>
 );
}

function Bag({
 items,
 products,
 settings:s,
 update,
 onClose,
 refresh,
 customer,
 accountChecked,
 signIn
}:{
 customer:Customer|null;
 accountChecked:boolean;
 signIn:()=>void;
 items:CartItem[];
 products:Product[];
 settings:Settings;
 update:(i:CartItem[])=>void;
 onClose:()=>void;
 refresh:()=>void;
}){
 const [step,setStep]=useState(0);
 const [error,setError]=useState('');
 const [busy,setBusy]=useState(false);
 const [result,setResult]=useState<{id:string;total:number}|null>(null);
 const [form,setForm]=useState({
  customer:customer?.name||'',
  email:customer?.email||'',
  phone:'',
  address:'',
  payment_ref:''
 });
 const [requestId]=useState(()=>crypto.randomUUID());

 const subtotal=items.reduce((v,i)=>v+(products.find(p=>p.id===i.productId)?.price||0)*i.quantity,0); const shipping=deliveryCharge(subtotal,s.shipping);
 const unavailable=items.some(i=>{
  const p=products.find(p=>p.id===i.productId);
  return !p||p.stock<i.quantity;
 });

 async function submit(e:React.FormEvent){
  e.preventDefault();
  setBusy(true);
  setError('');
  try{
   const r=await api('orders',{method:'POST',body:JSON.stringify({...form,items,requestId})});
   setResult(r);
   update([]);
   refresh();
   if(/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)&&s.upiId){
    const query=new URLSearchParams({pa:s.upiId,pn:s.payee,am:(r.total/100).toFixed(2),cu:'INR',tr:r.id,tn:'Order '+r.id.slice(0,8)});
    window.location.href='upi://pay?'+query.toString();
   }
  }catch(e){
   setError((e as Error).message);
  }finally{
   setBusy(false);
  }
 }

 return (
  <Modal title={result?'YOUR PIECES ARE ON THEIR WAY TO BEING MADE':step?'DELIVERY & PAYMENT DETAILS':'YOUR SHOPPING BAG'} onClose={onClose}>
   {result?(
    <div className="order-success">
     <Flower2 size={48} strokeWidth={1}/>
     <h2>Thank you,<em> {form.customer.split(' ')[0]}.</em></h2>
     <p>Your order has been placed. Awaiting payment verification. Pay using the options below; the studio will confirm receipt.</p>
     <div className="order-receipt">
      <span>Order reference</span>
      <strong>{result.id}</strong>
      <span>Total</span>
      <strong>{money(result.total)}</strong>
     </div>
     <PaymentInstructions settings={s} amount={result.total} reference={result.id}/>
     <p>Please keep this reference for your records.{s.email&&<> Questions? Email <a href={'mailto:'+s.email}>{s.email}</a></>}</p>
     <button className="button" onClick={onClose}>Back to the garden <Arrow/></button>
    </div>
   ):!items.length?(
    <Empty title="Room for a little happiness." body="Your bag is waiting for something handmade.">
     <button className="button" onClick={onClose}>Explore the collection <Arrow/></button>
    </Empty>
   ):(
    <>
     <h2>{step?'Where should we send your pieces?':'Your chosen treasures.'}</h2>
     <Alert>{error}</Alert>
     <ShippingProgress subtotal={subtotal} shipping={shipping}/>
     {!!step&&<p className="checkout-total">Order total <strong>{money(subtotal+shipping)}</strong> · including {shipping?money(shipping)+' delivery':'free delivery'}</p>}
     {!step?(
      <>
       {items.map((item,i)=>{
        const p=products.find(p=>p.id===item.productId);
        return (
         <div className="bag-item" key={i}>
          {p?.images[0]&&<ProductImage src={p.images[0]} alt={productAlt(p)}/>}
          <div>
           <h3>{p?.name||'Unavailable item'}</h3>
           <span className="bag-colour"><i style={{background:item.colour}}/>{item.colour}</span>
           <ColourSummary colours={item.partColours}/>
           {item.note&&<small className="bag-note">Note: “{item.note}”</small>}
           <div className="quantity">
            <button disabled={item.quantity<=1} aria-label="Decrease quantity" onClick={()=>update(items.map((v,j)=>j===i?{...v,quantity:v.quantity-1}:v))}><Minus size={13}/></button>
            <span>{item.quantity}</span>
            <button disabled={item.quantity>=Math.min(10,p?.stock||0)} aria-label="Increase quantity" onClick={()=>update(items.map((v,j)=>j===i?{...v,quantity:v.quantity+1}:v))}><Plus size={13}/></button>
           </div>
          </div>
          <div>
           <span>{money((p?.price||0)*item.quantity)}</span>
           <button className="icon-button" aria-label={'Remove '+(p?.name||'item')} onClick={()=>update(items.filter((_,j)=>j!==i))}><Trash2 size={16}/></button>
          </div>
         </div>
        );
       })}
       <div className="bag-total">
        <span>Subtotal</span>
        <strong>{money(subtotal)}</strong>
        <span>Delivery across India</span>
        <strong>{shipping?money(shipping):'Free'}</strong>
        <span>Estimated Total</span>
        <strong>{money(subtotal+shipping)}</strong>
       </div>
       {!s.acceptingOrders&&<p className="notice">The studio is preparing to accept orders. Your bag is saved on this device.</p>}
       {unavailable&&<Alert>Some items exceed current stock. Update quantity to continue.</Alert>}
       <button className="button full" disabled={!accountChecked||(!!customer&&(!s.acceptingOrders||unavailable))} onClick={()=>customer?setStep(1):signIn()}>
        {customer?'Continue to checkout':'Sign in to checkout'} <ArrowRight size={17}/>
       </button>
      </>
     ):(
      <form onSubmit={submit} className="form-stack">
       <div className="two-col">
        <Field label="Your name"><input required autoComplete="name" value={form.customer} onChange={e=>setForm({...form,customer:e.target.value})} minLength={2} maxLength={100}/></Field>
        <Field label="Email"><input required readOnly type="email" autoComplete="email" value={customer?.email||form.email} onChange={e=>setForm({...form,email:e.target.value})}/></Field>
       </div>
       <Field label="Phone number (for delivery updates)"><input required type="tel" autoComplete="tel" minLength={10} maxLength={16} value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></Field>
       <Field label="Delivery address" hint="House / Flat, Street, Locality, City, State, and PIN code. Shipping across India.">
        <textarea required autoComplete="street-address" minLength={15} maxLength={700} rows={3} value={form.address} onChange={e=>setForm({...form,address:e.target.value})}/>
       </Field>


       <p className="fine">Your delivery information is encrypted and shared only with our shipping partner to deliver your handmade parcel.</p>
       <button className="button full" disabled={busy}>
        {busy?'Placing your order…':'Place order & pay · '+money(subtotal+shipping)}
        <Arrow/>
       </button>
       <button type="button" className="text-link" disabled={busy} onClick={()=>setStep(0)}>Back to review bag</button>
      </form>
     )}
    </>
   )}
  </Modal>
 );
}
