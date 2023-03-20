import axios from 'axios'

const service = {
  async getHostServer (postData) {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/i1/findHost`
      const res = await axios.post(url, postData)
      return res.data
    } catch (error) {
      if (error.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('NBPS_USER'))
        if (user) {
          return service.getHostServer(postData)
        }
      }
    }
  },
  async getBatchHost (postData) {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/i1/findJobLog`
      const res = await axios.post(url, postData)
      return res.data
    } catch (error) {
      if (error.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('NBPS_USER'))
        if (user) {
          return service.getBatchHost(postData)
        }
      }
    }
  },
  async switchHostStatus (postData) {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/i1/executeHost`
      const res = await axios.post(url, postData)
      if (res.data) {
        return true
      }
    } catch (error) {
      if (error.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('NBPS_USER'))
        if (user) {
          return service.switchHostStatus(postData)
        }
      }
    }
  }
}

export default service
