<template>
  <div>
    detail
    <p>{{count}}</p>
    <p>{{$t('home.name')}}</p>
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
  mounted(){
  }
}
</script>