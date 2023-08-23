import axios from 'axios'

const service = {
  async getAnnounce () {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/d1/findAllAnn`
      const res = await axios.post(url, {})
      return res.data
    } catch (error) {
      if (error.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('NBPS_USER'))
        if (user) {
          return service.getAnnounce()
        }
      }
    }
  }
}

export default service
