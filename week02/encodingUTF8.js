const encodingUTF8 = (str) =>
  [...str]
    .reduce(
      (pre, cur) => pre.concat(`\\u${cur.charCodeAt(0).toString(16)}`),
      []
    )
    .join("");
console.log(encodingUTF8("hello world")); //\u68\u65\u6c\u6c\u6f\u20\u77\u6f\u72\u6c\u64
console.log(encodingUTF8("我是谁我在哪？前端为何这么深奥")); //\u6211\u662f\u8c01\u6211\u5728\u54ea\uff1f\u524d\u7aef\u4e3a\u4f55\u8fd9\u4e48\u6df1\u5965
