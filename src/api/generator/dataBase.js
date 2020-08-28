import request from '@/utils/request'

export function getDatabase() {
  return request({
    url: 'gen/database/',
    method: 'get'
  })
}
