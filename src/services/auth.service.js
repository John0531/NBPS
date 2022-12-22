import axios from 'axios'
import forge from 'node-forge'

const AuthService = {
  // getPublicKey () {
  //   return axios.get('/monopoly-api/env/publicKey')
  //     .then((res) => {
  //       if (res == null || res.data == null) {
  //         return null
  //       }
  //       return res.data
  //     })
  // },
  async login (user) {
    try {
      // const publicKey = await AuthService.getPublicKey()
      const publicKey = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAslBc8dLGlwuj1wZJCDjvJ9inQ67FQlOkAr0O50m/EFwvSswoLymTBZCC8BzoDy9pEBCMGCB196sADy8tYwMQf08u/oSuPC0YGtaXOGnlX/XRGY5YgmKHgwlZr8cDjP+b8/sjrylrRcDn6/24tEqcvQvfzBdso39RIUVy4KNOlTjMbuhaYXtNPpS6JIfLHDiTvsfpxnpM7tJyczfX673fsDT72W2hxzkpl76+SHTshXgFiGFuxRu4vMo+icYMhn2TFLgnqFivPwpjDsxp+iXQesePR2+UVYUdFSYOvZ7jsZhyRAp+hg4YBemcNYtgWLeKZ+7LcoZSQc4mEr4svNG0twIDAQAB'
      const ubPublicKey = '-----BEGIN PUBLIC KEY-----\n' + publicKey + '-----END PUBLIC KEY-----'
      const ubEDEPublicKey = forge.pki.publicKeyFromPem(ubPublicKey)
      const encryptedPd = forge.util.encode64(ubEDEPublicKey.encrypt(user.pd, 'RSAES-PKCS1-V1_5'))

      const res = await axios.post('/elixir-ui-api/d1/login', {
        userName: user.userName,
        pd: encryptedPd,
        envName: 'elixir-ui-api'
      })
      console.log(res)
      if (res.data.codeH === '0000') {
        const user = {
          at: res.data.token,
          rt: res.data.refreshToken,
          user: res.data.envData.user,
          username: res.data.user.userName
        }
        localStorage.setItem('ELIXIR_USER', JSON.stringify(user)) // ? 將物件傳為 json 字串存入
        return {
          isSuccess: true,
          user: user
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
    localStorage.removeItem('ELIXIR_USER')
  },
  async refreshTokenCheck (refreshTokenDto) {
    try {
      const res = await axios.post('/elixir-ui-api/d3/refresh-token', refreshTokenDto)
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
        localStorage.setItem('ELIXIR_USER', JSON.stringify(user))
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
