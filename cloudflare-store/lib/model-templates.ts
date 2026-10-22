import {collectionModels} from './collection-models';
export const modelStyles=['Bouquet','Bow charm','Daisy scrunchie','Gift set'];
export function suggestModel(name:string){
 if(/gift\s*(set|hamper)|love\s*letter/i.test(name))return collectionModels[3];
 if(/\bscrunchie\b/i.test(name))return collectionModels[2];
 if(/\bbow\b/i.test(name))return collectionModels[1];
 if(/\bbouquet\b/i.test(name))return collectionModels[0];
 return '';
}
