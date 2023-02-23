import axios from 'axios'

const service = {
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
  async getBatchDetail (batchId) {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/a3/findTxnDetail`
      const res = await axios.post(url, { batchId: batchId })
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
  async singleCancel (txnAuthId) {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/a3/singleCancel`
      const res = await axios.post(url, { txnAuthId: txnAuthId })
      if (res.data) {
        return true
      }
    } catch (error) {
      if (error.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('NBPS_USER'))
        if (user) {
          return service.singleCancel(txnAuthId)
        }
      }
    }
  }
}

export default service
