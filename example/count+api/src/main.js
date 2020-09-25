import Paketvy from 'paketvy'
// import Paketvy from '../../../packages/paketvy/lib'
import App from './App.vue'

const paketvy = new Paketvy.Package({
  pack: {
    importFn: path => import(`../packages/${path}`),
    modules: ['home']
  }
})

paketvy.create({
  el: '#app',
  render: h => h(App)
})
