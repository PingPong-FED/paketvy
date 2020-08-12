import cache from './core/cache'
import Vuepack from './core/vuepack'

export * from './core/router'
export * from './core/vuepack'
export * from './guard/vuex'
export * from '@pp/block'

export default {
  Package: Vuepack,
  config: Vuepack.config,
  cache,
}
