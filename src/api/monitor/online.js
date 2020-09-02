import request from '@/utils/request'

export function del(keys) {
  return request({
    url: 'auth/oauth/online',
    method: 'delete',
    data: keys
  })
}
