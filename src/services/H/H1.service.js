import axios from 'axios'

const service = {
  async getBatchData (postData) {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/g1/findBatch`
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
  async getBatchDetail (batchId) {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/g1/findTxnDetail`
      const res = await axios({
        url: url,
        method: 'POST',
        data: { batchId: batchId, page: 1, pageSize: 100 }
      })
      return res.data
    } catch (error) {
      if (error.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('NBPS_USER'))
        if (user) {
          return service.getBatchDetail(batchId)
        }
      }
    }
  },
  async getBatchError (postData) {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/g1/findBatchError`
      const res = await axios.post(url, postData)
      return res.data
    } catch (error) {
      if (error.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('NBPS_USER'))
        if (user) {
          return service.getBatchError(postData)
        }
      }
    }
  }
}

export default service
