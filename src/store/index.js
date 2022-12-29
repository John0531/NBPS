import { createStore } from 'vuex'

export default createStore({
  state: {
    loading: false,
    base_route: process.env.VUE_APP_BASE_ROUTE
  },
  mutations: {
    changeLoading (state, status) {
      state.loading = status
    }
  },
  actions: {
  },
  modules: {
  }
})
