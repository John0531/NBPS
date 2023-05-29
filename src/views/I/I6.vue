<template>
  <div>
    <div class="row justify-content-center">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h2 class="fw-bold mb-3">使用者操作紀錄查詢</h2>
            <h6>供經辦查詢使用者操作紀錄</h6>
          </div>
          <div class="card-body">
            <div class="row py-3">
              <div class="col-xxl-8 d-flex mb-4">
                <h5 class="text-nowrap me-3" style="padding-top:0.375rem;">日期:</h5>
                <div class="input-group">
                  <span class="input-group-text" id="basic-addon1">起日</span>
                  <Datepicker auto-apply enable-seconds v-model="searchForm.startDate" model-type="yyyy-MM-dd HH:mm:ss" format="yyyy/MM/dd HH:mm:ss"></Datepicker>
                </div>
                <div class="input-group">
                  <span class="input-group-text" id="basic-addon1">迄日</span>
                  <Datepicker auto-apply enable-seconds v-model="searchForm.endDate" model-type="yyyy-MM-dd HH:mm:ss" format="yyyy/MM/dd HH:mm:ss"></Datepicker>
                </div>
              </div>
              <div class="col-xxl-4"></div>
              <div class="col-xxl-5 d-flex mb-4">
                <h5 class="text-nowrap me-3" style="padding-top:0.375rem;">使用者帳號:</h5>
                <input type="text" v-model="searchForm.userName" class="form-control" placeholder="">
              </div>
            </div>
            <button @click="getData" class="btn btn-primary me-3 px-4" :disabled="!$store.state.pageBtnPermission.includes('view')">搜尋</button>
            <button @click="downloadExcel" class="btn btn-warning me-3 px-4" :disabled="!$store.state.pageBtnPermission.includes('download')">下載excel</button>
          </div>
        </div>
        <MainData :Page="pageData" @ChangePageInfo="getPageInfo">
          <template #default>
            <thead>
              <tr>
                <th scope="col">msgId</th>
                <th scope="col">時間</th>
                <th scope="col">URL</th>
                <th scope="col">名稱</th>
                <th scope="col">結果</th>
                <th scope="col">執行時間(ms)</th>
                <th scope="col">IP</th>
                <th scope="col">帳號</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in gridData" :key="item.batchId">
                <th scope="row">{{item.msgId}}</th>
                <td>{{item.time}}</td>
                <td>{{item.url}}</td>
                <td>{{item.action}}</td>
                <td>{{item.resultDesc}}</td>
                <td>{{item.runtime}}</td>
                <td>{{item.ip}}</td>
                <td>{{item.username}}</td>
                <td>
                  <button @click="getDetail(item)" class="btn btn-success me-2 btn-sm">檢視傳送資料</button>
                </td>
              </tr>
            </tbody>
          </template>
        </MainData>
      </div>
    </div>

    <!-- 檢視明細 Modal -->
    <div class="modal fade" ref="detailModal" tabindex="-1" aria-labelledby="detailModal" aria-hidden="true">
      <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-success">
            <h5 class="modal-title text-white">檢視傳送資料</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <h5>msgId: {{detailData.msgId}}</h5>
            <h5 v-html="detailData.input"></h5>
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
import service from '@/services/I/I6.service.js'
import MainData from '@/components/MainData.vue'

export default {
  components: {
    MainData
  },
  data () {
    return {
      pageData: {}, // ?分頁資訊
      searchForm: {
        page: 1,
        pageSize: 10
      },
      gridData: [],
      detailModal: '',
      detailData: {}
    }
  },
  methods: {
    // ? 取得 MainData 元件分頁資訊
    getPageInfo (PageInfo) {
      this.searchForm.page = PageInfo.page
      this.searchForm.pageSize = PageInfo.pageSize
      this.getData()
    },
    async getData () {
      this.$store.commit('changeLoading', true)
      const result = await service.getUserLog(this.searchForm)
      this.$store.commit('changeLoading', false)
      this.pageData = result.pageInfo // ? 傳送分頁資訊
      this.gridData = result.userLogList
    },
    getDetail (item) {
      this.detailData.msgId = item.msgId
      this.detailData.input = JSON.stringify(item.input)
      this.detailData.input = this.detailData.input.replaceAll(',', ',<br>')
      this.detailModal.show()
    },
    async downloadExcel () {
      this.$store.commit('changeLoading', true)
      const postData = {
        userName: this.searchForm.userName,
        startDate: this.searchForm.startDate,
        endDate: this.searchForm.endDate
      }
      const result = await service.downloadExcel(postData)
      this.$store.commit('changeLoading', false)
      const a = document.createElement('a')
      const url = window.URL.createObjectURL(new Blob([result.data], { type: result.headers['content-type'] }))
      a.href = url
      a.style.display = 'none'
      a.download = '總計excel.xlsx'
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
