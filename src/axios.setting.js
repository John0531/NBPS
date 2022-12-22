import axios from 'axios'
import router from './router'

import AuthService from '@/services/auth.service'
import Swal from 'sweetalert2/dist/sweetalert2.js'

axios.interceptors.request.use(
  config => {
    const user = JSON.parse(localStorage.getItem('ELIXIR_USER')) // ? 取得 LocalStorage 中的登入會員資訊
    if (user) {
      config.headers.Authorization = `Bearer ${user.at}`
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
      Swal.fire({
        title: '請重新整理頁面',
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
      const user = JSON.parse(localStorage.getItem('ELIXIR_USER')) // ? 取得 LocalStorage 中的登入會員資訊
      if (user) {
        const refreshToken = user.rt
        if (refreshToken) {
          const obj = {
            userName: user.username,
            token: user.at,
            refreshToken: user.rt
          }
          const rftk = await AuthService.refreshTokenCheck(obj)
          if (rftk) {
            return Promise.reject(err)
          } else {
            AuthService.logout()
            Swal.fire({
              title: '請重新登入',
              allowOutsideClick: false,
              confirmButtonColor: '#dc3545',
              confirmButtonText: '確認',
              backdrop: true,
              width: 400
            }).then((result) => {
              if (result.isConfirmed) {
                router.push('/elixir-ui/login')
                router.go()
              }
            })
            return Promise.reject(err)
          }
          //   .then((res) => {
          //     console.log(res)

          //   })
          // return Promise.all([rftk])
        }
      } else {
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
            router.push('/elixir-ui/login')
          }
        })
      }
    }
  }
)
