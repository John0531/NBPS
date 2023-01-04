<template>
  <div>
    <div class="row justify-content-center">
      <div class="col-12">
        <div class="card">
          <div class="card-header bg-secondary text-white">
            <h3>特店群組權限維護</h3>
            <h6>供經辦新增、修改、刪除及匯出群組設定EXCEL</h6>
          </div>
          <div class="card-body">
            <!-- <div class="row py-3">
              <div class="col-xxl-5 d-flex mb-4">
                <h5 class="text-nowrap me-3" style="padding-top:0.375rem;">特店代碼:</h5>
                <input type="text" class="form-control" placeholder="">
              </div>
            </div> -->
            <!-- <button class="btn btn-primary me-3 px-4">搜尋</button> -->
            <button class="btn btn-warning me-3 px-4" @click="openAddModal">新增群組</button>
            <button class="btn btn-primary me-3 px-4">匯出群組Excel</button>
          </div>
        </div>
        <div class="mt-5">
          <div class="d-flex w-25 mb-3 align-items-center">
              <label for="" class="text-nowrap me-3 fs-5">每頁資料數 :</label>
              <select
              v-model="GroupDataPost.pageSize"
              @change="changePageElements" class="form-select" aria-label="Default select example">
                <option selected :value="10">10</option>
                <option :value="20">20</option>
                <option :value="50">50</option>
                <option :value="100">100</option>
              </select>
          </div>
          <div class="tbl-container">
            <table class="table table-striped table-bordered table-hover">
              <thead>
                <tr>
                  <th scope="col">群組代號</th>
                  <th scope="col">群組名稱</th>
                  <th scope="col">簡述</th>
                  <th scope="col">權限</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in gridData" :key="item.groupNo">
                  <th scope="row">{{item.groupNo}}</th>
                  <td>{{item.groupName}}</td>
                  <td>{{item.description}}</td>
                  <td>{{item.auth}}</td>
                  <td>
                    <button @click="viewAuth(item)" class="btn btn-primary me-2 btn-sm">檢視權限</button>
                    <button @click="openEditModal(item)" class="btn btn-success me-2 btn-sm">編輯</button>
                    <button @click="removeGroup(item)" class="btn btn-danger btn-sm">刪除</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Pagination :Page="pageData" @PageNum="clickPageNum"></Pagination>
        </div>
      </div>
    </div>

    <!-- 新增權限 Modal -->
    <div class="modal fade" ref="addModal" tabindex="-1" aria-labelledby="editModal" aria-hidden="true">
      <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-warning">
            <h5 class="modal-title text-dark">新增群組權限</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <Form
              v-slot="{ errors }"
              @submit="addGroup"
            >
              <div class="row mb-3">
                <label for="account" class="col-sm-2 col-form-label">群組代號</label>
                <div class="col-sm-10">
                  <Field
                    name="群組代號"
                    type="text"
                    class="form-control"
                    rules="required"
                    :class="{ 'is-invalid': errors['群組代號'] }"
                    id="account"
                    v-model="addForm.groupNo"
                  />
                  <ErrorMessage
                    name="群組代號"
                    class="invalid-feedback"
                  />
                </div>
              </div>
              <div class="row mb-3">
                <label for="name" class="col-sm-2 col-form-label">群組名稱</label>
                <div class="col-sm-10">
                  <Field
                    name="群組名稱"
                    type="text"
                    class="form-control"
                    rules="required"
                    :class="{ 'is-invalid': errors['群組名稱'] }"
                    id="name"
                    v-model="addForm.groupName"
                  />
                  <ErrorMessage
                    name="群組名稱"
                    class="invalid-feedback"
                  />
                </div>
              </div>
              <div class="row mb-3">
                <label for="description" class="col-sm-2 col-form-label">簡述</label>
                <div class="col-sm-10">
                  <input
                    type="text"
                    class="form-control"
                    id="description"
                    v-model="addForm.description"
                  />
                </div>
              </div>
              <div class="group-table my-4">
                <table class="table table-borderless table-hover text-center">
                  <thead>
                    <tr>
                      <th scope="col"></th>
                      <th scope="col">查詢(查詢、檢視等)</th>
                      <th scope="col">新增(新增)</th>
                      <th scope="col">修改(修改、編輯等)</th>
                      <th scope="col">執行(上傳、送出、取消等)</th>
                      <th scope="col">下載</th>
                    </tr>
                  </thead>
                  <tbody>
                    <template v-for="item in defaultPermission" :key="item.code">
                      <tr>
                        <th class="text-start">
                          <div class="d-flex align-items-center">
                            <input @change="checkPermission(item)" v-model="item.checked" class="form-check-input" type="checkbox" :id="item.code">
                            <label :for="item.code" class="fs-5 ps-2">{{item.code}}-{{item.name}}</label>
                          </div>
                        </th>
                      </tr>
                      <tr v-for="item2 in item.function" :key="item2.pageCode">
                        <th class="text-start">
                          <div class="d-flex align-items-center ms-3">
                            <input @change="checkPage(item2)" v-model="item2.checked" class="form-check-input" type="checkbox" :id="item2.pageCode">
                            <label :for="item2.pageCode" class="ps-2">{{item2.pageCode}}-{{item2.pageName}}</label>
                          </div>
                        </th>
                        <td><input v-model="item2.usable" value="view" class="form-check-input" type="checkbox" v-if="item2.default.includes('view')"></td>
                        <td><input v-model="item2.usable" value="insert" class="form-check-input" type="checkbox" v-if="item2.default.includes('insert')"></td>
                        <td><input v-model="item2.usable" value="modify" class="form-check-input" type="checkbox" v-if="item2.default.includes('modify')"></td>
                        <td><input v-model="item2.usable" value="execute" class="form-check-input" type="checkbox" v-if="item2.default.includes('execute')"></td>
                        <td><input v-model="item2.usable" value="download" class="form-check-input" type="checkbox" v-if="item2.default.includes('download')"></td>
                      </tr>
                    </template>
                  </tbody>
                </table>
              </div>
              <div class="d-flex justify-content-end">
                <button class="btn btn-warning px-4">新增</button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>

    <!-- 檢視權限 Modal -->
    <div class="modal fade" ref="viewModal" tabindex="-1" aria-labelledby="viewModal" aria-hidden="true">
      <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-primary">
            <h5 class="modal-title text-white">檢視權限</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <Form
              v-slot="{ errors }"
            >
              <div class="row mb-3">
                <label for="account" class="col-sm-2 col-form-label">群組代號</label>
                <div class="col-sm-10">
                  <Field
                    name="群組代號"
                    type="text"
                    class="form-control"
                    rules="required"
                    :class="{ 'is-invalid': errors['群組代號'] }"
                    id="account"
                    v-model="viewForm.groupNo"
                    disabled
                  />
                  <ErrorMessage
                    name="群組代號"
                    class="invalid-feedback"
                  />
                </div>
              </div>
              <div class="row mb-3">
                <label for="name" class="col-sm-2 col-form-label">群組名稱</label>
                <div class="col-sm-10">
                  <Field
                    name="群組名稱"
                    type="text"
                    class="form-control"
                    rules="required"
                    :class="{ 'is-invalid': errors['群組名稱'] }"
                    id="name"
                    v-model="viewForm.groupName"
                    disabled
                  />
                  <ErrorMessage
                    name="群組名稱"
                    class="invalid-feedback"
                  />
                </div>
              </div>
              <div class="row mb-3">
                <label for="description" class="col-sm-2 col-form-label">簡述</label>
                <div class="col-sm-10">
                  <input
                    type="text"
                    class="form-control"
                    id="description"
                    v-model="viewForm.description"
                    disabled
                  />
                </div>
              </div>
              <div class="group-table my-4">
                <table class="table table-borderless table-hover text-center">
                  <thead>
                    <tr>
                      <th scope="col"></th>
                      <th scope="col">查詢(查詢、檢視等)</th>
                      <th scope="col">新增(新增)</th>
                      <th scope="col">修改(修改、編輯等)</th>
                      <th scope="col">執行(上傳、送出、取消等)</th>
                      <th scope="col">下載</th>
                    </tr>
                  </thead>
                  <tbody>
                    <template v-for="item in defaultPermission" :key="item.code">
                      <tr>
                        <th class="text-start">
                          <div class="d-flex align-items-center">
                            <input disabled v-model="item.checked" class="form-check-input" type="checkbox">
                            <label class="fs-5 ps-2">{{item.code}}-{{item.name}}</label>
                          </div>
                        </th>
                      </tr>
                      <tr v-for="item2 in item.function" :key="item2.pageCode">
                        <th class="text-start">
                          <div class="form-check d-flex align-items-center ms-3">
                            <input disabled v-model="item2.checked" class="form-check-input" type="checkbox">
                            <label class="ps-2">{{item2.pageCode}}-{{item2.pageName}}</label>
                          </div>
                        </th>
                        <td><input disabled v-model="item2.usable" value="view" class="form-check-input" type="checkbox" v-if="item2.default.includes('view')"></td>
                        <td><input disabled v-model="item2.usable" value="insert" class="form-check-input" type="checkbox" v-if="item2.default.includes('insert')"></td>
                        <td><input disabled v-model="item2.usable" value="modify" class="form-check-input" type="checkbox" v-if="item2.default.includes('modify')"></td>
                        <td><input disabled v-model="item2.usable" value="execute" class="form-check-input" type="checkbox" v-if="item2.default.includes('execute')"></td>
                        <td><input disabled v-model="item2.usable" value="download" class="form-check-input" type="checkbox" v-if="item2.default.includes('download')"></td>
                      </tr>
                    </template>
                  </tbody>
                </table>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>

    <!-- 編輯權限 Modal -->
    <div class="modal fade" ref="editModal" tabindex="-1" aria-labelledby="editModal" aria-hidden="true">
      <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-success">
            <h5 class="modal-title text-white">編輯權限</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <Form
              v-slot="{ errors }"
              @submit="editGroup"
            >
              <div class="row mb-3">
                <label for="account" class="col-sm-2 col-form-label">群組代號</label>
                <div class="col-sm-10">
                  <Field
                    name="群組代號"
                    type="text"
                    class="form-control"
                    rules="required"
                    :class="{ 'is-invalid': errors['群組代號'] }"
                    id="account"
                    v-model="editForm.groupNo"
                  />
                  <ErrorMessage
                    name="群組代號"
                    class="invalid-feedback"
                  />
                </div>
              </div>
              <div class="row mb-3">
                <label for="name" class="col-sm-2 col-form-label">群組名稱</label>
                <div class="col-sm-10">
                  <Field
                    name="群組名稱"
                    type="text"
                    class="form-control"
                    rules="required"
                    :class="{ 'is-invalid': errors['群組名稱'] }"
                    id="name"
                    v-model="editForm.groupName"
                  />
                  <ErrorMessage
                    name="群組名稱"
                    class="invalid-feedback"
                  />
                </div>
              </div>
              <div class="row mb-3">
                <label for="description" class="col-sm-2 col-form-label">簡述</label>
                <div class="col-sm-10">
                  <input
                    type="text"
                    class="form-control"
                    id="description"
                    v-model="editForm.description"
                  />
                </div>
              </div>
              <div class="group-table my-4">
                <table class="table table-borderless table-hover text-center">
                  <thead>
                    <tr>
                      <th scope="col"></th>
                      <th scope="col">查詢(查詢、檢視等)</th>
                      <th scope="col">新增(新增)</th>
                      <th scope="col">修改(修改、編輯等)</th>
                      <th scope="col">執行(上傳、送出、取消等)</th>
                      <th scope="col">下載</th>
                    </tr>
                  </thead>
                  <tbody>
                    <template v-for="item in defaultPermission" :key="item.code">
                      <tr>
                        <th class="text-start">
                          <div class="d-flex align-items-center">
                            <input @change="checkPermission(item)" v-model="item.checked" class="form-check-input" type="checkbox" :id="item.code">
                            <label :for="item.code" class="fs-5 ps-2">{{item.code}}-{{item.name}}</label>
                          </div>
                        </th>
                      </tr>
                      <tr v-for="item2 in item.function" :key="item2.pageCode">
                        <th class="text-start">
                          <div class="form-check d-flex align-items-center ms-3">
                            <input @change="checkPage(item2)" v-model="item2.checked" class="form-check-input" type="checkbox" :id="item2.pageCode">
                            <label :for="item2.pageCode" class="form-check-label ps-2">{{item2.pageCode}}-{{item2.pageName}}</label>
                          </div>
                        </th>
                        <td><input v-model="item2.usable" value="view" class="form-check-input" type="checkbox" v-if="item2.default.includes('view')"></td>
                        <td><input v-model="item2.usable" value="insert" class="form-check-input" type="checkbox" v-if="item2.default.includes('insert')"></td>
                        <td><input v-model="item2.usable" value="modify" class="form-check-input" type="checkbox" v-if="item2.default.includes('modify')"></td>
                        <td><input v-model="item2.usable" value="execute" class="form-check-input" type="checkbox" v-if="item2.default.includes('execute')"></td>
                        <td><input v-model="item2.usable" value="download" class="form-check-input" type="checkbox" v-if="item2.default.includes('download')"></td>
                      </tr>
                    </template>
                  </tbody>
                </table>
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
import service from '@/services/C/C3.service.js'
import Pagination from '@/components/Pagination.vue'

export default {
  components: {
    Pagination
  },
  data () {
    return {
      GroupDataPost: {
        msgId: '',
        page: 1,
        pageSize: 10
      },
      pageData: {}, // ?分頁資訊
      gridData: [],
      addModal: '',
      addForm: {},
      viewForm: {},
      editModal: '',
      editForm: {},
      viewModal: '',
      defaultPermission: []
    }
  },
  methods: {
    async getData () {
      this.$store.commit('changeLoading', true)
      this.GroupDataPost.msgId = this.$custom.uuidv4()
      const result = await service.getGroupData(this.GroupDataPost)
      this.gridData = result.groupList
      // ? 分頁資訊與檢察 ?/
      this.pageData = result.pageInfo
      if (this.pageData.pageElements === 0) {
        this.GroupDataPost.page -= 1
        this.getData()
        return
      }
      // ? 分頁資訊與檢察 end ?/
      this.gridData.forEach((item1) => {
        item1.auth = []
        item1.permissions.forEach((item2) => {
          item2.function.forEach((item3) => {
            if (item3.usable.length !== 0) {
              item1.auth.push(item3.pageCode)
            }
          })
        })
        item1.auth = item1.auth.toString()
      })
      this.$store.commit('changeLoading', false)
    },
    async openAddModal () {
      this.$store.commit('changeLoading', true)
      this.defaultPermission = await service.getDefaultPermission()
      this.$store.commit('changeLoading', false)
      this.addModal.show()
    },
    viewAuth (item) {
      this.viewForm = {
        groupNo: item.groupNo,
        groupName: item.groupName,
        description: item.description
      }
      this.defaultPermission = JSON.parse(JSON.stringify(item.permissions))
      this.defaultPermission.forEach((item1) => {
        item1.checked = true // ? 預設所有都勾選
        item1.function.forEach((item2) => {
          if (item2.default.length === item2.usable.length) {
            item2.checked = true
          } else {
            item1.checked = false // ? 只要一個不符合，則取消勾選
          }
        })
      })
      this.viewModal.show()
    },
    async openEditModal (item) {
      this.editForm = {
        groupNo: JSON.parse(JSON.stringify(item.groupNo)),
        groupName: JSON.parse(JSON.stringify(item.groupName)),
        description: JSON.parse(JSON.stringify(item.description))
      }
      this.defaultPermission = JSON.parse(JSON.stringify(item.permissions))
      this.defaultPermission.forEach((item1) => {
        item1.checked = true // ? 預設所有都勾選
        item1.function.forEach((item2) => {
          if (item2.default.length === item2.usable.length) {
            item2.checked = true
          } else {
            item1.checked = false // ? 只要一個不符合，則取消勾選
          }
        })
      })
      this.editModal.show()
    },
    async addGroup () {
      this.$store.commit('changeLoading', true)
      const postData = {
        ...this.addForm,
        msgId: this.$custom.uuidv4(),
        permissions: this.defaultPermission
      }
      await service.addGroup(postData)
      this.addForm = {}
      this.$store.commit('changeLoading', false)
      this.addModal.hide()
      this.getData()
    },
    async editGroup () {
      this.$store.commit('changeLoading', true)
      const postData = {
        ...this.editForm,
        msgId: this.$custom.uuidv4(),
        permissions: this.defaultPermission
      }
      await service.editGroup(postData)
      this.$store.commit('changeLoading', false)
      this.editModal.hide()
      this.getData()
    },
    removeGroup (item) {
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
          const postData = {
            ...item,
            msgId: this.$custom.uuidv4()
          }
          await service.removeGroup(postData)
          this.$store.commit('changeLoading', false)
          this.getData()
        }
      })
    },
    checkPermission (item) {
      if (item.checked) {
        item.function.forEach(element => {
          element.checked = true
          element.usable = element.default
        })
      } else {
        item.function.forEach(element => {
          element.checked = false
          element.usable = []
        })
      }
    },
    checkPage (item2) {
      if (item2.checked) {
        item2.usable = item2.default
      } else {
        item2.usable = []
      }
    },
    // ? 切換分頁
    clickPageNum (num) {
      this.GroupDataPost.page = num
      this.getData()
    },
    // ? 選擇每頁資料數
    changePageElements () {
      this.GroupDataPost.page = 1
      this.getData()
    }
  },
  mounted () {
    this.getData()
    this.addModal = new this.$custom.bootstrap.Modal(this.$refs.addModal, { backdrop: 'static' })
    this.editModal = new this.$custom.bootstrap.Modal(this.$refs.editModal, { backdrop: 'static' })
    this.viewModal = new this.$custom.bootstrap.Modal(this.$refs.viewModal, { backdrop: 'static' })
  }
}
</script>

<style scoped>
.form-check-input{
  width:1.5rem;
  height:1.5rem;
  margin-top: 0;
}

.group-table {
  max-height: 600px;
  overflow-y: scroll;
}

.group-table thead {
  position: sticky;
  top: 0;
  z-index: 1;
  background: #fff;
}

</style>
