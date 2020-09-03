<template>
  <div>
    detail
    <p>{{count}}</p>
    <p>{{$t('home.name')}}</p>
    <button @click="increment">increment</button>
    <button @click="changeLocale">切换中英文</button>
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
    changeLocale(){
      const localStorage = window.localStorage
      const currentLocale = localStorage.getItem('vuepack')
      if(currentLocale){
        const currentLanguageObj = JSON.parse(currentLocale)
        currentLanguageObj.language = currentLanguageObj.language === 'zh-CN'?'en-US':'zh-CN'
        localStorage.setItem('vuepack', JSON.stringify(currentLanguageObj))
        window.location.reload()
      }
    }
  },
  mounted(){
    // console.log(this.$store)
  }
}
</script>