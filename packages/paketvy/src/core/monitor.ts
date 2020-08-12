import EventEmitter, { EventFn } from '@stark/eventEmitter'
import { ROUTER_EVENTS, VUE_EVENTS } from '../config/eventType'

export default class Monitor extends EventEmitter {
  /**
   * 监听 初始化vue
   */
  public onInitVue(fn: EventFn) {
    this.on(VUE_EVENTS.INIT_VUE, fn)
  }

  /**
   * 触发 初始化vue
   */
  public emitInitVue(...arg: any[]) {
    this.emit(VUE_EVENTS.INIT_VUE, ...arg)
  }

  /**
   * 监听 添加路由beforeEach钩子
   */
  public onAddBeforeEach(fn: EventFn) {
    this.on(ROUTER_EVENTS.ADD_BEFORE_EACH, fn)
  }

  /**
   * 触发 添加路由afterEach钩子
   */
  public emitAddBeforeEach(...arg: any[]) {
    this.emit(ROUTER_EVENTS.ADD_BEFORE_EACH, ...arg)
  }

  /**
   * 监听 添加路由afterEach钩子
   */
  public onAddAfterEach(fn: EventFn) {
    this.on(ROUTER_EVENTS.ADD_AFTER_EACH, fn)
  }

  /**
   * 触发 添加路由afterEach钩子
   */
  public emitAddAfterEach(...arg: any[]) {
    this.emit(ROUTER_EVENTS.ADD_AFTER_EACH, ...arg)
  }
}
