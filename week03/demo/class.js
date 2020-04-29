function cls1(a) {
  console.log("cls1", a);
}

function cls2(s) {
  console.log("cls2", s);
  return cls1;
}

new new cls2(1)(2);

class foo {
  constructor() {
    this.b = 3;
  }
}

//方法call的优先级高于属性访问
console.log(new foo()["b"]); //3     != new (foo()['b'])错误
console.log(new foo().b); //3     != new (foo()['b'])错误
