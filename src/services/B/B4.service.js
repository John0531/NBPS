import axios from 'axios'

const service = {
  async searchMonthReport (postData) {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/b4/searchMonthlyReport`
      const res = await axios.post(url, postData)
      return res.data
    } catch (error) {
      if (error.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('NBPS_USER'))
        if (user) {
          return service.searchMonthReport(postData)
        }
      }
    }
  },
  async downloadMonthReport (postData) {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/b4/downloadMonthlyReport`
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
          return service.downloadMonthReport(postData)
        }
      }
    }
  },
  async searchDateReport (postData) {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/b4/searchDailyReport`
      const res = await axios.post(url, postData)
      return res.data
    } catch (error) {
      if (error.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('NBPS_USER'))
        if (user) {
          return service.searchDateReport(postData)
        }
      }
    }
  },
  async getDateReportDetail (postData) {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/b4/searchDailyReportDetail`
      const res = await axios.post(url, postData)
      return res.data
    } catch (error) {
      if (error.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('NBPS_USER'))
        if (user) {
          return service.getDateReportDetail(postData)
        }
      }
    }
  },
  async downloadDateReport (postData) {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/b4/downloadDailyReport`
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
          return service.downloadDateReport(postData)
        }
      }
    }
  }
}

export default service
