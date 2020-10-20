## Paketvy

基于 vue 全家桶的轻量级前端动态化解决方案

## 特点

- 📦 开箱即用：paketvy 内置了路由，接口请求，数据管理，国际化等常用模块，仅需安装一个依赖，即可满足日常的大多数开发需求。
- ☁️ 动态化：路由，接口请求，数据管理，以及国际化高度动态化，仅需完成对应模块的配置即可开发，无需其他冗余操作。
- 🌲 目录清晰：paketvy 将系统视为由多个模块组成，每个模块由模块元信息，页面，组件，接口请求，数据模型，国际化等组成，职责分离，由目录结构整理产生良好的规范，能够较清晰地模块结构，更便于系统维护。

## 快速上手

```bash
$ vue create paketvy-world
$ cd paketvy-world
$ yarn start
```

## 怎么用
### 推荐的目录约定
开始使用之前，因为paketvy依赖于目录结构，请大家先了解下目录约定，方便更了解下面各层的使用
```bash
├── packages
│   └── home
│       ├── block 模块的接口层
│       │   └── index.js
│       ├── vuex  模块的数据管理层
│       │   └── index.js 
│       ├── pages 模块的视图层
│       │   └── detail.vue 模块的子页面组件
│       ├── index.vue 模块的入口导航组件
│       ├── locales
│       │   ├── en-US.json i18n英文配置信息
│       │   └── zh-CN.json i18n中文配置信息
│       └── page.json 模块的路由配置信息
├── src
│   ├── App.vue  系统入口组件
│   └── main.js  入口文件
└── package.json
```

### 配置启动函数
```js
// main.js
import Paketvy from 'paketvy'
import App from './App.vue'

const paketvy = new Paketvy.Package({
  pack:{
    importFn: path => import(`../packages/${path}`),   // 指定加载的位置
    modules: ['home'] // 指定加载哪些模块【模块名与目录名一致】
  }
})

paketvy.create({
  el: '#app',
  render: (h) => h(App)
})
```

```html
// App.vue
<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
```
Paketvy.Package本质上是一个模块加载器，这里您需要通过**pack.modules**指定模块是哪些，以及通过**pack.importFn**指定从哪里加载模块

### 配置模块
> 在paketvy体系中，模块是系统组成的重要部分，由路由配置，数据配置，接口配置，若干视图，以及模块内常用的组件等组成。
> 配置模块即可完成前端开发中所需的常用功能：接口调用，持久层的状态管理（vuex状态），路由配置以及视图管理。
> 并且这一切异常简单，让我们开始吧！

```bash
├── packages
│   └── home
├── src
│   ├── App.vue  系统入口组件
│   └── main.js  入口文件
```
新建模块：在指定的模块根目录(packages)下，新建目录即可。目录名与模块名一致，例如这里的home。

### 配置视图
```bash
├── packages
│   └── home
│       ├── pages 模块的视图层
│       │   └── detail.vue 模块的子页面组件
│       └── index.vue 模块的入口导航组件
├── src
│   ├── App.vue  系统入口组件
│   └── main.js  入口文件
```

```html
// packages/home/index.vue
<template>
  <div>
    home
    <router-view></router-view>
  </div>
</template>

// packages/home/pages/detail.vue
<template>
  <div>
    detail
  </div>
</template>
```
视图管理：您可在模块目录中，通过pages目录来进行视图管理（不过这里paketvy并没有强约束视图目录，您也可以使用您常用的视图目录来进行管理，请别忘记在路由配置page.json中进行指定）

### 配置路由
```bash
├── packages
│   └── home
│       ├── pages 模块的视图层
│       │   └── detail.vue 模块的子页面组件
│       └── page.json 模块的路由配置信息
├── src
│   ├── App.vue  系统入口组件
│   └── main.js  入口文件
```

```json
{
  "name": "home",
  "desc": "主页",
  "route": {
    "path": "/home",
    "name":"homeRoot",
    "component": "/index.vue",
    "children":[
      {
        "name":"homeDetail",
        "path": "detail",
        "component": "/pages/detail.vue"
      }
    ]
  }
}
```
路由配置：您可以像在vue-router中配置路由一样，paketvy兼容vue-router。并且我们将路由配置独立出来放在模块中，与业务联系更更紧密，更方便管理路由信息。

### 配置接口
```bash
├── packages
│   └── home
│       ├── block 模块的接口层
│       │   └── index.js
│       ├── pages 模块的视图层
│       │   └── detail.vue 模块的子页面组件
│       └── page.json 模块的路由配置信息
├── src
│   ├── App.vue  系统入口组件
│   └── main.js  入口文件
```

```js
// packages/home/block/index.js
const api = {
  getList: [
    'post',
    '/api/getList/{type}',
    { expect: (res) => Array.isArray(res), initialVal: [] } // expect 预检验接口结果，如果结果不满足预期返回initialVal的值
  ],
}

const config = {
  baseURL: 'http://xxx/mock/199'
}

export default {
  api,
  config
}
```
```html
// packages/home/pages/deatil.vue
<template>
  <div>
    detail
  </div>
</template>
<script>

export default {
  name:'detail',
  methods:{
    async getUserInfo(){
      const resp = await this.$block.dispatch('home/getList',{
        params:{
          type:'easy',
          orderNo: 1
        },
        data:{
          name:'123'
        }
      })
      // 
    }
  },
  mounted(){
    this.getUserInfo()
  }
}
</script>
```
> this.$block.dispatch(apiName, payload) => promise  
> apiName：指定模块的接口名 payload：负载  
> payload.params：路径参数或者queryString的参数  
> payload.data：requestBody的参数  
> 上面操作的实际请求：http://xxx/mock/199/api/getList/easy?orderNo=1 requestBody: { "name": "123"}

配置接口：您只需在模块目录下新建block(接口层)目录以及参照上面packages/home/block/index.js配置接口即可使用接口请求
```json
注意：paketvy强约束接口层目录，即模块中的接口配置必须放在block目录中
```

### 配置数据层
```bash
├── packages
│   └── home
│       ├── vuex 模块的数据层
│       │   └── index.js
│       ├── pages 模块的视图层
│       │   └── detail.vue 模块的子页面组件
│       └── page.json 模块的路由配置信息
├── src
│   ├── App.vue  系统入口组件
│   └── main.js  入口文件
```
```js
// packages/home/vuex/index.js
export default {
  namespaced: true,
  state: ()=>({
    count:1,
  }),
  getters:{
    count: state=>{
      return state.count
    },
  },
  mutations:{
    increment (state) {
      // 变更状态
      state.count++
    }
  }
}
```
```html
<template>
  <div>
    detail
    <p>{{count}}</p>
    <button @click="increment">increment</button>
  </div>
</template>

<script>
export default {
  name:'detail',
  computed:{
    count(){
      return this.$store.getters['home/count']
    }
  },
  methods:{
    increment(){
      this.$store.commit('home/increment')
    },
  },
}
</script>
```
配置数据层：您只需在模块目录下新建vuex(数据层)目录以及参照上面packages/home/vuex/index.js配置即可使用数据管理。paketvy兼容vuex，您可以像使用vuex一样来进行数据层管理。
```json
注意：paketvy强约束数据层目录，即模块中的数据配置必须放在vuex目录中
```

### 配置国际化
```bash
├── packages
│   └── home
│       ├── locales 模块的国际化
│       │   ├── en-US.json i18n英文配置信息
│       │   └── zh-CN.json i18n中文配置信息
│       ├── pages 模块的视图层
│       │   └── detail.vue 模块的子页面组件
│       └── page.json 模块的路由配置信息
├── src
│   ├── App.vue  系统入口组件
│   └── main.js  入口文件
```
```json
// packages/home/locale/zh-CN.json
{
  "name":"你好 详情"
}
// packages/home/locale/en-US.json
{
  "name":"Hello Detail"
}
```
```html
<template>
  <div>
    detail
    <p>{{$t('home.name')}}</p>
  </div>
</template>
```

配置国际化：您只需在模块目录下新建locales(国际化)目录，再进行不同语言的配置即可
```json
注意：paketvy强约束国际化目录，即模块中的语言配置必须放在locales目录中
```

## 例子
count+api: 简单的计算+接口请求的示例
i18n: 简单的国际化示例，可手动切换语言

## LICENSE

[MIT](https://github.com/PingPong-FED/paketvy/blob/master/LICENSE)
