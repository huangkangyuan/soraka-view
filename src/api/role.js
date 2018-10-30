import * as request from '@/utils/request'

const API_PREFIX = '/admin/role/'

export function get(id) {
  return request.GET(API_PREFIX + id)
}

export function fetchList(params) {
  return request.GET(API_PREFIX, params)
}

export function createRole(data) {
  return request.POST(API_PREFIX, data)
}

export function updateRole(data) {
  return request.PUT(API_PREFIX, data)
}

export function deleteRole(id) {
  return request.DELETE(API_PREFIX + id)
}
