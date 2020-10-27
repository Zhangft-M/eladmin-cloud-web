import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'sys/users',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'sys/users',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'sys/users',
    method: 'put',
    data
  })
}

export function editUser(data) {
  return request({
    url: 'sys/users/center',
    method: 'put',
    data
  })
}

export function updatePass(user) {
  const data = {
    oldPass: user.oldPass,
    newPass: user.newPass
  }
  return request({
    url: 'sys/users/updatePass/',
    method: 'post',
    data
  })
}

export function updateEmail(form) {
  const data = {
    password: form.pass,
    email: form.email
  }
  return request({
    url: 'sys/users/updateEmail/' + form.code,
    method: 'post',
    data
  })
}

export default { add, edit, del }

