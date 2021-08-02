//should lint because of the use of Boolean in func params
function evaluate(params: Boolean) {
  if (params) {
    return params;
  }
  let key = (a: Boolean, b: string) => {
    let kaycee = (c: Number) => {
      c;
    };
    return [a, b];
  };
  const b = key(true, "io");
}

//should not lint
function evaluate2(params: boolean) {
  return params;
}

//should lint
function evaluate3(params: Number) {
  return params;
}

//should not lint
function evaluate4(params: number) {
  let kids = function (boy: String, girl: string) {
    let hey = function (a: Number) {};
    return [boy, girl];
  };
  return params;
}

//should lint
function evaluate5(params: String) {
  return params;
}

//should not lint
function evaluate6(params: string) {
  return params;
}

class Test2 {
  constructor() {}
  do_stuff(a: Number) {
    return a;
  }

  do_another_stuff(a: string) {
    return a;
  }
}

const Item2 = {
  stuff(item: Number, b: string) {
    return [item, b];
  },
  highs(c: Boolean) {},
  a: (mykeys: Number) => {
    let a = mykeys;
    let b = 23;
  },
};
