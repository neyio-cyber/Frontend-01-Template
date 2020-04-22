const reg = /(?:[^'\n\\\r\u2028\u2029]|\\(?:['"\\bfnrtv\n\r\u2028\u2029]|\r\n)|\\x[0-9a-fA-F]{2}|\\u[0-9a-fA-F]{4}|\\[^0-9ux'"\\bfbrtv\n\\\r\u2028\u2029]|\'|\")*/g;

const case1 =
  "这作业是'抄写'的From Winter and 打表的,\"cry ,cry I'm neyio-cyber,who are u? Why watch me？\",testing";
const res = reg.exec(case1);
console.log("Is matched?", res[0] === case1); //true
