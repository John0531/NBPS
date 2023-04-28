import axios from 'axios'
import FileSaver from 'file-saver'

const service = {
  async getBusinessDay () {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/b1/findDefaultElement`
      const res = await axios.post(url, {})
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
  async uploadExcel (postData) {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/b1/convertExcelFile`
      await axios.post(url, postData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        responseType: 'text/plain'
      }).then(response => {
        // 下載後端回覆的txt檔案
        let fileContent = response.data
        fileContent = fileContent.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        const downloadUrl = URL.createObjectURL(new Blob([fileContent], { type: 'text/plain;charset=big5' }))
        const link = document.createElement('a')
        link.href = downloadUrl
        link.download = postData.get('fileName').replace(/\.\w+$/, '') + '.txt'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
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
      const url = `${process.env.VUE_APP_BASE_API}/b1/convertTxtFile`
      await axios.post(url, postData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        responseType: 'arraybuffer'
      }).then(response => {
        // 將byte轉成Blob
        const blob = new Blob([response.data], { type: 'application/vnd.ms-excel;charset=big5' })
        const fileName = postData.get('fileName').replace(/\.\w+$/, '') + '.xlsx'
        // 使用FileSaver.js下載檔案
        FileSaver.saveAs(blob, fileName)
      })
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
      const url = `${process.env.VUE_APP_BASE_API}/b1/findBatch`
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
      const url = `${process.env.VUE_APP_BASE_API}/b1/findBatchTxn`
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
      const url = `${process.env.VUE_APP_BASE_API}/b1/findBatchError`
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
      const url = `${process.env.VUE_APP_BASE_API}/b1/downExcelFile`
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
      const url = `${process.env.VUE_APP_BASE_API}/b1/downTransFormatFile`
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
