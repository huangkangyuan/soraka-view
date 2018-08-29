import * as request from '@/utils/request'

export function get(id) {
  return request.GET('/user/' + id)
}
