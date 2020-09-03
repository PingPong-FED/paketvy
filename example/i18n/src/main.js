import Vuepack from '@shield/vuepack'
import App from './App.vue'

const vuepack = new Vuepack.Package({
  pack:{
    importFn: path => import(`../packages/${path}`),
    modules: ['home']
  }
})

vuepack.create({
  el: '#app',
  render: (h) => h(App)
})

