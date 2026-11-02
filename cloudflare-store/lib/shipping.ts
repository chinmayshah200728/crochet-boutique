// All amounts are integer paise. Exactly ₹499 still pays delivery.
export function deliveryCharge(subtotal:number,baseCharge=4000){return subtotal>49900?0:baseCharge;}
