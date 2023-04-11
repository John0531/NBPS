import axios from 'axios'

const service = {
  async getBatchDefault () {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/a2/findDefaultElement`
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
      const url = `${process.env.VUE_APP_BASE_API}/b2/findBatch`
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
      const url = `${process.env.VUE_APP_BASE_API}/b2/findTxnDetail`
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
  async getBatchDetailByPan (batchId, pan) {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/b2/findTxnDetail`
      console.log(pan)
      const res = await axios({
        url: url,
        method: 'POST',
        data: { batchId: batchId, pan: pan, page: 1, pageSize: 100 }
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
  async downloadReply (batchId) {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/b2/downloadReplyFile`
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
      const url = `${process.env.VUE_APP_BASE_API}/b2/downloadExcel`
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
  }
}

export default service
