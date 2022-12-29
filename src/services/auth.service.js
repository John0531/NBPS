import axios from 'axios'
import forge from 'node-forge'
import { v4 as uuidv4 } from 'uuid'

const AuthService = {
  getPublicKey () {
    return axios.post('/nbps-api/z1/env', { msgId: uuidv4() })
      .then((res) => {
        if (res == null || res.data == null) {
          return null
        }
        return res.data.pk
      })
  },
  async login (user) {
    try {
      const publicKey = await AuthService.getPublicKey()
      const ubPublicKey = '-----BEGIN PUBLIC KEY-----\n' + publicKey + '-----END PUBLIC KEY-----'
      const ubEDEPublicKey = forge.pki.publicKeyFromPem(ubPublicKey)
      const encryptedPd = forge.util.encode64(ubEDEPublicKey.encrypt(user.pd, 'RSAES-PKCS1-V1_5'))

      const res = await axios.post('/nbps-api/d1/login', {
        userName: user.userName,
        pd: encryptedPd,
        msgId: uuidv4()
      })
      console.log(res)
      if (res.data && res.data.token && res.data.refreshToken) {
        localStorage.setItem('NBPS_USER', JSON.stringify(res.data)) // ? 將物件傳為 json 字串存入
        return {
          isSuccess: true,
          user: res.data
        }
      } else {
        return {
          isSuccess: false,
          msg: `${res.data.message}(${res.data.codeH})`
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
  async refreshTokenCheck (refreshTokenDto) {
    try {
      const res = await axios.post('/nbps-api/d1/refresh', refreshTokenDto)
      console.log(res)
      if (res == null || res.data == null) {
        return null
      }
      if (res.data.token) {
        const user = {
          at: res.data.token,
          rt: res.data.refreshToken,
          roles: res.data.envData.permission,
          username: res.data.user.userName
        }
        localStorage.setItem('NBPS_USER', JSON.stringify(user))
        return user
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
