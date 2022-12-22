import axios from 'axios'

const B1Service = {
  add: async function (postData) {
    try {
      const url = '/elixir-ui-api/b1/save'
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
        const user = JSON.parse(localStorage.getItem('ELIXIR_USER'))
        if (user) {
          return B1Service.add(postData)
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
      const url = '/elixir-ui-api/b1/search'
      const res = await axios.post(url, postData)
      console.log(res)
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
      if (err.response.status === 401) {
        const user = JSON.parse(localStorage.getItem('ELIXIR_USER'))
        if (user) {
          return B1Service.search(postData)
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
      const url = '/elixir-ui-api/b1/update'
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
        const user = JSON.parse(localStorage.getItem('ELIXIR_USER'))
        if (user) {
          return B1Service.modify(postData)
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
    try {
      const url = '/elixir-ui-api/b1/delete'
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
        const user = JSON.parse(localStorage.getItem('ELIXIR_USER'))
        if (user) {
          return B1Service.delete(postData)
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

export default B1Service
