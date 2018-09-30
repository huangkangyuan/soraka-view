const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  roles: state => state.user.roles,
  permissions: state => state.user.permissions,
  userInfo: state => state.user.userInfo,
  menu: state => state.user.menu
}
export default getters
