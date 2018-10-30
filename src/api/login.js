import request from '@/utils/request'

export function login(username, password) {
  var grant_type = 'password'
  var scope = 'server'
  return request({
    url: '/auth/oauth/token',
    method: 'post',
    headers: {
      'Authorization': 'Basic c29yYWthOnNvcmFrYQ=='
    },
    params: { username, password, grant_type, scope }
  })
}

export function getUserInfo() {
  return request({
    url: '/admin/user/info',
    method: 'get'
  })
}
