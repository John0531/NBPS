import axios from 'axios'

const service = {
  async getUserLog (postData) {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/i6/findUserLog`
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
  async downloadExcel (postData) {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/i6/downloadExcel`
      const res = await axios({
        url: url,
        method: 'POST',
        data: postData,
        responseType: 'blob'
      })
      return res
    } catch (error) {
      if (error.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('NBPS_USER'))
        if (user) {
          return service.downloadExcel(postData)
        }
      }
    }
  }
}

export default service
