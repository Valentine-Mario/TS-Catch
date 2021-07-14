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
