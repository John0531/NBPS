import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

const service = {
  async getDefaultPermission () {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/c3/findDefaultPermission`
      const res = await axios.post(url, { msgId: uuidv4() })
      return res.data.permissions
    } catch (error) {
      if (error.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('ELIXIR_USER'))
        if (user) {
          return service.getDefaultPermission()
        }
      }
    }
  },
  async getGroupData (postData) {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/c3/findGroup`
      const res = await axios.post(url, postData)
      return res.data
    } catch (error) {
      const user = JSON.parse(localStorage.getItem('ELIXIR_USER'))
      if (user) {
        return service.getGroupData()
      }
    }
  },
  async addGroup (postData) {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/c3/createGroup`
      const res = await axios.post(url, postData)
      console.log(res)
    // return res.data
    } catch (error) {
      const user = JSON.parse(localStorage.getItem('ELIXIR_USER'))
      if (user) {
        return service.addGroup()
      }
    }
  },
  async editGroup (postData) {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/c3/updateGroup`
      const res = await axios.post(url, postData)
      console.log(res)
    } catch (error) {
      const user = JSON.parse(localStorage.getItem('ELIXIR_USER'))
      if (user) {
        return service.editGroup()
      }
    }
  },
  async removeGroup (postData) {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/c3/deleteGroup`
      const res = await axios.post(url, postData)
      console.log(res)
    } catch (error) {
      const user = JSON.parse(localStorage.getItem('ELIXIR_USER'))
      if (user) {
        return service.removeGroup()
      }
    }
  }
}

export default service
