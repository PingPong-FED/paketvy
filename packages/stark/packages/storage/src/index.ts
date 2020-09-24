/*
 * @Author: suliyu
 * @Date: 2018-08-29 21:39:57
 * @Last Modified by: suliyu
 * @Last Modified time: 2019-01-04 16:23:22
 */
import {
  isObject,
  isString,
  isUndefined
} from '@stark/utils/lib/basicType/index'
import { each, extend } from '@stark/utils/lib/methods/object'
import Store from 'store'

const currDomain = () => {
  const referrer = window.location.hostname
  if (!isString(referrer)) {
    return ''
  }
  const split = referrer.split('.')
  return `${split[split.length - 2]}.${split[split.length - 1]}`
}

export default class Storage {
  // 设置存储名称
  public name!: string
  // 存储数据库
  public db: any
  // 本地存储信息
  public props: { [key: string]: any } = {}
  // 存储功能是否可用
  public disabled: boolean = true
  constructor(token: string, dbType?: string) {
    // 创建存储实例
    this.db = typeof dbType === 'string' ? this.getDBType(dbType) : Store
    this.name = token
    // 加载本地存储信息
    this.load()

    this.disabled = !this.name
  }
  public getDBType(dbType: string) {
    const engine = require('store/src/store-engine')
    const storages = [require('store/storages/localStorage')]
    if (dbType === 'cookie') {
      storages.unshift(this.cookiesPlugin())
    }
    return engine.createStore(storages)
  }

  /**
   * 重写cookieStorage
   * 根据当前一级域名设置domain
   */
  public cookiesPlugin() {
    const cookies = require('store/storages/cookieStorage')
    cookies.write = (key: string, data: any) => {
      if (!key) {
        return
      }
      window.document.cookie = `${escape(key)}=${escape(
        data
      )}; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/; domain=${currDomain()}`
    }
    return cookies
  }
  // 获取指定本地存储属性（缓存和本地）
  public get(propName: string) {
    return this.props[propName]
  }

  /**
   * 加载本地存储信息
   */
  public load() {
    const localData = this.db.get(this.name)
    if (localData) {
      this.props = extend({}, localData)
    }
  }

  // 数据保存到本地
  public save() {
    this.db.set(this.name, this.props)
  }

  /**
   * 移除所有本地数据
   */
  public removeAll() {
    this.db.removeItem(this.name)
    this.db.removeItem(this.name, true)
  }

  /**
   * 清除存储的数据
   */
  public clear() {
    this.db.clear()
    this.props = {}
  }

  /**
   * 缓存指定的数据，同时将该数据保存到本地
   * @param {Object} props
   * @returns {Boolean} 返回true表示成功
   */
  public set(props: any) {
    if (this.disabled) {
      return
    }
    if (isObject(props)) {
      extend(this.props, props)
      this.save()
      return true
    }
    return false
  }

  /**
   * 只缓存一次指定的数据，下次设置该数据时不会覆盖前一次数据
   * 若想更新已设置的属性值，那么defaultValue参数值要等于本地缓存数据中需重置的属性的值(默认值)
   * this.props[prop] === defaultValue   prop为需更新的属性
   * @param {Object} props
   * @param {*} defaultValue
   * @returns {Boolean} 返回true表示成功
   */
  public setOnce(props: any, defaultValue?: any) {
    if (this.disabled) {
      return
    }
    if (isObject(props)) {
      if (typeof defaultValue === 'undefined') {
        defaultValue = 'None'
      }
      const that = this
      each(
        props,
        function(val: any, prop: any) {
          if (!that.props[prop] || that.props[prop] === defaultValue) {
            that.props[prop] = val
          }
        },
        this
      )

      this.save()
      return true
    }
    return false
  }

  /**
   * 移除指定的缓存数据，同时也清除本地的对应数据
   * @param {string} prop
   */
  public remove(prop: string) {
    if (prop in this.props) {
      delete this.props[prop]
      this.save()
    }
  }

  /**
   * 设置一个事件计时器，记录用户触发指定事件需要的时间，同时保存到本地
   * @param {String} eventName 该计时器的名称
   * @param {Date} timestamp 该计时器开始时间戳
   */
  public setEventTimer(eventName: string, timestamp: Date) {
    const timers = this.props.costTime || {}
    timers[eventName] = timestamp
    this.props.costTime = timers
    this.save()
  }

  /**
   * 移除指定计时器，同时将本地存储的该计时器信息清除
   * @param {String} eventName
   * @returns {Date} 返回移除该计时器的时间戳
   */
  public removeEventTimer(eventName: string) {
    const timers = this.props.costTime || {}
    const timestamp = timers[eventName]
    if (!isUndefined(timestamp)) {
      delete this.props.costTime[eventName]
      this.save()
    }
    return timestamp
  }
}
