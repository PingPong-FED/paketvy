// class State {
//   count = 1234
//   todos =  [
//     { id: 1, text: '1', done: true },
//     { id: 2, text: '2', done: false }
//   ]
// }

export default {
  namespaced: true,
  // state: new State(),
  state: ()=>({
    count:1,
    todos: [
      { id: 1, text: '...', done: true },
      { id: 2, text: '...', done: false }
    ]
  }),
  getters:{
    count: state=>{
      return state.count
    },
    doneTodos: state => {
      return state.todos.filter(todo => todo.done)
    }
  },
  mutations:{
    increment (state) {
      // 变更状态
      state.count++
    }
  }
}
