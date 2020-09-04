import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'mnt/database',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'mnt/database',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'mnt/database',
    method: 'put',
    data
  })
}

export function testDbConnection(data) {
  return request({
    url: 'mnt/database/testConnect',
    method: 'post',
    data
  })
}

export default { add, edit, del, testDbConnection }
