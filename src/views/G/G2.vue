<template>
  <div>
    <div class="row justify-content-center">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h2 class="fw-bold mb-3">批次交易檔上傳作業</h2>
            <h6>供<span class="text-primary">發卡業務經辦</span>上傳批次交易資料檔，<span class="text-primary">上傳</span>及<span class="text-primary">檔案格式</span>檢核成功後，系統將<span class="text-primary">自動進行</span>交易流程。</h6>
            <h6 class="fw-bold"><span class="text-danger">*</span>上傳檔案格式均為<span class="text-danger">壓縮檔(.zip)</span>，壓縮檔內的檔案格式如下說明(壓縮時需加密)：</h6>
            <h6 class="fw-bold">【郵購業務】</h6>
            <h6>檔名: <span class="text-primary">特店代碼(15碼)</span> + "." + <span class="text-info">YYYYMMDD(當天日期)</span> + "." + <span class="text-success">A~Z流水號</span>(第一次上傳為A，第二次為B，以此類推)+"."+<span class="text-danger">txt(大、小寫皆可)</span>。例如：<span class="text-primary">000001999999990</span>.<span class="text-info">20231026</span>.<span class="text-success">A</span>.<span class="text-danger">txt(TXT)</span></h6>
            <h6 class="fw-bold">【公共事業、新消貸業務】</h6>
            <h6>檔名: <span class="text-primary">特店代碼(15碼)</span> + "." + <span class="text-info">YYYYMMDD(當天日期)</span> + "." + <span class="text-success">任意英數字</span>(01,41,A,B)。例如：<span class="text-primary">000001999999999</span>.<span class="text-info">20231026</span>.<span class="text-success">41</span></h6>
            <h6 class="fw-bold"><span class="text-danger">*</span>注意：<span class="text-primary">公共事業</span>、<span class="text-primary">新消貸</span>業務類型的<span class="text-primary">壓縮檔內檔案格式</span>需為<span class="text-danger">非文字檔格式(.txt)</span></h6>
            <!-- <h6 class="text-danger fw-bold">*檔名不檢核</h6> -->
          </div>
          <div class="card-body">
            <Form
              ref="form"
              v-slot="{ errors }"
              @submit="uploadFile"
            >
              <div class="row py-3">
                <div class="col-xxl-6 d-flex mb-4 align-items-center">
                  <h5 class="text-nowrap me-3" style="padding-top:0.375rem;">批次交易檔:</h5>
                  <Field
                    id="batchFile"
                    style="width:400px;"
                    ref="upload"
                    type="file"
                    class="form-control"
                    placeholder=""
                    rules="required"
                    name="批次交易檔"
                    :class="{ 'is-invalid': errors['批次交易檔'] }"
                    @change="getFile($event)"
                    :validateOnChange="false"
                    :validateOnBlur="false"
                  />
                  <ErrorMessage
                    name="批次交易檔"
                    class="invalid-feedback ms-2"
                  />
                </div>
                <!-- <div class="col-xxl-6"></div> -->
                <!-- <div class="col-xxl-6 d-flex mb-4 align-items-center">
                  <h5 class="text-nowrap me-3" style="padding-top:0.375rem;">作業類型:</h5>
                  <Field
                    v-model="storeType"
                    style="width:300px;"
                    id="batchStoreType"
                    class="form-select"
                    as="select"
                    rules="required"
                    :class="{ 'is-invalid': errors['作業類型'] }"
                    name="作業類型"
                    @change="getDefaultData"
                  >
                    <option value="" selected>請選擇</option>
                    <option value="ACQUIRING">收單</option>
                    <option value="PUBLIC_UTILITIES">公共事業</option>
                    <option value="MAIL_ORDER">郵購</option>
                    <option value="ISSUE_CARD">發卡新消貸</option>
                  </Field>
                  <ErrorMessage
                    name="作業類型"
                    class="invalid-feedback ms-2"
                  />
                </div> -->
                <div class="col-xxl-6"></div>
                <div class="col-xxl-6 d-flex mb-4 align-items-center">
                  <h5 class="text-nowrap me-3" style="padding-top:0.375rem;">特店代碼:</h5>
                  <Field
                    v-model="uploadPost.storeId"
                    style="width:300px;"
                    id="batchStoreId"
                    class="form-select"
                    as="select"
                    rules="required"
                    :class="{ 'is-invalid': errors['特店代碼'] }"
                    name="特店代碼"
                    :validateOnChange="false"
                    :validateOnBlur="false"
                    :validateOnModelUpdate="false"
                  >
                    <option value="" selected>請選擇</option>
                    <option v-for="item in defaultData" :key="item.id" :value="item.storeId">{{item.storeId}} ({{item.storeName}})</option>
                  </Field>
                  <ErrorMessage
                    name="特店代碼"
                    class="invalid-feedback ms-2"
                  />
                </div>
                <div class="col-xxl-6"></div>
              </div>
              <button type="submit" class="btn btn-primary me-3 px-4" :disabled="!$store.state.pageBtnPermission.includes('execute')">上傳</button>
            </Form>
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
                <th scope="col">總金額</th>
                <th scope="col">總筆數</th>
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
                  <span v-if="item.trxStatus==='CALL_BANK_PROCESS'">Call Bank作業中</span>
                  <span v-if="item.trxStatus==='REPLY_PROCESS'">回覆檔產製中</span>
                  <span v-if="item.trxStatus==='REPLY_SUCCESS'">已下載回覆檔</span>
                  <span v-if="item.trxStatus==='REPLY_FAIL'">下傳回覆檔失敗</span>
                  <span v-if="item.trxStatus==='REPLY_UPLOAD_SUCCESS'">回覆檔上傳FTP成功</span>
                  <span v-if="item.trxStatus==='REPLY_DOWNLOAD_SUCCESS'">回覆檔FTP下載成功</span>
                </td>
                <td>{{$custom.currency(item.totalAmt)}}</td>
                <td>{{item.totalCnt}}</td>
                <td>
                  <button v-if="item.batchStatus==='VALIDATE_FAIL'" @click="getError(item)" class="btn btn-danger me-2 btn-sm">檢視錯誤</button>
                  <button v-if="item.batchStatus==='VALIDATE_SUCCESS'" @click="confirmBatch(item)" class="btn btn-primary btn-sm" :disabled="!$store.state.pageBtnPermission.includes('execute')">確認送出授權</button>
                </td>
              </tr>
            </tbody>
          </template>
        </MainData>
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
import service from '@/services/G/G2.service.js'
import MainData from '@/components/MainData.vue'

export default {
  components: {
    MainData
  },
  data () {
    return {
      storeType: '',
      GroupDataPost: {
        page: 1,
        pageSize: 10
      },
      pageData: {}, // ?分頁資訊
      defaultData: [],
      gridData: [],
      uploadPost: {},
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
      this.GroupDataPost = PageInfo
      this.getData()
    },
    // ? 取得 MainData 元件錯誤分頁資訊
    getErrorPageInfo (PageInfo) {
      this.errorDataPost.page = PageInfo.page
      this.errorDataPost.pageSize = PageInfo.pageSize
      this.getError()
    },
    async getDefaultData () {
      this.$store.commit('changeLoading', true)
      const result = await service.getBatchDefault()
      this.defaultData = result.storeList
      this.$store.commit('changeLoading', false)
    },
    async getData () {
      this.$store.commit('changeLoading', true)
      const result = await service.getBatchData(this.GroupDataPost)
      this.$store.commit('changeLoading', false)
      this.pageData = result.pageInfo // ? 傳送分頁資訊
      this.gridData = result.batchList
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
        if (item) {
          this.errorData.batchFileName = item.batchFileNameTxt
        }
        this.errorData.gridData = result.batchErrorList
      }
      this.errorModal.show()
    },
    getFile (event) {
      this.uploadPost.file = event.target.files[0]
    },
    async uploadFile () {
      const formData = new FormData()
      formData.append('file', this.uploadPost.file)
      formData.append('storeId', this.uploadPost.storeId)
      formData.append('msgId', this.$custom.uuidv4())
      this.$store.commit('changeLoading', true)
      const result = await service.uploadBatch(formData)
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
        this.uploadPost = {}
        document.querySelector('#batchFile').value = ''
        this.$refs.form.resetForm()
        this.getData()
      }
    },
    confirmBatch (item) {
      this.$swal.fire({
        title: '確認送出?',
        showCancelButton: true,
        confirmButtonColor: '#0d6efd',
        cancelButtonColor: '#4D4D4D',
        confirmButtonText: '確認',
        cancelButtonText: '取消',
        reverseButtons: true
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.$store.commit('changeLoading', true)
          const result = await service.confirmBatch({
            batchId: item.batchId
          })
          this.$store.commit('changeLoading', false)
          if (result) {
            this.getData()
          }
        }
      })
    }
  },
  mounted () {
    this.getDefaultData()
    this.errorModal = new this.$custom.bootstrap.Modal(this.$refs.errorModal, { backdrop: 'static' })
  }
}
</script>

<style>
  .pointer {
    cursor: pointer !important;
  }
  .z-10000{
    z-index: 10000;
  }
</style>
