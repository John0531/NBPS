import axios from 'axios'

const service = {
  async getDefaultPermission () {
    try {
      const url = 'https://mocki.io/v1/5013965e-466e-480b-98ff-ccd228c14cbb'
      const res = await axios.get(url)
      console.log(res.data.defaultPermission)
      return res.data.defaultPermission
      // if (res && res.data === '成功') {
      //   return {
      //     isSuccess: true,
      //     data: res.data
      //   }
      // } else {
      //   return {
      //     isSuccess: false
      //   }
      // }
    } catch (err) {
      if (err.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('ELIXIR_USER'))
        if (user) {
          return service.getDefaultPermission()
        }
      } else {
        return {
          isSuccess: false,
          msg: err.response.data
        }
      }
    }
  },
  async getPermissionData () {
    const url = 'https://mocki.io/v1/39fc1c0c-b8b2-4ff0-8e4b-658bcf537f89'
    const res = await axios.get(url)
    return res.data
  }
}

export default service
