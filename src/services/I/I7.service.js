import axios from 'axios'

const service = {
  async getDefault () {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/i7/findDefault`
      const res = await axios.post(url, {})
      return res.data
    } catch (error) {
      if (error.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('NBPS_USER'))
        if (user) {
          return service.getDefault()
        }
      }
    }
  },
  async getData (postData) {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/i7/findEntityRecordLog`
      const res = await axios.post(url, postData)
      return res.data
    } catch (error) {
      if (error.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('NBPS_USER'))
        if (user) {
          return service.getData(postData)
        }
      }
    }
  }
}

export default service
