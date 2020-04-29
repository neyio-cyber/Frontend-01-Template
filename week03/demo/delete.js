const o = { x: 1 };
console.log(delete o.x); //true

console.log(o);

global.a = 1;
console.log(delete a);
