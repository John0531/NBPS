import { createStore } from 'vuex'

export default createStore({
  state: {
    loading: false,
    base_route: process.env.VUE_APP_BASE_ROUTE,
    user: JSON.parse(localStorage.getItem('NBPS_USER')) ? JSON.parse(localStorage.getItem('NBPS_USER')).user : null,
    pageBtnPermission: []//* 頁面操作權限
  },
  mutations: {
    getPageBtnPermission (state, payload) {
      state.pageBtnPermission = payload
    },
    getUser (state, payload) {
      state.user = payload
    },
    changeLoading (state, status) {
      state.loading = status
    }
  },
  actions: {
  },
  modules: {
  }
})
