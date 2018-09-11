import * as request from '@/utils/request'

const API_PREFIX = '/dept/'

export function get(id) {
  return request.GET(API_PREFIX + id)
}

export function fetchList(params) {
  return request.GET(API_PREFIX, params)
}

export function createDept(data) {
  return request.POST(API_PREFIX, data)
}

export function updateDept(data) {
  return request.PUT(API_PREFIX, data)
}

export function deleteDept(id) {
  return request.DELETE(API_PREFIX + id)
}
