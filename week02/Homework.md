# 作业

* [isNumber](isNumber.js)

```js
  const isNumber = (num) =>
    /^[-\+]?(([1-9]\d*\.?\d*|0\.?\d*[1-9]\d)|([1-9]\d*\.?\d*([eE](\-)?)?\d*|0)|^[-\+]?0[xX](([1-9a-fA-F][\da-fA-F]*|0))|[-\+]?0[bB]([0-1]*|0)*|[-\+]?0[Oo]([0-7]*|0))$/.test(
      num
    );

  const isNumber2 = (num) =>
    /^[-\+]?(\.\d+|(0|[1-9]\d*)\.?\d*?)([eE][-\+]?\d+)?$|^[-\+]?0[bB][01]+$|^[-\+]?0[oO][0-7]+$|^[-\+]?0[xX][0-9a-fA-F]+$/.test(
      num
    );

  const cases = [
    "10.123",
    "010.123", //false
    "10.1e10",
    "10.1E10",
    "10e-1",
    "-10e-1",
    "10e--1", //false
    "-10.123g",
    "-0x123456789abcdef",
    "0X123456789abcdef",
    "0x123456789abcdef.acf",
    "0xs12",
    "0b0",
    "0b10",
    "-0b10",
    "0b20",
    "0o10",
    "-0o01",
    "0o123456780",
  ];

  const test = (fn) => (arrs) =>
    arrs.reduce(
      (pre, cur) => ({
        ...pre,
        [cur]: fn(cur),
      }),
      {}
    );

  const case1 = test(isNumber)(cases);
  const case2 = test(isNumber2)(cases);
  const matched = Object.entries(case1).every(([k, v]) => {
    if (v !== case2[k]) {
      console.log(k);
    }
    return v === case2[k];
  });

  console.log("matched", matched);
  console.log(case2);

```

* [encodingUTF8](encodingUTF8.js)

```js
const encodingUTF8 = (str) =>
  [...str]
    .reduce(
      (pre, cur) => pre.concat(`\\u${cur.charCodeAt(0).toString(16)}`),
      []
    )
    .join("");
console.log(encodingUTF8("hello world")); //\u68\u65\u6c\u6c\u6f\u20\u77\u6f\u72\u6c\u64
console.log(encodingUTF8("我是谁我在哪？前端为何这么深奥")); //\u6211\u662f\u8c01\u6211\u5728\u54ea\uff1f\u524d\u7aef\u4e3a\u4f55\u8fd9\u4e48\u6df1\u5965

```

* [matchString](matchString.js)

```js
const reg = /(?:[^'\n\\\r\u2028\u2029]|\\(?:['"\\bfnrtv\n\r\u2028\u2029]|\r\n)|\\x[0-9a-fA-F]{2}|\\u[0-9a-fA-F]{4}|\\[^0-9ux'"\\bfbrtv\n\\\r\u2028\u2029]|\'|\")*/g;

const case1 =
  "这作业是'抄写'的From Winter and 打表的,\"cry ,cry I'm neyio-cyber,who are u? Why watch me？\",testing";
const res = reg.exec(case1);
console.log("Is matched?", res[0] === case1); //true
```
