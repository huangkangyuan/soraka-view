import * as request from '@/utils/request'

const API_PREFIX = '/user/'

export function get(id) {
  return request.GET(API_PREFIX + id)
}

export function fetchList(params) {
  return request.GET(API_PREFIX, params)
}

export function createUser(data) {
  return request.POST(API_PREFIX, data)
}

export function updateUser(data) {
  return request.PUT(API_PREFIX, data)
}

export function deleteUser(id) {
  return request.DELETE(API_PREFIX + id)
}

export function getUserRoles(id) {
  return request.GET(API_PREFIX + id + '/role')
}
