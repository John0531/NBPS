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
                  <!-- <span class="fw-bold" v-if="item.batchStatus==='TRX_WAIT'">等待交易中</span> -->
                  <span class="fw-bold" v-if="item.batchStatus==='TRX_PROCESS'">交易處理中</span>
                  <span class="fw-bold" v-if="item.batchStatus==='TRX_FINISH'">交易處理完成</span>
                  <span class="fw-bold" v-if="item.batchStatus==='CALL_BANK_PROCESS'">Call Bank作業中</span>
                  <span class="fw-bold" v-if="item.batchStatus==='REPLY_PROCESS'">回覆檔產製中</span>
                  <span class="fw-bold" v-if="item.batchStatus==='REPLY_SUCCESS'">已下傳回覆檔</span>
                  <span class="fw-bold" v-if="item.batchStatus==='REPLY_FAIL'">下傳回覆檔失敗</span>
                  <span class="fw-bold" v-if="item.batchStatus==='DOWLOAD_REPLY'">特店已下載回覆檔</span>
                  <span class="fw-bold" v-if="item.batchStatus==='REPLY_UPLOAD_SUCCESS'">回覆檔上傳FTP成功</span>
                  <span class="fw-bold" v-if="item.batchStatus==='REPLY_UPLOAD_FAIL'">回覆檔上傳FTP失敗</span>
                  <span class="fw-bold" v-if="item.batchStatus==='CALL_BANK_SUCCESS'">Call Bank作業完成</span>
                </td>
                <td>
                  <span v-if="item.trxStatus==='TRX_WAITING'">等待交易中</span>
                  <span v-if="item.trxStatus==='TRX_PROCESS'">交易處理中</span>
                  <span v-if="item.trxStatus==='TRX_FINISH_WITH_ERROR'">交易處理完成但有異常</span>
                  <span v-if="item.trxStatus==='TRX_ERROR_PROCESS'">異常交易取消中</span>
                  <span v-if="item.trxStatus==='TRX_ERROR_REVERSAL'">異常交易已取消</span>
                  <span v-if="item.trxStatus==='TRX_ERROR_FAIL'">異常交易取消錯誤</span>
                  <span v-if="item.trxStatus==='TRX_ALL_VOID_WAITING'">等待整批交易取消中</span>
                  <span v-if="item.trxStatus==='TRX_ALL_VOID_PROCESS'">交易整批取消中</span>
                  <span v-if="item.trxStatus==='TRX_ALL_VOID_FAIL'">交易整批取消錯誤</span>
                  <span v-if="item.trxStatus==='TRX_FINISH_REVERSAL'">交易已取消</span>
                  <span v-if="item.trxStatus==='TRX_FINISH'">交易處理完成</span>
                  <span v-if="item.trxStatus==='REPLY_PROCESS'">回覆檔產製中</span>
                  <span v-if="item.trxStatus==='REPLY_SUCCESS'">已下載回覆檔</span>
                  <span v-if="item.trxStatus==='REPLY_FAIL'">下傳回覆檔失敗</span>
                  <span v-if="item.trxStatus==='REPLY_UPLOAD_SUCCESS'">回覆檔上傳FTP成功</span>
                  <span v-if="item.trxStatus==='REPLY_DOWNLOAD_SUCCESS'">回覆檔FTP下載成功</span>
                </td>
                <td>{{item.count}}</td>
                <td>{{$custom.currency(item.amt)}}</td>
                <td>
                  <button v-if="item.trxStatus==='TRX_FINISH'" @click="getDetail(item,defaultDetailPage.page,defaultDetailPage.pageSize)" :diable="!item.trxStatus===REPLY_UPLOAD_SUCCESS" class="btn btn-primary me-2 btn-sm">檢視明細</button>
                  <button  v-if="item.batchStatus !=='CALL_BANK_SUCCESS'" @click="callBankFTP(item)" :disabled="!((item.count===0)&&($custom.currency(item.amt)===0))" class="btn btn-success me-2 btn-sm">作業完成</button>
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
              <h5>檔名: {{detailData.fileName}}</h5>
              <h5>作業類型:
                <span v-if="detailData.storeType==='ACQUIRING'">收單</span>
                <span v-if="detailData.storeType==='PUBLIC_UTILITIES'">公共事業</span>
                <span v-if="detailData.storeType==='MAIL_ORDER'">郵購</span>
                <span v-if="detailData.storeType==='ISSUE_CARD'">發卡新消貸</span>
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
                    <tr v-for="(item, index) in detailData.gridData" :key="item.txnId">
                      <th scope="row">{{item.storeId}}</th>
                      <th scope="row">{{item.pan}}</th>
                      <td>
                        <span v-if="item.txnType==='SALE'">授權與請款</span>
                        <span v-if="item.txnType==='AUTH'">授權</span>
                        <span v-if="item.txnType==='OFF_LINE_SALE'">請款</span>
                        <span v-if="item.txnType==='REFUND'">退貨</span>
                      </td>
                      <td>{{$custom.currency(item.amt)}}</td>
                      <td>
                        {{item.codeH}}
                      </td>
                      <td>
                        <input type="text" v-model="nowCodeH[index]" maxlength="2" class="input-group-text" @change="addData(index)">
                      </td>
                      <td>
                        <input type="text" v-model="nowAuthCode[index]" maxlength="6" class="input-group-text" @change="addData(index)">
                      </td>
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
      nowPage: 1,
      eleNum: 10,
      defaultDetailPage: { // ?檢視詳細資料第一次的分頁資訊
        page: 1,
        pageSize: 10
      },
      pageData: {}, // ?分頁資訊
      searchForm: {
        startDate: `${this.$custom.moment().format('YYYY-MM-DD')}`,
        endDate: `${this.$custom.moment().format('YYYY-MM-DD')}`
      },
      gridData: [],
      detailPageData: {
        page: 1,
        pageSize: 10
      }, // ?詳細分頁資訊
      detailModal: '',
      detailData: {
        originData: [],
        gridData: []
      },
      pageDataList: {
        CodeH: [],
        authCode: [],
        txnId: []
      },
      CodeH: [],
      authCode: [],
      txnId: [],

      defaultCodeH: '00',
      defaultAuthCode: '',
      inputCodeH: Array.from({ length: 10 }, () => '00'),
      inputAuthCode: Array.from({ length: 10 }, () => ''),
      num: '',
      totalElements: ''
    }
  },
  computed: {
    nowCodeH () {
      return this.inputCodeH.map((value) => value !== '' ? value : this.defaultCodeH)
    },
    nowAuthCode () {
      return this.inputAuthCode.map((value) => value !== '' ? value : this.defaultAuthCode)
    }
  },
  methods: {
    addTxnId (page, pageSize) {
      var stN = (page - 1) * pageSize
      var edN = (page - 1) * pageSize + (pageSize - 1)
      for (let j = stN, i = 0; j <= edN; j++) {
        // console.log('from ' + stN + 'to' + edN + ', i=:' + i)
        this.pageDataList.txnId[j] = this.detailData.gridData[i].txnId
        i++
      }
      console.log('TxnId: ' + this.pageDataList.txnId)
    },
    cleanData () {
      // this.nowCodeH.splice(0, this.nowCodeH.length)
      const pageSize = this.detailPageData.pageSize
      // ? 資料更新,填入欄位值
      var stNum = (this.detailPageData.currentPage - 1) * pageSize
      var edNum = (this.detailPageData.currentPage - 1) * pageSize + (pageSize - 1)
      // console.log('update data: ' + this.pageDataList.CodeH)
      // console.log(stNum + 'to' + edNum)
      for (let j = stNum, n = 0; j <= edNum; j++) {
        // this.pageDataList.txnId[j] = this.detailData.gridData[n].txnId
        // console.log(this.detailData.gridData[n].txnId)
        this.nowCodeH[n] = this.pageDataList.CodeH[j]
        this.nowAuthCode[n] = this.pageDataList.authCode[j]
        n++
      }
      console.log('clean page data')
      // console.log('added TxnId: ' + this.pageDataList.txnId)
      // this.nowCodeH.splice(0, this.nowCodeH.length)
      // this.nowAuthCode.splice(0, this.nowAuthCode.length)
    },
    addData (index) {
      const pageSize = this.detailPageData.totalElements / this.detailPageData.totalPages
      var num = (this.detailPageData.currentPage - 1) * pageSize + index
      // console.log('Element Num: ' + num)
      console.log('nowCodeH: ' + this.nowCodeH)
      // console.log('nowAuthCode[]' + this.nowAuthCode)
      console.log('save page data')
      this.pageDataList.CodeH[num] = this.nowCodeH[index]
      this.pageDataList.authCode[num] = this.nowAuthCode[index]
      // ? 若AuthCode有值則將CodeH設為00
      if (this.nowAuthCode[index] !== undefined || this.nowAuthCode[index] !== '') {
        this.nowCodeH.splice(index, 1, '00')
        this.pageDataList.CodeH[num] = this.defaultCodeH
      }
      // console.log('this.pageDataList.CodeH[]' + this.pageDataList.CodeH)
      // console.log('this.pageDataList.authCode[]' + this.pageDataList.authCode)
      // this.inputAuthCode = this.pageDataList.authCode
    },
    // ? 取得 MainData 元件分頁資訊
    getPageInfo (PageInfo) {
      this.searchForm.page = PageInfo.page
      this.searchForm.pageSize = PageInfo.pageSize
      this.getData()
    },
    // ? 取得 MainData 元件詳細分頁資訊
    getDetailPageInfo (PageInfo) {
      this.detailPageData = {
        totalElements: this.detailData.totalElements,
        currentPage: PageInfo.page,
        totalPages: Math.ceil(this.detailData.totalElements / PageInfo.pageSize),
        pageSize: PageInfo.pageSize,
        batchId: this.detailData.batchId,
        fileName: this.detailData.fileName,
        storeType: this.detailData.storeType
      }
      this.getDetail(this.detailPageData, PageInfo.page, PageInfo.pageSize)
      this.cleanData()
    },
    async getData () {
      this.$store.commit('changeLoading', true)
      const result = await service.getCallBankData(this.searchForm)
      this.$store.commit('changeLoading', false)
      this.pageData = result.pageInfo // ? 傳送分頁資訊
      this.gridData = result.batchTxnAuthCallBankData
    },
    async getDetail (item, page, pageSize) {
      this.eleNum = pageSize // ? 設定初始 inputCodeH 陣列的數量
      this.$store.commit('changeLoading', true)
      const result = await service.getCallBankDetail(item.batchId, page, pageSize)
      this.$store.commit('changeLoading', false)
      if (result) {
        this.detailPageData = {
          totalElements: result.pageInfo.totalElements,
          currentPage: result.pageInfo.currentPage,
          totalPages: Math.ceil(result.pageInfo.totalElements / pageSize),
          batchId: item.batchId,
          fileName: item.fileName,
          storeType: item.storeType
        }
        // this.setPageData(this.detailPageData.pageSize)
        this.detailData.originData = result.txnAuthCallBankDetailData
        this.detailData.gridData = this.detailData.originData.slice(0, pageSize)
        this.detailData.fileName = item.fileName
        this.detailData.storeType = item.storeType
        this.detailData.batchId = item.batchId
        this.totalElements = this.detailPageData.totalElements
        // * 將每頁資料數初始化
        this.$refs.detailMainData.PageInfo.pageSize = pageSize
      }
      this.setPageData(this.totalElements)
      this.addTxnId(page, pageSize)
      // this.cleanData()
      this.detailModal.show()
    },
    async updateCallBank () {
      // this.$store.commit('changeLoading', true)
      // const data = []
      // for (let i = 0; i < this.detailData.gridData.length; i++) {
      //   const newitem = {
      //     txnId: this.detailData.gridData[i].txnId,
      //     codeH: this.codeH[this.detailData.gridData[i].txnId],
      //     authCode: this.authCode[this.detailData.gridData[i].txnId]
      //   }
      //   data.push(newitem)
      // }
      // const updateData = {
      //   msgId: this.gridData.msgId,
      //   updateData: data.map(({ authCode, codeH, txnId }) => ({
      //     codeH: String(codeH),
      //     authCode: String(authCode),
      //     txnId: String(txnId)
      //   }))
      // }
      const updateData = {
        msgId: this.gridData.msgId,
        updateData: this.pageDataList
      }
      const dataList = JSON.parse(JSON.stringify(updateData))
      console.log(dataList)
      // console.table('final data list: ' + dataList)
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
        })// * 無法更新整個檔案 只更新當前page的筆數
        this.getData()
      }
    },
    async callBankFTP (item) {
      this.$store.commit('changeLoading', true)
      const result = await service.getCallBankFTP(item.batchId)
      this.$store.commit('changeLoading', false)
      if (result) {
        this.$swal.fire({
          toast: true,
          position: 'center',
          icon: 'success',
          title: '上傳成功！',
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
    setPageData (N) {
      // ? 將this.pageDataList.CodeH空值的部分填入預設值00
      for (let i = 0; i < N; i++) {
        if (this.pageDataList.CodeH[i] === '' || this.pageDataList.CodeH[i] === undefined) {
          this.pageDataList.CodeH[i] = '00'
          this.pageDataList.authCode[i] = '123456'
          this.pageDataList.txnId[i] = '99'
        }
      }
    }
  },
  watch: {
    eleNum (newVal, oldVal) {
      // console.log(`eleNum 的新值為 ${newVal}，舊值為 ${oldVal}`)
      // this.inputCodeH = Array.from({ length: newVal }, () => '00')
    },
    nowPage () {
      // this.cleanData()
    }
  },
  mounted () {
    this.detailModal = new this.$custom.bootstrap.Modal(this.$refs.detailModal, { backdrop: 'static' })
  }
}
</script>
