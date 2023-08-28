<template>
  <div
    class="modal fade"
    ref="Modal"
    tabindex="-1"
    aria-labelledby="convertModal"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header bg-info">
          <h4 class="modal-title text-black">公告事項</h4>
          <button
            type="button"
            class="btn-close btn-close-white"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div>
            <div class="announce-contents" v-html="$store.state.announceInfo.ann?$store.state.announceInfo.ann[0].contents:''"></div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import './vue-quill.snow.css'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import '@vueup/vue-quill'

export default {
  data () {
    return {
      Modal: null,
      announce: '',
      isPublish: ''
    }
  },
  async mounted () {
    this.Modal = new this.$custom.bootstrap.Modal(this.$refs.Modal, { backdrop: 'static' })
    this.$store.commit('getAnnounceModal', this.Modal)
    this.$refs.Modal.addEventListener('show.bs.modal', function (event) {
      const imgArr = document.querySelectorAll('.announce-contents img')
      imgArr.forEach((item) => {
        item.classList.add('img-fluid')
      })
    })
  }
}
</script>

<style scoped>
.announce-contents img{
  max-width: 100%;
  height: auto;
}
</style>
