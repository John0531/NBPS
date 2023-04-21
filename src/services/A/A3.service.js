import axios from 'axios'

const service = {
  async getBatchDefault () {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/a3/findDefaultElement`
      const res = await axios.post(url, {})
      return res.data
    } catch (error) {
      if (error.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('NBPS_USER'))
        if (user) {
          return service.getBatchDefault()
        }
      }
    }
  },
  async getBatchData (postData) {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/a3/findBatch`
      const res = await axios.post(url, postData)
      return res.data
    } catch (error) {
      if (error.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('NBPS_USER'))
        if (user) {
          return service.getBatchData(postData)
        }
      }
    }
  },
  async getBatchDetail (postData) {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/a3/findTxnDetail`
      const res = await axios.post(url, postData)
      return res.data
    } catch (error) {
      if (error.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('NBPS_USER'))
        if (user) {
          return service.getBatchDetail(postData)
        }
      }
    }
  },
  async multipleCancel (batchId) {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/a3/multipleCancel`
      const res = await axios.post(url, { batchId: batchId })
      if (res.data) {
        return true
      }
    } catch (error) {
      if (error.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('NBPS_USER'))
        if (user) {
          return service.multipleCancel(batchId)
        }
      }
    }
  },
  async singleCancel (postData) {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/a3/singleCancel`
      const res = await axios.post(url, postData)
      if (res.data) {
        return true
      }
    } catch (error) {
      if (error.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('NBPS_USER'))
        if (user) {
          return service.singleCancel(postData)
        }
      }
    }
  }
}

export default service
