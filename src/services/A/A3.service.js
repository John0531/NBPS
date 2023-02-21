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
  async getBatchDetail (postData) {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/a3/findTxnDetail`
      const res = await axios.post(url, postData)
      console.log(res)
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
      const url = `${process.env.VUE_APP_BASE_API}/a3/findTxnDetail`
      const res = await axios.post(url, { batchId: batchId })
      console.log(res)
      return res.data
    } catch (error) {
      if (error.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('NBPS_USER'))
        if (user) {
          return service.multipleCancel({ batchId: batchId })
        }
      }
    }
  },
  async singleCancel (txnAuthId) {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/a3/findTxnDetail`
      const res = await axios.post(url, { txnAuthId: txnAuthId })
      console.log(res)
      return res.data
    } catch (error) {
      if (error.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('NBPS_USER'))
        if (user) {
          return service.singleCancel({ txnAuthId: txnAuthId })
        }
      }
    }
  }
}

export default service
