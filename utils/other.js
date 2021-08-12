export function stringIncludesOneOfArray(_str, _arr) {
  let result = false;
  for (let i = 0; i < _arr.length; i++) {
    if (_str.includes(_arr[i].toString())) {
      result = true;
      break;
    }
  }
  return result;
}

export function excludeDuplicatesFromArray(array, field) {
  return array.filter(
    (obj, index, self) =>
      index === self.findIndex((el) => el[field] === obj[field])
  );
}
