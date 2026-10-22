import sharp from 'sharp';
import fs from 'node:fs';
await sharp('public/art/garden.png').resize(1600).webp({quality:83}).toFile('public/art/garden.webp');
await sharp('public/art/cotton-crochet.png').resize(1024).webp({quality:88}).toFile('public/art/cotton-crochet.webp');
const info=await sharp('public/art/collection-sheet.png').metadata();
for(let n=0;n<4;n++)await sharp('public/art/collection-sheet.png').extract({left:n%2?Math.floor(info.width/2):0,top:n>1?Math.floor(info.height/2):0,width:Math.floor(info.width/2),height:Math.floor(info.height/2)}).resize(800,800).webp({quality:86}).toFile('public/art/sample-'+n+'.webp');
await sharp('public/art/collection-sheet.png').extract({left:0,top:0,width:Math.floor(info.width/2),height:Math.floor(info.height/2)}).resize(900,1100,{fit:'cover'}).webp({quality:85}).toFile('public/art/studio.webp');
await sharp('public/art/garden.png').resize(1200,630,{fit:'cover'}).jpeg({quality:85}).toFile('public/art/social-preview.jpg');
console.log('Optimised image bytes:',fs.readdirSync('public/art').filter(n=>n.endsWith('.webp')).map(n=>[n,fs.statSync('public/art/'+n).size]));
