function stuff(params: number) {
  //should lint because of the var key word
  var a = params + 1;
  //should be ignored
  let b = 3 + 8;
  return a;
}
