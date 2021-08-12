function string_includes_one_of(_str, _arr) {
  let result = false;
  for (let i = 0; i < _arr.length; i++) {
    if (_str.includes(_arr[i].toString())) {
      result = true;
      break;
    }
  }
  return result;
}
