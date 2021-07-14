function stuff(params: number) {
  //should lint because of the var key word
  var a = params + 1;
  //should be ignored
  let b = 3 + 8;
  return a;
}

class Test {
  value: string;
  constructor(x: string) {
    this.value = x;
  }
  test1(a: string) {
    var b = a + "hello";
  }
  test2(b: string) {
    let c = b + "hi";
    return c;
  }
}

const hi = () => {
  var a = 12;
  let b = 34;
  return a + b;
};

const hey = function () {
  var a = 12;
  let b = 34;
  return a + b;
};
const a = 12;

(function () {
  123;
  let b = 23;
  var k = 45;
  return b + k;
})();
