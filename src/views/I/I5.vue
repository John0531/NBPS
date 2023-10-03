<template>
  <div>
    <div class="row justify-content-center">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h2 class="fw-bold mb-3">事件通知設定</h2>
            <h6>供經辦設定事件通知之信箱</h6>
          </div>
        </div>
        <MainData ref="ValveMainData" :Page="PageData" @ChangePageInfo="getPageInfo">
          <template #default>
            <thead>
              <tr>
                <th scope="col">事件</th>
                <th scope="col">事件類型</th>
                <th scope="col">信箱(以逗號分隔)</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in EventMailList.gridData" :key="item.id">
                <th scope="row">{{item.eventName}}</th>
                <th scope="row">{{item.eventType}}</th>
                <td>{{item.emails.join()}}</td>
                <td>
                  <button @click="openEditModal(item)" class="btn btn-success me-2 btn-sm" :disabled="!$store.state.pageBtnPermission.includes('modify')">修改信箱</button>
                </td>
              </tr>
            </tbody>
          </template>
        </MainData>
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
  </div>
</template>

<script>
import service from '@/services/I/I5.service.js'
import MainData from '@/components/MainData.vue'

export default {
  components: {
    MainData
  },
  data () {
    return {
      PageData: {}, // ?分頁資訊
      EventMailList: {
        originData: [],
        gridData: []
      },
      editModal: '',
      editForm: {}
    }
  },
  methods: {
    // ? 取得 MainData 元件 server 分頁資訊
    getPageInfo (PageInfo) {
      // * 傳送分頁資訊
      this.PageData = {
        totalElements: this.EventMailList.originData.length,
        currentPage: PageInfo.page,
        totalPages: Math.ceil(this.EventMailList.originData.length / PageInfo.pageSize)
      }
      // * 前端取得分頁資料(不打api)
      this.EventMailList.gridData = this.EventMailList.originData.slice((PageInfo.page - 1) * PageInfo.pageSize, PageInfo.page * PageInfo.pageSize)
    },
    async getData () {
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
          } else if (item.event === 'ABE_VALIDATOR') {
            item.eventName = '批次交易檔檢核錯誤'
          } else if (item.event === 'TXN_GENERATED_FAIL') {
            item.eventName = '請款結果查詢及對帳單產製失敗'
          } else if (item.event === 'BIN_UPDATED_FAIL') {
            item.eventName = 'BIN碼更新失敗'
          } else if (item.event === 'REPLY_FILE_SUCCESS') {
            item.eventName = '回覆檔產製完成'
          } else if (item.event === 'CB_UNDONE') {
            item.eventName = 'CALL BANK未完成'
          }
          switch (item.storeType) {
            case 'ACQUIRING':
              item.eventType = '收單作業'
              break
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
        this.$refs.ValveMainData.PageInfo.pageSize = 10
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
          this.getData()
        }
      }
    }
  },
  mounted () {
    this.getData()
    this.editModal = new this.$custom.bootstrap.Modal(this.$refs.editModal, { backdrop: 'static' })
  }
}
</script>
