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
