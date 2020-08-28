import request from '@/utils/request'

export function get(dbName, tableName) {
  return request({
    url: `gen/genConfig/${dbName}/${tableName}`,
    method: 'get'
  })
}

export function update(data) {
  return request({
    url: 'gen/genConfig',
    data,
    method: 'put'
  })
}
