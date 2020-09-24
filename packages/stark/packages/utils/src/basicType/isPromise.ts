export function isPromise(val: any) {
  return val && typeof val.then === 'function'
}
