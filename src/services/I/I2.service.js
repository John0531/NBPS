import axios from 'axios'

const service = {
  async getData () {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/i2/findAllValve`
      const res = await axios.post(url, {})
      return res.data
    } catch (error) {
      if (error.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('NBPS_USER'))
        if (user) {
          return service.getData()
        }
      }
    }
  },
  async editValve (postData) {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/i2/executeValve`
      const res = await axios.post(url, postData)
      if (res.data) {
        return true
      }
    } catch (error) {
      if (error.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('NBPS_USER'))
        if (user) {
          return service.editValve(postData)
        }
      }
    }
  }
}

export default service
