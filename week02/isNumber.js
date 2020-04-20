const isNumber = (num) =>
  /^(\-|\+)?(([1-9]\d*\.?\d*|0\.?\d*[1-9]\d)|0x(([1-9a-fA-F][\da-fA-F]*|0)\.?[\da-fA-F]*)|(0b(([1][0-1]*)|0)\.?[0-1]*)|(0o(([1-7][0-7]*)|0)\.?[0-7]*))$/.test(
    num
  );

console.log(isNumber("10.123")); //true
console.log(isNumber("-10.123")); //true
console.log(isNumber("-10")); //true
console.log("-10.123g", isNumber("-10.123g")); //false
console.log(isNumber("-0x123456789abcdef")); //true
console.log(isNumber("0x123456789abcdef")); //true
console.log(isNumber("0x123456789abcdef.acf")); //true
console.log("0x123456789abcdef.acg", isNumber("0x123456789abcdef.acg")); //false
console.log("0xs12", isNumber("0xs12")); //false a-f之间
console.log(isNumber("0b0")); //true
console.log(isNumber("0b10")); //true
console.log("0b20", isNumber("0b20")); //false 0-1
console.log(isNumber("0b10.0110")); //true
console.log("0b10.0120", isNumber("0b10.0120")); //false
console.log(isNumber("0o10")); //true
console.log(isNumber("-0o0")); //true
console.log(isNumber("-0o10")); //true
console.log(isNumber("0o12345670")); //true
console.log(isNumber("0o123456780")); //false 0-7
console.log("0o123456780", isNumber("0o123456780")); //false 0-7
console.log("0o1234567.12345678", isNumber("0o1234567.12345678")); //false 0-7
