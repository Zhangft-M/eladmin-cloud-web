import request from '@/utils/request'

export function get(id) {
  return request({
    url: `router/${id}`,
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: 'router',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'router/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'router',
    method: 'put',
    data
  })
}

export function editPredicate(data) {
  return request({
    url: 'router/predicate',
    method: 'put',
    data
  })
}

export function editFilter(data) {
  return request({
    url: 'router/filter',
    method: 'put',
    data
  })
}

export default { get, add, edit, del, editPredicate, editFilter }
