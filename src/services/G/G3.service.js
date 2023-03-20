import axios from 'axios'

const service = {
  async getTxnAuth (postData) {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/g3/findTxnAuth`
      const res = await axios.post(url, postData)
      return res.data
    } catch (error) {
      if (error.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('NBPS_USER'))
        if (user) {
          return service.getTxnAuth(postData)
        }
      }
    }
  }
}

export default service
