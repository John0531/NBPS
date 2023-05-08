import axios from 'axios'

const service = {
  async getBatchExeLog (postData) {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/i4/searchBatchExeLog`
      const res = await axios.post(url, postData)
      return res.data
    } catch (error) {
      if (error.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('NBPS_USER'))
        if (user) {
          return service.getBatchExeLog(postData)
        }
      }
    }
  },
  async batchExecute (postData) {
    // 將時間轉換為後端API需求的格式
    // const year = postData.datetimeE5.year
    // const mo = `${postData.datetimeE5.month + 1}`.padStart(2, '0')
    // postData.datetimeE5 = year + '-' + mo + '-' + '01'
    try {
      const url = `${process.env.VUE_APP_BASE_API}/i4/batchExecute`
      const res = await axios.post(url, postData)
      return res.data
    } catch (error) {
      if (error.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('NBPS_USER'))
        if (user) {
          return service.batchExecute(postData)
        }
      }
    }
  }
}

export default service
