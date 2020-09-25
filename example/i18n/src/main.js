import Paketvy from 'paketvy'
import App from './App.vue'

const paketvy = new Paketvy.Package({
  pack: {
    importFn: (path) => import(`../packages/${path}`),
    modules: ['home'],
  },
})

paketvy.create({
  el: '#app',
  render: (h) => h(App),
})
