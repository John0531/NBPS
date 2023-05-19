<template>
  <div>
    <div class="row justify-content-center">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h2 class="fw-bold mb-3">批次交易取消作業</h2>
            <h6>供帳務科執行整批取消，或單筆取消，僅當日交易完成之批次才可執行取消，若原交易已跨日，請於隔日執行退貨。於營業日9點到五點半才可執行</h6>
          </div>
          <div class="card-body">
            <div class="row py-3">
              <div class="col-xxl-5 d-flex mb-4">
                <h5 class="text-nowrap me-3" style="padding-top:0.375rem;">特店代碼:</h5>
                <select class="form-select" v-model="GroupDataPost.storeId">
                    <option value="" selected>請選擇</option>
                    <option v-for="item in defaultData" :key="item.id" :value="item.storeId">{{item.storeId}} ({{item.storeName}})</option>
                </select>
                  <!-- <ErrorMessage
                    name="特店代碼"
                    class="invalid-feedback ms-2"
                  /> -->
              </div>
            </div>
            <button @click.prevent="getData" class="btn btn-primary me-3 px-4" :disabled="!$store.state.pageBtnPermission.includes('view')">搜尋</button>
          </div>
        </div>
        <MainData :Page="pageData" @ChangePageInfo="getPageInfo" @updatePageInfo="getPageInfo">
          <template #default>
            <thead>
              <tr>
                <th scope="col">特店代碼</th>
                <th scope="col">特店名稱</th>
                <th scope="col">上傳批次交易檔名</th>
                <th scope="col">上傳時間</th>
                <th scope="col">交易處理狀態</th>
                <th scope="col">總筆數</th>
                <th scope="col">總金額 A-B</th>
                <th scope="col">總授權筆數</th>
                <th scope="col">總授權金額 A</th>
                <th scope="col">總退貨筆數</th>
                <th scope="col">總退貨金額 B</th>
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
                  <span v-if="item.trxStatus==='TRX_WAITING'">等待交易中*</span>
                  <span v-if="item.trxStatus==='TRX_PROCESS'">交易處理中*</span>
                  <span v-if="item.trxStatus==='TRX_FINISH_WITH_ERROR'">交易處理完成但有異常</span>
                  <span v-if="item.trxStatus==='TRX_ERROR_PROCESS'">異常交易取消中*</span>
                  <span v-if="item.trxStatus==='TRX_ERROR_REVERSAL'">異常交易已取消</span>
                  <span v-if="item.trxStatus==='TRX_ERROR_FAIL'">異常交易取消錯誤</span>
                  <span v-if="item.trxStatus==='TRX_ALL_VOID_WAITING'">等待整批交易取消中*</span>
                  <span v-if="item.trxStatus==='TRX_ALL_VOID_PROCESS'">交易整批取消中*</span>
                  <span v-if="item.trxStatus==='TRX_ALL_VOID_FAIL'">交易整批取消錯誤</span>
                  <span v-if="item.trxStatus==='TRX_FINISH_REVERSAL'">交易已取消</span>
                  <span v-if="item.trxStatus==='TRX_FINISH'">交易處理完成</span>
                  <span v-if="item.trxStatus==='REPLY_PROCESS'">回覆檔產製中</span>
                  <span v-if="item.trxStatus==='REPLY_SUCCESS'">已下載回覆檔</span>
                  <span v-if="item.trxStatus==='REPLY_FAIL'">下傳回覆檔失敗</span>
                  <span v-if="item.trxStatus==='REPLY_UPLOAD_SUCCESS'">回覆檔上傳FTP成功</span>
                  <span v-if="item.trxStatus==='REPLY_DOWNLOAD_SUCCESS'">回覆檔FTP下載成功</span>
                </td>
                <td>{{item.totalCnt}}</td>
                <td>{{$custom.currency(item.totalAmt)}}</td>
                <td>{{item.authCnt}}</td>
                <td>{{$custom.currency(item.authAmt)}}</td>
                <td>{{item.refundCnt}}</td>
                <td>{{$custom.currency(item.refundAmt)}}</td>
                <td>
                  <button @click="getDetail(item)" class="btn btn-primary me-2 btn-sm">檢視明細</button>
                  <button @click="multipleCancel(item)" v-if="item.trxStatus!=='TRX_FINISH_REVERSAL'" class="btn btn-success me-2 btn-sm" :disabled="!$store.state.pageBtnPermission.includes('execute')">整批取消</button>
                </td>
              </tr>
            </tbody>
          </template>
        </MainData>
      </div>
    </div>

    <!-- 檢視明細 Modal -->
    <div class="modal fade" ref="detailModal" tabindex="-1" aria-labelledby="detailModal" aria-hidden="true">
      <div class="modal-dialog modal-xxl modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-primary">
            <h5 class="modal-title text-white">檢視明細</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <h5>檔名: {{detailData.batchFileName}}</h5>
            <h5>特店名稱: {{detailData.batchStoreName}}</h5>
            <div class="d-flex">
              <h5 class="text-nowrap me-3" style="padding-top:0.375rem;">卡號:</h5>
              <input v-model="detailDataPost.pan" type="text" class="form-contorl" style="margin-right: 1em;border-radius: 10px;">
              <button @click="getDetail()" class="btn btn-primary me-2 btn-sm"> 查詢</button>
            </div>
            <MainData ref="detailMainData" :Page="detailPageData" @ChangePageInfo="getDetailPageInfo">
              <template #default>
                <thead>
                  <tr>
                    <th scope="col">卡號</th>
                    <th scope="col">交易類別</th>
                    <th scope="col">金額</th>
                    <th scope="col">帳單描述</th>
                    <th scope="col">授權碼</th>
                    <th scope="col">交易授權結果</th>
                    <th scope="col">交易請款結果</th>
                    <th scope="col">交易取消結果</th>
                    <th scope="col" v-if="!(detailData.gridData.filter(item => item.voidCodeH).length === detailData.gridData.length)"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in detailData.gridData" :key="item.txnAuthId">
                    <th scope="row">{{item.pan}}</th>
                    <td>
                      <span v-if="item.type==='SALE'">(S)授權與請款</span>
                      <span v-if="item.type==='AUTH'">(A)授權</span>
                      <span v-if="item.type==='OFF_LINE_SALE'">(O)請款</span>
                      <span v-if="item.type==='REFUND'">(R)退貨</span>
                    </td>
                    <td>{{$custom.currency(item.amt)}}</td>
                    <td>{{item.desc}}</td>
                    <td>{{item.authCode}}</td>
                    <td>
                      <span v-if="item.codeH==='00'">授權成功</span>
                      <span v-else>授權失敗</span>
                    </td>
                    <td>
                      <span v-if="(item.statusCode==='0000')">請款成功</span>
                      <span v-if="(item.statusCode!='0000')">請款失敗</span>
                    </td>
                    <td>
                      <span v-if="item.voidCodeH==='00'">取消成功</span>
                      <span v-if="item.voidCodeH&&item.voidCodeH!=='00'">取消失敗</span>
                    </td>
                    <td v-if="!(detailData.gridData.filter(item => item.voidCodeH).length === detailData.gridData.length)">
                      <button v-if="item.codeH==='00'&&item.statusCode==='0000'&&!item.voidCodeH" @click="singleCancel(item)" class="btn btn-danger me-2 btn-sm" :disabled="!$store.state.pageBtnPermission.includes('execute')">單筆取消</button>
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
import service from '@/services/A/A3.service.js'
import MainData from '@/components/MainData.vue'

export default {
  components: {
    MainData
  },
  data () {
    return {
      defaultDetailPage: { // ?檢視詳細資料第一次的分頁資訊
        page: 1,
        pageSize: 10
      },
      pageData: {}, // ?分頁資訊
      GroupDataPost: {
        page: 1,
        pageSize: 10
      },
      defaultData: [],
      gridData: [],
      detailModal: '',
      detailDataPost: {
        pan: '',
        batchId: '',
        page: 1,
        pageSize: 10
      },
      detailData: {
        batchFileName: '',
        batchStoreName: '',
        gridData: []
      },
      detailPageData: {} // ?詳細分頁資訊
    }
  },
  methods: {
    // ? 取得 MainData 元件分頁資訊
    getPageInfo (PageInfo) {
      this.GroupDataPost.page = PageInfo.page
      this.GroupDataPost.pageSize = PageInfo.pageSize
      this.getData()
    },
    // ? 取得 MainData 元件詳細分頁資訊
    getDetailPageInfo (PageInfo) {
      this.detailDataPost.page = PageInfo.page
      this.detailDataPost.pageSize = PageInfo.pageSize
      this.getDetail()
    },
    async getDefaultData () {
      this.$store.commit('changeLoading', true)
      const result = await service.getBatchDefault()
      this.defaultData = result.storeList
      this.$store.commit('changeLoading', false)
    },
    async getData () {
      if (this.GroupDataPost.storeId === '') {
        this.GroupDataPost.storeId = null
      }
      this.$store.commit('changeLoading', true)
      const result = await service.getBatchData(this.GroupDataPost)
      this.$store.commit('changeLoading', false)
      this.pageData = result.pageInfo // ? 傳送分頁資訊
      this.gridData = result.batchList
    },
    async getDetail (item) {
      if (item) {
        this.detailDataPost.pan = ''
        this.detailDataPost.batchId = item.batchId
        this.detailDataPost.page = 1
        this.detailDataPost.pageSize = 10
      }
      this.$store.commit('changeLoading', true)
      const result = await service.getBatchDetail(this.detailDataPost)
      this.$store.commit('changeLoading', false)
      if (result) {
        this.detailPageData = result.pageInfo // ? 傳送分頁資訊
        if (item) {
          this.detailData.batchFileName = item.batchFileName
          this.detailData.batchStoreName = item.batchStoreName
        }
        this.detailData.gridData = result.batchList
      }
      this.detailModal.show()
    },
    async multipleCancel (item) {
      const res = await this.$swal.fire({
        title: '確認是否整批取消?',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#4D4D4D',
        confirmButtonText: '是',
        cancelButtonText: '否',
        reverseButtons: true
      })
      if (res.isConfirmed) {
        this.$store.commit('changeLoading', true)
        const result = await service.multipleCancel(item.batchId)
        this.$store.commit('changeLoading', false)
        if (result) {
          this.getData()
        }
      }
    },
    async singleCancel (item) {
      const res = await this.$swal.fire({
        title: '確認是否單筆取消?',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#4D4D4D',
        confirmButtonText: '是',
        cancelButtonText: '否',
        reverseButtons: true
      })
      if (res.isConfirmed) {
        const postData = {
          txnAuthId: item.txnAuthId,
          txnSettleId: item.txnSettleId
        }
        this.$store.commit('changeLoading', true)
        const result = await service.singleCancel(postData)
        this.$store.commit('changeLoading', false)
        if (result) {
          this.getDetail()
        }
      }
    }
  },
  mounted () {
    this.getDefaultData()
    this.detailModal = new this.$custom.bootstrap.Modal(this.$refs.detailModal, { backdrop: 'static' })
  }
}
</script>

<style scoped>
  .modal-xxl{
    --bs-modal-width: 1200px;
  }
</style>
