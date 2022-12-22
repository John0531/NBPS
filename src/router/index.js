import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/nbps-ui',
    redirect: '/nbps-ui/login',
    children: [
      {
        path: '/nbps-ui/login',
        component: () => import('../views/Login.vue')
      },
      {
        path: '/nbps-ui/nbps',
        component: () => import('../Template/System.vue'),
        children: [
          {
            path: 'A1',
            component: () => import('../views/A/A1.vue')
          },
          {
            path: 'A2',
            component: () => import('../views/A/A2.vue')
          },
          {
            path: 'A3',
            component: () => import('../views/A/A3.vue')
          },
          {
            path: 'A4',
            component: () => import('../views/A/A4.vue')
          },
          {
            path: 'B1',
            component: () => import('../views/B/B1.vue')
          },
          {
            path: 'B4',
            component: () => import('../views/B/B4.vue')
          },
          {
            path: 'C1',
            component: () => import('../views/C/C1.vue')
          },
          {
            path: 'C2',
            component: () => import('../views/C/C2.vue')
          },
          {
            path: 'C3',
            component: () => import('../views/C/C3.vue')
          },
          {
            path: 'F2',
            component: () => import('../views/F/F2.vue')
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

// router.beforeEach((to, from, next) => {
//   const publicPages = ['/elixir-ui/login', '/elixir-ui/error'] // * 設定公開路徑(不需要 token)
//   const authRequired = !publicPages.includes(to.path)
//   const loginUser = JSON.parse(localStorage.getItem('ELIXIR_USER'))
//   if (to.path === '/elixir-ui/login' && loginUser) {
//     if (loginUser.roles === 'ADMIN') {
//       router.push('/nbps-ui/nbps/A1')
//     } else if (loginUser.roles === 'API-USER') {
//       router.push('/nbps-ui/nbps/B1')
//     }
//     return
//   }
//   // * 設定 API-USER 權限不可導入特定頁面
//   if (loginUser && loginUser.roles === 'API-USER' && to.path === '/nbps-ui/nbps/A1') {
//     router.push('/nbps-ui/nbps/error')
//     return
//   }
//   // * 非公開頁面且無登入資訊走這
//   if (authRequired && !loginUser) {
//     next('/elixir-ui/login')
//   } else if (to.path === from.path) {
//     // 點擊同一頁，無須動作
//     router.go(0)
//   } else {
//     next()
//   }
// })

export default router
