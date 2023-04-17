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
  async getCallBankDetail (batchId, page, pageSize) {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/h1/findTxnAuthData`
      const res = await axios({
        url: url,
        method: 'POST',
        data: { batchId: batchId, page: page, pageSize: pageSize }
      })
      return res.data
    } catch (error) {
      if (error.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('NBPS_USER'))
        if (user) {
          return service.getCallBankDetail(batchId, page, pageSize)
        }
      }
    }
  },
  async updateCallBankCode (dataList) {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/h1/updateCodeHAndAuthCode`
      const res = await axios.post(url, dataList)
      return res.data
    } catch (error) {
      if (error.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('NBPS_USER'))
        if (user) {
          return service.updateCallBankCode(dataList)
        }
      }
    }
  },
  async getCallBankFTP (batchId) {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/h1/callBankFTP`
      const res = await axios({
        url: url,
        method: 'POST',
        data: { batchid: batchId, page: 1, pageSize: 10 }
      })
      return res.data
    } catch (error) {
      if (error.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('NBPS_USER'))
        if (user) {
          return service.getCallBankFTP(batchId)
        }
      }
    }
  }
}

export default service
