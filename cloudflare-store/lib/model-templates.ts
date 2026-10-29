import {collectionModels} from './collection-models';
export const modelStyles=['Bouquet','Bow charm','Daisy scrunchie','Gift set'];
export function suggestModel(name:string){
 if(/gift\s*(set|hamper)|love\s*letter/i.test(name))return collectionModels[3];
 if(/\b(scrunchie|screnchie|scrunchy)\b/i.test(name))return collectionModels[2];
 if(/\bbow\b/i.test(name))return collectionModels[1];
 if(/\b(bouquet|boquet|tulip)\b/i.test(name))return collectionModels[0];
 if(/sunflower/i.test(name))return '/models/sunflower-v1.glb';
 if(/\brose\b/i.test(name))return '/models/rosebud-v1.glb';
 return '';
}
