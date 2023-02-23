import axios from 'axios'

const service = {
  async getBatchData (postData) {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/a2/findBatch`
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
      const url = `${process.env.VUE_APP_BASE_API}/a2/findTxnDetail`
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
  async downloadReply (batchId) {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/a2/downloadReplyFile`
      const res = await axios({
        url: url,
        method: 'POST',
        data: { batchId: batchId },
        responseType: 'blob'
      })
      return res
    } catch (error) {
      if (error.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('NBPS_USER'))
        if (user) {
          return service.downloadReply(batchId)
        }
      }
    }
  },
  async downloadExcel (batchId) {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/a2/downloadExcel`
      const res = await axios({
        url: url,
        method: 'POST',
        data: { batchId: batchId },
        responseType: 'blob'
      })
      return res
    } catch (error) {
      if (error.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('NBPS_USER'))
        if (user) {
          return service.downloadExcel(batchId)
        }
      }
    }
  },
  async downloadResendTrans (postData) {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/a2/downloadResendTrans`
      const res = await axios({
        url: url,
        method: 'POST',
        data: postData,
        responseType: 'blob'
      })
      return res
    } catch (error) {
      if (error.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('NBPS_USER'))
        if (user) {
          return service.downloadResendTrans(postData)
        }
      }
    }
  }
}

export default service
