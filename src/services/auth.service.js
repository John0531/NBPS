import axios from 'axios'
import forge from '@/utilities/forge'

const AuthService = {
  async login (user) {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/d1/login`
      const postData = {
        userName: user.userName,
        pd: await forge.encrypt(user.pd)
      }
      const res = await axios.post(url, postData)
      if (res.data && res.data.token && res.data.refreshToken) {
        localStorage.setItem('NBPS_USER', JSON.stringify(res.data)) // ? 將物件傳為 json 字串存入
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
      console.log(postData)
      const res = await axios.post(`${process.env.VUE_APP_BASE_API}/d1/refresh`, postData)
      if (res == null || res.data == null) {
        return null
      }
      if (res.data.token) {
        localStorage.setItem('NBPS_USER', JSON.stringify(res.data))
        return res.data
      } else {
        return null
      }
    } catch (error) {
      console.log(error)
      return null
    }
  }
}
export default AuthService
