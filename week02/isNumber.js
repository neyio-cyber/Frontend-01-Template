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
