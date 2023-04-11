<template>
  <div>
    <div class="row justify-content-center">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h2 class="fw-bold mb-3">Excel檔轉交易檔</h2>
            <h6>上傳Excel檔案，副檔名需為.xls或.xlsx</h6>
            <!-- <h6 class="text-danger fw-bold">*檔名為: 商店代碼後九碼 + "." + YYYYMMDD(自動帶出今日日期) + "." + A(第一次上傳為A，第二次為B，以此類推)+"."txt(大、小寫皆可)。例如：XXXXXXXXX.20230317.A.txt(TXT)。</h6> -->
          </div>
          <div class="card-body">
            <Form
              v-slot="{ errors }"
              @submit="uploadExcelFile"
            >
              <div class="row py-3">
                <div class="col-xxl-6 d-flex mb-4 align-items-center">
                  <h5 class="text-nowrap me-3" style="padding-top:0.375rem;">上傳檔案:</h5>
                  <Field
                    style="width:400px;"
                    ref="upload"
                    type="file"
                    class="form-control"
                    placeholder=""
                    rules="required"
                    name="上傳檔案"
                    :class="{ 'is-invalid': errors['上傳檔案'] }"
                    @change="getFile($event)"
                  />
                  <ErrorMessage
                    name="上傳檔案"
                    class="invalid-feedback ms-2"
                  />
                </div>
                <div class="col-xxl-6"></div>
              </div>
              <button type="submit" :disabled="!isBusinessDay||!$store.state.pageBtnPermission.includes('execute')" class="btn btn-success me-3 px-4">轉檔</button>
              <button class="btn btn-warning me-3" @click.prevent="downloadExcel" :disabled="!$store.state.pageBtnPermission.includes('execute')">下載範例Excel檔</button>
            </Form>
          </div>
        </div>
        <br>
        <div class="card">
          <div class="card-header">
            <h2 class="fw-bold mb-3">文字回覆檔轉Excel檔</h2>
            <h6>上傳Txt文字檔案(回覆檔)</h6>
            <!-- <h6 class="text-danger fw-bold">*檔名為: 商店代碼後九碼 + "." + YYYYMMDD(自動帶出今日日期) + "." + A(第一次上傳為A，第二次為B，以此類推)+"."txt(大、小寫皆可)。例如：XXXXXXXXX.20230317.A.txt(TXT)。</h6> -->
          </div>
          <div class="card-body">
            <Form
              v-slot="{ errors }"
              @submit="uploadTxtFile"
            >
              <div class="row py-3">
                <div class="col-xxl-6 d-flex mb-4 align-items-center">
                  <h5 class="text-nowrap me-3" style="padding-top:0.375rem;">上傳檔案:</h5>
                  <Field
                    style="width:400px;"
                    ref="upload"
                    type="file"
                    class="form-control"
                    placeholder=""
                    rules="required"
                    name="上傳檔案"
                    :class="{ 'is-invalid': errors['上傳檔案'] }"
                    @change="getFile($event)"
                  />
                  <ErrorMessage
                    name="上傳檔案"
                    class="invalid-feedback ms-2"
                  />
                </div>
                <div class="col-xxl-6"></div>
              </div>
              <button type="submit" :disabled="!isBusinessDay||!$store.state.pageBtnPermission.includes('execute')" class="btn btn-success me-3 px-4">轉檔</button>
              <!-- <button class="btn btn-warning me-3" @click.prevent="downloadExcel" :disabled="!$store.state.pageBtnPermission.includes('download')">下載範例</button> -->
              <!-- <button class="btn btn-success" @click.prevent="downloadFormat" :disabled="!$store.state.pageBtnPermission.includes('download')">下載批次交易檔規格</button> -->
            </Form>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import service from '@/services/B/B5.service.js'
// import MainData from '@/components/MainData.vue'

export default {
  data () {
    return {
      isBusinessDay: false, // ? 是否為營業時間
      defaultData: [],
      gridData: [],
      uploadPost: {},
      errorData: {
        batchFileName: '',
        gridData: []
      },
      errorPageData: {}// ?錯誤分頁資訊
    }
  },
  methods: {
    async getBusinessDay () {
      this.$store.commit('changeLoading', true)
      const result = await service.getBusinessDay()
      this.isBusinessDay = result.isBusinessDay
      this.$store.commit('changeLoading', false)
    },
    getFile (event) {
      this.uploadPost.file = event.target.files[0]
      console.log(this.uploadPost.file.name)
    },
    async uploadExcelFile () {
      const formData = new FormData()
      formData.append('file', this.uploadPost.file)
      formData.append('fileName', this.uploadPost.file.name)
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
        this.uploadPost = {}
        this.$refs.upload.value = ''
        // this.getData()
      }
    },
    async uploadTxtFile () {
      const formData = new FormData()
      formData.append('file', this.uploadPost.file)
      formData.append('fileName', this.uploadPost.file.name)
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
        this.uploadPost = {}
        this.$refs.upload.value = ''
        // this.getData()
      }
    },
    async downloadConvertExcel (item) {
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
    }
  //   async downloadFormat () {
  //     this.$store.commit('changeLoading', true)
  //     const result = await service.downloadFormat()
  //     this.$store.commit('changeLoading', false)
  //     const a = document.createElement('a')
  //     const url = window.URL.createObjectURL(new Blob([result.data], { type: result.headers['content-type'] }))
  //     a.href = url
  //     a.style.display = 'none'
  //     a.download = '批次交易檔範例.docx'
  //     a.click()
  //     // 清除暫存
  //     a.href = ''
  //     window.URL.revokeObjectURL(url)
  //   }
  },
  mounted () {
    this.getBusinessDay()
    // this.detailModal = new this.$custom.bootstrap.Modal(this.$refs.detailModal, { backdrop: 'static' })
    // this.errorModal = new this.$custom.bootstrap.Modal(this.$refs.errorModal, { backdrop: 'static' })
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
