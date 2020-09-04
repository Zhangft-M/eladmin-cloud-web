import request from '@/utils/request'

export function testDbConnect(data) {
  return request({
    url: 'mnt/database/testConnect',
    method: 'post',
    data
  })
}

export function testServerConnect(data) {
  return request({
    url: 'mnt/serverDeploy/testConnect',
    method: 'post',
    data
  })
}
