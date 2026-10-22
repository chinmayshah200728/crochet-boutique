import Storefront from '../components/Storefront';
import {getCatalog} from '../lib/catalog';
import {brandSchema,jsonLd} from '../lib/seo';
export default async function Home(){const data=await getCatalog();return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd(brandSchema(data.settings))}}/><Storefront initialData={data}/></>}
