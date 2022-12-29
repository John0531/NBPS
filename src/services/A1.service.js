import axios from 'axios'

const A1service = {
  add: async function (postData) {
    try {
      const url = '/elixir-ui-api/a1/save'
      const res = await axios.post(url, postData)
      console.log(res)
      if (res && res.data === '成功') {
        return {
          isSuccess: true
        }
      } else {
        return {
          isSuccess: false
        }
      }
    } catch (err) {
      if (err.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('NBPS_USER'))
        if (user) {
          return A1service.add(postData)
        }
      } else {
        return {
          isSuccess: false,
          msg: err.response.data
        }
      }
    }
  },
  search: async function (postData) {
    try {
      const url = '/elixir-ui-api/a1/search'
      const res = await axios.post(url, postData)
      if (res) {
        return {
          isSuccess: true,
          data: res.data
        }
      } else {
        return {
          isSuccess: false
        }
      }
    } catch (err) {
      console.log(err)
      if (err.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('NBPS_USER'))
        if (user) {
          return A1service.search(postData)
        }
      } else {
        return {
          isSuccess: false,
          msg: err.response.data
        }
      }
    }
  },
  modify: async function (postData) {
    try {
      const url = '/elixir-ui-api/a1/update'
      const res = await axios.post(url, postData)
      if (res && res.data === '成功') {
        return {
          isSuccess: true
        }
      } else {
        return {
          isSuccess: false
        }
      }
    } catch (err) {
      if (err.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('NBPS_USER'))
        if (user) {
          return A1service.modify(postData)
        }
      } else {
        return {
          isSuccess: false,
          msg: err.response.data
        }
      }
    }
  },
  delete: async function (postData) {
    console.log(postData)
    try {
      const url = '/elixir-ui-api/a1/delete'
      const res = await axios.post(url, postData)
      if (res && res.data === '成功') {
        return {
          isSuccess: true
        }
      } else {
        return {
          isSuccess: false
        }
      }
    } catch (err) {
      if (err.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('NBPS_USER'))
        if (user) {
          return A1service.delete(postData)
        }
      } else {
        return {
          isSuccess: false,
          msg: err.response.data
        }
      }
    }
  }
}

export default A1service
