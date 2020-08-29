import request from '@/utils/request'

export function getPredicateList() {
  return request({
    url: 'router/predicates/all',
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: 'router/predicates',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'router/predicates',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'router/predicates',
    method: 'put',
    data
  })
}

export default { add, edit, del }
