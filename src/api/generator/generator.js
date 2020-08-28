import request from '@/utils/request'

export function getAllTable() {
  return request({
    url: 'gen/generator/tables/all',
    method: 'get'
  })
}

export function generator(dbName, tableName, type) {
  return request({
    url: `gen/generator/${dbName}/${tableName}/${type}`,
    method: 'post',
    responseType: type === 2 ? 'blob' : ''
  })
}

export function save(data) {
  return request({
    url: 'gen/generator',
    data,
    method: 'put'
  })
}

export function sync(dbName, tables) {
  return request({
    url: 'gen/generator/sync',
    method: 'post',
    params: { 'dbName': dbName },
    data: tables
  })
}

