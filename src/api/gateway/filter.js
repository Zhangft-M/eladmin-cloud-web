import request from '@/utils/request'

export function getFilterList() {
  return request({
    url: 'router/filters/all',
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: 'router/filters',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'router/filters',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'router/filters',
    method: 'put',
    data
  })
}

export default { add, edit, del }
