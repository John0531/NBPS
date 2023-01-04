import axios from 'axios'
import router from './router'
import store from './store'

import AuthService from '@/services/auth.service'
import Swal from 'sweetalert2/dist/sweetalert2.js'

axios.interceptors.request.use(
  config => {
    const user = JSON.parse(localStorage.getItem('NBPS_USER')) // ? 取得 LocalStorage 中的登入會員資訊
    if (user) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    return config
  }
)
// ?設定cross跨域 並設定訪問許可權 允許跨域攜帶cookie資訊
axios.defaults.withCredentials = false

axios.interceptors.response.use(
  config => {
    return config
  },
  async err => {
    // ?非 200 或非 401 的狀態顯示(ex. 500 時顯示)
    if (err.response && (err.response.status !== 200 && err.response.status !== 401)) {
      store.commit('changeLoading', false)
      console.log(err)
      Swal.fire({
        title: err.response.data,
        allowOutsideClick: true,
        confirmButtonColor: '#dc3545',
        confirmButtonText: '確認',
        backdrop: true,
        width: 400
      })
      console.log(err)
      return Promise.reject(err)
    }
    if (err.response && err.response.status === 401) {
      /* token 到期，取得 refreshtoken 換發 */
      const user = JSON.parse(localStorage.getItem('NBPS_USER')) // ? 取得 LocalStorage 中的登入會員資訊
      if (user) {
        if (user.refreshToken) {
          const rftk = await AuthService.refreshTokenCheck()
          if (rftk) {
            return Promise.reject(err)
          } else {
            AuthService.logout()
            store.commit('changeLoading', false)
            Swal.fire({
              title: '請重新登入',
              allowOutsideClick: false,
              confirmButtonColor: '#dc3545',
              confirmButtonText: '確認',
              backdrop: true,
              width: 400
            }).then((result) => {
              if (result.isConfirmed) {
                router.push(`${process.env.VUE_APP_BASE_ROUTE}/login`)
                router.go()
              }
            })
            return Promise.reject(err)
          }
        }
      } else {
        store.commit('changeLoading', false)
        Swal.fire({
          title: '請先登入',
          allowOutsideClick: false,
          confirmButtonColor: '#dc3545',
          confirmButtonText: '確認',
          backdrop: true,
          width: 400
        }).then((result) => {
          if (result.isConfirmed) {
            AuthService.logout()
            router.push(`${process.env.VUE_APP_BASE_ROUTE}/login`)
          }
        })
      }
    }
  }
)
