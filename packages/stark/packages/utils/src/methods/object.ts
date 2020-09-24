/*
 * @Author: suliyu
 * @Date: 2018-08-29 21:36:36
 * @Last Modified by: suliyu
 * @Last Modified time: 2018-08-29 21:37:00
 */

import { isObject } from '../basicType'
export function each(obj: any, iterator: any, context?: any) {
  const breaker = {}
  if (obj === null || obj === undefined) {
    return
  }
  if (Array.prototype.forEach && obj.forEach === Array.prototype.forEach) {
    obj.forEach(iterator, context)
  } else if (obj.length === +obj.length) {
    for (let i = 0, l = obj.length; i < l; i++) {
      if (i in obj && iterator.call(context, obj[i], i, obj) === breaker) {
        return
      }
    }
  } else {
    for (const key in obj) {
      if (obj.hasOwnProperty.call(obj, key)) {
        if (iterator.call(context, obj[key], key, obj) === breaker) {
          return
        }
      }
    }
  }
}

export function extend(obj: any, ...exObj: any[]) {
  each(exObj, (source: any) => {
    for (const prop in source) {
      if (source[prop] !== void 0) {
        obj[prop] = source[prop]
      }
    }
  })
  return obj
}

// 对象的字段值截取
export function truncate(obj: any, length: any) {
  let ret: any
  if (typeof obj === 'string') {
    ret = obj.slice(0, length)
  } else if (Array.isArray(obj)) {
    ret = []
    each(obj, function(val: any) {
      ret.push(truncate(val, length))
    })
  } else if (isObject(obj)) {
    ret = {}
    each(obj, function(val: any, key: string) {
      ret[key] = truncate(val, length)
    })
  } else {
    ret = obj
  }
  return ret
}
