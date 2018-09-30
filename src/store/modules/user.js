import { login, logout } from '@/api/login'
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
    userInfo: getStore({
      name: 'userInfo'
    }) || {},
    roles: getStore({
      name: 'roles'
    }) || [],
    permissions: getStore({
      name: 'permissions'
    }) || [],
    menu: getStore({
      name: 'menu'
    }) || []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
      setToken(token)
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
      state.permissions = permissions
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
          const data = response.data
          commit('SET_TOKEN', data.token)
          commit('SET_USER_INFO', data.user)
          commit('SET_ROLES', data.user.roles)
          commit('SET_PERMISSIONS', data.user.permissions)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_USER_INFO', [])
          commit('SET_ROLES', [])
          commit('SET_MENU', [])
          commit('SET_PERMISSIONS', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_USER_INFO', [])
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
    }
  }
}

export default user
