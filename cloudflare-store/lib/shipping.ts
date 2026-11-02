// All amounts are integer paise. Exactly ₹499 still pays delivery.
export function deliveryCharge(subtotal:number,baseCharge=4000){return subtotal>49900?0:baseCharge;}

export function freeDeliveryRemaining(subtotal:number){return Math.max(0,Math.ceil((49901-subtotal)/100)*100);}
