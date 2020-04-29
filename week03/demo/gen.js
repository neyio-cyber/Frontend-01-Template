function* foo() {
  let p = yield;
  let a = yield p;
  return a;
}

const gen = foo();
console.log(gen.next());
console.log(gen.next(1));
console.log(gen.next(2));
