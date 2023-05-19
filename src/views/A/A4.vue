<template>
  <div>
    <div class="row justify-content-center">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h2 class="fw-bold mb-3">分析報表下載作業</h2>
            <h6>供帳務科經辦依年月下載分析報表 Excel 檔</h6>
          </div>
          <div class="card-body">
            <div class="row py-3">
              <div class="col-xxl-8 d-flex mb-4">
                <h5 class="text-nowrap me-3" style="padding-top:0.375rem;">日期:</h5>
                <Datepicker class="w-xxl-50 w-100" v-model="date" month-picker auto-apply format="yyyy年MM月"></Datepicker>
              </div>
            </div>
            <button @click="downloadReport" :disabled="!$store.state.pageBtnPermission.includes('download')" class="btn btn-primary me-3 px-4">下載</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import service from '@/services/A/A4.service.js'

export default {
  data () {
    return {
      date: null
    }
  },
  methods: {
    async downloadReport () {
      if (!this.date) {
        this.$swal.fire({
          title: '請選擇日期',
          allowOutsideClick: true,
          confirmButtonColor: '#dc3545',
          confirmButtonText: '確認',
          backdrop: true,
          width: 400
        })
        return
      }
      const postData = {
        year: this.date.year,
        month: `${this.date.month + 1}`.padStart(2, '0')
      }
      this.$store.commit('changeLoading', true)
      const result = await service.downloadReport(postData)
      this.$store.commit('changeLoading', false)
      const a = document.createElement('a')
      const url = window.URL.createObjectURL(new Blob([result.data], { type: result.headers['content-type'] }))
      a.href = url
      a.style.display = 'none'
      a.download = postData.year + '-' + postData.month + '月報.xlsx'
      a.click()
      // 清除暫存
      a.href = ''
      window.URL.revokeObjectURL(url)
    }
  }
}
</script>
