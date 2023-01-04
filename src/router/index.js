import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: `${process.env.VUE_APP_BASE_ROUTE}`,
    redirect: `${process.env.VUE_APP_BASE_ROUTE}/login`,
    children: [
      {
        path: `${process.env.VUE_APP_BASE_ROUTE}/login`,
        component: () => import('../views/Login.vue')
      },
      {
        path: `${process.env.VUE_APP_BASE_ROUTE}/nbps-system`,
        component: () => import('../Template/System.vue'),
        children: [
          {
            path: 'A1',
            component: () => import('../views/A/A1.vue'),
            meta: {
              code: 'A1'
            }
          },
          {
            path: 'A2',
            component: () => import('../views/A/A2.vue'),
            meta: {
              code: 'A2'
            }
          },
          {
            path: 'A3',
            component: () => import('../views/A/A3.vue'),
            meta: {
              code: 'A3'
            }
          },
          {
            path: 'A4',
            component: () => import('../views/A/A4.vue'),
            meta: {
              code: 'A4'
            }
          },
          {
            path: 'B1',
            component: () => import('../views/B/B1.vue'),
            meta: {
              code: 'B1'
            }
          },
          {
            path: 'B4',
            component: () => import('../views/B/B4.vue'),
            meta: {
              code: 'B4'
            }
          },
          {
            path: 'C1',
            component: () => import('../views/C/C1.vue'),
            meta: {
              code: 'C1'
            }
          },
          {
            path: 'C2',
            component: () => import('../views/C/C2.vue'),
            meta: {
              code: 'C2'
            }
          },
          {
            path: 'C3',
            component: () => import('../views/C/C3.vue'),
            meta: {
              code: 'C3'
            }
          },
          {
            path: 'F1',
            component: () => import('../views/F/F1.vue'),
            meta: {
              code: 'F1'
            }
          },
          {
            path: 'F2',
            component: () => import('../views/F/F2.vue'),
            meta: {
              code: 'F2'
            }
          },
          {
            path: '/:pathMatch(.*)*',
            name: 'error',
            component: () => import('../views/PageNotFound.vue')
          }
        ]
      }
    ]
  }
]

const routeCfg = {
  history: createWebHistory(),
  scrollBehavior (to, from) {
    return {
      top: 0
    }
  }
}

routeCfg.routes = routes
const router = createRouter(routeCfg)

router.beforeEach((to, from, next) => {
  const publicPages = [`${process.env.VUE_APP_BASE_ROUTE}/login`, `${process.env.VUE_APP_BASE_ROUTE}/nbps-system/error`] // * 設定公開路徑(不需要 token)
  const authRequired = !publicPages.includes(to.path) // * 導入頁面為非公開路徑
  const loginUser = JSON.parse(localStorage.getItem('NBPS_USER'))
  // * 設定不同權限不可導入特定頁面
  if (loginUser && loginUser.envData.permissions.map((item) => item.pageCode).indexOf(to.meta.code) === -1 && authRequired) {
    router.push(`${process.env.VUE_APP_BASE_ROUTE}/nbps-system/error`)
    return
  }
  // * 非公開頁面且無登入資訊走這
  if (authRequired && !loginUser) {
    next(`${process.env.VUE_APP_BASE_ROUTE}/login`)
  } else if (to.path === from.path) {
    // 點擊同一頁，無須動作
    router.go(0)
  } else {
    next()
  }
})

export default router
