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
                <h5 class="text-nowrap me-3" style="padding-top:0.375rem;">確認送出日期:</h5>
                <div class="input-group">
                  <span class="input-group-text" id="basic-addon1">起日</span>
                  <Datepicker auto-apply enable-seconds v-model="searchForm.startDate" model-type="yyyy-MM-dd" format="yyyy/MM/dd"></Datepicker>
                </div>
                <div class="input-group">
                  <span class="input-group-text" id="basic-addon1">迄日</span>
                  <Datepicker auto-apply enable-seconds v-model="searchForm.endDate" model-type="yyyy-MM-dd" format="yyyy/MM/dd"></Datepicker>
                </div>
              </div>
              <div class="col-xxl-4"></div>
              <div class="col-xxl-5 d-flex mb-4">
                <h5 class="text-nowrap me-3" style="padding-top:0.375rem;">交易處理狀態:</h5>
                <select class="form-select" v-model="searchForm.trxType">
                  <option selected value="">全部</option>
                  <option value="TRX_WAITING">等待交易中</option>
                  <option value="TRX_PROCESS">交易處理中</option>
                  <option value="TRX_FINISH_WITH_ERROR">交易處理完成但有異常</option>
                  <option value="TRX_FINISH">交易處理完成</option>
                  <option value="TRX_FINISH_REVERSAL">交易已取消</option>
                </select>
              </div>
              <div class="col-xxl-7"></div>
            </div>
            <button @click="getData" class="btn btn-primary me-3 px-4" :disabled="!$store.state.pageBtnPermission.includes('view')">搜尋</button>
          </div>
        </div>
        <MainData :Page="pageData" @ChangePageInfo="getPageInfo" @updatePageInfo="getPageInfo">
          <template #default>
            <thead>
              <tr>
                <th scope="col">特店代碼</th>
                <th scope="col">特店名稱</th>
                <th scope="col">上傳批次交易檔名</th>
                <th scope="col">確認送出時間</th>
                <th scope="col">批次處理狀態</th>
                <th scope="col">交易處理狀態</th>
                <th scope="col">總筆數</th>
                <th scope="col">總金額 A-B</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in gridData" :key="item.batchId">
                <th scope="row">{{item.batchStoreId}}</th>
                <td>{{item.batchStoreName}}</td>
                <td>{{item.batchFileName}}</td>
                <td>{{item.submitTime}}</td>
                <td>
                  <span class="fw-bold" v-if="item.batchStatus==='UPLOAD_SUCCESS'">上傳成功</span>
                  <span class="fw-bold" v-if="item.batchStatus==='UPLAOD_FAIL'">上傳失敗</span>
                  <span class="fw-bold" v-if="item.batchStatus==='VALIDATING'">格式檢核中</span>
                  <span class="fw-bold text-success" v-if="item.batchStatus==='VALIDATE_SUCCESS'">格式檢核成功</span>
                  <span class="fw-bold text-danger" v-if="item.batchStatus==='VALIDATE_FAIL'">格式檢核失敗</span>
                  <span class="fw-bold" v-if="item.batchStatus==='SUBMISSION_AND_TRX_WAIT'">確認送出，等待交易中</span>
                  <span class="fw-bold" v-if="item.batchStatus==='TRX_WAIT'">等待交易中</span>
                  <span class="fw-bold" v-if="item.batchStatus==='TRX_PROCESS'">交易處理中</span>
                  <span class="fw-bold" v-if="item.batchStatus==='TRX_FINISH'">交易處理完成</span>
                  <span class="fw-bold" v-if="item.batchStatus==='REPLY_PROCESS'">回覆檔產製中</span>
                  <span class="fw-bold" v-if="item.batchStatus==='REPLY_SUCCESS'">已下傳回覆檔</span>
                  <span class="fw-bold" v-if="item.batchStatus==='REPLY_FAIL'">下傳回覆檔失敗</span>
                  <span class="fw-bold" v-if="item.batchStatus==='DOWLOAD_REPLY'">特店已下載回覆檔</span>
                </td>
                <td>
                  <span v-if="item.trxStatus==='TRX_WAITING'">等待交易中</span>
                  <span v-if="item.trxStatus==='TRX_PROCESS'">交易處理中</span>
                  <span v-if="item.trxStatus==='TRX_FINISH_WITH_ERROR'">交易處理完成但有異常</span>
                  <span v-if="item.trxStatus==='TRX_FINISH'">交易處理完成</span>
                  <span v-if="item.trxStatus==='TRX_FINISH_REVERSAL'">交易已取消</span>
                  <span v-if="item.trxStatus==='REPLY_PROCESS'">回覆檔產製中</span>
                  <span v-if="item.trxStatus==='REPLY_SUCCESS'">已下載回覆檔</span>
                  <span v-if="item.trxStatus==='REPLY_FAIL'">下傳回覆檔失敗</span>
                </td>
                <td>{{item.totalCnt}}</td>
                <td>{{$custom.currency(item.totalAmt)}}</td>
                <td>
                  <button @click="getDetail(item)" class="btn btn-primary me-2 btn-sm">檢視明細</button>
                  <button @click="downloadReply(item)" v-if="item.batchStatus==='REPLY_SUCCESS'" class="btn btn-success me-2 btn-sm" :disabled="!$store.state.pageBtnPermission.includes('download')">下載回覆檔</button>
                  <button @click="downloadExcel(item)" class="btn btn-warning me-2 btn-sm" :disabled="!$store.state.pageBtnPermission.includes('download')">下載總計EXCEL</button>
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
            <h5 class="modal-title text-white">檢視明細</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <h5>檔名: {{detailData.batchFileName}}</h5>
            <h5>特店名稱: {{detailData.batchStoreName}}</h5>
            <div class="d-flex">
              <h5 class="text-nowrap me-3" style="padding-top:0.375rem;">依卡號查詢:</h5>
              <input v-model="pan" v-on:blur="getDetailByPan(detailData.batchId, pan)" type="text" class="form-contorl">
            </div>
            <MainData ref="detailMainData" :Page="detailPageData" @ChangePageInfo="getDetailPageInfo">
              <template #default>
                <thead>
                  <tr>
                    <th scope="col">卡號</th>
                    <th scope="col">交易類別</th>
                    <th scope="col">金額</th>
                    <th scope="col">帳單描述</th>
                    <th scope="col">回應碼</th>
                    <th scope="col">授權碼</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in detailData.gridData" :key="item.pan">
                    <th scope="row">{{item.pan}}</th>
                    <td>
                      <span v-if="item.transType==='SALE'">授權與請款</span>
                      <span v-if="item.transType==='AUTH'">授權</span>
                      <span v-if="item.transType==='OFF_LINE_SALE'">請款</span>
                      <span v-if="item.transType==='REFUND'">退貨</span>
                    </td>
                    <td>{{$custom.currency(item.amt)}}</td>
                    <td>{{item.desc}}</td>
                    <td>{{item.codeH}}</td>
                    <td>{{item.authCode}}</td>
                  </tr>
                </tbody>
              </template>
            </MainData>
            <div class="mt-3 d-flex justify-content-center" v-if="detailData.dtSummary">
              <table class="table table-borderless" style="width:auto;font-size:18px;">
                <thead class="text-center table-success">
                  <tr>
                    <th></th>
                    <td>(A)授權</td>
                    <td>(R)退貨</td>
                    <td>(S)銷售</td>
                    <td>(O)交易補登請款</td>
                    <td>取消授權</td>
                    <td>取消退貨</td>
                    <td>取消銷售</td>
                  </tr>
                </thead>
                <tbody class="text-center">
                  <tr>
                    <th>
                      <div class="d-flex justify-content-between">
                        <span>交易總筆數</span>
                        <span>{{detailData.dtSummary.totalCnt}} =</span>
                      </div>
                    </th>
                    <td>{{detailData.dtSummary.totalAuthCnt}} +</td>
                    <td>{{detailData.dtSummary.totalRefundCnt}} +</td>
                    <td>{{detailData.dtSummary.totalSaleCnt}} +</td>
                    <td>0 +</td>
                    <td><span class="text-danger">{{'('+detailData.dtSummary.voidAuthCnt+')'}}</span> +</td>
                    <td><span class="text-danger">{{'('+detailData.dtSummary.voidRefundCnt+')'}}</span> +</td>
                    <td><span class="text-danger">{{'('+detailData.dtSummary.voidSaleCnt+')'}}</span></td>
                  </tr>
                  <tr>
                    <th>
                      <div class="d-flex justify-content-between">
                        <span>交易總金額</span>
                        <span class="ms-3">{{$custom.currency(detailData.dtSummary.totalAmt)}} =</span>
                      </div>
                    </th>
                    <td>{{$custom.currency(detailData.dtSummary.totalAuthAmt)}} +</td>
                    <td><span class="text-danger">({{$custom.currency(detailData.dtSummary.totalRefundAmt)}})</span> +</td>
                    <td>{{$custom.currency(detailData.dtSummary.totalSaleAmt)}} +</td>
                    <td>0 +</td>
                    <td><span class="text-danger">{{'('+$custom.currency(detailData.dtSummary.voidAuthAmt)+')'}}</span> +</td>
                    <td><span class="text-danger">{{'('+$custom.currency(detailData.dtSummary.voidRefundAmt)+')'}}</span> +</td>
                    <td><span class="text-danger">{{'('+$custom.currency(detailData.dtSummary.voidSaleAmt)+')'}}</span></td>
                  </tr>
                  <tr>
                    <th>
                      <div class="d-flex justify-content-between">
                        <span>交易核准筆數</span>
                        <span>{{detailData.dtSummary.successTransCnt}} =</span>
                      </div>
                    </th>
                    <td>{{detailData.dtSummary.successAuthTransCnt}} +</td>
                    <td>{{detailData.dtSummary.successRefundTransCnt}} +</td>
                    <td>{{detailData.dtSummary.successSaleTransCnt}} +</td>
                    <td>0 +</td>
                    <td><span class="text-danger">{{'('+detailData.dtSummary.successVoidAuthCnt+')'}}</span> +</td>
                    <td><span class="text-danger">{{'('+detailData.dtSummary.successVoidRefundCnt+')'}}</span> +</td>
                    <td><span class="text-danger">{{'('+detailData.dtSummary.successVoidSaleCnt+')'}}</span></td>
                  </tr>
                  <tr>
                    <th>
                      <div class="d-flex justify-content-between">
                        <span>交易核准金額</span>
                        <span class="ms-3">{{$custom.currency(detailData.dtSummary.successAmtSum)}} =</span>
                      </div>
                    </th>
                    <td>{{$custom.currency(detailData.dtSummary.successAuthAmtSum)}} +</td>
                    <td><span class="text-danger">({{$custom.currency(detailData.dtSummary.successRefundAmtSum)}})</span> +</td>
                    <td>{{$custom.currency(detailData.dtSummary.successSaleAmtSum)}} +</td>
                    <td>0 +</td>
                    <td><span class="text-danger">{{'('+$custom.currency(detailData.dtSummary.successVoidAuthAmt)+')'}}</span>  +</td>
                    <td><span class="text-danger">{{'('+$custom.currency(detailData.dtSummary.successVoidRefundAmt)+')'}}</span>  +</td>
                    <td><span class="text-danger">{{'('+$custom.currency(detailData.dtSummary.successVoidSaleAmt)+')'}}</span> </td>
                  </tr>
                  <tr>
                    <th>
                      <div class="d-flex justify-content-between">
                        <span>交易拒絕筆數</span>
                        <span>{{detailData.dtSummary.failTransCnt}} =</span>
                      </div>
                    </th>
                    <td>{{detailData.dtSummary.failAuthTransCnt}} +</td>
                    <td>{{detailData.dtSummary.failRefundTransCnt}} +</td>
                    <td>{{detailData.dtSummary.failSaleTransCnt}} +</td>
                    <td>0 +</td>
                    <td><span class="text-danger">{{'('+detailData.dtSummary.failVoidAuthCnt+')'}}</span> +</td>
                    <td><span class="text-danger">{{'('+detailData.dtSummary.failVoidRefundCnt+')'}}</span> +</td>
                    <td><span class="text-danger">{{'('+detailData.dtSummary.failVoidSaleCnt+')'}}</span></td>
                  </tr>
                  <tr>
                    <th>
                      <div class="d-flex justify-content-between">
                        <span>交易拒絕金額</span>
                        <span class="ms-3">{{$custom.currency(detailData.dtSummary.failAmtSum)}} =</span>
                      </div>
                    </th>
                    <td>{{$custom.currency(detailData.dtSummary.failAuthAmtSum)}} +</td>
                    <td><span class="text-danger">({{$custom.currency(detailData.dtSummary.failRefundAmtSum)}})</span> +</td>
                    <td>{{$custom.currency(detailData.dtSummary.failSaleAmtSum)}} +</td>
                    <td>0 +</td>
                    <td><span class="text-danger">{{'('+$custom.currency(detailData.dtSummary.failVoidAuthAmt)+')'}}</span> +</td>
                    <td><span class="text-danger">{{'('+$custom.currency(detailData.dtSummary.failVoidRefundAmt)+')'}}</span> +</td>
                    <td><span class="text-danger">{{'('+$custom.currency(detailData.dtSummary.failVoidSaleAmt)+')'}}</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
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
import service from '@/services/B/B2.service.js'
import MainData from '@/components/MainData.vue'

export default {
  components: {
    MainData
  },
  data () {
    return {
      pageData: {}, // ?分頁資訊
      searchForm: {
        startDate: `${this.$custom.moment().format('YYYY-MM-DD')}`,
        endDate: `${this.$custom.moment().format('YYYY-MM-DD')}`
      },
      gridData: [],
      detailPageData: {}, // ?詳細分頁資訊
      detailModal: '',
      pan: '',
      detailData: {
        originData: [],
        gridData: []
      }
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
      // * 傳送分頁資訊
      this.detailPageData = {
        totalElements: this.detailData.originData.length,
        currentPage: PageInfo.page,
        totalPages: Math.ceil(this.detailData.originData.length / PageInfo.pageSize)
      }
      // * 前端取得分頁資料(不打api)
      this.detailData.gridData = this.detailData.originData.slice((PageInfo.page - 1) * PageInfo.pageSize, PageInfo.page * PageInfo.pageSize)
    },
    async getData () {
      if (this.searchForm.storeId === '') {
        this.searchForm.storeId = null
      }
      if (this.searchForm.trxType === '') {
        this.searchForm.trxType = null
      }
      this.$store.commit('changeLoading', true)
      const result = await service.getBatchData(this.searchForm)
      this.$store.commit('changeLoading', false)
      this.pageData = result.pageInfo // ? 傳送分頁資訊
      this.gridData = result.batchList
    },
    async getDetail (item) {
      this.$store.commit('changeLoading', true)
      const result = await service.getBatchDetail(item.batchId)
      this.$store.commit('changeLoading', false)
      if (result) {
        // * 傳送分頁資訊(僅第一次打api取得所有資料)
        this.detailPageData = {
          totalElements: result.batchList.length,
          currentPage: 1,
          totalPages: Math.ceil(result.batchList.length / 10)
        }
        this.detailData.originData = result.batchList
        this.detailData.gridData = this.detailData.originData.slice(0, 10)
        // * 傳送分頁資訊(僅第一次打api取得所有資料) end
        this.detailData.batchFileName = item.batchFileName
        this.detailData.batchStoreName = item.batchStoreName
        this.detailData.dtSummary = result.dtSummary
        this.detailData.batchId = item.batchId
        // * 將每頁資料數初始化
        this.$refs.detailMainData.PageInfo.pageSize = 10
      }
      this.detailModal.show()
    },
    async getDetailByPan (batchId, pan) {
      this.$store.commit('changeLoading', true)
      const result = await service.getBatchDetailByPan(batchId, pan)
      this.$store.commit('changeLoading', false)
      if (result) {
        // * 傳送分頁資訊(僅第一次打api取得所有資料)
        this.detailPageData = {
          totalElements: result.batchList.length,
          currentPage: 1,
          totalPages: Math.ceil(result.batchList.length / 10)
        }
        this.detailData.originData = result.batchList
        this.detailData.gridData = this.detailData.originData.slice(0, 10)
        // * 傳送分頁資訊(僅第一次打api取得所有資料) end
        // this.detailData.batchFileName = item.batchFileName
        // this.detailData.batchStoreName = item.batchStoreName
        this.detailData.dtSummary = result.dtSummary
        // * 將每頁資料數初始化
        this.$refs.detailMainData.PageInfo.pageSize = 10
      }
      this.detailModal.show()
    },
    async downloadReply (item) {
      this.$store.commit('changeLoading', true)
      const result = await service.downloadReply(item.batchId)
      this.$store.commit('changeLoading', false)
      const a = document.createElement('a')
      const url = window.URL.createObjectURL(new Blob([result.data], { type: result.headers['content-type'] }))
      a.href = url
      a.style.display = 'none'
      a.download = item.batchFileName
      a.click()
      // 清除暫存
      a.href = ''
      window.URL.revokeObjectURL(url)
    },
    async downloadExcel (item) {
      this.$store.commit('changeLoading', true)
      const result = await service.downloadExcel(item.batchId)
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
