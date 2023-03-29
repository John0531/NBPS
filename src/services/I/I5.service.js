import axios from 'axios'

const service = {
  async getData () {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/i5/findAllEventMail`
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
  async editEventMail (postData) {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/i5/updateEventMailById`
      const res = await axios.post(url, postData)
      if (res.data) {
        return true
      }
    } catch (error) {
      if (error.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('NBPS_USER'))
        if (user) {
          return service.editEventMail(postData)
        }
      }
    }
  }
}

export default service
