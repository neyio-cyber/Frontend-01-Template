# 转换函数

* 转换字符串到函数

```js
function convertStringToNumber(string, radix = 10) {
  if (typeof string !== "string") throw new Error("传入类型必须为string");
  let front = string;
  let radix10Tail = 1;
  if (radix === 10) {
    if (
      radix === 10 &&
      !!~[...string].findIndex((i) => i === "e" || i === "E")
    ) {
      [front, radix10Tail] = string.toLowerCase().split("e");
      radix10Tail = Math.pow(10, convertStringToNumber(radix10Tail, 10));
    }
  }
  const abs = front.startsWith("-") ? -1 : 1;
  let absString = [...front.toLowerCase()];
  if (abs === -1) [, ...absString] = [...front];
  const chars = absString.join("").split(".");
  const [left, right = []] = chars;
  if (radix !== 10 && right.length > 0) {
    throw new Error("十进制才有小数");
  }

  const l = [...left].reduceRight((pre, cur, index, arr) => {
    const countNum =
      cur.codePointAt() - "0".codePointAt() > 16
        ? cur.codePointAt() - "a".codePointAt()
        : cur.codePointAt() - "0".codePointAt();
    return pre + countNum * Math.pow(radix, arr.length - 1 - index);
  }, 0);
  const r = right.length
    ? [...right].reduce((pre, cur) => {
        return pre * 10 + cur.codePointAt() - "0".codePointAt();
      }, 0) / [...right].reduce((p) => p * 10, 1)
    : 0;
  return (r + l) * abs * radix10Tail;
}

console.log("10.12 equals 10.12", convertStringToNumber("10.12") === 10.12);
console.log("-0.12 equals -0.12 ", convertStringToNumber("-0.12") === -0.12);
console.log(
  "-0.12e10 equals -1.2e+99 ",
  convertStringToNumber("-0.12e100") === -1.2e99
); // -1.2e+99
console.log(
  "-0.12e-10 equals  -1.012e-9",
  convertStringToNumber("-10.12e-10") === -1.012e-9
); // -1.012e-9

console.log("11 16进制 equals 17", convertStringToNumber("11", 16) === 17); //17
console.log("11 2进制 equals 3", convertStringToNumber("11", 2) === 3); //3
console.log("11 8进制 equals 9", convertStringToNumber("11", 8) === 9); //9

```


* 转换数字到字符串

```js
const convertNumberToString = (number, radix = 10) => {
  //其实得保证数字是符合进制的规范的，否则直接要报错
  const prefixMap = new Map([
    [2, "0b"],
    [8, "0o"],
    [10, ""],
    [16, "0x"],
  ]);
  const minus = number > 0 ? "" : "-";
  const fraction = radix === 10 ? ("" + number).match(/\.\d*/)[0] : null;
  let iterator = Math.floor(Math.abs(number));
  let string = "";
  while (iterator && iterator > 0) {
    string = (iterator % radix) + string;
    iterator = Math.floor(iterator / radix);
  }
  return (
    (fraction && `${minus}${string}${fraction}`) ||
    `${prefixMap.get(radix)}${string}`
  );
};

console.log("7 2进制 为 0b111", convertNumberToString("7", 2) === "0b111");
console.log("12的8进制 为 0o14", convertNumberToString("12", 8) === "0o14");
console.log("17的16进制 为 0x11", convertNumberToString("17", 16) === "0x11");
console.log("10.1 为 10.1", convertNumberToString("10.1", 10) === "10.1");
console.log("-10.1 为 -10.1", convertNumberToString("-10.1", 10) === "-10.1");
```

* 特殊对象

1. window || global

2. 绑定this作用域的方法

3. Array 的 length 属性根据最大的下标自动发生变化

4. 函数内部的arguments

5. Object.prototype 对象原型

应该还有很多吧