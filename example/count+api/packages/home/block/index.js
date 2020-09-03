const api = {
  getTodos: [
    'get',
    '/todos/{todoNo}',
    { expect: () => true, initialVal: {} }
  ],
}

const config = {
  baseURL: 'https://jsonplaceholder.typicode.com'
}

export default {
  api,
  config
}
