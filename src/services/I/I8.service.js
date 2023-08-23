import axios from 'axios'

const service = {
  async setAnnounce (postData) {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/i8/updateAnnById`
      const res = await axios.post(url, postData)
      return res.data
    } catch (error) {
      if (error.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('NBPS_USER'))
        if (user) {
          return service.setAnnounce(postData)
        }
      }
    }
  }
}

export default service
