export function isArray(obj: any) {
  return (
    Array.isArray ||
    function() {
      return Object.prototype.toString.apply(obj) === '[object Array]'
    }
  )
}
