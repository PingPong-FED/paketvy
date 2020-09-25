import Storage from '@paketvy/storage'
import { isFunction, isObject } from '@paketvy/utils/lib/basicType/index'
import blockStore from '@ppfed/block/dist/core/store'
import Vue, { ComponentOptions } from 'vue'
import VueI18n from 'vue-i18n'
import VueRouter from 'vue-router'
import PackBlock, { IBlockOptions } from '../guard/block'
import PackI18n, { II18nOptions } from '../guard/i18n'
import PackVuex, { IPackStore, IStoreOptions } from '../guard/vuex'
import cache, { Cache } from './cache'
import PackRouter, { IRouterConfig } from './router'
export type IVueConfig = ComponentOptions<Vue>

export interface IPackConfig {
  // package配置
  pack: {
    // 是否启用package架构
    enabled?: boolean
    // package的import函数
    importFn: (path: string) => Promise<any>
    // 所有package模块的名称
    modules: string[]
    // 在任何情况下都会加载的模块
    externalModules?: string[]
    // 是否启用vuex，默认启用
    useVuex?: boolean
    // 是否启用i18n，默认启用
    useI18n?: boolean
    // 是否启用block，默认启用
    useBlock?: boolean
  }
  // inject注入的示例
  inject?: {
    router: VueRouter
    blockStore: blockStore
    store: IPackStore
    i18n: VueI18n
  }
  // router配置项
  router?: IRouterConfig
  // vuex配置项
  vuex?: IStoreOptions
  // block配置项
  block?: IBlockOptions
  // i18n配置项
  i18n?: II18nOptions
  // vue初始化前的钩子
  beforeCreate?: (cache: Cache) => void
  created?: (cache: Cache) => void
  // vue实例初始化后的钩子
  mounted?: (cache: Cache) => void
}

export default class Vuepack {
  /**
   * 获取cache的属性
   */
  public static config(): Cache {
    return cache
  }
  public packConf!: IPackConfig
  public vue!: Vue
  public packRouter!: PackRouter
  constructor(packConf?: IPackConfig) {
    // pack配置项
    if (packConf && isObject(packConf)) {
      const externalModules = packConf.pack.externalModules
      packConf.pack.externalModules = Array.isArray(externalModules)
        ? externalModules
        : []
      this.packConf = cache.packConf = packConf
    }
    cache.VueConstructor = Vue
    // 创建缓存
    cache.storage = new Storage('paketvy', 'cookie')
    cache.storage.load()
    this.init()
  }

  /**
   * 路由注入并初始化vue
   */
  public create(vueConf: any) {
    // vue配置项
    if (!isObject(vueConf)) {
      return
    }
    cache.vueConf = { ...cache.vueConf, ...vueConf }
    this.packRouter.start().then(() => cache.monitor.emitInitVue())
  }

  /**
   * 初始化框架
   */
  private init() {
    // 监听 添加路由beforeEach钩子
    cache.monitor.onAddBeforeEach((...arg: any[]) =>
      cache.beforeEachHooks.push(arg[1])
    )
    // 监听 添加路由afterEach钩子
    cache.monitor.onAddAfterEach((...arg: any[]) =>
      cache.afterEachHooks.push(arg[1])
    )
    // 监听 初始化vue
    cache.monitor.onInitVue(this.initVue.bind(this))

    const { beforeCreate } = this.packConf
    if (beforeCreate && isFunction(beforeCreate)) {
      beforeCreate(cache)
    }

    // 加载package生态
    this.packConf.pack.enabled !== false ? this.initPack() : this.initRouter()
  }

  /**
   * 初始化vue
   */
  private initVue() {
    cache.VueConstructor.config.productionTip = false

    this.vue = cache.vue = new cache.VueConstructor(cache.vueConf)
    // 生命周期
    const { mounted } = this.packConf
    if (mounted && isFunction(mounted)) {
      mounted(cache)
    }
  }

  /**
   * 初始化router
   */
  private initRouter() {
    this.packRouter = new PackRouter(this.packConf.router)
  }

  /**
   * 初始化pack
   */
  private initPack() {
    this.packConf.vuex = this.packConf.vuex ? this.packConf.vuex : {}
    // 加载i18n
    if (this.packConf.pack.useI18n !== false) {
      cache.packI18n = new PackI18n(this.packConf.i18n)
    }
    // 加载block
    if (this.packConf.pack.useBlock !== false) {
      cache.packBlock = new PackBlock(this.packConf.block)
      this.packConf.vuex.plugins = Array.isArray(this.packConf.vuex.plugins)
        ? [...this.packConf.vuex.plugins, cache.block.vuexPlugin]
        : [cache.block.vuexPlugin]
    }
    // 加载vuex
    if (this.packConf.pack.useVuex !== false) {
      cache.packVuex = new PackVuex(this.packConf.vuex)
    }

    // vuex的路由钩子要优先于用户自定义的钩子
    this.initRouter()

    const { created } = this.packConf
    if (created && isFunction(created)) {
      created(cache)
    }
  }
}
