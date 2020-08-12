const api = {
  getUserInfo: [
    'get',
    '/api/getUserInfo',
    { expect: () => false, initialVal: 123 }
  ],
  getRootInfo: [
    'get',
    '/api/getRoot',
    { expect: () => true, initialVal: { a: 123 } }
  ]
}

const request = {
  success(req) {
    return req
  },

  error(err) {}
}

const response = {
  success(res) {
    return res
  },

  error(err) {}
}

const config = {
  baseURL: 'http://mock.pingpongx.org/mock/199'
}

export default {
  api,
  request,
  config
}
