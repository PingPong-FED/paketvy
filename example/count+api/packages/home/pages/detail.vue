<template>
  <div>
    detail
    <p>{{count}}</p>
    <p>{{$t('home.name')}}</p>
    <button @click="increment">increment</button>
    <div>
      <p>{{post.title}}</p>
      <p>{{post.body}}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'detail',
  data() {
    return {
      post: {},
    }
  },
  computed: {
    count() {
      return this.$store.getters['home/count']
    },
  },
  methods: {
    increment() {
      this.$store.commit('home/increment')
    },
  },
}
</script>