import axios from 'axios'

const service = {
  async getBusinessDay () {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/b1/findDefaultElement`
      const res = await axios.post(url, {})
      console.log(res)
      return res.data
    } catch (error) {
      if (error.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('NBPS_USER'))
        if (user) {
          return service.getBusinessDay()
        }
      }
    }
  },
  async getBatchData (postData) {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/b1/findBatch`
      const res = await axios.post(url, postData)
      console.log(res)
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
  async uploadBatch (postData) {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/b1/uploadFile`
      const res = await axios.post(url, postData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      if (res.data) {
        return true
      }
    } catch (error) {
      if (error.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('NBPS_USER'))
        if (user) {
          return service.uploadBatch(postData)
        }
      }
    }
  },
  async confirmBatch (postData) {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/b1/updateBatchStatus`
      const res = await axios.post(url, postData)
      console.log(res)
      if (res.data) {
        return true
      }
    } catch (error) {
      if (error.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('NBPS_USER'))
        if (user) {
          return service.confirmBatch(postData)
        }
      }
    }
  },
  async getBatchError (postData) {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/b1/findBatchError`
      const res = await axios.post(url, postData)
      console.log(res)
      return res.data
    } catch (error) {
      if (error.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('NBPS_USER'))
        if (user) {
          return service.getBatchError(postData)
        }
      }
    }
  },
  async downloadExcel () {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/b1/downExcelFile`
      const res = await axios({
        url: url,
        method: 'POST',
        data: {},
        responseType: 'blob'
      })
      console.log(res)
      return res
    } catch (error) {
      if (error.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('NBPS_USER'))
        if (user) {
          return service.downloadExcel()
        }
      }
    }
  },
  async downloadFormat () {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/b1/downTransFormatFile`
      const res = await axios({
        url: url,
        method: 'POST',
        data: {},
        responseType: 'blob'
      })
      console.log(res)
      return res
    } catch (error) {
      if (error.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('NBPS_USER'))
        if (user) {
          return service.downloadFormat()
        }
      }
    }
  }
}

export default service
