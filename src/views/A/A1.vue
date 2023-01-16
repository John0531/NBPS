<template>
  <div>
    <div class="row justify-content-center">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h2 class="fw-bold mb-3">批次交易檔上傳作業</h2>
            <h6>供帳務科經辦上傳批次交易資料檔，上傳功能僅於營業日上午九點至下午五點半開放，批次交易資料檔上傳且格式檢核成功後，按下確認並送出，系統隨開始發動交易。</h6>
            <h6>*檔名為: 商店代碼(自動依特店代碼欄位之值檢查)  + "." + YYYYMMDD(自動帶出今日日期) + "." + A(第一次上傳為A，第二次為B，以此類退)。上傳檔案均需依約定之密碼規則(兩碼當月月份 + 約定之加解密密碼)，以ZIP加密，若檔名或解密錯誤或總筆數及總金額不對，此檔直接剔退。</h6>
          </div>
          <div class="card-body">
            <Form
              v-slot="{ errors }"
              @submit="uploadFile"
            >
              <div class="row py-3">
                <div class="col-xxl-6 d-flex mb-4 align-items-center">
                  <h5 class="text-nowrap me-3" style="padding-top:0.375rem;">特店代碼:</h5>
                  <Field
                    style="width:300px;"
                    id="batchStoreId"
                    class="form-select"
                    as="select"
                    rules="required"
                    :class="{ 'is-invalid': errors['特店代碼'] }"
                    name="特店代碼"
                    v-model="uploadPost.storeId"
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
                <div class="col-xxl-6 d-flex mb-4 align-items-center">
                  <h5 class="text-nowrap me-3" style="padding-top:0.375rem;">批次交易檔:</h5>
                  <Field
                    style="width:400px;"
                    ref="upload"
                    type="file"
                    class="form-control"
                    placeholder=""
                    rules="required"
                    name="批次交易檔"
                    :class="{ 'is-invalid': errors['批次交易檔'] }"
                    @change="getFile($event)"
                  />
                  <ErrorMessage
                    name="批次交易檔"
                    class="invalid-feedback ms-2"
                  />
                </div>
                <div class="col-xxl-6"></div>
                <div class="col-xxl-3 d-flex mb-4 align-items-center">
                  <h5 class="text-nowrap me-3" style="padding-top:0.375rem;">總筆數:</h5>
                  <Field
                    name="總筆數"
                    type="text"
                    class="form-control"
                    rules="required"
                    :class="{ 'is-invalid': errors['總筆數'] }"
                    id="totalCount"
                    v-model="uploadPost.totalCount"
                  />
                  <ErrorMessage
                    name="總筆數"
                    class="invalid-feedback ms-2"
                  />
                </div>
                <div class="col-xxl-5 d-flex mb-4 align-items-center">
                  <h5 class="text-nowrap me-3" style="padding-top:0.375rem;">總金額(授權金額-退貨金額):</h5>
                  <Field
                    name="總金額"
                    type="text"
                    class="form-control"
                    rules="required"
                    :class="{ 'is-invalid': errors['總金額'] }"
                    id="totalAmt"
                    v-model="uploadPost.totalAmt"
                  />
                  <ErrorMessage
                    name="總金額"
                    class="invalid-feedback ms-2"
                  />
                </div>
              </div>
              <button type="submit" class="btn btn-primary me-3 px-4">上傳</button>
              <button class="btn btn-warning me-3" @click.prevent="downloadExcel">下載範例EXCEL</button>
              <button class="btn btn-success" @click.prevent="downloadFormat">下載批次交易檔規格</button>
            </Form>
          </div>
        </div>
        <MainData :Page="pageData" @ChangePageInfo="getPageInfo">
          <template #default>
            <thead>
              <tr>
                <th scope="col">特店代碼</th>
                <th scope="col">特店名稱</th>
                <th scope="col">上傳批次交易檔名</th>
                <th scope="col">上傳時間</th>
                <th scope="col">批次處理狀態</th>
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
                <td>{{$custom.moment(item.batchDate).format('YYYY/MM/DD')}}</td>
                <td>
                  <span class="fw-bold" v-if="item.batchStatus==='UPLOAD_SUCCESS'">上傳成功</span>
                  <span class="fw-bold" v-if="item.batchStatus==='UPLAOD_FAIL'">上傳失敗</span>
                  <span class="fw-bold" v-if="item.batchStatus==='VALIDATING'">格式檢核中</span>
                  <span class="fw-bold text-success" v-if="item.batchStatus==='VALIDATE_SUCCESS'">格式檢核成功</span>
                  <span class="fw-bold text-danger" v-if="item.batchStatus==='VALIDATE_FAIL'">格式檢核失敗</span>
                  <span class="fw-bold" v-if="item.batchStatus==='SUBMISSION'">確認送出</span>
                  <span class="fw-bold" v-if="item.batchStatus==='TRX_WAIT'">等待交易中</span>
                  <span class="fw-bold" v-if="item.batchStatus==='TRX_PROCESS'">交易處理中</span>
                  <span class="fw-bold" v-if="item.batchStatus==='TRX_FINISH'">交易處理完成</span>
                  <span class="fw-bold" v-if="item.batchStatus==='REPLY_PROCESS'">回覆檔產製中</span>
                  <span class="fw-bold" v-if="item.batchStatus==='REPLY_SUCCESS'">已下傳回覆檔</span>
                  <span class="fw-bold" v-if="item.batchStatus==='REPLY_FAIL'">下傳回覆檔失敗</span>
                  <span class="fw-bold" v-if="item.batchStatus==='DOWLOAD_REPLY'">特店已下載回覆檔</span>
                </td>
                <td>{{item.totalCnt}}</td>
                <td>{{$custom.currency(item.totalAmt)}}</td>
                <td>{{item.authCnt}}</td>
                <td>{{$custom.currency(item.authAmt)}}</td>
                <td>{{item.refundCnt}}</td>
                <td>{{$custom.currency(item.refundAmt)}}</td>
                <td>
                  <button v-if="item.batchStatus==='VALIDATE_FAIL'" @click="getError(item)" class="btn btn-danger me-2 btn-sm">檢視錯誤</button>
                  <button v-if="item.batchStatus==='VALIDATE_SUCCESS'" @click="confirmBatch(item)" class="btn btn-primary btn-sm">確認送出授權</button>
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
            <h5>特店名稱: {{errorData.batchStoreName}}</h5>
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
import service from '@/services/A/A1.service.js'
import MainData from '@/components/MainData.vue'

export default {
  components: {
    MainData
  },
  data () {
    return {
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
      this.GroupDataPost.storeId = ''
      this.getData()
    },
    // ? 取得 MainData 元件錯誤分頁資訊
    getErrorPageInfo (PageInfo) {
      this.errorDataPost.page = PageInfo.page
      this.errorDataPost.pageSize = PageInfo.pageSize
      this.getData()
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
      this.errorDataPost = {
        batchId: item.batchId,
        page: 1,
        pageSize: 10
      }
      this.$store.commit('changeLoading', true)
      const result = await service.getBatchError(this.errorDataPost)
      this.$store.commit('changeLoading', false)
      if (result) {
        this.errorPageData = result.pageInfo // ? 傳送分頁資訊
        this.errorData.batchFileName = item.batchFileName
        this.errorData.batchStoreName = item.batchStoreName
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
      formData.append('totalCount', this.uploadPost.totalCount)
      formData.append('totalAmt', this.uploadPost.totalAmt)
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
        this.$refs.upload.value = ''
        this.getData()
      }
    },
    confirmBatch (item) {
      this.$swal.fire({
        title: '確認送出?',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#4D4D4D',
        confirmButtonText: '刪除',
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
    },
    async downloadExcel () {
      const result = await service.downloadExcel()
      const a = document.createElement('a')
      a.href = window.URL.createObjectURL(new Blob([result.data], { type: result.headers['content-type'] }))
      a.style.display = 'none'
      a.download = '範例excel.xls'
      document.body.appendChild(a)
      a.click()
    },
    async downloadFormat () {
      const result = await service.downloadFormat()
      const a = document.createElement('a')
      a.href = window.URL.createObjectURL(new Blob([result.data], { type: result.headers['content-type'] }))
      a.style.display = 'none'
      a.download = '批次交易檔範例.docx'
      document.body.appendChild(a)
      a.click()
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
