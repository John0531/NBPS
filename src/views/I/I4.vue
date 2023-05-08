<template>
  <div>
    <div class="row justify-content-center">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h2 class="fw-bold mb-3">批次執行紀錄查詢</h2>
            <h6>依起訖日、批次代碼查詢批次執行結果</h6>
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
              <!-- <div class="col-xxl-5 d-flex mb-4">
                <h5 class="text-nowrap me-3" style="padding-top:0.375rem;">批次代碼:</h5>
                <select class="form-select" v-model="searchForm.batchCode">
                  <option selected value="E3">E3:款結果查詢及對帳單產製批次</option>
                  <option value="E5">E5分析報表下載作業批次</option>
                </select>
              </div> -->
            </div>
            <button @click="getData" class="btn btn-primary me-3 px-4" :disabled="!$store.state.pageBtnPermission.includes('view')">查詢紀錄</button>
          </div>
        </div>
        <MainData :Page="pageData" @ChangePageInfo="getPageInfo" @updatePageInfo="getPageInfo">
          <template #default>
            <thead>
              <tr>
                <th scope="col">批次執行時間</th>
                <th scope="col">批次類型</th>
                <th scope="col">批次狀態</th>
                <th scope="col">錯誤資訊</th>
                <th scope="col">重新執行時間</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in gridData" :key="item.id">
                <th scope="row">{{item.lastExecuteTime}}</th>
                <td>{{item.name}}</td>
                <td>{{item.status}} </td>
                <td>{{item.errMsg}}</td>
                <td>{{item.reExecuteTime}}</td>
                <td>
                  <button @click="getDetail(item)" class="btn btn-success me-2 btn-sm">重新執行批次</button>
                  <!-- <button v-if="item.name==='E5分析報表下載作業批次'" @click="getDetail(item)" class="btn btn-success me-2 btn-sm">重新執行批次</button>
                  <button v-if="item.name==='E3請款結果查詢及對帳單產製批次'" @click="getDetail(item)" class="btn btn-success me-2 btn-sm">重新執行批次</button> -->
                </td>
              </tr>
            </tbody>
          </template>
        </MainData>
      </div>
    </div>

    <!-- 重新執行E5批次 Modal -->
    <div class="modal fade" ref="detailE5Modal" tabindex="-1" aria-labelledby="detailE5Modal" aria-hidden="true">
      <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-success">
            <h5 class="modal-title text-white">重新執行E5批次</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row justify-content-center">
              <div class="col-12">
                <div class="card">
                  <div class="card-header">
                    <h2 class="fw-bold mb-3">E5:分析報表下載作業批次</h2>
                    <h6 >產製<span class="fw-bold text-primary">選擇月份的上個月</span>之月結報表 (範例: 選取月份為5月，則產製4月份的報表)</h6>
                  </div>
                  <div class="card-body">
                    <div class="row py-3">
                      <div class="col-xxl-8 d-flex mb-4">
                        <h5 class="text-nowrap me-3" style="padding-top:0.375rem;">月份:</h5>
                        <Datepicker class="w-xxl-50 w-100" v-model="reExeDate" month-picker auto-apply format="yyyy年MM月"></Datepicker>
                      </div>
                    </div>
                    <button @click="reExecureE5(this.detailE5Modal)" :disabled="!$store.state.pageBtnPermission.includes('execute')" class="btn btn-primary me-3 px-4">執行批次</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 重新執行E3批次 Modal -->
    <div class="modal fade" ref="detailE3Modal" tabindex="-1" aria-labelledby="detailE3Modal" aria-hidden="true">
      <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-success">
            <h5 class="modal-title text-white">重新執行E3批次</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row justify-content-center">
              <div class="col-12">
                <div class="card">
                  <div class="card-header">
                    <h2 class="fw-bold mb-3">E3:特店月結報表產製作業批次</h2>
                    <h6 >產製<span class="fw-bold text-primary">選擇月份的上個月</span>之月結報表 (範例: 選取月份為5月，則產製4月份的報表)</h6>
                  </div>
                  <div class="card-body">
                    <div class="row py-3">
                      <div class="col-xxl-8 d-flex mb-4">
                        <h5 class="text-nowrap me-3" style="padding-top:0.375rem;">月份:</h5>
                        <Datepicker class="w-xxl-50 w-100" v-model="reExeDate" month-picker auto-apply format="yyyy年MM月"></Datepicker>
                      </div>
                    </div>
                    <button @click="reExecureE3(this.detailE3Modal)" :disabled="!$store.state.pageBtnPermission.includes('execute')" class="btn btn-primary me-3 px-4">執行批次</button>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import service from '@/services/I/I4.service.js'
import MainData from '@/components/MainData.vue'

export default {
  components: {
    MainData
  },
  data () {
    return {
      reExeDate: `${this.$custom.moment().format('YYYY-MM-DD')}`,
      pageData: {}, // ?分頁資訊
      searchForm: {
        startDate: `${this.$custom.moment().format('YYYY-MM-DD')} 00:00:00`,
        endDate: `${this.$custom.moment().format('YYYY-MM-DD')} 23:59:59`
        // batchCode: '',
      },
      gridData: [],
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
      detailE5Modal: '',
      detailE3Modal: '',
      sendData: {}
    }
  },
  methods: {
    getDetail (item) {
      switch (item.name) {
        case 'E3特店月結報表產製作業批次':
          this.detailE3Modal = new this.$custom.bootstrap.Modal(this.$refs.detailE3Modal, { backdrop: 'static' })
          // this.detailE3Modal.msgId = item.msgId
          this.detailE3Modal.batchHistoryId = item.id
          this.detailE3Modal.batchCode = 'E3'
          this.detailE3Modal.show()
          break
        case 'E5分析報表下載作業批次':
          this.detailE5Modal = new this.$custom.bootstrap.Modal(this.$refs.detailE5Modal, { backdrop: 'static' })
          // this.detailE5Modal.msgId = item.msgId
          this.detailE5Modal.batchHistoryId = item.id
          this.detailE5Modal.batchCode = 'E5'
          this.detailE5Modal.show()
          break
        default:
          break
      }
    },
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
      const result = await service.getBatchExeLog(this.searchForm)
      this.$store.commit('changeLoading', false)
      this.pageData = result.pageInfo // ? 傳送分頁資訊
      this.gridData = result.batchHistoryList // ? 依照日期搜尋後的結果
    },
    async reExecureE5 (item) { // ? 重新執行E5批次
      console.log('item.id=' + item.batchHistoryId)
      if (item) {
        // this.detailDataPost.msgId = item.msgId
        this.detailDataPost.page = 1
        this.detailDataPost.pageSize = 10
        this.detailDataPost.batchCode = 'E5'
        this.detailDataPost.batchHistoryId = item.batchHistoryId
        this.detailDataPost.datetimeE5 = this.reExeDate // 傳送產製批次指定的日期
      }
      this.$store.commit('changeLoading', true)
      const result = await service.batchExecute(this.detailDataPost)
      this.$store.commit('changeLoading', false)
      if (result) {
        this.$swal.fire({
          toast: true,
          position: 'center',
          icon: 'success',
          title: '批次已重新執行',
          showConfirmButton: false,
          timer: 1500,
          width: 500,
          background: '#F0F0F2',
          padding: 25,
          customClass: {
            container: 'z-10000'
          }
        })
      }
      this.detailE5Modal.show()
    },
    async reExecureE3 (item) { // ? 重新執行E3批次
      if (item) {
        // this.detailDataPost.msgId = item.msgId
        this.detailDataPost.page = 1
        this.detailDataPost.pageSize = 10
        this.detailDataPost.batchCode = 'E3'
        this.detailDataPost.batchHistoryId = item.batchHistoryId
        this.detailDataPost.datetimeE5 = this.reExeDate // 傳送產製批次指定的日期
      }
      this.$store.commit('changeLoading', true)
      const result = await service.batchExecute(this.detailDataPost)
      this.$store.commit('changeLoading', false)
      if (result) {
        this.$swal.fire({
          toast: true,
          position: 'center',
          icon: 'success',
          title: '批次已重新執行',
          showConfirmButton: false,
          timer: 1500,
          width: 500,
          background: '#F0F0F2',
          padding: 25,
          customClass: {
            container: 'z-10000'
          }
        })
      }
      this.detailE3Modal.show()
      this.getData()
    },
    mounted () {
      this.getData()
      this.detailE3Modal = new this.$custom.bootstrap.Modal(this.$refs.detailE3Modal, { backdrop: 'static' })
      this.detailE5Modal = new this.$custom.bootstrap.Modal(this.$refs.detailE5Modal, { backdrop: 'static' })
    }
  }
}
</script>
