/*
 * 日志类
 * @Author: suliyu
 * @Date: 2018-08-28 17:31:00
 * @Last Modified by: suliyu
 * @Last Modified time: 2018-12-27 15:15:21
 */

import { isUndefined } from '@stark/utils/lib/basicType/index'
import { each } from '@stark/utils/lib/methods/object'

export class Log {
  public windowConsole: Console
  public debug: boolean = false
  public appName!: string
  constructor(config: { appName: string; debug: boolean }) {
    const { appName, debug } = config
    this.windowConsole = window.console
    this.appName = appName
    this.debug = !!debug
  }

  public isDebug() {
    return this.debug && !isUndefined(this.windowConsole) && this.windowConsole
  }

  public assert(condition: boolean, msg: string) {
    if (condition) {
      throw new Error(`[${this.appName}]${msg}`)
    }
  }
  public group(...args: any[]) {
    if (this.isDebug()) {
      args = [this.appName].concat(args)
      try {
        this.windowConsole.group(...args)
      } catch (err) {
        each(args, (arg: any) => {
          this.windowConsole.error(arg)
        })
      }
    }
  }
  public groupEnd() {
    if (this.isDebug()) {
      try {
        this.windowConsole.groupEnd()
      } catch (err) {
        this.windowConsole.error(err)
      }
    }
  }
  public log(...args: any[]) {
    if (this.isDebug()) {
      args = [this.appName].concat(args)
      try {
        this.windowConsole.warn.apply(this.windowConsole, args as any)
      } catch (err) {
        each(args, (arg: any) => {
          this.windowConsole.warn(arg)
        })
      }
    }
  }
  public error(...args: any[]) {
    if (this.isDebug()) {
      args = [this.appName].concat(args)
      try {
        this.windowConsole.error.apply(this.windowConsole, args as any)
      } catch (err) {
        each(args, (arg: any) => {
          this.windowConsole.error(arg)
        })
      }
    }
  }
  public browerError(...args: any[]) {
    args = [this.appName].concat(args)
    try {
      this.windowConsole.error.apply(this.windowConsole, args as any)
    } catch (err) {
      each(args, (arg: any) => {
        this.windowConsole.error(arg)
      })
    }
  }
}
