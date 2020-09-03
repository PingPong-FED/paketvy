<template>
  <div>
    home
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name:'home',
  methods:{
    async getUserInfo(){
      const resp = await this.$block.dispatch('home/getUserInfo')
      console.log(resp)
    }
  },
  mounted(){
    // console.log(this.$store)
    this.getUserInfo()
  }
}
</script>