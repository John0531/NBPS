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
                  <button v-if="item.batchStatus==='TRX_FINISH'||item.batchStatus==='CALL_BANK_PROCESS'" @click="getDetail(item)" class="btn btn-primary me-2 btn-sm">檢視明細</button>
                  <!-- <button v-if="item.batchStatus ==='CALL_BANK_SUCCESS'" @click="callBankFTP(item)" class="btn btn-success me-2 btn-sm">作業完成</button> -->
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
            <button @click.prevent="closeDetailModel" type="button" class="btn-close btn-close-white" aria-label="Close"></button>
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
                    <tr v-for="item in detailData.gridData" :key="item.txnId">
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
                        <input type="text" v-model="item.modifyCodeH" maxlength="2" class="form-control" style="text-align:center" @keyup="modifyCode(item)">
                      </td>
                      <td>
                        <input type="text" v-model="item.modifyAuthCode" maxlength="6" class="form-control" style="text-align:center" @keyup="modifyCode(item)" :disabled="item.modifyCodeH!=='00'">
                      </td>
                    </tr>
                  </tbody>
                </template>
              </MainData>
              <div class="modal-footer">
                <button type="button" class="btn btn-success px-4" @click.prevent="updateCallBank">儲存全部變更</button>
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
      searchForm: {
        startDate: `${this.$custom.moment().format('YYYY-MM-DD')}`,
        endDate: `${this.$custom.moment().format('YYYY-MM-DD')}`
      },
      pageData: {}, // ?分頁資訊
      gridData: [],
      detailModal: '',
      detailDataPost: {
        batchId: '',
        page: 1,
        pageSize: 10
      },
      detailData: {
        fileName: '',
        storeType: '',
        gridData: [],
        batchId: ''
      },
      detailPageData: {}, // ?詳細分頁資訊
      keepDetailData: [] // ? 暫存資訊
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
      const result = await service.getCallBankData(this.searchForm)
      this.$store.commit('changeLoading', false)
      this.pageData = result.pageInfo // ? 傳送分頁資訊
      this.gridData = result.batchTxnAuthCallBankData
    },
    async getDetail (item) {
      if (item) {
        this.detailDataPost.batchId = item.batchId
        this.detailDataPost.page = 1
        this.detailDataPost.pageSize = 10
      }
      this.$store.commit('changeLoading', true)
      const result = await service.getCallBankDetail(this.detailDataPost)
      this.$store.commit('changeLoading', false)
      if (result) {
        this.detailPageData = result.pageInfo // ? 傳送分頁資訊
        if (item) {
          this.keepDetailData = []
          this.detailData.fileName = item.fileName
          this.detailData.storeType = item.storeType
          this.detailData.batchId = item.batchId
          // * 將每頁資料數初始化
          this.$refs.detailMainData.PageInfo.pageSize = 10
        }
        this.detailData.gridData = result.txnAuthCallBankDetailData
        this.detailData.gridData.forEach((item1) => {
          item1.modifyCodeH = '00'
          item1.modifyAuthCode = ''
          this.keepDetailData.forEach((item2) => {
            if (item1.txnId === item2.txnId) {
              item1.modifyCodeH = item2.modifyCodeH
              item1.modifyAuthCode = item2.modifyAuthCode
            }
          })
        })
      }
      this.detailModal.show()
    },
    closeDetailModel () {
      this.$swal.fire({
        title: '關閉後不會儲存修改資料，確認是否關閉?',
        showCancelButton: true,
        confirmButtonColor: '#0d6efd',
        cancelButtonColor: '#4D4D4D',
        confirmButtonText: '確認',
        cancelButtonText: '取消',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          this.detailModal.hide()
        }
      })
    },
    modifyCode (item) {
      if (item.modifyCodeH !== '00') {
        item.modifyAuthCode = ''
      }
      if (item.modifyAuthCode) {
        item.modifyCodeH = '00'
      }
      if (this.keepDetailData.length === 0) {
        this.keepDetailData.push({
          txnId: item.txnId,
          codeH: item.codeH,
          authCode: item.authCode,
          modifyCodeH: item.modifyCodeH,
          modifyAuthCode: item.modifyAuthCode
        })
      } else {
        const index = this.keepDetailData.findIndex(obj => obj.txnId === item.txnId)
        if (index === -1) {
          this.keepDetailData.push({
            txnId: item.txnId,
            codeH: item.codeH,
            authCode: item.authCode,
            modifyCodeH: item.modifyCodeH,
            modifyAuthCode: item.modifyAuthCode
          })
        } else {
          this.keepDetailData[index].modifyCodeH = item.modifyCodeH
          this.keepDetailData[index].modifyAuthCode = item.modifyAuthCode
        }
      }
    },
    async updateCallBank () {
      const postData = {
        batchId: this.detailData.batchId,
        updateData: this.keepDetailData
      }
      for (let i = 0; i < postData.updateData.length; i++) {
        if (postData.updateData[i].modifyCodeH === '00' && postData.updateData[i].modifyAuthCode && postData.updateData[i].modifyAuthCode.length !== 6) {
          this.$swal.fire({
            title: '請輸入正確授權碼'
          })
          return
        }
        if (postData.updateData[i].modifyCodeH.length !== 2) {
          this.$swal.fire({
            title: '請輸入正確回應碼'
          })
          return
        }
      }
      postData.updateData.forEach((item) => {
        if (item.modifyCodeH === '00' && item.modifyAuthCode) {
          item.codeH = '00'
          item.authCode = item.modifyAuthCode
        } else if (item.modifyCodeH !== '00') {
          item.codeH = item.modifyCodeH
          item.authCode = ''
        }
      })
      this.$store.commit('changeLoading', true)
      const result = await service.updateCallBankCode(postData)
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
      const res = await this.$swal.fire({
        title: '確認是否執行?',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#4D4D4D',
        confirmButtonText: '是',
        cancelButtonText: '否',
        reverseButtons: true
      })
      if (res.isConfirmed) {
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
      }
    }
  },
  mounted () {
    this.detailModal = new this.$custom.bootstrap.Modal(this.$refs.detailModal, { backdrop: 'static' })
  }
}
</script>
