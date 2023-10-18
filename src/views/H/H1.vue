<template>
  <div>
    <div class="row justify-content-center">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h2 class="fw-bold mb-3">CALL BANK作業</h2>
            <h6>供<span class="text-primary">授權科經辦</span>修改<span class="text-primary">回應碼(2碼)</span>與<span class="text-success">授權回應碼(6碼)</span>，當<span class="text-danger">尚有未完成</span>的CALL BANK事件時，系統<span class="text-danger">每10分鐘</span>自動發送通知至<span class="text-mail">指定信箱</span>。</h6>
            <h6><span class="text-danger">*</span>若該筆交易有<span class="text-danger">未完成</span>的Call Bank作業，則會顯示 <button class="btn btn-primary btn-sm">檢視明細</button> 按鈕；當作業<span class="text-danger">全部完成</span>後按鈕即消失，接續流程並成功<span class="text-primary">產製回覆檔</span>後，系統會發送通知至<span class="text-mail">指定信箱</span> (主要通知對象:<span class="text-primary"> 發卡科經辦</span>)。</h6>
            <h6><span class="text-danger">*</span><span class="text-primary">回應碼</span>同意為<span class="text-primary">00</span>，需填寫<span class="text-success">授權回應碼</span>；不同意為<span class="text-danger">05</span>，無需填寫<span class="text-success">授權回應碼</span>(系統自動保留空白)。</h6>
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                <img class="img-fluid" src="~@/assets/img/email.png" alt=""><span class="text-mail">事件通知設定(點此)</span>
            </button>
          </div>
          <div class="card-body">
            <div class="row py-3">
              <div class="col-xxl-8 mb-4">
                <div class="input-group">
                <h5 class="text-nowrap fw-bold me-3" style="padding-top:0.375rem;">查詢資料時間：</h5>
                  <span class="input-group-text" id="basic-addon1">起日</span>
                  <Datepicker auto-apply enable-seconds v-model="searchForm.startDate" model-type="yyyy-MM-dd" format="yyyy/MM/dd "></Datepicker>
                  <span class="mb-4 me-3"></span>
                  <span class="input-group-text" id="basic-addon1">迄日</span>
                  <Datepicker auto-apply enable-seconds v-model="searchForm.endDate" model-type="yyyy-MM-dd" format="yyyy/MM/dd"></Datepicker>
                  <span class="mb-4 me-3"></span>
                  <button @click="getData" class="btn btn-primary me-3 px-4" :disabled="!$store.state.pageBtnPermission.includes('view')">搜尋</button>
                </div>
              </div>
                <div class="accordion-item">
                  <div id="flush-collapseOne" class="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
                    <div class="accordion-body">
                      <table class="table">
                        <thead class="table-eventLlist">
                          <tr>
                            <th scope="col">通知事件</th>
                            <th scope="col">事件類型</th>
                            <th scope="col">信箱(以逗號分隔)</th>
                            <th></th>
                            </tr>
                        </thead>
                        <tbody>
                          <tr v-for="item in EventMailList.gridData" :key="item.id">
                            <th scope="row">{{item.eventName}}</th>
                            <th scope="row">{{item.eventType}}</th>
                            <td class="wrap-text">{{item.emails.join()}}</td>
                            <td>
                              <button @click="openEditModal(item)" class="btn btn-success me-2 btn-sm" :disabled="!$store.state.pageBtnPermission.includes('modify')">修改信箱</button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                  </div>
                </div>
              </div>
        </div>
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
                  <span v-if="item.trxStatus==='CALL_BANK_PROCESS'">Call Bank作業中</span>
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

  <!-- 修改信箱 Modal -->
  <div class="modal fade" ref="editModal" tabindex="-1" aria-labelledby="editModal" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-success">
            <h5 class="modal-title text-white">修改信箱</h5>
            <button @click.prevent="closeEditModel" type="button" class="btn-close btn-close-white" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <Form
              ref="form"
              v-slot="{ errors }"
            >
              <div class="row mb-3">
                <label for="event" class="col-sm-2 col-form-label">事件</label>
                <div class="col-sm-10">
                  <Field
                    name="事件"
                    type="text"
                    class="form-control"
                    rules="required"
                    :class="{ 'is-invalid': errors['事件'] }"
                    id="event"
                    v-model="editForm.eventName"
                    disabled
                  />
                  <ErrorMessage
                    name="事件"
                    class="invalid-feedback"
                  />
                </div>
              </div>
              <div class="row mb-3">
                <label for="event" class="col-sm-2 col-form-label">類型</label>
                <div class="col-sm-10">
                  <Field
                    name="事件類型"
                    type="text"
                    class="form-control"
                    rules="required"
                    :class="{ 'is-invalid': errors['事件類型'] }"
                    id="eventType"
                    v-model="editForm.eventType"
                    disabled
                  />
                  <ErrorMessage
                    name="事件"
                    class="invalid-feedback"
                  />
                </div>
              </div>
              <div class="row mb-3">
                <div class="row mb-3">
                <label for="event" class="col-sm-2 col-form-label">通知信標題</label>
                <div class="col-sm-10">
                  <Field
                    name="通知信標題"
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': errors['通知信標題'] }"
                    id="title"
                    v-model="editForm.title"
                  />
                  <ErrorMessage
                    name="通知信標題"
                    class="invalid-feedback"
                  />
                </div>
                </div>
              </div>
              <div class="row mb-3">
                <div class="row mb-3">
                <label for="event" class="col-sm-2 col-form-label">通知信內容</label>
                <div class="col-sm-10">
                  <Field
                    name="通知信內容"
                    as="textarea"
                    class="form-control"
                    :class="{ 'is-invalid': errors['通知信內容'] }"
                    id="title"
                    v-model="editForm.contents"
                  />
                  <ErrorMessage
                    name="通知信內容"
                    class="invalid-feedback"
                  />
                </div>
              </div>
                <label for="email" class="col-sm-2 col-form-label">新增信箱</label>
                <div class="col-sm-8">
                  <Field
                    name="新增信箱"
                    class="form-control"
                    rules="required|email"
                    :class="{ 'is-invalid': errors['新增信箱'] }"
                    id="email"
                    v-model="editForm.addEmail"
                  />
                  <ErrorMessage
                    name="新增信箱"
                    class="invalid-feedback"
                  />
                </div>
                <div class="col-sm-2">
                  <button @click.prevent="addEmail" class="btn btn-primary px-4">新增</button>
                </div>
              </div>
              <div class="row mb-3">
                <div class="col-12">
                  <div class="tbl-container table-responsive">
                    <table class="table table-striped table-bordered table-hover">
                      <thead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">信箱</th>
                          <th scope="col"></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(item,index) in editForm.emailList" :key="`A${index}`">
                          <th scope="row">{{index+1}}</th>
                          <td>
                            <Field
                              :name="`信箱${index+1}`"
                              class="form-control"
                              rules="required|email"
                              :class="{ 'is-invalid': errors[`信箱${index+1}`] }"
                              v-model="item.email"
                            />
                            <span class="text-danger">
                              {{errors[`信箱${index+1}`]}}
                            </span>
                          </td>
                          <td>
                            <button @click.prevent="removeEmail(index)" class="btn btn-danger btn-sm">刪除</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div class="d-flex justify-content-end">
                <button @click.prevent="editEmail" class="btn btn-success px-4">儲存</button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>

    <!-- 授權碼列表 Modal -->
  <div class="modal fade" ref="authCodeListModal" tabindex="-1" aria-labelledby="authCodeListModal" aria-hidden="true">
    <div class="modal-dialog modal-xl modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header bg-info">
          <h5 class="modal-title text-black">常用回應代碼表</h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <img class="img-fluid rounded mx-auto d-block" src="~@/assets/img/ACL.png" alt="">
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
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
      MailPageData: {}, // ?分頁資訊
      EventMailList: {
        originData: [],
        gridData: []
      },
      editModal: '',
      editForm: {},
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
    authCodeList () {
      this.authCodeListModal.show()
    },
    async getEmailData () {
      this.$store.commit('changeLoading', true)
      const result = await service.getData()
      this.$store.commit('changeLoading', false)
      if (result) {
        // * 傳送分頁資訊(僅第一次打api取得所有資料)
        this.PageData = {
          totalElements: result.eventMailList.length,
          currentPage: 1,
          totalPages: Math.ceil(result.eventMailList.length / 10)
        }
        this.EventMailList.originData = result.eventMailList
        // ? 資料格式處理
        this.EventMailList.originData.forEach((item) => {
          if (item.event === 'CB_NOTIFY') {
            item.eventName = 'CALL BANK通知'
          } else if (item.event === 'REPLY_FILE_SUCCESS') {
            item.eventName = '回覆檔產製完成'
          } else if (item.event === 'CB_UNDONE') {
            item.eventName = 'CALL BANK未完成'
          }
          switch (item.storeType) {
            case 'PUBLIC_UTILITIES':
              item.eventType = '公共事業'
              break
            case 'MAIL_ORDER':
              item.eventType = '郵購'
              break
            case 'ISSUE_CARD':
              item.eventType = '新消貸'
              break
            default:
              break
          }
        })
        // ? 資料格式處理 end
        this.EventMailList.gridData = this.EventMailList.originData.slice(0, 10)
        // * 傳送分頁資訊(僅第一次打api取得所有資料) end
        // * 將每頁資料數初始化
        // this.$refs.ValveMainData.PageInfo.pageSize = 10
      }
    },
    openEditModal (item) {
      this.editForm = JSON.parse(JSON.stringify(item))
      this.editForm.emailList = this.editForm.emails.map((item) => {
        return { email: item }
      })
      this.editModal.show()
    },
    async addEmail () {
      const result = await this.$refs.form.validateField('新增信箱')
      if (result.valid) {
        this.editForm.emailList.push({
          email: this.editForm.addEmail
        })
      }
    },
    async removeEmail (index) {
      this.$swal.fire({
        title: '確認是否刪除?',
        showCancelButton: true,
        confirmButtonColor: '#0d6efd',
        cancelButtonColor: '#4D4D4D',
        confirmButtonText: '確認',
        cancelButtonText: '取消',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          this.editForm.emailList.splice(index, 1)
        }
      })
    },
    closeEditModel () {
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
          this.editModal.hide()
        }
      })
    },
    async editEmail () {
      this.$refs.form.setErrors({})
      this.$refs.form.setFieldError('新增信箱', '')
      for (let i = 0; i < this.editForm.emailList.length; i++) {
        await this.$refs.form.validateField(`信箱${i + 1}`)
      }
      const errors = this.$refs.form.getErrors()
      if (Object.keys(errors).length === 0) {
        this.editForm.emails = this.editForm.emailList.map(item => {
          return item.email
        })
        this.editForm.eventType = this.editForm.event
        this.$store.commit('changeLoading', true)
        const result = await service.editEventMail(this.editForm)
        this.$store.commit('changeLoading', false)
        if (result) {
          this.editModal.hide()
          this.getEmailData()
        }
      }
    },
    // ? 取得 MainData 元件分頁資訊
    getPageInfo (PageInfo) {
      this.searchForm.page = PageInfo.page
      this.searchForm.pageSize = PageInfo.pageSize
      this.getData()
      // * 傳送分頁資訊
      this.MailPageData = {
        totalElements: this.EventMailList.originData.length,
        currentPage: PageInfo.page,
        totalPages: Math.ceil(this.EventMailList.originData.length / PageInfo.pageSize)
      }
      // * 前端取得分頁資料(不打api)
      this.EventMailList.gridData = this.EventMailList.originData.slice((PageInfo.page - 1) * PageInfo.pageSize, PageInfo.page * PageInfo.pageSize)
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
    this.getEmailData()
    this.detailModal = new this.$custom.bootstrap.Modal(this.$refs.detailModal, { backdrop: 'static' })
    this.editModal = new this.$custom.bootstrap.Modal(this.$refs.editModal, { backdrop: 'static' })
    this.authCodeListModal = new this.$custom.bootstrap.Modal(this.$refs.authCodeListModal, { backdrop: 'static' })
  }
}
</script>

<style scoped>
.table-eventLlist{
  background-color: rgb(73, 151, 108);
  color: white;
}
.wrap-text {
  white-space: normal;
  overflow: visible;
  text-overflow: inherit;
  max-width: 800px; /* 列宽 */
}
.btn-cutBtn{
  background-color: rgb(49, 196, 233);
}

.btn-cutBtn:hover{
  background-color: rgb(49, 196, 233);
}

.img-fluid{
  max-width: 100%;
  /* height: auto; */
}
.accordion-button{
  /* background-color: rgb(49, 196, 233); */
  max-width: 18%;
  margin-right: auto;
}
.img-fluid{
  max-width: 10%;
  margin-right: 10px;
  margin-left: 10px;
}
.text-mail{
  color: #e97e1a;
}
</style>
