import Storage from '@paketvy/storage'
import blockStore from '@ppfed/block/dist/core/store'
import Vue, { VueConstructor } from 'vue'
import VueI18n from 'vue-i18n'
import VueRouter, { NavigationGuard } from 'vue-router'
import PackBlock from '../guard/block'
import PackI18n from '../guard/i18n'
import PackVuex, { IPackStore } from '../guard/vuex'
import Monitor from './monitor'
import { IAfterEach } from './router'
import { IPackConfig } from './vuepack'
export class Cache {
  public storage!: Storage
  // vue配置项
  public vueConf: any = {}
  // pack配置项
  public packConf!: IPackConfig
  // 事件收集
  public monitor!: Monitor
  // beforeEach钩子收集器
  public beforeEachHooks: NavigationGuard[] = []
  // afterEach钩子收集器
  public afterEachHooks: IAfterEach = []
  // vue构造器
  public VueConstructor!: VueConstructor
  // vue实例
  public vue!: Vue
  // router实例
  public router!: VueRouter
  // vuex store实例
  public store!: IPackStore
  // i18n实例
  public i18n!: VueI18n
  // block实例
  public block!: blockStore
  // vuepack的i18n实例
  public packI18n!: PackI18n
  // vuepack的block实例
  public packBlock!: PackBlock
  // vuepack的vuex实例
  public packVuex!: PackVuex
  constructor() {
    this.monitor = new Monitor()
  }
}

export default new Cache()
