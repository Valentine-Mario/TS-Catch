function stuff(params: number) {
  //should lint because of the var key word
  var a = params + 1;
  //should be ignored
  let b = 3 + 8;
  return a;
}

var NewStuff = {
  hi() {
    //lint this
    var bobo = "bobo";
    return bobo;
  },
};

class Test {
  value: string;
  constructor(x: string) {
    this.value = x;
  }
  test1(a: string) {
    //lint this
    var b = a + "hello";
  }
  test2(b: string) {
    //do  not lint
    let c = b + "hi";
    return c;
  }
}

const hi = () => {
  //lint this
  var a = 12;
  //do not lint
  let b = 34;
  return a + b;
};

const hey = function () {
  //lint this
  var a = 12;
  //do not lint
  let b = 34;
  return a + b;
};
const a = 12;

(function () {
  123;
  //do not lint
  let b = 23;
  //lint this
  var k = 45;
  return b + k;
})();

const Item = {
  stuff() {
    //lint this
    var stuff = "a";
    //do not lint
    let bc = 2;
    return stuff + bc;
  },
  a: () => {
    //lint this
    var a_b = "234";
    //do not lint
    let cv = "bol";
  },
};
