import * as request from '@/utils/request'

const API_PREFIX = '/admin/menu/'

export function get(id) {
  return request.GET(API_PREFIX + id)
}

export function fetchList(params) {
  return request.GET(API_PREFIX, params)
}

export function createMenu(data) {
  return request.POST(API_PREFIX, data)
}

export function updateMenu(data) {
  return request.PUT(API_PREFIX, data)
}

export function deleteMenu(id) {
  return request.DELETE(API_PREFIX + id)
}

export function getUserMenu() {
  return request.GET(API_PREFIX + 'userMenu')
}

export function getMenuTree() {
  return request.GET(API_PREFIX + 'tree')
}
