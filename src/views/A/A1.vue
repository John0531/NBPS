<template>
  <div>
    <div class="row justify-content-center">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h2 class="fw-bold mb-3">批次交易檔上傳作業</h2>
            <h6>供<h7 class="text-primary">帳務科經辦</h7>上傳批次交易資料檔，請於營業日 <h7 class="text-primary">09:00-18:00</h7> 期間執行，批次交易資料檔上傳且格式檢核成功後，按下確認並送出，系統隨開始發動交易。</h6>
            <h6 class="text-danger fw-bold">*檔名為: 商店代碼後九碼 + "." + YYYYMMDD(當天日期) + "." + A(第一次上傳為A，第二次為B，以此類推)+"."txt(大、小寫皆可)。例如：XXXXXXXXX.20230317.A.txt(TXT)。</h6>
            <h6 class="text-danger fw-bold">*上傳檔案均需依約定之密碼規則(約定之加解密密碼+兩碼當月月份)，以ZIP加密，若檔名或解密錯誤或總筆數及總金額不對，此檔直接剔退。</h6>
          </div>
          <div class="card-body">
            <Form
              ref="form"
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
                    type="number"
                    class="form-control"
                    rules="required"
                    :class="{ 'is-invalid': errors['總筆數'] }"
                    id="totalCount"
                    v-model.number="uploadPost.totalCount"
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
                    type="number"
                    class="form-control"
                    rules="required"
                    :class="{ 'is-invalid': errors['總金額'] }"
                    id="totalAmt"
                    v-model.number="uploadPost.totalAmt"
                  />
                  <ErrorMessage
                    name="總金額"
                    class="invalid-feedback ms-2"
                  />
                </div>
                <h6 class="text-danger fw-bold" style="padding-left:380px;">*若計算總金額為負數，則需加上負號「-」(半形)，例如：-123。</h6>
              </div>
              <button type="submit" class="btn btn-primary me-3 px-4" :disabled="!$store.state.pageBtnPermission.includes('insert')">上傳</button>
              <button class="btn btn-warning me-3 px-4" @click.prevent="downloadExcel" :disabled="!$store.state.pageBtnPermission.includes('download')">下載範例EXCEL</button>
              <button class="btn btn-success me-3 px-4" @click.prevent="downloadFormat" :disabled="!$store.state.pageBtnPermission.includes('download')">下載批次交易檔規格</button>
              <button class="btn btn-info me-3 px-4" @click.prevent="convertFile" :disabled="!$store.state.pageBtnPermission.includes('execute')">UB BPS轉檔程式</button>
            </Form>
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
                <td>{{item.batchDate}}</td>
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
                <td>{{item.totalCnt}}</td>
                <td>{{$custom.currency(item.totalAmt)}}</td>
                <td>{{item.authCnt}}</td>
                <td>{{$custom.currency(item.authAmt)}}</td>
                <td>{{item.refundCnt}}</td>
                <td>
                  <span v-if="item.refundAmt===0">{{$custom.currency(item.refundAmt)}}</span>
                  <span v-if="item.refundAmt!==0">-{{$custom.currency(item.refundAmt)}}</span>
                </td>
                <td>
                  <button v-if="item.batchStatus==='VALIDATE_FAIL'" @click="getError(item)" class="btn btn-danger me-2 btn-sm">檢視錯誤</button>
                  <button v-if="item.batchStatus==='VALIDATE_SUCCESS'" @click="getDetail(item)" class="btn btn-success me-2 btn-sm">檢視明細</button>
                  <button v-if="item.batchStatus==='VALIDATE_SUCCESS'" @click="confirmBatch(item)" class="btn btn-primary btn-sm" :disabled="!$store.state.pageBtnPermission.includes('execute')">確認送出授權</button>
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
            <MainData ref="detailMainData" :Page="detailPageData" @ChangePageInfo="getDetailPageInfo">
              <template #default>
                <thead>
                  <tr>
                    <th scope="col">卡號</th>
                    <th scope="col">交易類別</th>
                    <th scope="col">金額</th>
                    <th scope="col">帳單描述</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item,index) in detailData.gridData" :key="`A+${index}`">
                    <th scope="row">{{item.pan}}</th>
                    <td>
                      <span v-if="item.transType==='SALE'">授權與請款</span>
                      <span v-if="item.transType==='AUTH'">授權</span>
                      <span v-if="item.transType==='OFF_LINE_SALE'">請款</span>
                      <span v-if="item.transType==='REFUND'">退貨</span>
                    </td>
                    <td>{{$custom.currency(item.amt)}}</td>
                    <td>{{item.desc}}</td>
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

     <!-- 轉檔程式 Modal -->
     <div class="modal fade" ref="convertModal" tabindex="-1" aria-labelledby="convertModal" aria-hidden="true">
      <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-info">
            <h5 class="modal-title text-black">UB BPS轉檔程式</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div>
    <div class="row justify-content-center">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h2 class="fw-bold mb-3">Excel檔轉交易檔</h2>
            <h6>上傳Excel檔案，副檔名需為.xls或.xlsx</h6>
          </div>
          <div class="card-body">
            <Form
              ref="excelForm"
              v-slot="{ errors }"
              @submit="uploadExcelFile"
            >
              <div class="row py-3">
                <div class="col-xxl-6 d-flex mb-4 align-items-center">
                  <h5 class="text-nowrap me-3" style="padding-top:0.375rem;">上傳檔案:</h5>
                  <Field
                    id="excelFile"
                    style="width:400px;"
                    ref="upload"
                    type="file"
                    class="form-control"
                    placeholder=""
                    rules="required"
                    name="上傳檔案"
                    :class="{ 'is-invalid': errors['上傳檔案'] }"
                    @change="getFileConv($event)"
                  />
                  <ErrorMessage
                    name="上傳檔案"
                    class="invalid-feedback ms-2"
                  />
                </div>
                <div class="col-xxl-6"></div>
              </div>
              <button type="submit" :disabled="!$store.state.pageBtnPermission.includes('execute')" class="btn btn-success me-3 px-4">轉檔</button>
            </Form>
          </div>
        </div>
        <br>
        <div class="card">
          <div class="card-header">
            <h2 class="fw-bold mb-3">文字回覆檔轉Excel檔</h2>
            <h6>上傳txt文字檔案(回覆檔),副檔名需為小寫的.txt</h6>
          </div>
          <div class="card-body">
            <Form
              ref="txtForm"
              v-slot="{ errors }"
              @submit="uploadTxtFile"
            >
              <div class="row py-3">
                <div class="col-xxl-6 d-flex mb-4 align-items-center">
                  <h5 class="text-nowrap me-3" style="padding-top:0.375rem;">上傳檔案:</h5>
                  <Field
                    id="txtFile"
                    style="width:400px;"
                    ref="upload"
                    type="file"
                    class="form-control"
                    placeholder=""
                    rules="required"
                    name="上傳檔案"
                    :class="{ 'is-invalid': errors['上傳檔案'] }"
                    @change="getFileConv($event)"
                  />
                  <ErrorMessage
                    name="上傳檔案"
                    class="invalid-feedback ms-2"
                  />
                </div>
                <div class="col-xxl-6"></div>
              </div>
              <button type="submit" :disabled="!$store.state.pageBtnPermission.includes('execute')" class="btn btn-success me-3 px-4">轉檔</button>
            </Form>
          </div>
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
</template>

<script>
import service from '@/services/A/A1.service.js'
import MainData from '@/components/MainData.vue'
// import Model from '@/model/Public.model.js'

export default {
  components: {
    MainData
  },
  data () {
    return {
      // test: new Model.Address(),
      // test2: new Model.Address(),
      GroupDataPost: {
        page: 1,
        pageSize: 10
      },
      pageData: {}, // ?分頁資訊
      defaultData: [],
      gridData: [],
      uploadPost: {},
      uploadConv: {},
      detailModal: '',
      detailDataPost: {
        batchId: '',
        page: 1,
        pageSize: 10
      },
      detailData: {
        batchFileName: '',
        batchStoreName: '',
        gridData: []
      },
      detailPageData: {}, // ?詳細分頁資訊
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
    convertFile () {
      this.convertModal.show()
    },
    // ? 取得 MainData 元件分頁資訊
    getPageInfo (PageInfo) {
      this.GroupDataPost = PageInfo
      this.getData()
    },
    // ? 取得 MainData 元件詳細分頁資訊
    getDetailPageInfo (PageInfo) {
      this.detailDataPost.page = PageInfo.page
      this.detailDataPost.pageSize = PageInfo.pageSize
      this.getDetail()
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
    async getDetail (item) {
      if (item) {
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
          this.errorData.batchFileName = item.batchFileName
          this.errorData.batchStoreName = item.batchStoreName
        }
        this.errorData.gridData = result.batchErrorList
      }
      this.errorModal.show()
    },
    getFile (event) {
      this.uploadPost.file = event.target.files[0]
    },
    getFileConv (event) {
      this.uploadConv.file = event.target.files[0]
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
        document.querySelector('#batchFile').value = ''
        this.$refs.form.resetForm()
        this.getData()
      }
    },
    async uploadExcelFile () {
      const fileType = this.uploadConv.file.type
      if (fileType !== 'application/vnd.ms-excel' && fileType !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        this.$swal.fire('上傳檔案格式錯誤！請確認是否為.xls或.xlsx檔')
        return
      }
      const formData = new FormData()
      formData.append('file', this.uploadConv.file)
      formData.append('fileName', this.uploadConv.file.name)
      formData.append('msgId', this.$custom.uuidv4())
      this.$store.commit('changeLoading', true)
      const result = await service.uploadExcel(formData)
      this.$store.commit('changeLoading', false)
      if (result) {
        this.$swal.fire({
          toast: true,
          position: 'center',
          icon: 'success',
          title: '轉檔成功！',
          showConfirmButton: false,
          timer: 1500,
          width: 500,
          background: '#F0F0F2',
          padding: 25,
          customClass: {
            container: 'z-10000'
          }
        })
        this.uploadConv = {}
        document.querySelector('#excelFile').value = ''
        this.$refs.excelForm.resetForm()
      }
    },
    async uploadTxtFile () {
      const fileType = this.uploadConv.file.type
      if (fileType !== 'text/plain') {
        this.$swal.fire('上傳檔案格式錯誤！請確認是否為.txt檔')
        return
      }
      const formData = new FormData()
      formData.append('file', this.uploadConv.file)
      formData.append('fileName', this.uploadConv.file.name)
      formData.append('msgId', this.$custom.uuidv4())
      this.$store.commit('changeLoading', true)
      const result = await service.uploadTxt(formData)
      this.$store.commit('changeLoading', false)
      if (result) {
        this.$swal.fire({
          toast: true,
          position: 'center',
          icon: 'success',
          title: '轉檔成功！',
          showConfirmButton: false,
          timer: 1500,
          width: 500,
          background: '#F0F0F2',
          padding: 25,
          customClass: {
            container: 'z-10000'
          }
        })
        this.uploadConv = {}
        document.querySelector('#txtFile').value = ''
        this.$refs.txtForm.resetForm()
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
    },
    async downloadExcel () {
      this.$store.commit('changeLoading', true)
      const result = await service.downloadExcel()
      this.$store.commit('changeLoading', false)
      const a = document.createElement('a')
      const url = window.URL.createObjectURL(new Blob([result.data], { type: result.headers['content-type'] }))
      a.href = url
      a.style.display = 'none'
      a.download = '範例excel.xlsx'
      a.click()
      // 清除暫存
      a.href = ''
      window.URL.revokeObjectURL(url)
    },
    async downloadFormat () {
      this.$store.commit('changeLoading', true)
      const result = await service.downloadFormat()
      this.$store.commit('changeLoading', false)
      const a = document.createElement('a')
      const url = window.URL.createObjectURL(new Blob([result.data], { type: result.headers['content-type'] }))
      a.href = url
      a.style.display = 'none'
      a.download = '批次交易檔範例.pdf'
      a.click()
      // 清除暫存
      a.href = ''
      window.URL.revokeObjectURL(url)
    }
  },
  mounted () {
    this.getDefaultData()
    this.detailModal = new this.$custom.bootstrap.Modal(this.$refs.detailModal, { backdrop: 'static' })
    this.errorModal = new this.$custom.bootstrap.Modal(this.$refs.errorModal, { backdrop: 'static' })
    this.convertModal = new this.$custom.bootstrap.Modal(this.$refs.convertModal, { backdrop: 'static' })
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
