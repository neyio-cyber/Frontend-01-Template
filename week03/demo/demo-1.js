function foo() {
  console.log(new.target);
}
foo(); //undefined
new foo(); //[Function: foo]
