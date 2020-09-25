<template>
  <div>
    home
    <div>
      <p>以下为请求的数据：</p>
      <p>{{post.title}}</p>
      <p>{{post.body}}</p>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'home',
  data() {
    return {
      post: {},
    }
  },
  methods: {
    increment() {
      this.$store.commit('home/increment')
    },
    async getTodos() {
      const resp = await this.$block.dispatch('home/getRootInfo', {
        params: {
          pid: 55,
        },
      })
      this.post = resp && resp.data
    },
  },
  mounted() {
    this.getTodos()
  },
}
</script>