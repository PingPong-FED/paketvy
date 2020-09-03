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
      const SIGN_NAME = 'paketvy'
      const currentLocale = localStorage.getItem(SIGN_NAME)
      if(currentLocale){
        const currentLanguageObj = JSON.parse(currentLocale)
        currentLanguageObj.language = currentLanguageObj.language === 'zh-CN'?'en-US':'zh-CN'
        localStorage.setItem(SIGN_NAME, JSON.stringify(currentLanguageObj))
        window.location.reload()
      }
    }
  },
}
</script>