import Block, { StoreOptions } from '@pp/block'
import BlockStore from '@pp/block/dist/core/store'
import Vue from 'vue'
import cache from '../core/cache'
import Import from '../core/import'
import { routerGuardGenerate } from '../core/router'

export type IBlockStore = BlockStore
export type IBlockOptions = StoreOptions
export default class PackBlock {
  public blockStore!: BlockStore
  public registerModules: string[] = []
  /**
   * 路由钩子
   * 进入页面前加载对应模块的语言包
   */
  public blockRouterEnter = routerGuardGenerate(this.loadBlockAsync.bind(this))

  constructor(blockConfig?: StoreOptions) {
    const config = {
      modules: {},
      Vue,
      ...blockConfig,
    }
    this.blockStore = cache.block =
      (cache.packConf.inject && cache.packConf.inject.blockStore) ||
      new Block.Store(config)
    // 添加路由钩子
    cache.monitor.emitAddBeforeEach(this.blockRouterEnter)
  }

  /**
   * 按需加载block模块
   * @param packageNames
   */
  public async loadBlockAsync(packageNames: string[]) {
    // 过滤业务模块并读取配置
    const pkgConfigs = await Import.loadPkgConfig(packageNames, true)
    const loadModuleNames: string[] = []
    pkgConfigs.forEach((pkg: any) => {
      if (!(pkg.config.block && pkg.config.block.enabled === false)) {
        loadModuleNames.push(pkg.name)
      }
      if (
        pkg.config.block &&
        pkg.config.block.dep &&
        Array.isArray(pkg.config.block.dep)
      ) {
        loadModuleNames.push(...pkg.config.block.dep)
      }
    })
    // 从未被加载且需要被加载的模块
    const needLoadNames = loadModuleNames.filter(
      (name: string) => !this.registerModules.includes(name)
    )

    // 读取block配置
    const data: any = await Promise.all(
      needLoadNames.map((name: string) =>
        Import.importModule(name, `/block/index.ts`)
      )
    )

    // 加载block模块
    needLoadNames.forEach((name: string, index: number) => {
      // 不加载已装载或无数据的module
      if (data[index].default) {
        cache.block.registerModule({
          [name]: data[index].default,
        })
        this.registerModules.push(name)
      }
    })
    console.log(`当前已加载的block module：`, this.registerModules)
    return Promise.resolve()
  }
}
