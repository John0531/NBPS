<template>
  <div>
    <div class="row justify-content-center">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h2 class="fw-bold mb-3">帳號維護</h2>
            <h6>供經辦新增、修改、刪除及匯出帳號EXCEL，若使用超級權限帳號登入，則只可看到資訊科權限帳號，若使用資訊科權限帳號登入，則只可看到內部人員帳號，資訊科權限亦能看資訊處帳號，但不能異動</h6>
          </div>
          <div class="card-body">
            <!-- <div class="row py-3">
              <div class="col-xxl-5 d-flex mb-4">
                <h5 class="text-nowrap me-3" style="padding-top:0.375rem;">特店代碼:</h5>
                <input type="text" class="form-control" placeholder="">
              </div>
            </div> -->
            <!-- <button class="btn btn-primary me-3 px-4">搜尋</button> -->
            <button class="btn btn-warning me-3 px-4" @click="openAddModal" :disabled="!$store.state.pageBtnPermission.includes('insert')">新增帳號</button>
            <button class="btn btn-primary me-3 px-4" @click="downloadExcel" :disabled="!$store.state.pageBtnPermission.includes('download')">匯出帳號excel</button>
          </div>
        </div>
        <MainData :Page="pageData" @ChangePageInfo="getPageInfo" @updatePageInfo="getPageInfo">
          <template #default>
            <thead>
              <tr>
                <th scope="col">帳號</th>
                <th scope="col">類別</th>
                <th scope="col">名稱</th>
                <th scope="col">是否為AD使用者</th>
                <th scope="col">群組</th>
                <th scope="col">簡述</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in gridData" :key="item.userName">
                <th scope="row">{{item.userName}}</th>
                <td>{{item.userTypeStr}}</td>
                <td>{{item.name}}</td>
                <td>
                  <span v-if="item.adType==='NONE'">否</span>
                  <span v-if="item.adType==='CARD_AD'">是</span>
                </td>
                <td>{{item.groupName}}</td>
                <td>{{item.description}}</td>
                <td>
                  <button v-if="$store.state.user.level!==item.level" @click="openEditModal(item)" class="btn btn-success me-2 btn-sm">編輯</button>
                  <button v-if="$store.state.user.level!==item.level" @click="removeAccount(item)" class="btn btn-danger btn-sm" :disabled="!$store.state.pageBtnPermission.includes('modify')">刪除</button>
                </td>
              </tr>
            </tbody>
          </template>
        </MainData>
      </div>
    </div>

    <!-- 新增 Modal -->
    <div class="modal fade" ref="addModal" tabindex="-1" aria-labelledby="editModal" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-warning">
            <h5 class="modal-title text-dark">新增帳號</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <Form
              v-slot="{ errors }"
              @submit="addAccount"
            >
              <div class="row mb-3">
                <label for="account" class="col-sm-2 col-form-label">帳號</label>
                <div class="col-sm-10">
                  <Field
                    name="帳號"
                    type="text"
                    class="form-control"
                    rules="required"
                    :class="{ 'is-invalid': errors['帳號'] }"
                    id="account"
                    v-model="addForm.userName"
                  />
                  <ErrorMessage
                    name="帳號"
                    class="invalid-feedback"
                  />
                </div>
              </div>
              <div class="row mb-3">
                <label for="type" class="col-sm-2 col-form-label">類別</label>
                <div class="col-sm-10">
                  <input v-model="addForm.userTypeStr" type="text" class="form-control" id="type" disabled>
                </div>
              </div>
              <div class="row mb-3">
                <label for="account" class="col-sm-2 col-form-label">名稱</label>
                <div class="col-sm-10">
                  <Field
                    name="名稱"
                    type="text"
                    class="form-control"
                    rules="required"
                    :class="{ 'is-invalid': errors['名稱'] }"
                    id="account"
                    v-model="addForm.name"
                  />
                  <ErrorMessage
                    name="名稱"
                    class="invalid-feedback"
                  />
                </div>
              </div>
              <div class="row mb-3">
                <label for="adType" class="col-sm-2 col-form-label">是否為AD使用者</label>
                <div class="col-sm-10 d-flex align-items-center">
                  <div class="form-check form-check-inline">
                    <Field
                      rules="required"
                      :class="{ 'is-invalid': errors['是否為AD使用者'] }"
                      v-model="addForm.adType"
                      value="NONE"
                      class="form-check-input"
                      type="radio"
                      name="是否為AD使用者"
                      id="adType1"
                    />
                    <label class="form-check-label" for="adType1">否</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <Field
                      rules="required"
                      :class="{ 'is-invalid': errors['是否為AD使用者'] }"
                      v-model="addForm.adType"
                      value="CARD_AD"
                      class="form-check-input"
                      type="radio"
                      name="是否為AD使用者"
                      id="adType2"
                    />
                    <label class="form-check-label" for="adType2">是</label>
                  </div>
                  <ErrorMessage
                    name="是否為AD使用者"
                    class="text-danger"
                    style="font-size:0.875em"
                  />
                </div>
              </div>
              <div class="row mb-3" v-if="addForm.adType==='NONE'">
                <label for="pwd" class="col-sm-2 col-form-label">密碼</label>
                <div class="col-sm-7">
                  <Field
                    type="text"
                    class="form-control"
                    id="pwd"
                    :class="{ 'is-invalid': errors['密碼'] }"
                    name="密碼"
                    v-model="addForm.pd"
                    disabled
                  />
                  <ErrorMessage
                    name="密碼"
                    class="invalid-feedback"
                  />
                </div>
              </div>
              <div class="row mb-3">
                <label for="shop" class="col-sm-2 col-form-label">群組</label>
                <div class="col-sm-10">
                  <Field
                    id="shop"
                    class="form-select"
                    as="select"
                    rules="required"
                    :class="{ 'is-invalid': errors['群組'] }"
                    name="群組"
                    v-model="addForm.groupNo"
                  >
                    <option value="" selected>請選擇</option>
                    <option v-for="item in addForm.groupList" :key="item.groupNo" :value="item.groupNo">{{item.groupName}} - {{item.groupNo}}</option>
                  </Field>
                  <ErrorMessage
                    name="群組"
                    class="invalid-feedback"
                  />
                </div>
              </div>
              <div class="row mb-3">
                <label for="desc" class="col-sm-2 col-form-label">簡述<span class="text-danger">(非必填)</span></label>
                <div class="col-sm-10">
                  <textarea v-model="addForm.description" class="form-control" id="desc" rows="3"></textarea>
                </div>
              </div>
              <div class="d-flex justify-content-end">
                <button class="btn btn-warning px-4">新增</button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>

    <!-- 編輯 Modal -->
    <div class="modal fade" ref="editModal" tabindex="-1" aria-labelledby="editModal" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-success">
            <h5 class="modal-title text-white">編輯帳號</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <Form
              v-slot="{ errors }"
              @submit="editAccount"
            >
              <div class="row mb-3">
                <label for="account" class="col-sm-2 col-form-label">帳號</label>
                <div class="col-sm-10">
                  <Field
                    name="帳號"
                    type="text"
                    class="form-control"
                    rules="required"
                    :class="{ 'is-invalid': errors['帳號'] }"
                    id="account"
                    v-model="editForm.userName"
                    disabled
                  />
                  <ErrorMessage
                    name="帳號"
                    class="invalid-feedback"
                  />
                </div>
              </div>
              <div class="row mb-3">
                <label for="type" class="col-sm-2 col-form-label">類別</label>
                <div class="col-sm-10">
                  <input v-model="editForm.userTypeStr" type="text" class="form-control" id="type" disabled>
                </div>
              </div>
              <div class="row mb-3">
                <label for="account" class="col-sm-2 col-form-label">名稱</label>
                <div class="col-sm-10">
                  <Field
                    name="名稱"
                    type="text"
                    class="form-control"
                    rules="required"
                    :class="{ 'is-invalid': errors['名稱'] }"
                    id="account"
                    v-model="editForm.name"
                  />
                  <ErrorMessage
                    name="名稱"
                    class="invalid-feedback"
                  />
                </div>
              </div>
              <div class="row mb-3">
                <label for="adTypeEdit" class="col-sm-2 col-form-label">是否為AD使用者</label>
                <div class="col-sm-10 d-flex align-items-center">
                  <div class="form-check form-check-inline">
                    <Field
                      rules="required"
                      :class="{ 'is-invalid': errors['是否為AD使用者'] }"
                      v-model="editForm.adType"
                      value="NONE"
                      class="form-check-input"
                      type="radio"
                      name="是否為AD使用者"
                      id="adTypeEdit1"
                    />
                    <label class="form-check-label" for="adTypeEdit1">否</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <Field
                      rules="required"
                      :class="{ 'is-invalid': errors['是否為AD使用者'] }"
                      v-model="editForm.adType"
                      value="CARD_AD"
                      class="form-check-input"
                      type="radio"
                      name="是否為AD使用者"
                      id="adTypeEdit2"
                    />
                    <label class="form-check-label" for="adTypeEdit2">是</label>
                  </div>
                  <ErrorMessage
                    name="是否為AD使用者"
                    class="text-danger"
                    style="font-size:0.875em"
                  />
                </div>
              </div>
              <div class="row mb-3" v-if="editForm.adType==='NONE'">
                <label for="pwd" class="col-sm-2 col-form-label">密碼</label>
                <div class="col-sm-7">
                  <Field
                    type="text"
                    class="form-control"
                    id="pwd"
                    :class="{ 'is-invalid': errors['密碼'] }"
                    name="密碼"
                    v-model="editForm.pd"
                    disabled
                  />
                  <ErrorMessage
                    name="密碼"
                    class="invalid-feedback"
                  />
                </div>
                <div class="col-sm-3">
                  <button @click.prevent="editForm.pd='UBot123456!'" class="btn btn-primary">設為預設密碼</button>
                </div>
              </div>
              <div class="row mb-3">
                <label for="group" class="col-sm-2 col-form-label">群組</label>
                <div class="col-sm-10">
                  <Field
                    id="group"
                    class="form-select"
                    as="select"
                    rules="required"
                    :class="{ 'is-invalid': errors['群組'] }"
                    name="群組"
                    v-model="editForm.groupNo"
                  >
                    <option v-for="item in editForm.groupList" :key="item.groupNo" :value="item.groupNo">{{item.groupName}} - {{item.groupNo}}</option>
                  </Field>
                  <ErrorMessage
                    name="群組"
                    class="invalid-feedback"
                  />
                </div>
              </div>
              <div class="row mb-3">
                <label for="desc" class="col-sm-2 col-form-label">簡述<span class="text-danger">(非必填)</span></label>
                <div class="col-sm-10">
                  <textarea v-model="editForm.description" class="form-control" id="desc" rows="3"></textarea>
                </div>
              </div>
              <div class="d-flex justify-content-end">
                <button class="btn btn-success px-4" :disabled="!$store.state.pageBtnPermission.includes('modify')">儲存</button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import service from '@/services/F/F1.service.js'
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
      gridData: [],
      addModal: '',
      addForm: {},
      editModal: '',
      editForm: {},
      defaultUserInfo: {}
    }
  },
  methods: {
    // ? 取得 MainData 元件分頁資訊
    getPageInfo (PageInfo) {
      this.GroupDataPost = PageInfo
      this.getData()
    },
    async getDefault () {
      const result = await service.getDefaultUserInfo()
      this.defaultUserInfo = result
    },
    async getData () {
      this.$store.commit('changeLoading', true)
      await this.getDefault()
      const result = await service.getAccountData(this.GroupDataPost)
      this.$store.commit('changeLoading', false)
      this.pageData = result.pageInfo // ? 傳送分頁資訊
      this.gridData = result.users
    },
    async openAddModal () {
      this.addForm = this.defaultUserInfo
      this.addForm.pd = 'UBot123456!'
      this.addModal.show()
    },
    async addAccount () {
      this.$store.commit('changeLoading', true)
      if (this.addForm.adType !== 'NONE') {
        this.addForm.pd = ''
      }
      const postData = JSON.parse(JSON.stringify(this.addForm))
      const result = await service.addAccount(postData)
      this.$store.commit('changeLoading', false)
      if (result) {
        this.addForm = {}
        this.addModal.hide()
        this.getData()
      }
    },
    openEditModal (item) {
      this.editForm = JSON.parse(JSON.stringify(item))
      this.editForm.pd = '********'
      this.editForm.groupList = this.defaultUserInfo.groupList
      this.editModal.show()
    },
    async editAccount () {
      this.$store.commit('changeLoading', true)
      if (this.editForm.adType !== 'NONE') {
        this.editForm.pd = ''
      }
      if (this.editForm.pd === '********') {
        this.editForm.pd = ''
      }
      const postData = JSON.parse(JSON.stringify(this.editForm))
      const result = await service.editAccount(postData)
      this.$store.commit('changeLoading', false)
      if (result) {
        this.editModal.hide()
        this.getData()
      }
    },
    removeAccount (item) {
      this.$swal.fire({
        title: '是否刪除?',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#4D4D4D',
        confirmButtonText: '刪除',
        cancelButtonText: '取消',
        reverseButtons: true
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.$store.commit('changeLoading', true)
          const result = await service.removeAccount(item)
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
      a.download = '所有帳號.xlsx'
      a.click()
      // 清除暫存
      a.href = ''
      window.URL.revokeObjectURL(url)
    }
  },
  mounted () {
    this.addModal = new this.$custom.bootstrap.Modal(this.$refs.addModal, { backdrop: 'static' })
    this.editModal = new this.$custom.bootstrap.Modal(this.$refs.editModal, { backdrop: 'static' })
  }
}
</script>
