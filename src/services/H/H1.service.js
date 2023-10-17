import axios from 'axios'

const service = {
  async getCallBankData (postData) {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/h1/findCallBankData`
      const res = await axios.post(url, postData)
      return res.data
    } catch (error) {
      if (error.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('NBPS_USER'))
        if (user) {
          return service.getCallBankData(postData)
        }
      }
    }
  },
  async getCallBankDetail (postData) {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/h1/findTxnAuthData`
      const res = await axios.post(url, postData)
      return res.data
    } catch (error) {
      if (error.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('NBPS_USER'))
        if (user) {
          return service.getCallBankDetail(postData)
        }
      }
    }
  },
  async updateCallBankCode (postData) {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/h1/updateCodeHAndAuthCode`
      const res = await axios.post(url, postData)
      if (res.data === '成功') {
        return true
      }
    } catch (error) {
      if (error.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('NBPS_USER'))
        if (user) {
          return service.updateCallBankCode(postData)
        }
      }
    }
  },
  async getCallBankFTP (batchId) {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/h1/callBankFTP`
      const res = await axios.post(url, { batchid: batchId })
      if (res.data === '成功') {
        return true
      }
    } catch (error) {
      if (error.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('NBPS_USER'))
        if (user) {
          return service.getCallBankFTP(batchId)
        }
      }
    }
  },
  async getData () { // find call bank event emails
    try {
      const url = `${process.env.VUE_APP_BASE_API}/h1/findCBEventMail`
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
      const url = `${process.env.VUE_APP_BASE_API}/h1/updateCBEventMailById`
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
