import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'

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
        path: `${process.env.VUE_APP_BASE_ROUTE}/changePwd`,
        component: () => import('../views/ChangePwd.vue')
      },
      {
        path: `${process.env.VUE_APP_BASE_ROUTE}/nbps-system`,
        component: () => import('../Template/System.vue'),
        children: [
          {
            path: 'A1',
            component: () => import('../views/A/A1.vue'),
            meta: {
              group: 'A',
              code: 'A1'
            }
          },
          {
            path: 'A2',
            component: () => import('../views/A/A2.vue'),
            meta: {
              group: 'A',
              code: 'A2'
            }
          },
          {
            path: 'A3',
            component: () => import('../views/A/A3.vue'),
            meta: {
              group: 'A',
              code: 'A3'
            }
          },
          {
            path: 'A4',
            component: () => import('../views/A/A4.vue'),
            meta: {
              group: 'A',
              code: 'A4'
            }
          },
          {
            path: 'B1',
            component: () => import('../views/B/B1.vue'),
            meta: {
              group: 'B',
              code: 'B1'
            }
          },
          {
            path: 'B2',
            component: () => import('../views/B/B2.vue'),
            meta: {
              group: 'B',
              code: 'B2'
            }
          },
          {
            path: 'B3',
            component: () => import('../views/B/B3.vue'),
            meta: {
              group: 'B',
              code: 'B3'
            }
          },
          {
            path: 'B4',
            component: () => import('../views/B/B4.vue'),
            meta: {
              group: 'B',
              code: 'B4'
            }
          },
          {
            path: 'C1',
            component: () => import('../views/C/C1.vue'),
            meta: {
              group: 'C',
              code: 'C1'
            }
          },
          {
            path: 'C2',
            component: () => import('../views/C/C2.vue'),
            meta: {
              group: 'C',
              code: 'C2'
            }
          },
          {
            path: 'C3',
            component: () => import('../views/C/C3.vue'),
            meta: {
              group: 'C',
              code: 'C3'
            }
          },
          {
            path: 'F1',
            component: () => import('../views/F/F1.vue'),
            meta: {
              group: 'F',
              code: 'F1'
            }
          },
          {
            path: 'F2',
            component: () => import('../views/F/F2.vue'),
            meta: {
              group: 'F',
              code: 'F2'
            }
          },
          {
            path: 'F3',
            component: () => import('../views/F/F3.vue'),
            meta: {
              group: 'F',
              code: 'F3'
            }
          },
          {
            path: 'G1',
            component: () => import('../views/G/G1.vue'),
            meta: {
              group: 'G',
              code: 'G1'
            }
          },
          {
            path: 'G2',
            component: () => import('../views/G/G2.vue'),
            meta: {
              group: 'G',
              code: 'G2'
            }
          },
          {
            path: 'G3',
            component: () => import('../views/G/G3.vue'),
            meta: {
              group: 'G',
              code: 'G3'
            }
          },
          {
            path: 'H1',
            component: () => import('../views/H/H1.vue'),
            meta: {
              group: 'H',
              code: 'H1'
            }
          },
          {
            path: 'I1',
            component: () => import('../views/I/I1.vue'),
            meta: {
              group: 'I',
              code: 'I1'
            }
          },
          {
            path: 'I2',
            component: () => import('../views/I/I2.vue'),
            meta: {
              group: 'I',
              code: 'I2'
            }
          },
          {
            path: 'I3',
            component: () => import('../views/I/I3.vue'),
            meta: {
              group: 'I',
              code: 'I3'
            }
          },
          {
            path: 'I4',
            component: () => import('../views/I/I4.vue'),
            meta: {
              group: 'I',
              code: 'I4'
            }
          },
          {
            path: 'I5',
            component: () => import('../views/I/I5.vue'),
            meta: {
              group: 'I',
              code: 'I5'
            }
          },
          {
            path: 'I6',
            component: () => import('../views/I/I6.vue'),
            meta: {
              group: 'I',
              code: 'I6'
            }
          },
          {
            path: 'I7',
            component: () => import('../views/I/I7.vue'),
            meta: {
              group: 'I',
              code: 'I7'
            }
          },
          {
            path: 'I8',
            component: () => import('../views/I/I8.vue'),
            meta: {
              group: 'I',
              code: 'I8'
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
  const publicPages = [`${process.env.VUE_APP_BASE_ROUTE}/login`, `${process.env.VUE_APP_BASE_ROUTE}/nbps-system/error`, `${process.env.VUE_APP_BASE_ROUTE}/changePwd`] // * 設定公開路徑(不需要 token)
  const authRequired = !publicPages.includes(to.path) // * 導入頁面為非公開路徑
  const loginUser = JSON.parse(localStorage.getItem('NBPS_USER'))
  // * 設定不同權限不可導入特定頁面
  if (loginUser) {
    const permissions = [] // * 頁面可訪問權限
    loginUser.envData.permissions.forEach((item1) => {
      item1.function.forEach((item2) => {
        permissions.push(item2.pageCode)
        //* 取得頁面操作權限
        if (item2.pageCode === to.meta.code) {
          store.commit('getPageBtnPermission', item2.usable)
        }
      })
    })
    if (permissions.indexOf(to.meta.code) === -1 && authRequired) {
      router.push(`${process.env.VUE_APP_BASE_ROUTE}/nbps-system/error`)
      return
    }
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
