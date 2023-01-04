import axios from 'axios'
import forge from 'node-forge'
import { v4 as uuidv4 } from 'uuid'

const AuthService = {
  async getPublicKey () {
    const url = `${process.env.VUE_APP_BASE_API}/z1/env`
    const res = await axios.post(url, { msgId: uuidv4() })
    if (res == null || res.data == null) {
      return null
    }
    return res.data.pk
  },
  async login (user) {
    try {
      const publicKey = await AuthService.getPublicKey()
      const ubPublicKey = '-----BEGIN PUBLIC KEY-----\n' + publicKey + '-----END PUBLIC KEY-----'
      const ubEDEPublicKey = forge.pki.publicKeyFromPem(ubPublicKey)
      const encryptedPd = forge.util.encode64(ubEDEPublicKey.encrypt(user.pd, 'RSAES-PKCS1-V1_5'))

      const url = `${process.env.VUE_APP_BASE_API}/d1/login`
      const postData = {
        userName: user.userName,
        pd: encryptedPd,
        msgId: uuidv4()
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
  async refreshTokenCheck () {
    try {
      const postData = {
        msgId: uuidv4(),
        userName: localStorage.getItem('NBPS_USER').user.userName,
        token: localStorage.getItem('NBPS_USER').token,
        refreshToken: localStorage.getItem('NBPS_USER').refreshToken
      }
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
