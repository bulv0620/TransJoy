/**
 * 基础路由
 * @type { *[] }
 */

const constantRouterMap = [
  {
    path: '/',
    name: 'Example',
    component: () => import('@/layout/index.vue')
  },
]

export default constantRouterMap