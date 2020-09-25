const api = {
  getRootInfo: [
    'get',
    '/posts/{pid}',
    { expect: data => true, initialVal: undefined, retry: { times: 3 } }
  ]
}

const config = {
  baseURL: 'http://jsonplaceholder.typicode.com'
}

export default {
  api,
  config
}
