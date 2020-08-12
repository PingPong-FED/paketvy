import cache from './cache'

export default class Import {
  /**
   * 动态加载模块
   * 默认加载 packages/${modulesName}/page.json
   * @param moduleName
   * @param resourcePath
   */
  public static importModule(
    moduleName: string,
    resourcePath: string = '/page.json'
  ) {
    moduleName = moduleName.split('/')[0]
    resourcePath = resourcePath[0] === '/' ? resourcePath : `/${resourcePath}`
    const path = `${moduleName}${resourcePath}`
    // return import(/* webpackChunkName: "pkgs-[request]-[index]------" */
    // `package/${moduleName}${resourcePath}`).catch(() => ({}))
    return cache.packConf.pack.importFn(path).catch(() => ({}))
  }

  /**
   * 读取业务模块的配置
   * 默认读取所有模块的配置
   * @param pkgs 数组为多个，string为单个
   */
  public static async loadPkgConfig(pkgs?: string[] | string, mark?: boolean) {
    let flag = true
    const modules = [
      ...new Set([
        ...cache.packConf.pack.modules,
        ...(cache.packConf.pack.externalModules || [])
      ])
    ]
    // 默认读取所有配置
    if (!pkgs) {
      flag = false
      pkgs = modules || []
    }
    let data: any
    // 读取单个配置
    if (typeof pkgs === 'string' && modules.includes(pkgs)) {
      data = await this.importModule(pkgs)
      if (mark) {
        data = {
          name: pkgs,
          config: data
        }
      }
    }

    // 读取多个配置
    if (Array.isArray(pkgs)) {
      pkgs = [
        ...new Set([...pkgs, ...(cache.packConf.pack.externalModules || [])])
      ]
      if (flag) {
        pkgs = pkgs.filter(name => modules.includes(name))
      }
      data = await Promise.all(
        pkgs.map((name: string) => this.importModule(name))
      )

      if (mark) {
        data = pkgs.map((name: string, index: number) => ({
          name,
          config: data[index]
        }))
      }
    }

    return data
  }
}
