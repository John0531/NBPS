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
                <th scope="col">信箱(以逗號分隔)</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in EventMailList.gridData" :key="item.id">
                <th scope="row">{{item.eventName}}</th>
                <td>{{item.emails}}</td>
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
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <Form
              v-slot="{ errors }"
              @submit="editEmail"
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
                <label for="email" class="col-sm-2 col-form-label">信箱</label>
                <div class="col-sm-10">
                  <Field
                    name="信箱"
                    as="textarea"
                    class="form-control"
                    :rules="{CheckEmailsArea:[this.editForm.emails],required:true}"
                    :class="{ 'is-invalid': errors['信箱'] }"
                    id="email"
                    v-model="editForm.emails"
                  />
                  <div class="mt-2 text-primary fw-bold">需以逗號分隔，如: a01@utic.com,a02@utic.com</div>
                  <ErrorMessage
                    name="信箱"
                    class="invalid-feedback"
                  />
                </div>
              </div>
              <div class="d-flex justify-content-end">
                <button class="btn btn-success px-4">儲存</button>
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
          item.emails = item.emails.join()
          if (item.event === 'CB_NOTIFY') {
            item.eventName = 'CALL BANK通知'
          } else if (item.event === 'ABE_VALIDATOR') {
            item.eventName = '收單批次交易檔檢核錯誤'
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
      this.editModal.show()
    },
    async editEmail () {
      this.editForm.eventType = this.editForm.event
      this.$store.commit('changeLoading', true)
      const result = await service.editEventMail(this.editForm)
      this.$store.commit('changeLoading', false)
      if (result) {
        this.editModal.hide()
        this.getData()
      }
    }
  },
  mounted () {
    this.getData()
    this.editModal = new this.$custom.bootstrap.Modal(this.$refs.editModal, { backdrop: 'static' })
  }
}
</script>
