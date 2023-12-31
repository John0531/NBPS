import axios from 'axios'
import FileSaver from 'file-saver'

const service = {
  async getBatchDefault () {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/a1/findDefaultElement`
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
  async uploadExcel (postData) {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/a1/convertExcelFile`
      const res = await axios.post(url, postData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        responseType: 'arraybuffer'
      })
      if (res.status === 200) {
        const blob = new Blob([res.data], { type: 'text/plain;charset=big5' })
        const fileName = postData.get('fileName').replace(/\.\w+$/, '') + '.txt'
        // 使用FileSaver.js下載檔案
        FileSaver.saveAs(blob, fileName)
        return true
      }
    } catch (error) {
      if (error.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('NBPS_USER'))
        if (user) {
          return service.uploadExcel(postData)
        }
      }
    }
  },
  async uploadTxt (postData) {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/a1/convertTxtFile`
      const res = await axios.post(url, postData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        responseType: 'arraybuffer'
      })
      if (res.status === 200) {
        const blob = new Blob([res.data], { type: 'application/vnd.ms-excel;charset=big5' })
        const fileName = postData.get('fileName').replace(/\.\w+$/, '') + '.xlsx'
        // 使用FileSaver.js下載檔案
        FileSaver.saveAs(blob, fileName)
        return true
      }
    } catch (error) {
      if (error.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('NBPS_USER'))
        if (user) {
          return service.uploadTxt(postData)
        }
      }
    }
  },
  async getBatchData (postData) {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/a1/findBatch`
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
  async uploadBatch (postData) {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/a1/uploadFile`
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
      const url = `${process.env.VUE_APP_BASE_API}/a1/updateBatchStatus`
      const res = await axios.post(url, postData)
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
  async getBatchDetail (postData) {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/a1/findBatchTxn`
      const res = await axios.post(url, postData)
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
  async getBatchError (postData) {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/a1/findBatchError`
      const res = await axios.post(url, postData)
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
      const url = `${process.env.VUE_APP_BASE_API}/a1/downExcelFile`
      const res = await axios({
        url: url,
        method: 'POST',
        data: {},
        responseType: 'blob'
      })
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
      const url = `${process.env.VUE_APP_BASE_API}/a1/downTransFormatFile`
      const res = await axios({
        url: url,
        method: 'POST',
        data: {},
        responseType: 'blob'
      })
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
