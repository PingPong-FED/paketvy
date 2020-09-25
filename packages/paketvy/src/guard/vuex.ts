import Vue from 'vue'
import Vuex, {
  ActionTree,
  GetterTree,
  MutationTree,
  Store,
  StoreOptions,
} from 'vuex'
import cache from '../core/cache'
import Import from '../core/import'
import { routerGuardGenerate } from '../core/router'

export type RootState = any
export type MutationTree<S> = MutationTree<S>
export type ActionTree<S> = ActionTree<S, RootState>
export type GetterTree<S> = GetterTree<S, RootState>

export type IPackStore = Store<{ [key: string]: any }>
export type IStoreOptions = StoreOptions<{ [key: string]: any }>

export default class PackVuex {
  public vuexRegisterModules: string[] = []
  public vuexUnregisterModules: string[] = []

  /**
   * 进入路由时装载vuex module
   * 全局路由钩子
   */
  public vuexRouterEnter = routerGuardGenerate(
    this.registerVuexAsync.bind(this)
  )

  /**
   * 进入路由时卸载vuex module
   * 全局路由钩子
   */
  public vuexRouterAfter = routerGuardGenerate(
    this.unRegisterVuexAsync.bind(this)
  )

  constructor(storeConfig: IStoreOptions) {
    cache.VueConstructor.use(Vuex)
    // console.log(storeConfig)

    cache.store = cache.vueConf.store =
      (cache.packConf.inject && cache.packConf.inject.store) ||
      new Vuex.Store(storeConfig)
    // 添加路由钩子
    cache.monitor.emitAddBeforeEach(this.vuexRouterEnter)
    cache.monitor.emitAddAfterEach(this.vuexRouterAfter)
  }

  /**
   * 按模块加载vuex module
   * 默认载入{vuex.path}/index.json
   * @param packageNames
   */
  public async registerVuexAsync(packageNames: string[]) {
    const pkgConfigs = await Import.loadPkgConfig(packageNames, true)
    // 需要被加载的模块
    const loadVuexModuleNames: string[] = []
    pkgConfigs.forEach((pkg: any) => {
      if (!(pkg.config.vuex && pkg.config.vuex.enabled === false)) {
        loadVuexModuleNames.push(pkg.name)
      }
      if (
        pkg.config.vuex &&
        pkg.config.vuex.dep &&
        Array.isArray(pkg.config.vuex.dep)
      ) {
        loadVuexModuleNames.push(...pkg.config.vuex.dep)
      }
    })
    // 重置要卸载的模块名称集合
    const unregisterModules = this.vuexRegisterModules.filter(
      (name: string) => !loadVuexModuleNames.includes(name)
    )
    this.vuexUnregisterModules = [
      ...this.vuexUnregisterModules,
      ...unregisterModules,
    ]
    // 重置已加载过的模块名称集合
    this.vuexRegisterModules = this.vuexRegisterModules.filter((name: string) =>
      loadVuexModuleNames.includes(name)
    )
    // 从未被加载且需要被加载的模块
    const needLoadNames = loadVuexModuleNames.filter(
      (name: string) => !this.vuexRegisterModules.includes(name)
    )
    // 读取vuex配置
    const data: any = await Promise.all(
      needLoadNames.map((name: string) =>
        Import.importModule(name, `/vuex/index`)
      )
    )

    // 加载vuex模块
    needLoadNames.forEach((name: string, index: number) => {
      // 不加载已装载或无数据的module
      if (!cache.store.state[name] && data[index].default) {
        cache.store.registerModule([name], data[index].default)
        this.vuexRegisterModules.push(name)
      }
    })

    // console.log(`当前已加载的vuex module：`, this.vuexRegisterModules)
    return Promise.resolve()
  }

  /**
   * 按模块卸载vuex module
   * 默认卸载当前路由match中不需要的模块
   * @param packageNames
   */
  public unRegisterVuexAsync() {
    if (!this.vuexUnregisterModules.length) {
      return Promise.resolve()
    }

    // router.afterEach resolve后才会触发dom更新，直接卸载vuex模块再resolve会导致前一个页面视图绑定的vuex state引用报错。所以必须使用nextTick，在新页面dom完全加载后再卸载vuex模块
    Vue.nextTick().then(() => {
      // 卸载vuex
      this.vuexUnregisterModules = this.vuexUnregisterModules.filter(
        (name: string) => {
          const flag =
            !this.vuexRegisterModules.includes(name) && cache.store.state[name]
          if (flag) {
            cache.store.unregisterModule(name)
          }
          return flag
        }
      )
      // console.log(`卸载vuex module：`, this.vuexUnregisterModules)
      this.vuexUnregisterModules = []
    })

    return Promise.resolve()
  }
}
