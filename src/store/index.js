import { createStore } from 'vuex'
import utilService from '@/services/utilities.service.js'

export default createStore({
  state: {
    loading: false,
    base_route: process.env.VUE_APP_BASE_ROUTE,
    user: JSON.parse(localStorage.getItem('NBPS_USER')) ? JSON.parse(localStorage.getItem('NBPS_USER')).user : null,
    pageBtnPermission: [], //* 頁面操作權限
    announceModal: null, //* 公告Modal
    announceInfo: {}//* 公告api 資訊
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
    },
    getAnnounceModal (state, modal) {
      state.announceModal = modal
    },
    changeAnnounceInfo (state, info) {
      state.announceInfo = info
    }
  },
  actions: {
    async openAnnounceModal ({ state, dispatch }) {
      await dispatch('getAnnounceInfo')
      if (state.announceInfo.isPublish && state.announceInfo.ann[0].ann) {
        state.announceModal.show()
      }
    },
    async getAnnounceInfo ({ commit }) {
      const result = await utilService.getAnnounce()
      commit('changeAnnounceInfo', result)
    }
  },
  modules: {
  }
})
