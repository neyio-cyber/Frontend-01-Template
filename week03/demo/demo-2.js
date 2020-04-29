function foo(...args) {
  console.log(args);
  return args;
}

foo`你是谁，${1}你在${2}哪里`; // [ [ '你是谁，', '你在', '哪里' ], 1, 2 ]
