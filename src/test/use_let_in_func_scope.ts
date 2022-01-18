function stuff(params: number) {
  //should lint because of the var key word
  var a = params + 1;
  //should be ignored
  let b = 3 + 8;

  let d = (kkl: string) => {
    var boi = 12;
    let kkk = (lmn: string) => {
      var jio = 90;
    };
  };
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
    let d = function () {
      var dope = "lover";
    };
  }
  test2(b: string) {
    //do  not lint
    let c = b + "hi";
    return c;
  }
}

const hi = () => {
  //lint this
  var alpha = 12;
  //do not lint
  let b = 34;
  return alpha + b;
};

const hey = function () {
  //lint this
  var beta = 12;
  //do not lint
  let b = 34;
  var leg = (s: string) => {
    var note = s;
  };
  return beta + b;
};
//don't lint
var number = 12;

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
    var kayy = () => {
      var kay1 = 234;
    };
    return stuff + bc;
  },
  a: () => {
    //lint this
    var a_b = "234";
    var l = () => {
      var lord = "hello";
    };
    //do not lint
    let cv = "bol";
  },
};
