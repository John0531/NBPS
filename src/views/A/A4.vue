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
              <div class="col-xxl-6 d-flex mb-4">
                <h5 class="text-nowrap me-3" style="padding-top:0.375rem;">查詢方式:</h5>
                <select class="form-select" v-model="searchType">
                  <option value="" selected>請選擇</option>
                  <option value="month">依月份</option>
                  <option value="date">依日期</option>
                </select>
              </div>
              <div class="col-xxl-6"></div>
              <div class="col-xxl-6 d-flex mb-4" v-if="searchType==='month'">
                <h5 class="text-nowrap me-3" style="padding-top:0.375rem;">依月份:</h5>
                <Datepicker  v-model="date" month-picker auto-apply format="yyyy年MM月"></Datepicker>
              </div>
              <div class="col-xxl-6 d-flex mb-4" v-if="searchType==='date'">
                <h5 class="text-nowrap me-3" style="padding-top:0.375rem;">依日期:</h5>
                <Datepicker class="w-xxl-50 w-100" auto-apply enable-seconds v-model="searchDate" model-type="yyyy-MM-dd" format="yyyy/MM/dd"></Datepicker>
              </div>
            </div>
            <div class="col-xxl-6 d-flex mb-4" v-if="searchType==='date'">
                <h5 class="text-nowrap me-3" style="padding-top:0.375rem;">特店代碼/特店名稱:</h5>
                <input  v-model="searchDatePost.storeId" type="text" class="form-control" placeholder="">
              </div>
            <button @click="downloadReport" :disabled="!$store.state.pageBtnPermission.includes('download')" class="btn btn-primary me-3 px-4" v-if="searchType==='month'" >下載</button>
            <button class="btn btn-primary me-3 px-4" @click.prevent="searchReport" v-if="searchType==='date'">搜尋</button>
          </div>
        </div>
      </div>
    </div>
    <MainData v-if="searchType==='date'" :Page="pageData" @ChangePageInfo="getPageInfo">
          <template #default>
            <thead>
              <tr>
                <th scope="col">請款日期</th>
                <th scope="col">特店代號</th>
                <th scope="col">特店名稱</th>
                <th scope="col">請款成功總筆數</th>
                <th scope="col">請款成功總金額</th>
                <th scope="col">請款失敗總筆數</th>
                <th scope="col">請款失敗總金額</th>
                <th scope="col">下載成功明細</th>
                <th scope="col">下載失敗明細</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item,index) in dateGridData" :key="`A+${index}`">
                <th scope="row">{{item.date}}</th>
                <td>{{item.storeId}}</td>
                <td>{{item.storeName}}</td>
                <td>{{item.totalSuccessSettleCount}}</td>
                <td>{{$custom.currency(item.totalSuccessSettleAmt)}}</td>
                <td>{{item.totalFailSettleCount}}</td>
                <td>{{$custom.currency(item.totalFailSettleAmt)}}</td>
                <td>
                  <button v-if="item.totalSuccessSettleCount!==0" @click.prevent="downloadDateReport(item,'B4SUCCESS')" class="btn btn-success me-2 btn-sm">下載成功明細</button>
                </td>
                <td>
                  <button v-if="item.totalFailSettleCount!==0" @click.prevent="downloadDateReport(item,'B4FAIL')" class="btn btn-danger me-2 btn-sm">下載失敗明細</button>
                </td>
                <td v-if="item.totalSuccessSettleCount ==0 && item.totalFailSettleCount ==0">未產生明細</td>
              </tr>
            </tbody>
          </template>
        </MainData>
  </div>
</template>

<script>
import service from '@/services/A/A4.service.js'
import MainData from '@/components/MainData.vue'

export default {
  components: {
    MainData
  },
  data () {
    return {
      searchType: '',
      searchDate: '',
      searchDatePost: {},
      date: null,
      pageData: {}
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
    },
    searchReport () {
      if (!this.searchType) {
        this.$swal.fire('請選擇查詢方式')
        return
      }
      if (!this.searchDate) {
        this.$swal.fire('請選擇日期')
        return
      }
      this.searchDatePost.date = this.searchDate
      this.searchDatePost.page = 1
      this.searchDatePost.pageSize = 10
      this.getDateData()
    },
    getPageInfo (PageInfo) {
      this.searchDatePost.page = PageInfo.page
      this.searchDatePost.pageSize = PageInfo.pageSize
      this.getDateData()
    },
    async getDateData () {
      this.$store.commit('changeLoading', true)
      const result = await service.searchDateReport(this.searchDatePost)
      this.$store.commit('changeLoading', false)
      this.pageData = result.pageInfo // ? 傳送分頁資訊
      this.dateGridData = result.txnSettlePage
    },
    async downloadDateReport (item, type) {
      this.$store.commit('changeLoading', true)
      const result = await service.downloadDateReport({
        year: item.date.substr(0, 4),
        month: item.date.substr(5, 2),
        day: item.date.substr(8, 2),
        dailyReportType: type,
        storeId: item.storeId
      })
      this.$store.commit('changeLoading', false)
      const a = document.createElement('a')
      const url = window.URL.createObjectURL(new Blob([result.data], { type: result.headers['content-type'] }))
      a.href = url
      a.style.display = 'none'
      if (type === 'B4SUCCESS') {
        a.download = `${item.date}.成功日報.xlsx`
      } else {
        a.download = `${item.date}.失敗日報.xlsx`
      }
      a.click()
      // 清除暫存
      a.href = ''
      window.URL.revokeObjectURL(url)
    }
  }
}
</script>
