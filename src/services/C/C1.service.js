import axios from 'axios'
import forge from '@/utilities/forge'

const service = {
  async getStoreDataByCond (postData) {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/c1/searchStoreByCondi`
      const res = await axios.post(url, postData)
      return res.data
    } catch (error) {
      if (error.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('NBPS_USER'))
        if (user) {
          return service.getStoreData(postData)
        }
      }
    }
  },
  async getStoreData (postData) {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/c1/searchStore`
      const res = await axios.post(url, postData)
      return res.data
    } catch (error) {
      if (error.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('NBPS_USER'))
        if (user) {
          return service.getStoreData(postData)
        }
      }
    }
  },
  async addStore (formData) {
    try {
      const postData = JSON.parse(JSON.stringify(formData))
      postData.uploadPd = await forge.encrypt(postData.uploadPd)
      const url = `${process.env.VUE_APP_BASE_API}/c1/createStore`
      const res = await axios.post(url, postData)
      if (res.data) {
        return true
      }
    } catch (error) {
      if (error.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('NBPS_USER'))
        if (user) {
          return service.addStore(formData)
        }
      }
      return false
    }
  },
  async editStore (formData) {
    try {
      const postData = JSON.parse(JSON.stringify(formData))
      if (postData.uploadPd === '********') {
        postData.uploadPd = ''
      } else {
        postData.uploadPd = await forge.encrypt(postData.uploadPd)
      }
      const url = `${process.env.VUE_APP_BASE_API}/c1/updateStore`
      const res = await axios.post(url, postData)
      if (res.data) {
        return true
      }
    } catch (error) {
      if (error.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('NBPS_USER'))
        if (user) {
          return service.editStore(formData)
        }
      }
    }
  },
  async removeStore (postData) {
    try {
      const url = `${process.env.VUE_APP_BASE_API}/c1/deleteStore`
      const res = await axios.post(url, postData)
      if (res.data) {
        return true
      }
    } catch (error) {
      if (error.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('NBPS_USER'))
        if (user) {
          return service.removeStore(postData)
        }
      }
    }
  }
}

export default service
