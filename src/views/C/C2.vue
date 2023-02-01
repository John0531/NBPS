<template>
  <div>
    <div class="row justify-content-center">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h2 class="fw-bold mb-3">特店帳號維護</h2>
            <h6>供經辦新增、修改、刪除特店帳號</h6>
          </div>
          <div class="card-body">
            <!-- <div class="row py-3">
              <div class="col-xxl-5 d-flex mb-4">
                <h5 class="text-nowrap me-3" style="padding-top:0.375rem;">特店代碼:</h5>
                <input type="text" class="form-control" placeholder="">
              </div>
            </div> -->
            <!-- <button class="btn btn-primary me-3 px-4">搜尋</button> -->
            <button class="btn btn-warning me-3 px-4" @click="openAddModal">新增帳號</button>
          </div>
        </div>
        <MainData :Page="pageData" @ChangePageInfo="getPageInfo" @updatePageInfo="getPageInfo">
          <template #default>
            <thead>
              <tr>
                <th scope="col">帳號</th>
                <th scope="col">類別</th>
                <th scope="col">名稱</th>
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
                <td>{{item.groupName}}</td>
                <td>{{item.description}}</td>
                <td>
                  <button v-if="$store.state.user.level!==item.level" @click="openEditModal(item)" class="btn btn-success me-2 btn-sm">編輯</button>
                  <button v-if="$store.state.user.level!==item.level" @click="removeAccount(item)" class="btn btn-danger btn-sm">刪除</button>
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
            <h5 class="modal-title text-dark">新增特店資料</h5>
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
                    ref="addForm"
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
                <label for="shop" class="col-sm-2 col-form-label">所屬特店</label>
                <div class="col-sm-10">
                  <Field
                    id="shop"
                    class="form-select"
                    as="select"
                    rules="required"
                    :class="{ 'is-invalid': errors['所屬特店'] }"
                    name="所屬特店"
                    v-model="addForm.storeId"
                  >
                    <option value="" selected>請選擇</option>
                    <option v-for="item in addForm.storeDataList" :key="item.id" :value="item.storeId">{{item.storeId}}({{item.storeName}})</option>
                  </Field>
                  <ErrorMessage
                    name="所屬特店"
                    class="invalid-feedback"
                  />
                </div>
              </div>
              <div class="row mb-3">
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
                <label for="email" class="col-sm-2 col-form-label">Email</label>
                <div class="col-sm-7">
                  <Field
                    name="Email"
                    type="text"
                    class="form-control"
                    rules="required|email"
                    :class="{ 'is-invalid': errors['Email'] }"
                    id="email"
                    v-model="addForm.email"
                  />
                  <ErrorMessage
                    name="Email"
                    class="invalid-feedback"
                  />
                </div>
                <div class="col-sm-3">
                  <button @click.prevent="sendEmail(addForm)" :disabled="errors['Email']||!addForm.email||errors['密碼']||!addForm.pd" class="btn btn-primary">寄送預設密碼</button>
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
            <h5 class="modal-title text-white">檢視與編輯</h5>
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
                <label for="shop" class="col-sm-2 col-form-label">所屬特店</label>
                <div class="col-sm-10">
                  <Field
                    id="shop"
                    class="form-select"
                    as="select"
                    rules="required"
                    :class="{ 'is-invalid': errors['所屬特店'] }"
                    name="所屬特店"
                    v-model="editForm.storeId"
                    @input="getStoreName()"
                  >
                    <option v-for="item in editForm.storeDataList" :key="item.id" :value="item.storeId">{{item.storeId}}({{item.storeName}})</option>
                  </Field>
                  <ErrorMessage
                    name="所屬特店"
                    class="invalid-feedback"
                  />
                </div>
              </div>
              <div class="row mb-3">
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
                <label for="email" class="col-sm-2 col-form-label">Email</label>
                <div class="col-sm-7">
                  <Field
                    name="Email"
                    type="text"
                    class="form-control"
                    rules="required|email"
                    :class="{ 'is-invalid': errors['Email'] }"
                    id="email"
                    v-model="editForm.email"
                  />
                  <ErrorMessage
                    name="Email"
                    class="invalid-feedback"
                  />
                </div>
                <div class="col-sm-3">
                  <button @click.prevent="sendEmail(editForm)" :disabled="errors['Email']||!editForm.email||editForm.pd==='********'" class="btn btn-primary">寄送預設密碼</button>
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
import service from '@/services/C/C2.service.js'
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
      if (this.addForm.isAd) {
        this.addForm.pd = ''
      }
      this.defaultUserInfo.storeDataList.forEach((item) => {
        if (item.storeId === this.addForm.storeId) {
          this.addForm.storeName = item.storeName
        }
      })
      const postData = JSON.parse(JSON.stringify(this.addForm))
      const result = await service.addAccount(postData)
      this.$store.commit('changeLoading', false)
      if (result) {
        // this.GroupDataPost = {
        //   page: this.pageData.totalPages,
        //   pageSize: this.GroupDataPost.pageSize
        // }
        this.addModal.hide()
        this.addForm = {}
        this.$refs.addForm.resetForm()
        this.getData()
      }
    },
    openEditModal (item) {
      this.editForm = JSON.parse(JSON.stringify(item))
      this.editForm.storeDataList = this.defaultUserInfo.storeDataList
      this.editForm.pd = '********'
      this.editForm.groupList = this.defaultUserInfo.groupList
      this.editModal.show()
    },
    getStoreName () {
      this.editForm.storeDataList.forEach((item) => {
        if (this.editForm.storeId === item.storeId) {
          this.editForm.storeName = item.storeName
        }
      })
    },
    async editAccount () {
      this.$store.commit('changeLoading', true)
      if (this.editForm.isAd) {
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
    async sendEmail (form) {
      const postData = {
        presetPd: form.pd,
        email: form.email
      }
      this.$store.commit('changeLoading', true)
      const result = await service.sendEmail(postData)
      this.$store.commit('changeLoading', false)
      if (result) {
        this.$swal.fire({
          title: 'Email 已成功寄出!',
          icon: 'success'
        })
      }
    }
  },
  mounted () {
    this.addModal = new this.$custom.bootstrap.Modal(this.$refs.addModal, { backdrop: 'static' })
    this.editModal = new this.$custom.bootstrap.Modal(this.$refs.editModal, { backdrop: 'static' })
  }
}
</script>
