import axios from 'axios'
import forge from '@/utilities/forge'

const service = {
  async getDefaultUserInfo () {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/c2/findDefaultElement`
      const res = await axios.post(url, {})
      return res.data
    } catch (error) {
      if (error.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('ELIXIR_USER'))
        if (user) {
          return service.getDefaultUserInfo()
        }
      }
    }
  },
  async getAccountData (postData) {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/c2/findUsers`
      const res = await axios.post(url, postData)
      console.log(res)
      return res.data
    } catch (error) {
      if (error.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('ELIXIR_USER'))
        if (user) {
          return service.getAccountData()
        }
      }
    }
  },
  async addAccount (postData) {
    try {
      if (postData.pd) {
        postData.pd = await forge.encrypt(postData.pd)
      }
      console.log(postData)
      const url = `${process.env.VUE_APP_BASE_API}/c2/createUser`
      const res = await axios.post(url, postData)
      if (res.data) {
        return true
      }
    } catch (error) {
      if (error.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('ELIXIR_USER'))
        if (user) {
          return service.addAccount()
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
      const url = `${process.env.VUE_APP_BASE_API}/c2/updateUser`
      const res = await axios.post(url, postData)
      if (res.data) {
        return true
      }
    } catch (error) {
      if (error.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('ELIXIR_USER'))
        if (user) {
          return service.editAccount()
        }
      }
    }
  },
  async removeAccount (postData) {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/c2/deleteUser`
      const res = await axios.post(url, postData)
      if (res.data) {
        return true
      }
    } catch (error) {
      if (error.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('ELIXIR_USER'))
        if (user) {
          return service.removeAccount()
        }
      }
    }
  }
}

export default service
