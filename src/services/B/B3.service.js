import axios from 'axios'

const service = {
  async getBatchData (postData) {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/b3/findBatch`
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
      const url = `${process.env.VUE_APP_BASE_API}/b3/findTxnDetail`
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
      const url = `${process.env.VUE_APP_BASE_API}/b3/findTxnDetail`
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
  async multipleCancel (batchId) {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/b3/multipleCancel`
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
      const url = `${process.env.VUE_APP_BASE_API}/b3/singleCancel`
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
