import type {Product,Settings} from './store';
export const site='https://crochetbyprisha.pages.dev';
export const isSample=(p:Product)=>p.lead_time.startsWith('Preview')||p.description.toLowerCase().includes('collection preview:');
export const productPath=(p:Product)=>'/products/'+(p.name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'crochet')+'--'+p.id;
export const jsonLd=(value:unknown)=>JSON.stringify(value).replace(/</g,'\\u003c');
export const photoUrl=(p:Product)=>p.images[0]?.startsWith('/art/collection-sheet.png#')?site+'/art/sample-'+p.images[0].slice(-1)+'.webp':p.images[0]?site+p.images[0]:undefined;
export function brandSchema(s:Settings){return {'@context':'https://schema.org','@graph':[{'@type':'Organization','@id':site+'/#brand',name:'crochetbyprisha',url:site,logo:site+'/favicon.svg',...(s.email?{email:s.email}:{}),...(s.instagram?{sameAs:['https://www.instagram.com/'+s.instagram+'/']}:{}),description:'Handmade crochet flowers, keepsakes and gifts with personalised colours.'},{'@type':'WebSite','@id':site+'/#website',name:'crochetbyprisha',url:site,inLanguage:'en-IN',publisher:{'@id':site+'/#brand'}}]}}
export function questions(s:Settings){return [
 {q:'What is crochetbyprisha?',a:'crochetbyprisha is Prisha’s handmade crochet studio in India, creating flowers, small keepsakes and gifts with personalised colours.'},
 {q:'Can I order the products shown?',a:s.acceptingOrders?'Ordering is open for products with available stock. Check each product’s availability and making time before placing an order.':'Ordering is currently paused. Items labelled Collection preview are samples, with illustrative images and prices. Real products and availability will be added by Prisha.'},
 {q:'Can I choose a different colour for every part?',a:'Yes. For products with a 3D model, select a named part or tap it in the preview, then choose a palette shade or a custom hex colour. The selected part colours and 3D design are saved with your order. Screen colours are approximate and actual yarn shades may vary.'},
 {q:'Are the 3D previews exact replicas?',a:'Collection templates are illustrative previews, not scans of the photographed item. Product photographs and descriptions provide the item details. Custom product models may be added by the studio.'},
 {q:'How do UPI payments work?',a:'Prices are in Indian rupees. When ordering is open, sign in, place your order and use the displayed UPI QR or payment-app link. A payment reference alone does not confirm payment: Prisha checks the credit in her bank before confirming your order.'},
 {q:'How long does making and delivery take?',a:s.dispatch},
 {q:'How do I ask about care, returns or a custom order?',a:s.returns+(s.email?' Contact the studio at '+s.email+'.':'')}
 ]}
