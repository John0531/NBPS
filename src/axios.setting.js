import axios from 'axios'
import router from './router'
import store from './store'
import { v4 as uuidv4 } from 'uuid'

import AuthService from '@/services/auth.service'
import Swal from 'sweetalert2/dist/sweetalert2.js'

axios.interceptors.request.use(
  config => {
    store.commit('changeLoading', true)
    const user = JSON.parse(localStorage.getItem('NBPS_USER')) // ? 取得 LocalStorage 中的登入會員資訊
    if (user) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    if (config.method === 'post' && !config.data.msgId) {
      config.data.msgId = uuidv4()
    }
    return config
  }
)
// ?設定cross跨域 並設定訪問許可權 允許跨域攜帶cookie資訊
axios.defaults.withCredentials = false

axios.interceptors.response.use(
  config => {
    store.commit('changeLoading', false)
    return config
  },
  async err => {
    store.commit('changeLoading', false)
    // ?非 200 或非 401 的狀態顯示(ex. 500 時顯示)
    if (err.response && (err.response.status !== 200 && err.response.status !== 401)) {
      store.commit('changeLoading', false)
      // ? responseType 為 blob時，需解析 blob 資料
      if (err.response.request.responseType === 'blob') {
        const errMsg = await err.response.data.text()
        Swal.fire({
          title: `${errMsg}(${err.response.status})`,
          allowOutsideClick: true,
          confirmButtonColor: '#dc3545',
          confirmButtonText: '確認',
          backdrop: true,
          width: 400
        })
        return Promise.reject(err)
      }
      Swal.fire({
        title: err.response.status === 403 ? `權限不足(${err.response.status})` : `${err.response.data} (${err.response.status})`,
        allowOutsideClick: true,
        confirmButtonColor: '#dc3545',
        confirmButtonText: '確認',
        backdrop: true,
        width: 400
      })
      return Promise.reject(err)
    }
    if (err.response && err.response.status === 401) {
      /* token 到期，取得 refreshtoken 換發 */
      const user = JSON.parse(localStorage.getItem('NBPS_USER')) // ? 取得 LocalStorage 中的登入會員資訊
      if (user) {
        if (user.refreshToken) {
          const rftk = await AuthService.refreshTokenCheck(user)
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
