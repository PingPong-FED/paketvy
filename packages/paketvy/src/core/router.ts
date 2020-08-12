import Vue from 'vue'
import VueRouter, {
  NavigationGuard,
  Route,
  RouteConfig,
  RouterOptions,
} from 'vue-router'
import cache from './cache'
import Import from './import'

export type IAfterEach = Array<(to: Route, from: Route) => any>
export interface IRouterConfig extends RouterOptions {
  beforeEach?: NavigationGuard[]
  afterEach?: IAfterEach
}

/**
 * 统一的高阶路由钩子
 * 用于生成各个模块路由事件
 * @param fn
 */
export const routerGuardGenerate = (
  fn: (pkgName: string[], ...params: any) => Promise<any>
) => {
  return (...params: any[]) => {
    const [to, from, next] = params
    let packageNames: string[] = to.matched.map(
      (router: any) => router.meta.packageName
    )
    packageNames = [...new Set(packageNames)]
    fn(packageNames, ...params).then(() => {
      if (next) {
        next()
      }
    })
  }
}

export default class PackRouter {
  public router: VueRouter
  constructor(routerConfig?: IRouterConfig) {
    const { beforeEach = [], afterEach = [], ...routerOpt } = routerConfig || {}
    cache.monitor.emitAddBeforeEach(...beforeEach)
    cache.monitor.emitAddAfterEach(...afterEach)

    this.router = cache.router = cache.vueConf.router = this.generateRouteIns(
      routerOpt
    )
  }

  /**
   * 启动路由
   * 加载所有钩子
   */
  public async start() {
    cache.beforeEachHooks.forEach((fn) => {
      this.router.beforeEach(fn)
    })
    cache.afterEachHooks.forEach((fn) => {
      this.router.afterEach(fn)
    })
    await this.addRoute()
    return new Promise((resolve) => resolve())
  }

  /**
   * 动态加载路由
   * @param router
   */
  public async addRoute() {
    const moduleConf = await Import.loadPkgConfig()
    let routeConf = moduleConf.map((config: any) =>
      this.generateRoute((config as any).name, (config as any).route)
    )
    routeConf = routeConf.filter((conf: any) => !!conf)
    const routeConfResult = this.dependencyAnalysis(routeConf)
    console.log('动态加载路由表：', routeConfResult)
    this.router.addRoutes(routeConfResult)
    return new Promise((resolve) => resolve())
  }

  /**
   * 递归生成路由表
   * 默认使用 packages/${module}/page.json
   * @param packageName
   * @param routeConf
   */
  public generateRoute(packageName: string, routeConf: any) {
    if (!routeConf || routeConf.enabled === false) {
      return
    }
    const { component, children, meta, ...conf } = routeConf

    const config: RouteConfig = {
      ...conf,
      component: () => Import.importModule(packageName, component),
      meta: {
        ...meta,
        packageName,
      },
    }
    if (Array.isArray(children) && children.length > 0) {
      const child: RouteConfig[] = []
      children.forEach((childRouteConf) => {
        const temp = this.generateRoute(packageName, childRouteConf)
        if (temp) {
          child.push(temp)
        }
      })
      config.children = child
    }
    return config
  }

  /**
   * 路由依赖分析
   * 默认使用route.parentPackage作为上一级模块的依赖
   * @param routeConf
   */
  public dependencyAnalysis(routeConf: any) {
    // 根据依赖长度进行分级
    let parentLength: any[] = []
    routeConf.forEach((route: any) => {
      const length = Array.isArray(route.parentPackage)
        ? route.parentPackage.length
        : 0
      const lengthObj = parentLength[length]
      const temp = { [route.meta.packageName]: route }
      parentLength[length] = lengthObj ? { ...lengthObj, ...temp } : temp
    })
    parentLength = parentLength.reverse()
    const flag = parentLength.length - 2
    // 分级从后往前合并children
    parentLength.forEach((routeArr: any, lv: number) => {
      if (flag - lv >= 0) {
        Object.values(routeArr).forEach((route: any) => {
          const parentName = route.parentPackage[flag - lv]
          const parent = parentLength[lv + 1][route.parentPackage[flag - lv]]
          if (!parent) {
            throw new Error(
              `${parentName}模块不存在，请修改${route.meta.packageName}的路由依赖`
            )
          }
          let oldChildren = parent.children
          oldChildren = Array.isArray(oldChildren) ? oldChildren : []
          parent.children = [...oldChildren, route]
        })
      }
    })
    const routes: RouteConfig[] = Object.values(
      parentLength[parentLength.length - 1]
    )
    return routes
  }

  /**
   * 产生router实例
   */
  private generateRouteIns(routerOpt: IRouterConfig): any {
    const isInjectRouter = cache.packConf.inject && cache.packConf.inject.router
    const routerIns: any =
      cache.packConf.inject && isInjectRouter
        ? cache.packConf.inject.router
        : new VueRouter(routerOpt)

    if (!isInjectRouter) {
      Vue.use(VueRouter)
    }
    return routerIns
  }
}
