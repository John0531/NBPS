import { createStore } from 'vuex'

export default createStore({
  state: {
    loading: false
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
