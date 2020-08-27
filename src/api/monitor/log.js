import request from '@/utils/request'

export function getErrDetail(id) {
  return request({
    url: 'log/logs/error/' + id,
    method: 'get'
  })
}

export function delAllError() {
  return request({
    url: 'log/logs/del/error',
    method: 'delete'
  })
}

export function delAllInfo() {
  return request({
    url: 'log/logs/del/info',
    method: 'delete'
  })
}
