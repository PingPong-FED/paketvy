export function isNumber(obj: any) {
  return Object.prototype.toString.call(obj) == '[object Number]'
}
