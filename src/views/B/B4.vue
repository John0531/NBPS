<template>
  <div>
    <div class="row justify-content-center">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h2 class="fw-bold mb-3">請款對帳單</h2>
            <h6>供特店端下載每月請款總結及明細 Excel 檔，需將主機請款回覆檔回寫置資料庫後呈現</h6>
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
                <Datepicker class="w-xxl-50 w-100" v-model="searchMonth" month-picker auto-apply format="yyyy年MM月"></Datepicker>
              </div>
              <div class="col-xxl-6 d-flex mb-4" v-if="searchType==='date'">
                <h5 class="text-nowrap me-3" style="padding-top:0.375rem;">依日期:</h5>
                <Datepicker :enable-time-picker="false" class="w-xxl-50 w-100" v-model="searchDate" range auto-apply multi-calendars multi-calendars-solo model-type="yyyy-MM-dd" format="yyyy/MM/dd"></Datepicker>
              </div>
            </div>
            <button class="btn btn-primary me-3 px-4" @click.prevent="searchReport">搜尋</button>
          </div>
        </div>
        <div v-if="searchType==='month'" class="mt-5 tbl-container table-responsive">
          <table class="table table-striped table-bordered table-hover" v-if="monthGridData.date">
            <thead>
              <tr>
                <th scope="col">請款日期</th>
                <th scope="col">特店代號</th>
                <th scope="col">特店名稱</th>
                <th scope="col">請款成功總筆數</th>
                <th scope="col">請款成功總金額</th>
                <th scope="col">請款失敗總筆數</th>
                <th scope="col">請款失敗總金額</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">{{monthGridData.date}}</th>
                <td>{{monthGridData.storeId}}</td>
                <td>{{monthGridData.storeName}}</td>
                <td>{{monthGridData.totalSuccessSettleCount}}</td>
                <td>{{$custom.currency(monthGridData.totalSuccessSettleAmt)}}</td>
                <td>{{monthGridData.totalFailSettleCount}}</td>
                <td>{{$custom.currency(monthGridData.totalFailSettleAmt)}}</td>
                <td>
                  <button @click.prevent="downloadMonthReport" class="btn btn-primary me-2 btn-sm">下載</button>
                </td>
              </tr>
            </tbody>
          </table>
          <h3 class="text-center mb-0 py-5 fw-bold bg-light" v-else>查無資訊</h3>
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
              </tr>
            </tbody>
          </template>
        </MainData>
      </div>
    </div>

    <!-- 檢視明細 Modal -->
    <div class="modal fade" ref="detailModal" tabindex="-1" aria-labelledby="detailModal" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-danger">
            <h5 class="modal-title text-white">檢失敗視明細</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <h5>特店代號: {{detailData.storeId}}</h5>
            <h5>特店名稱: {{detailData.storeName}}</h5>
            <MainData :Page="detailPageData" @ChangePageInfo="getDetailPageInfo">
              <template #default>
                <thead>
                  <tr>
                    <th scope="col">卡號</th>
                    <th scope="col">交易日</th>
                    <th scope="col">金額</th>
                    <th scope="col">授權碼</th>
                    <th scope="col">帳單描述</th>
                    <th scope="col">請款失敗</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item,index) in detailData.gridData" :key="`A+${index}`">
                    <th scope="row">{{item.pan}}</th>
                    <td>{{item.date}}</td>
                    <td>{{$custom.currency(item.amt)}}</td>
                    <td>{{item.desc}}</td>
                    <td>{{item.authCode}}</td>
                    <td>
                      <span v-if="item.codeH==='00'">成功</span>
                      <span v-else>失敗</span>
                    </td>
                  </tr>
                </tbody>
              </template>
            </MainData>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import service from '@/services/B/B4.service.js'
import MainData from '@/components/MainData.vue'

export default {
  components: {
    MainData
  },
  data () {
    return {
      searchType: '',
      searchMonth: '',
      monthGridData: {},
      searchDate: '',
      searchDatePost: {},
      pageData: {}, // ?分頁資訊
      dateGridData: [],
      detailModal: '',
      detailDataPost: {
        date: '',
        page: 1,
        pageSize: 10
      },
      detailData: {
        storeId: '',
        storeName: '',
        gridData: []
      },
      detailPageData: {} // ?詳細分頁資訊
    }
  },
  methods: {
    searchReport () {
      if (!this.searchType) {
        this.$swal.fire('請選擇查詢方式')
        return
      }
      if (this.searchType === 'month') {
        if (!this.searchMonth) {
          this.$swal.fire('請選擇月份')
          return
        }
        this.getMonthData()
      } else if (this.searchType === 'date') {
        if (!this.searchDate) {
          this.$swal.fire('請選擇日期')
          return
        }
        this.searchDatePost.startDate = this.searchDate[0]
        this.searchDatePost.endDate = this.searchDate[1]
        this.searchDatePost.page = 1
        this.searchDatePost.pageSize = 10
        this.getDateData()
      }
    },
    async getMonthData () {
      this.$store.commit('changeLoading', true)
      const result = await service.searchMonthReport({
        year: this.searchMonth.year.toString(),
        month: (this.searchMonth.month + 1).toString().padStart(2, '0')
      })
      this.$store.commit('changeLoading', false)
      if (result) {
        this.monthGridData = result
      }
    },
    async downloadMonthReport () {
      this.$store.commit('changeLoading', true)
      const result = await service.downloadMonthReport({
        year: this.monthGridData.date.split('-')[0],
        month: this.monthGridData.date.split('-')[1]
      })
      this.$store.commit('changeLoading', false)
      const a = document.createElement('a')
      const url = window.URL.createObjectURL(new Blob([result.data], { type: result.headers['content-type'] }))
      a.href = url
      a.style.display = 'none'
      a.download = `${this.monthGridData.date.split('-')[1]}月月報.xlsx`
      a.click()
      // 清除暫存
      a.href = ''
      window.URL.revokeObjectURL(url)
    },
    // ? 取得 MainData 元件分頁資訊
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
    // ? 取得 MainData 元件詳細分頁資訊
    getDetailPageInfo (PageInfo) {
      this.detailDataPost.page = PageInfo.page
      this.detailDataPost.pageSize = PageInfo.pageSize
      this.getDetail()
    },
    async getDetail (item) {
      if (item) {
        this.detailDataPost.date = item.date
        this.detailDataPost.page = 1
        this.detailDataPost.pageSize = 10
      }
      this.$store.commit('changeLoading', true)
      const result = await service.getDateReportDetail(this.detailDataPost)
      this.$store.commit('changeLoading', false)
      if (result) {
        this.detailPageData = result.pageInfo // ? 傳送分頁資訊
        if (item) {
          this.detailData.storeId = item.storeId
          this.detailData.storeName = item.storeName
        }
        this.detailData.gridData = result.txnSettlePage
      }
      this.detailModal.show()
    },
    async downloadDateReport (item, type) {
      this.$store.commit('changeLoading', true)
      const result = await service.downloadDateReport({
        year: item.date.substr(0, 4),
        month: item.date.substr(4, 2),
        day: item.date.substr(6, 2),
        dailyReportType: type
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
  },
  mounted () {
    this.detailModal = new this.$custom.bootstrap.Modal(this.$refs.detailModal, { backdrop: 'static' })
  }
}
</script>
