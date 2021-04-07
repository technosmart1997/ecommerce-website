// const fs = require('fs');
//
// const rootPath = 'C://Users/ayaag/Desktop/Code/';
// let keyword = 'string';
// let res;
// fs.readdir(rootPath,'utf-8' , (err,fileNames) => {
//     if(err) {
//         console.log(err);
//     }
//     fileNames.filter(fileName => {
//         fs.readFile(rootPath + fileName, (e,data) => {
//             if(e) {
//                 console.log(e);
//             }
//           if (data.toString().search(`${keyword}`) > 0) {
//               console.log(fileName);
//           }
//         })
//     })
// })


let codes = ['ABC','DEF','GHI','JKL','MNO','PQRS','TUV','WXYZ']
let heroes = ["SUPERMAN","THOR","ROBIN","IRONMAN","GHOSTRIDER","CAPTAINAMERICA","FLASH","WOLVERINE","BATMAN",
    "HULK","BLADE","PHANTOM","SPIDERMAN","BLACKWIDOW","HELLBOY","PUNISHER"];
let num = 78737626;
num = num.toString();
console.log(num);
function checkHeroWithNum(num, hero) {
   for(let i=0;i<num.length;i++) {
       let code = codes[num[i]-2];
       if(![...code].includes(hero[i])) {
            return false;
       }
   }
   return true;
}

let filteredHeroes = heroes.filter(hero => hero.length === num.length);
if(!filteredHeroes || filteredHeroes.length === 0) {
    // Need to throw Error
}
let heroResponse = filteredHeroes.find(hero => checkHeroWithNum(num, hero));

console.log(heroResponse);