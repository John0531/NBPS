import axios from 'axios'
import forge from '@/utilities/forge'

const service = {
  async getDefaultUserInfo () {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/f1/findDefaultElement`
      const res = await axios.post(url, {})
      return res.data
    } catch (error) {
      if (error.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('NBPS_USER'))
        if (user) {
          return service.getDefaultUserInfo()
        }
      }
    }
  },
  async getAccountData (postData) {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/f1/findUsers`
      const res = await axios.post(url, postData)
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
  async addAccount (postData) {
    try {
      if (postData.pd) {
        postData.pd = await forge.encrypt(postData.pd)
      }
      const url = `${process.env.VUE_APP_BASE_API}/f1/createUser`
      const res = await axios.post(url, postData)
      if (res.data) {
        return true
      }
    } catch (error) {
      if (error.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('NBPS_USER'))
        if (user) {
          return service.addAccount(postData)
        }
      }
      return false
    }
  },
  async editAccount (postData) {
    try {
      if (postData.pd) {
        postData.pd = await forge.encrypt(postData.pd)
      }
      const url = `${process.env.VUE_APP_BASE_API}/f1/updateUser`
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
  },
  async removeAccount (postData) {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/f1/deleteUser`
      const res = await axios.post(url, postData)
      if (res.data) {
        return true
      }
    } catch (error) {
      if (error.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('NBPS_USER'))
        if (user) {
          return service.removeAccount(postData)
        }
      }
    }
  },
  async downloadExcel () {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/f1/downloadExcel`
      const res = await axios({
        url: url,
        method: 'POST',
        data: {},
        responseType: 'blob'
      })
      return res
    } catch (error) {
      if (error.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('NBPS_USER'))
        if (user) {
          return service.downloadExcel()
        }
      }
    }
  }
}

export default service
