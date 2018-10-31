import { validatenull } from '@/utils/validate'
/* Layout */
import Layout from '@/views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const defaultRouter = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/sys/user/profile',
    component: Layout,
    hidden: true,
    children: [{
      path: '/sys/user/profile',
      component: () => import('@/views/sys/user/profile'),
      name: '个人资料',
      meta: { title: '个人资料', icon: 'user' }
    }]
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      name: 'dashboard',
      meta: { title: '首页', icon: 'dashboard', noCache: true }
    }]
  },

  { path: '*', redirect: '/404', hidden: true }
]

/**
 * 初始化菜单
 */
export const initMenu = (router, menu) => {
  if (menu.length === 0) {
    return
  }
  router.addRoutes(formatRoutes(menu))
  const menuRouter = [].concat(defaultRouter, formatRoutes(menu))
  router.options.routes = menuRouter
}

/**
 * 格式化路由数据
 */
export const formatRoutes = (menu) => {
  const aRouter = []
  menu.forEach(oMenu => {
    const {
      name,
      path,
      component,
      meta: {
        icon,
        title
      },
      children
    } = oMenu
    if (!validatenull(component)) {
      const oRouter = {
        name: name,
        path: path,
        alwaysShow: true,
        meta: {
          icon: icon,
          title: title
        },
        component: resolve => {
          let componentPath = ''
          if (component === 'Layout') {
            require(['@/views/layout/Layout'], resolve)
            return
          } else {
            componentPath = component
          }
          require([`@/${componentPath}.vue`], resolve)
        },
        children: validatenull(children) ? [] : formatRoutes(children)
      }
      aRouter.push(oRouter)
    }
  })
  return aRouter
}
