import axios from 'axios'
import forge from '@/utilities/forge'

const service = {
  async getAccountData (postData) {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/f3/findLockUser`
      const res = await axios.post(url, postData)
      console.log(res)
      return res.data
    } catch (error) {
      if (error.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('NBPS_USER'))
        if (user) {
          return service.getAccountData(postData)
        }
      }
    }
  },
  async editAccount (postData) {
    try {
      if (postData.pd) {
        postData.pd = await forge.encrypt(postData.pd)
      }
      const url = `${process.env.VUE_APP_BASE_API}/f3/unLock`
      const res = await axios.post(url, postData)
      if (res.data) {
        return true
      }
    } catch (error) {
      if (error.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('NBPS_USER'))
        if (user) {
          return service.editAccount(postData)
        }
      }
    }
  }
}

export default service
