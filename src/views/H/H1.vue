<template>
  <div>
    <div class="row justify-content-center">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h2 class="fw-bold mb-3">CALL BANK作業</h2>
            <h6>供發Call Bank 經辦修改授權碼及回應碼，當有CALL BANK條件之交易時，回寄信通知指定的信箱。</h6>
          </div>
          <div class="card-body">
            <div class="row py-3">
              <div class="col-xxl-8 d-flex mb-4">
                <h5 class="text-nowrap me-3" style="padding-top:0.375rem;">確認送出日期:</h5>
                <div class="input-group">
                  <span class="input-group-text" id="basic-addon1">起日</span>
                  <Datepicker auto-apply enable-seconds v-model="searchForm.startDate" model-type="yyyy-MM-dd" format="yyyy/MM/dd "></Datepicker>
                </div>
                <div class="input-group">
                  <span class="input-group-text" id="basic-addon1">迄日</span>
                  <Datepicker auto-apply enable-seconds v-model="searchForm.endDate" model-type="yyyy-MM-dd" format="yyyy/MM/dd"></Datepicker>
                </div>
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
                <th scope="col">交易拒絕筆數</th>
                <th scope="col">交易拒絕金額</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in gridData" :key="item.batchId">
                <th scope="row">{{item.fileName}}</th>
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
                  <span class="fw-bold" v-if="item.batchStatus==='TRX_PROCESS'">交易處理中</span>
                  <span class="fw-bold" v-if="item.batchStatus==='TRX_FINISH'">交易處理完成</span>
                  <span class="fw-bold" v-if="item.batchStatus==='CALL_BANK_PROCESS'">Call Bank作業中</span>
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
                <td>{{item.count}}</td>
                <td>{{$custom.currency(item.amt)}}</td>
                <td>
                  <button  @click="getDetail(item)" class="btn btn-primary me-2 btn-sm">檢視明細</button>
                  <button  v-if="item.batchStatus !=='REPLY_UPLOAD_SUCCESS'" @click="callBankFTP(item)" class="btn btn-primary me-2 btn-sm">作業完成</button>
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
                    <th scope="col">商店代號</th>
                    <th scope="col">卡號</th>
                    <th scope="col">交易類別</th>
                    <th scope="col">金額</th>
                    <th scope="col">原始回應碼</th>
                    <th scope="col">更改回應碼</th>
                    <th scope="col">更改授權碼</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item,index)  in detailData.gridData" :key="item.txnId">
                    <th scope="row">{{item.storeId}}</th>
                    <th scope="row">{{item.pan}}</th>
                    <td>
                      <span v-if="item.txnType==='SALE'">授權與請款</span>
                      <span v-if="item.txnType==='AUTH'">授權</span>
                      <span v-if="item.txnType==='OFF_LINE_SALE'">請款</span>
                      <span v-if="item.txnType==='REFUND'">退貨</span>
                    </td>
                    <td>{{$custom.currency(item.amt)}}</td>
                    <td>{{item.codeH}}</td>
                    <td><input type="text" v-model = "codeH[index]"  class="input-group-text"></td>
                    <td><input type="text" v-model = "authCode[index]" class="input-group-text"></td>
                  </tr>
                </tbody>
              </template>
            </MainData>
            <div class="modal-footer">
            <button type="button" class="btn btn-success px-4" @click="updateCallBank()" data-bs-dismiss="modal">全部儲存</button>
          </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import service from '@/services/H/H1.service.js'
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
      detailData: {
        originData: [],
        gridData: []
      },
      errorDataPost: {
        batchId: '',
        page: 1,
        pageSize: 10
      },
      codeH: [],
      authCode: [],
      txnId: [],
      updateData: {},
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
      this.$store.commit('changeLoading', true)
      const result = await service.getCallBankData(this.searchForm)
      this.$store.commit('changeLoading', false)
      this.pageData = result.pageInfo // ? 傳送分頁資訊
      this.gridData = result.batchTxnAuthCallBankData
    },
    async getDetail (item) {
      this.$store.commit('changeLoading', true)
      const result = await service.getCallBankDetail(item.batchId)
      this.$store.commit('changeLoading', false)
      if (result) {
        // * 傳送分頁資訊(僅第一次打api取得所有資料)
        this.detailPageData = {
          totalElements: result.txnAuthCallBankDetailData.length,
          currentPage: 1,
          totalPages: Math.ceil(result.txnAuthCallBankDetailData.length / 10)
        }
        this.detailData.originData = result.txnAuthCallBankDetailData
        this.detailData.gridData = this.detailData.originData.slice(0, 10)
        // * 傳送分頁資訊(僅第一次打api取得所有資料) end
        this.detailData.batchFileName = item.fileName
        this.detailData.batchStoreName = item.storeType
        // * 將每頁資料數初始化
        this.$refs.detailMainData.PageInfo.pageSize = 10
        this.detailModal.show()
      }
    },
    async updateCallBank () {
      this.$store.commit('changeLoading', true)
      const data = []
      for (let i = 0; i < this.detailData.gridData.length; i++) {
        const newitem = {
          codeH: this.codeH[i],
          authCode: this.authCode[i],
          txnId: this.detailData.gridData[i].txnId
        }
        data.push(newitem)
      }
      this.postdata = data
      const updateData = {
        msgId: this.gridData.msgId,
        updateData: data.map(({ authCode, codeH, txnId }) => ({
          codeH: String(codeH),
          authCode: String(authCode),
          txnId: String(txnId)
        }))
      }
      const dataList = JSON.parse(JSON.stringify(updateData))
      console.log(dataList)
      const result = await service.updateCallBankCode(dataList)
      this.$store.commit('changeLoading', false)
      if (result) {
        this.detailModal.hide()
        this.$swal.fire({
          toast: true,
          position: 'center',
          icon: 'success',
          title: '修改成功！',
          showConfirmButton: false,
          timer: 1500,
          width: 500,
          background: '#F0F0F2',
          padding: 25,
          customClass: {
            container: 'z-10000'
          }
        })
        this.getData()
      }
    },
    async callBankFTP (item) {
      this.$store.commit('changeLoading', true)
      const result = await service.getCallBankFTP(item.batchId)
      this.$store.commit('changeLoading', false)
      if (result) {
        this.getData()
      }
    }
  },
  mounted () {
    this.detailModal = new this.$custom.bootstrap.Modal(this.$refs.detailModal, { backdrop: 'static' })
  }
}
</script>
