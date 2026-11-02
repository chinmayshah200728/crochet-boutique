import MakerStory from '../../components/MakerStory';
import InfoShell from '../../components/InfoShell';
import {getCatalog} from '../../lib/catalog';
import {site} from '../../lib/seo';
export const metadata={title:'Meet Prisha’s Crochet Studio | crochetbyprisha',description:'Meet crochetbyprisha: a handmade crochet studio in India for personalised flowers, keepsakes and gifts.',alternates:{canonical:site+'/about'}};
export default async function About(){const {settings:s}=await getCatalog();return <InfoShell><span className="eyebrow">THE HANDS BEHIND THE THREAD</span><h1>Meet Prisha.<br/><em>The heart behind the yarn.</em></h1><MakerStory settings={s}/></InfoShell>}
