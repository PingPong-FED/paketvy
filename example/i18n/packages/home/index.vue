<template>
  <div>
    <p>{{$t('home.name')}}</p>
    <button @click="changeLocale">切换中英文</button>
  </div>
</template>

<script>
export default {
  name:'home',
  methods:{
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
}
</script>