import axios from 'axios'

const service = {
  async downloadReport (postData) {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/a4/downloadReport`
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
          return service.downloadReport(postData)
        }
      }
    }
  }
}

export default service
