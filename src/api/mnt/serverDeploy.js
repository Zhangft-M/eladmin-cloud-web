import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'mnt/serverDeploy',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'mnt/serverDeploy',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'mnt/serverDeploy',
    method: 'put',
    data
  })
}

export default { add, edit, del }
