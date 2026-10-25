import {getCatalog} from '../../lib/catalog';
import {site,productPath,isSample} from '../../lib/seo';
export async function GET(){const {products}=await getCatalog();const urls=['/','/about','/help','/crochet-guide',...products.filter(p=>!isSample(p)).map(productPath)];return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+urls.map(path=>'<url><loc>'+site+path+'</loc></url>').join('')+'</urlset>',{headers:{'Content-Type':'application/xml; charset=utf-8','Cache-Control':'public, max-age=300'}})}
