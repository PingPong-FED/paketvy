/*
 * @Author: suliyu
 * @Date: 2018-11-12 16:30:55
 * @Last Modified by: suliyu
 * @Last Modified time: 2019-01-04 20:41:17
 */

import EventEmitter3 from 'eventemitter3/index.d'

const EventEmitter = require('eventemitter3')

export type EventFn = (...arg: any[]) => any

export default class Eventmitter {
  public eventEmitter!: EventEmitter3
  constructor() {
    this.eventEmitter = new EventEmitter()
  }

  /**
   * 公共触发事件接口
   * @param eventName
   * @param arg
   */
  public emit(eventName: string, ...arg: any[]) {
    this.eventEmitter.emit(eventName, eventName, ...arg)
  }

  /**
   * 公共触发事件接口
   * @param eventName
   * @param arg
   */
  public on(eventName: string, fn: EventFn) {
    this.eventEmitter.on(eventName, (eventName, ...arg: any[]) =>
      fn(eventName, ...arg)
    )
  }
}
