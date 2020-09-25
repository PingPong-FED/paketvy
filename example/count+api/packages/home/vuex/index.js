export default {
  namespaced: true,
  state: () => ({
    count: 1,
    todos: [
      { id: 1, text: '...', done: true },
      { id: 2, text: '...', done: false }
    ]
  }),
  getters: {
    count: state => {
      return state.count
    },
    doneTodos: state => {
      return state.todos.filter(todo => todo.done)
    }
  },
  mutations: {
    increment(state) {
      // 变更状态
      state.count++
    }
  }
}
