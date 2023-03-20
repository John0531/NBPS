<template>
  <div>
    <div class="row justify-content-center">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h2 class="fw-bold mb-3">批次交易查詢作業</h2>
            <h6>供帳務科經辦依起訖日、特店查詢批次交易結果</h6>
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
                <h5 class="text-nowrap me-3" style="padding-top:0.375rem;">結果:</h5>
                <select class="form-select" v-model="searchForm.result">
                  <option selected value="FAIL">失敗</option>
                  <option value="SUCCESS">成功</option>
                </select>
              </div>
            </div>
            <button @click="getData" class="btn btn-primary me-3 px-4" :disabled="!$store.state.pageBtnPermission.includes('view')">搜尋</button>
          </div>
        </div>
        <MainData :Page="pageData" @ChangePageInfo="getPageInfo" @updatePageInfo="getPageInfo">
          <template #default>
            <thead>
              <tr>
                <th scope="col">msgId</th>
                <th scope="col">時間</th>
                <th scope="col">URL</th>
                <th scope="col">名稱</th>
                <th scope="col">結果</th>
                <th scope="col">執行時間(ms)</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in gridData" :key="item.batchId">
                <th scope="row">{{item.msgId}}</th>
                <td>{{item.time}}</td>
                <td>{{item.url}}</td>
                <td>{{item.name}}</td>
                <td>
                  <span v-if="item.result==='SUCCESS'">成功</span>
                  <span v-if="item.result==='FAIL'">失敗</span>
                </td>
                <td>{{item.runtime}}</td>
                <td>
                  <button @click="getDetail(item)" class="btn btn-success me-2 btn-sm">檢視物件方法明細</button>
                  <button @click="getSendData(item)" class="btn btn-primary me-2 btn-sm">檢視傳送資料</button>
                </td>
              </tr>
            </tbody>
          </template>
        </MainData>
      </div>
    </div>

    <!-- 檢視物件方法明細 Modal -->
    <div class="modal fade" ref="detailModal" tabindex="-1" aria-labelledby="detailModal" aria-hidden="true">
      <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-success">
            <h5 class="modal-title text-white">檢視明細</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <h5>msgId: {{detailData.msgId}}</h5>
            <MainData ref="detailMainData" :Page="detailPageData" @ChangePageInfo="getDetailPageInfo">
              <template #default>
                <thead>
                  <tr>
                    <th scope="col">方法</th>
                    <th scope="col">物件</th>
                    <th scope="col">執行時間(ms)</th>
                    <th scope="col">類別</th>
                    <th scope="col">時間</th>
                    <th scope="col">結果</th>
                    <th scope="col">例外</th>
                    <th scope="col">例外訊息</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in detailData.gridData" :key="item.time">
                    <th scope="row">{{item.action}}</th>
                    <td>{{item.className}}</td>
                    <td>{{item.runtime}}</td>
                    <td>{{item.type}}</td>
                    <td>{{item.time}}</td>
                    <td>
                      <span v-if="item.result==='SUCCESS'">成功</span>
                      <span v-if="item.result==='FAIL'">失敗</span>
                    </td>
                    <td>{{item.exp}}</td>
                    <td>{{item.expMsg}}</td>
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

    <!-- 檢視傳送資料 Modal -->
    <div class="modal fade" ref="sendDataModal" tabindex="-1" aria-labelledby="detailModal" aria-hidden="true">
      <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-primary">
            <h5 class="modal-title text-white">檢視傳送資料</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <h5>msgId: {{sendData.msgId}}</h5>
            <h5 v-html="sendData.input"></h5>
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
import service from '@/services/I/I3.service.js'
import MainData from '@/components/MainData.vue'

export default {
  components: {
    MainData
  },
  data () {
    return {
      pageData: {}, // ?分頁資訊
      searchForm: {
        startDate: `${this.$custom.moment().format('YYYY-MM-DD')} 00:00:00`,
        endDate: `${this.$custom.moment().format('YYYY-MM-DD')} 23:59:59`,
        result: 'FAIL'
      },
      gridData: [],
      detailModal: '',
      detailDataPost: {
        msgId: '',
        page: 1,
        pageSize: 10
      },
      detailData: {
        msgId: '',
        gridData: []
      },
      detailPageData: {}, // ?詳細分頁資訊
      sendDataModal: '',
      sendData: {}
    }
  },
  methods: {
    // ? 取得 MainData 元件分頁資訊
    getPageInfo (PageInfo) {
      this.searchForm.page = PageInfo.page
      this.searchForm.pageSize = PageInfo.pageSize
      this.getData()
    },
    // ? 取得 MainData 元件詳細分頁資訊
    getDetailPageInfo (PageInfo) {
      this.detailDataPost.page = PageInfo.page
      this.detailDataPost.pageSize = PageInfo.pageSize
      this.getDetail()
    },
    async getData () {
      this.$store.commit('changeLoading', true)
      const result = await service.getUserLog(this.searchForm)
      this.$store.commit('changeLoading', false)
      this.pageData = result.pageInfo // ? 傳送分頁資訊
      this.gridData = result.errorLogList
    },
    async getDetail (item) {
      if (item) {
        this.detailDataPost.msgId = item.msgId
        this.detailDataPost.page = 1
        // this.detailDataPost.pageSize = 10
      }
      this.$store.commit('changeLoading', true)
      const result = await service.getLogDetail(this.detailDataPost)
      this.$store.commit('changeLoading', false)
      if (result) {
        this.detailPageData = result.pageInfo // ? 傳送分頁資訊
        if (item) {
          this.detailData.msgId = item.msgId
        }
        this.detailData.gridData = result.statLogList
      }
      this.detailModal.show()
    },
    getSendData (item) {
      this.sendData.msgId = item.msgId
      this.sendData.input = JSON.stringify(item.input)
      this.sendData.input = this.sendData.input.replaceAll(',', ',<br>')
      this.sendDataModal.show()
    }
  },
  mounted () {
    this.detailModal = new this.$custom.bootstrap.Modal(this.$refs.detailModal, { backdrop: 'static' })
    this.sendDataModal = new this.$custom.bootstrap.Modal(this.$refs.sendDataModal, { backdrop: 'static' })
  }
}
</script>
