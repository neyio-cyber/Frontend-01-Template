for (var i = 0; i < 10; i++) {
  setTimeout(() => {
    console.log(i);
  });
}

// 10个10

//修正
for (let i = 0; i < 10; i++) {
  setTimeout(() => {
    console.log(i);
  });
}

//修正
for (var i = 0; i < 10; i++) {
  ((i) =>
    setTimeout(() => {
      console.log(i);
    }))(i);
}

//修正
for (var i = 0; i < 10; i++) {
  void (function (i) {
    setTimeout(() => {
      console.log(i);
    });
  })(i);
}

for (var i = 0; i < 10; i++) {
  setTimeout(() => {
    console.log.call(i);
  });
}
