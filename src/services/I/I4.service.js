import axios from 'axios'

const service = {
  async getUserLog (postData) {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/i3/findUserLogError`
      const res = await axios.post(url, postData)
      return res.data
    } catch (error) {
      if (error.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('NBPS_USER'))
        if (user) {
          return service.getUserLog(postData)
        }
      }
    }
  },
  async getLogDetail (postData) {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/i3/findStatLogDetail`
      const res = await axios.post(url, postData)
      return res.data
    } catch (error) {
      if (error.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('NBPS_USER'))
        if (user) {
          return service.getLogDetail(postData)
        }
      }
    }
  }
}

export default service
