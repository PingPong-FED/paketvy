const api = {
  getUserInfo: [
    'get',
    '/api/getUserInfo',
    { expect: () => false, initialVal: 123 }
  ],
}

const config = {
  baseURL: 'http://mock.pingpongx.org/mock/199'
}

export default {
  api,
  config
}
