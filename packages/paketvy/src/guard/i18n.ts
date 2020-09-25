import VueI18n from 'vue-i18n'
import cache from '../core/cache'
import Import from '../core/import'
import { routerGuardGenerate } from '../core/router'

export type II18nOptions = VueI18n.I18nOptions

class PackI18n {
  public language!: string
  public loadedLanguages: string[] = []
  public i18n!: VueI18n
  public fallbackLocale!: string
  /**
   * 路由钩子
   * 进入页面前加载对应模块的语言包
   */
  public i18nRouterEnter = routerGuardGenerate(
    this.loadLanguageAsync.bind(this)
  )

  constructor(i18nConfig?: II18nOptions) {
    cache.VueConstructor.use(VueI18n)
    this.fallbackLocale = (i18nConfig && i18nConfig.fallbackLocale) || 'zh-CN'
    this.language =
      cache.storage.get('language') || navigator.language || this.fallbackLocale

    this.i18n = cache.i18n = cache.vueConf.i18n =
      (cache.packConf.inject && cache.packConf.inject.i18n) ||
      new VueI18n({
        ...i18nConfig,
        locale: this.language,
        fallbackLocale: this.fallbackLocale,
        messages: {},
      })

    // 添加路由钩子
    cache.monitor.emitAddBeforeEach(this.i18nRouterEnter)
  }

  /**
   * 变更当前语言
   */
  public async localeChange(lang: string) {
    const { currentRoute } = cache.router
    const packageNames: string[] = currentRoute.matched.map(
      (router: any) => router.meta.packageName
    )
    await this.loadLanguageAsync(packageNames, lang)
  }

  /**
   * 设定语言
   * @param lang
   */
  public setI18nLanguage(lang: string) {
    this.language = lang
    cache.storage.set({ language: lang })
    ;(document as any).querySelector('html').setAttribute('lang', lang)
    this.i18n.locale = lang
    return lang
  }

  /**
   * 懒加载业务模块的语言包
   * @param lang
   */
  public async loadLanguageAsync(packageNames: string[], lang?: string) {
    lang = typeof lang === 'string' ? lang : this.language
    // 过滤业务模块并读取配置
    const pkgConfigs = await Import.loadPkgConfig(packageNames, true)
    const filterConfigs = pkgConfigs.filter(
      (pkg: any) => !(pkg.config.i18n && pkg.config.i18n.enabled === false)
    )
    // 读取第一语言包
    const data: any = await Promise.all(
      filterConfigs.map((pkg: any) =>
        Import.importModule(pkg.config.name, `/locales/${lang}.json`)
      )
    )
    const messages: any = {}
    filterConfigs.forEach((pkg: any, index: number) => {
      messages[pkg.name] = data[index].default || data[index]
    })
    const futureLocaleMessage = {
      ...this.i18n.getLocaleMessage(lang),
      ...messages,
    }
    this.i18n.setLocaleMessage(lang, futureLocaleMessage)

    // 读取备选语言包
    const fallbackLocaleFiles: any = {}
    const fallbackLocaleData: any = await Promise.all(
      filterConfigs.map((pkg: any) =>
        Import.importModule(
          pkg.config.name,
          `/locales/${this.fallbackLocale}.json`
        )
      )
    )
    filterConfigs.forEach((pkg: any, index: number) => {
      fallbackLocaleFiles[pkg.name] =
        fallbackLocaleData[index].default || fallbackLocaleData[index]
    })
    const fallbackLocaleMessage = {
      ...this.i18n.getLocaleMessage(this.fallbackLocale),
      ...fallbackLocaleFiles,
    }
    this.i18n.setLocaleMessage(this.fallbackLocale, fallbackLocaleMessage)

    this.loadedLanguages.push(lang)
    // console.log(`第一语言${lang}，更新后的语言包：`, futureLocaleMessage)
    // console.log(
    //   `备用语言${this.fallbackLocale}，备选语言包：`,
    //   fallbackLocaleMessage
    // )
    return Promise.resolve(this.setI18nLanguage(lang))
  }
}

export default PackI18n
