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
      const url = `${process.env.VUE_APP_BASE_API}/b5/convertExcelFile`
      await axios.post(url, postData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(response => {
        // 下載後端回覆的txt檔案
        const downloadUrl = URL.createObjectURL(new Blob([response.data], { type: 'text/plain' }))
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
      const url = `${process.env.VUE_APP_BASE_API}/b5/convertTxtFile`
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
