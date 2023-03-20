<template>
  <div>
    <div class="row justify-content-center">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h2 class="fw-bold mb-3">批次交易查詢作業</h2>
            <h6>供發卡業務經辦查詢批次交易進度</h6>
          </div>
          <div class="card-body">
            <div class="row py-3">
              <div class="col-xxl-8 d-flex mb-4">
                <h5 class="text-nowrap me-3" style="padding-top:0.375rem;">確認送出日期:</h5>
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
                <h5 class="text-nowrap me-3" style="padding-top:0.375rem;">交易處理狀態:</h5>
                <select class="form-select" v-model="searchForm.trxType">
                  <option selected value="">全部</option>
                  <option value="TRX_WAITING">等待交易中</option>
                  <option value="TRX_PROCESS">交易處理中</option>
                  <option value="TRX_FINISH_WITH_ERROR">交易處理完成但有異常</option>
                  <option value="TRX_FINISH">交易處理完成</option>
                  <option value="TRX_ALL_REVERSAL">交易已整批取消</option>
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
                <th scope="col">上傳批次交易檔名</th>
                <th scope="col">確認送出時間</th>
                <th scope="col">作業類型</th>
                <th scope="col">批次處理狀態</th>
                <th scope="col">交易處理狀態</th>
                <th scope="col">總筆數</th>
                <th scope="col">總金額</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in gridData" :key="item.batchId">
                <th scope="row">{{item.batchFileNameTxt}}</th>
                <td>{{item.submitTime}}</td>
                <td>
                  <span v-if="item.storeType==='ACQUIRING'">收單</span>
                  <span v-if="item.storeType==='PUBLIC_UTILITIES'">公共事業</span>
                  <span v-if="item.storeType==='MAIL_ORDER'">郵購</span>
                  <span v-if="item.storeType==='ISSUE_CARD'">發卡新消貸</span>
                </td>
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
                  <span v-if="item.trxStatus==='TRX_ALL_REVERSAL'">交易已整批取消</span>
                  <span v-if="item.trxStatus==='REPLY_PROCESS'">回覆黨產製中</span>
                  <span v-if="item.trxStatus==='REPLY_SUCCESS'">已下載回覆檔</span>
                  <span v-if="item.trxStatus==='REPLY_FAIL'">下傳回覆檔失敗</span>
                </td>
                <td>{{item.totalCnt}}</td>
                <td>{{$custom.currency(item.totalAmt)}}</td>
                <td>
                  <button v-if="item.trxStatus==='TRX_FINISH'" @click="getDetail(item)" class="btn btn-primary me-2 btn-sm">檢視明細</button>
                  <!-- <button v-if="item.batchStatus==='VALIDATE_FAIL'" @click="getError(item)" class="btn btn-danger me-2 btn-sm">檢視錯誤</button> -->
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
            <h5>作業類型:
              <span v-if="detailData.batchStoreName==='ACQUIRING'">收單</span>
              <span v-if="detailData.batchStoreName==='PUBLIC_UTILITIES'">公共事業</span>
              <span v-if="detailData.batchStoreName==='MAIL_ORDER'">郵購</span>
              <span v-if="detailData.batchStoreName==='ISSUE_CARD'">發卡新消貸</span>
            </h5>
            <MainData ref="detailMainData" :Page="detailPageData" @ChangePageInfo="getDetailPageInfo">
              <template #default>
                <thead>
                  <tr>
                    <th scope="col">卡號</th>
                    <th scope="col">交易類別</th>
                    <th scope="col">金額</th>
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
                    <td>授權</td>
                    <td>退貨</td>
                    <td>銷售</td>
                    <td>交易補登請款</td>
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
                    <td>0 +</td>
                    <td>0 +</td>
                    <td>0</td>
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
                    <td>0 +</td>
                    <td>0 +</td>
                    <td>0</td>
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
                    <td>0 +</td>
                    <td>0 +</td>
                    <td>0</td>
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
                    <td>0 +</td>
                    <td>0 +</td>
                    <td>0</td>
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
                    <td>0 +</td>
                    <td>0 +</td>
                    <td>0</td>
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
                    <td>0 +</td>
                    <td>0 +</td>
                    <td>0</td>
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

    <!-- 檢視錯誤 Modal -->
    <div class="modal fade" ref="errorModal" tabindex="-1" aria-labelledby="errorModal" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-danger">
            <h5 class="modal-title text-white">檢視錯誤</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <h5>檔名: {{errorData.batchFileName}}</h5>
            <MainData :Page="errorPageData" @ChangePageInfo="getErrorPageInfo">
              <template #default>
                <thead>
                  <tr>
                    <th scope="col">筆數</th>
                    <th scope="col">錯誤原因</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in errorData.gridData" :key="item.storeId">
                    <th scope="row">{{item.row}}</th>
                    <td>{{item.errMsg}}</td>
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
import service from '@/services/G/G1.service.js'
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
        endDate: `${this.$custom.moment().format('YYYY-MM-DD')} 23:59:59`
      },
      gridData: [],
      detailPageData: {}, // ?詳細分頁資訊
      detailModal: '',
      detailData: {
        originData: [],
        gridData: []
      },
      errorModal: '',
      errorDataPost: {
        batchId: '',
        page: 1,
        pageSize: 10
      },
      errorData: {
        batchFileName: '',
        batchStoreName: '',
        gridData: []
      },
      errorPageData: {}// ?錯誤分頁資訊
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
    // ? 取得 MainData 元件錯誤分頁資訊
    getErrorPageInfo (PageInfo) {
      this.errorDataPost.page = PageInfo.page
      this.errorDataPost.pageSize = PageInfo.pageSize
      this.getError()
    },
    async getData () {
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
        this.detailData.batchFileName = item.batchFileNameTxt
        this.detailData.batchStoreName = item.storeType
        this.detailData.dtSummary = result.dtSummary
        // * 將每頁資料數初始化
        this.$refs.detailMainData.PageInfo.pageSize = 10
        this.detailModal.show()
      }
    },
    async getError (item) {
      if (item) {
        this.errorDataPost.batchId = item.batchId
        this.errorDataPost.page = 1
        this.errorDataPost.pageSize = 10
      }
      this.$store.commit('changeLoading', true)
      const result = await service.getBatchError(this.errorDataPost)
      this.$store.commit('changeLoading', false)
      if (result) {
        this.errorPageData = result.pageInfo // ? 傳送分頁資訊
        this.errorData.batchFileName = item.batchFileNameTxt
        this.errorData.gridData = result.batchErrorList
      }
      this.errorModal.show()
    }
  },
  mounted () {
    this.detailModal = new this.$custom.bootstrap.Modal(this.$refs.detailModal, { backdrop: 'static' })
    this.errorModal = new this.$custom.bootstrap.Modal(this.$refs.errorModal, { backdrop: 'static' })
  }
}
</script>
