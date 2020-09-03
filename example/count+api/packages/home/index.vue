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
    async getTodos(){
      const resp = await this.$block.dispatch('home/getTodos',{
        params:{
          todoNo:1
        }
      })
      console.log(resp)
    }
  },
  mounted(){
    this.getTodos()
  }
}
</script>