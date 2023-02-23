import axios from 'axios'

const service = {
  async getDefaultPermission () {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/f2/findDefaultPermission`
      const res = await axios.post(url, {})
      return res.data.permissions
    } catch (error) {
      if (error.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('NBPS_USER'))
        if (user) {
          return service.getDefaultPermission()
        }
      }
    }
  },
  async getGroupData (postData) {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/f2/findGroup`
      const res = await axios.post(url, postData)
      return res.data
    } catch (error) {
      if (error.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('NBPS_USER'))
        if (user) {
          return service.getGroupData(postData)
        }
      }
    }
  },
  async addGroup (postData) {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/f2/createGroup`
      const res = await axios.post(url, postData)
      if (res.data) {
        return true
      }
    } catch (error) {
      if (error.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('NBPS_USER'))
        if (user) {
          return service.addGroup(postData)
        }
      }
      return false
    }
  },
  async editGroup (postData) {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/f2/updateGroup`
      const res = await axios.post(url, postData)
      if (res.data) {
        return true
      }
    } catch (error) {
      if (error.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('NBPS_USER'))
        if (user) {
          return service.editGroup(postData)
        }
      }
      return false
    }
  },
  async removeGroup (postData) {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/f2/deleteGroup`
      const res = await axios.post(url, postData)
      if (res.data) {
        return true
      }
    } catch (error) {
      if (error.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('NBPS_USER'))
        if (user) {
          return service.removeGroup(postData)
        }
      }
      return false
    }
  },
  async downloadExcel () {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/f2/downloadExcel`
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
