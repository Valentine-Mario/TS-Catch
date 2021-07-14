//should lint because of the use of Boolean in func params
function evaluate(params: Boolean) {
  if (params) {
    return params;
  }
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
