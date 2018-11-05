import { login, getUserInfo } from '@/api/login'
import { getUserMenu } from '@/api/menu'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { setStore, getStore } from '@/utils/store'
/**
 * Token存到Cookie里
 * 用户和权限、路由信息存到session里
 */
const user = {
  state: {
    token: getToken(),
    refreshToken: getStore({
      name: 'refreshToken'
    }) || {},
    userInfo: getStore({
      name: 'userInfo'
    }) || {},
    roles: getStore({
      name: 'roles'
    }) || [],
    permissions: getStore({
      name: 'permissions'
    }) || {},
    menu: getStore({
      name: 'menu'
    }) || []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
      setToken(token)
    },
    SET_REFRESH_TOKEN: (state, refreshToken) => {
      state.refreshToken = refreshToken
      setStore({
        name: 'refreshToken',
        content: state.refreshToken,
        type: 'session'
      })
    },
    SET_USER_INFO: (state, userInfo) => {
      state.userInfo = userInfo
      setStore({
        name: 'userInfo',
        content: state.userInfo,
        type: 'session'
      })
    },
    SET_PERMISSIONS: (state, permissions) => {
      // 权限以map形式存储，降低取数复杂度
      const perms = {}
      for (let i = 0; i < permissions.length; i++) {
        perms[permissions[i]] = true
      }
      state.permissions = perms
      setStore({
        name: 'permissions',
        content: state.permissions,
        type: 'session'
      })
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
      setStore({
        name: 'menu',
        content: state.menu,
        type: 'session'
      })
    },
    SET_MENU: (state, menu) => {
      state.menu = menu
      setStore({
        name: 'menu',
        content: state.menu,
        type: 'session'
      })
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(response => {
          const data = response
          commit('SET_TOKEN', data.access_token)
          commit('SET_REFRESH_TOKEN', data.refresh_token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        // 暂时只支持伪退出
        commit('SET_TOKEN', '')
        commit('SET_REFRESH_TOKEN', '')
        commit('SET_USER_INFO', '')
        commit('SET_ROLES', [])
        commit('SET_MENU', [])
        commit('SET_PERMISSIONS', [])
        removeToken()
        resolve()
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_REFRESH_TOKEN', '')
        commit('SET_USER_INFO', '')
        commit('SET_ROLES', [])
        commit('SET_MENU', [])
        commit('SET_PERMISSIONS', [])
        removeToken()
        resolve()
      })
    },

    // 获取系统菜单
    GetMenu({ commit }) {
      return new Promise(resolve => {
        getUserMenu().then(response => {
          const data = response.data
          commit('SET_MENU', data)
          resolve(data)
        })
      })
    },

    // 获取用户信息
    GetUserInfo({ commit }) {
      return new Promise(resolve => {
        getUserInfo().then(response => {
          const data = response
          commit('SET_USER_INFO', data.user)
          commit('SET_PERMISSIONS', data.permissions)
          resolve(data)
        })
      })
    }
  }
}

export default user
