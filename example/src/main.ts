// import Vue from 'vue'
import App from './App.vue'
// import router from './router'
import store from './store'

// new Vue({
//   router,
//   store,
//   render: h => h(App)
// }).$mount('#app')
import Vuepack from '@paketvy/paketvy/src/index'
const vuepack = new Vuepack.Package({
  pack: {
    importFn: path => import(`../package/${path}`),
    modules: ['home']
  }
})

vuepack.create({
  el: '#app',
  render: (h: any) => h(App)
})
