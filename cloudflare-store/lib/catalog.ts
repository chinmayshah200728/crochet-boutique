import {env} from 'cloudflare:workers';
import {defaults,Product,Review,Settings} from './store';
import {mergeWithCurated} from './curated-products';
export async function getCatalog():Promise<{products:Product[];reviews:Review[];settings:Settings}>{
 // Use the public live catalogue for development previews; never copy customer or order data.
 if(process.env.NODE_ENV==='development'){
  try{const response=await fetch('https://crochetbyprisha.pages.dev/api/store',{signal:AbortSignal.timeout(5000)});if(response.ok){const data=await response.json() as {products:Product[];reviews:Review[];settings:Settings};if(Array.isArray(data.products))return {...data,products:data.products.map(p=>({...p,images:p.images.map(src=>src.startsWith('/')?'https://crochetbyprisha.pages.dev'+src:src)}))};}}catch{}
 }
 const [products,reviews,row]=await Promise.all([env.DB.prepare("SELECT * FROM products WHERE status='active' ORDER BY created_at DESC").all(),env.DB.prepare('SELECT * FROM reviews WHERE published=1 ORDER BY date DESC LIMIT 50').all(),env.DB.prepare("SELECT value FROM settings WHERE id='store'").first<{value:string}>()]);
 const decoded=products.results.map((p:any)=>({...p,images:JSON.parse(p.images),colours:JSON.parse(p.colours),model_colours:JSON.parse(p.model_colours||'{}')}));
 return {products:mergeWithCurated(decoded),reviews:reviews.results as unknown as Review[],settings:{...defaults,...(row?JSON.parse(row.value):{})}};
}
