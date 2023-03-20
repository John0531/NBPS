import axios from 'axios'
import forge from '@/utilities/forge'
import store from '../store'

const AuthService = {
  async login (user) {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/d1/login`
      const postData = {
        userName: user.userName,
        pd: await forge.encrypt(user.pd)
      }
      const res = await axios.post(url, postData)
      if (res.data && res.data.token) {
        localStorage.setItem('NBPS_USER', JSON.stringify(res.data)) // ? 將物件傳為 json 字串存入
        store.commit('getUser', res.data.user)
        return {
          isSuccess: true,
          userData: res.data
        }
      } else {
        return {
          isSuccess: false,
          msg: res.data
        }
      }
    } catch (error) {
      return {
        isSuccess: false,
        msg: error.response.data
      }
    }
  },
  logout () {
    localStorage.removeItem('NBPS_USER')
  },
  async refreshTokenCheck (user) {
    try {
      const postData = {
        userName: user.user.userName,
        token: user.token,
        refreshToken: user.refreshToken
      }
      const res = await axios.post(`${process.env.VUE_APP_BASE_API}/d1/refresh`, postData)
      if (res.data.token) {
        localStorage.setItem('NBPS_USER', JSON.stringify(res.data))
        return true
      } else {
        return null
      }
    } catch (error) {
      return null
    }
  },
  async changePwd (user) {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/d3/updatePd`
      const postData = {
        oldpd: await forge.encrypt(user.oldpd),
        pd: await forge.encrypt(user.pd)
      }
      const res = await axios.post(url, postData)
      if (res.data) {
        return true
      }
    } catch (error) {
      if (error.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('NBPS_USER'))
        if (user) {
          return AuthService.changePwd(user)
        }
      }
    }
  }
}
export default AuthService
