import axios from 'axios'

const service = {
  async getDefault () {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/f5/findDefault`
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
      const url = `${process.env.VUE_APP_BASE_API}/f5/findEntityRecordLog`
      const res = await axios.post(url, postData)
      console.log(res)
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
