import request from '@/utils/request'

const client_id = 'admin-web'
const client_secret = '123456'
const grant_type = 'password'
const scope = 'server'

export function login(username, password, code, uuid) {
  return request({
    url: '/auth/oauth/token',
    method: 'post',
    params: {
      username,
      password,
      code,
      uuid,
      client_id,
      client_secret,
      grant_type,
      scope
    }
  })
}

export function getInfo() {
  return request({
    url: '/sys/users/info',
    method: 'get'
  })
}

export function getCodeImg() {
  return request({
    url: 'auth/code',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: 'auth/token/logout',
    method: 'delete'
  })
}
