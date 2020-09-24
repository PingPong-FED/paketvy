/*
 * @Author: suliyu 
 * @Date: 2018-08-29 21:36:39 
 * @Last Modified by:   suliyu 
 * @Last Modified time: 2018-08-29 21:36:39 
 */
export function trim(str: string) {
  if (!str) {
    return
  }
  return str.replace(/(^\s*)|(\s*$)/g, '')
}
