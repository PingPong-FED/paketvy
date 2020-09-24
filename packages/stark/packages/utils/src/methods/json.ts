/*
 * @Author: suliyu
 * @Date: 2018-08-29 21:36:26
 * @Last Modified by:   suliyu
 * @Last Modified time: 2018-08-29 21:36:26
 */
// 转化成json
export function JSONDecode(string: string) {
  try {
    return JSON.parse(string)
  } catch (error) {
    return {}
  }
}

// json转化为string
export function JSONEncode(json: any) {
  try {
    return JSON.stringify(json)
  } catch (error) {
    return ''
  }
}
