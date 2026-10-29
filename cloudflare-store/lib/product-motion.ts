export function wiggleProduct(element:HTMLElement){
 if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 const image=element.querySelector('img');if(!image)return;
 image.getAnimations().forEach(animation=>animation.cancel());
 image.animate([{transform:'rotate(0deg) scale(1)'},{transform:'rotate(-1.5deg) scale(1.025)'},{transform:'rotate(1.5deg) scale(1.025)'},{transform:'rotate(-.8deg) scale(1.015)'},{transform:'rotate(0deg) scale(1)'}],{duration:520,easing:'ease-in-out'});
}
