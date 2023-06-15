<template>
  <div>
    <div class="row justify-content-center">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h2 class="fw-bold mb-3">群組權限維護</h2>
            <h6>供經辦新增、修改、刪除及匯出群組設定EXCEL。1. 超級帳號才看得到所有權縣(A~~~Z) 2.資訊科特權除了B、F以外都看的到 3. 內部帳號只看的到B系列</h6>
          </div>
          <div class="card-body">
            <!-- <div class="row py-3">
              <div class="col-xxl-5 d-flex mb-4">
                <h5 class="text-nowrap me-3" style="padding-top:0.375rem;">特店代碼:</h5>
                <input type="text" class="form-control" placeholder="">
              </div>
            </div> -->
            <!-- <button class="btn btn-primary me-3 px-4">搜尋</button> -->
            <button class="btn btn-warning me-3 px-4" @click="
            $refs.addForm.resetForm()
            ;openAddModal()" :disabled="!$store.state.pageBtnPermission.includes('insert')">新增群組</button>
            <button class="btn btn-primary me-3 px-4" @click="downloadExcel" :disabled="!$store.state.pageBtnPermission.includes('download')">匯出群組Excel</button>
          </div>
        </div>
        <MainData :Page="pageData" @ChangePageInfo="getPageInfo" @updatePageInfo="getPageInfo">
          <template #default>
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
                  <button v-if="$store.state.user.level!==item.level" @click="openEditModal(item)" class="btn btn-success me-2 btn-sm" :disabled="!$store.state.pageBtnPermission.includes('modify')">編輯</button>
                  <button v-if="$store.state.user.level!==item.level" @click="removeGroup(item)" class="btn btn-danger btn-sm" :disabled="!$store.state.pageBtnPermission.includes('modify')">刪除</button>
                </td>
              </tr>
            </tbody>
          </template>
        </MainData>
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
              ref="addForm"
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
                  <Field
                    name="簡述"
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
                      <th scope="col" width="35%"></th>
                      <th scope="col">
                        <span data-bs-toggle="tooltip" data-bs-placement="bottom" title="查詢、檢視等">查詢</span>
                      </th>
                      <th scope="col">
                        <span data-bs-toggle="tooltip" data-bs-placement="bottom" title="新增">新增</span>
                      </th>
                      <th scope="col">
                        <span data-bs-toggle="tooltip" data-bs-placement="bottom" title="修改、編輯等">修改</span>
                      </th>
                      <th scope="col">
                        <span data-bs-toggle="tooltip" data-bs-placement="bottom" title="上傳、送出、取消等">執行</span>
                      </th>
                      <th scope="col">
                        <span data-bs-toggle="tooltip" data-bs-placement="bottom" title="下載">下載</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <template v-for="item in defaultPermission" :key="item.code">
                      <tr>
                        <th class="text-start">
                          <div class="d-flex align-items-center">
                            <input @change="$custom.permission.checkPermission(item)" v-model="item.checked" class="form-check-input" type="checkbox" :id="item.code">
                            <label :for="item.code" class="fs-5 ps-2">{{item.code}}-{{item.name}}</label>
                          </div>
                        </th>
                      </tr>
                      <tr v-for="item2 in item.function" :key="item2.pageCode">
                        <th class="text-start">
                          <div class="d-flex align-items-center ms-3">
                            <input @change="$custom.permission.checkPage(item2)" v-model="item2.checked" class="form-check-input" type="checkbox" :id="item2.pageCode">
                            <label :for="item2.pageCode" class="ps-2">{{item2.pageCode}}-{{item2.pageName}}</label>
                          </div>
                        </th>
                        <td><input @change="$custom.permission.checkUsable(item)" v-model="item2.usable" value="view" class="form-check-input" type="checkbox" v-if="item2.default.includes('view')"></td>
                        <td><input @change="$custom.permission.checkUsable(item)" v-model="item2.usable" value="insert" class="form-check-input" type="checkbox" v-if="item2.default.includes('insert')"></td>
                        <td><input @change="$custom.permission.checkUsable(item)" v-model="item2.usable" value="modify" class="form-check-input" type="checkbox" v-if="item2.default.includes('modify')"></td>
                        <td><input @change="$custom.permission.checkUsable(item)" v-model="item2.usable" value="execute" class="form-check-input" type="checkbox" v-if="item2.default.includes('execute')"></td>
                        <td><input @change="$custom.permission.checkUsable(item)" v-model="item2.usable" value="download" class="form-check-input" type="checkbox" v-if="item2.default.includes('download')"></td>
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
                      <th scope="col" width="35%"></th>
                      <th scope="col">
                        <span data-bs-toggle="tooltip" data-bs-placement="bottom" title="查詢、檢視等">查詢</span>
                      </th>
                      <th scope="col">
                        <span data-bs-toggle="tooltip" data-bs-placement="bottom" title="新增">新增</span>
                      </th>
                      <th scope="col">
                        <span data-bs-toggle="tooltip" data-bs-placement="bottom" title="修改、編輯等">修改</span>
                      </th>
                      <th scope="col">
                        <span data-bs-toggle="tooltip" data-bs-placement="bottom" title="上傳、送出、取消等">執行</span>
                      </th>
                      <th scope="col">
                        <span data-bs-toggle="tooltip" data-bs-placement="bottom" title="下載">下載</span>
                      </th>
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
                      <th scope="col" width="35%"></th>
                      <th scope="col">
                        <span data-bs-toggle="tooltip" data-bs-placement="bottom" title="查詢、檢視等">查詢</span>
                      </th>
                      <th scope="col">
                        <span data-bs-toggle="tooltip" data-bs-placement="bottom" title="新增">新增</span>
                      </th>
                      <th scope="col">
                        <span data-bs-toggle="tooltip" data-bs-placement="bottom" title="修改、編輯等">修改</span>
                      </th>
                      <th scope="col">
                        <span data-bs-toggle="tooltip" data-bs-placement="bottom" title="上傳、送出、取消等">執行</span>
                      </th>
                      <th scope="col">
                        <span data-bs-toggle="tooltip" data-bs-placement="bottom" title="下載">下載</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <template v-for="item in defaultPermission" :key="item.code">
                      <tr>
                        <th class="text-start">
                          <div class="d-flex align-items-center">
                            <input @change="$custom.permission.checkPermission(item)" v-model="item.checked" class="form-check-input" type="checkbox" :id="item.code">
                            <label :for="item.code" class="fs-5 ps-2">{{item.code}}-{{item.name}}</label>
                          </div>
                        </th>
                      </tr>
                      <tr v-for="item2 in item.function" :key="item2.pageCode">
                        <th class="text-start">
                          <div class="form-check d-flex align-items-center ms-3">
                            <input @change="$custom.permission.checkPage(item2)" v-model="item2.checked" class="form-check-input" type="checkbox" :id="item2.pageCode">
                            <label :for="item2.pageCode" class="form-check-label ps-2">{{item2.pageCode}}-{{item2.pageName}}</label>
                          </div>
                        </th>
                        <td><input @change="$custom.permission.checkUsable(item)" v-model="item2.usable" value="view" class="form-check-input" type="checkbox" v-if="item2.default.includes('view')"></td>
                        <td><input @change="$custom.permission.checkUsable(item)" v-model="item2.usable" value="insert" class="form-check-input" type="checkbox" v-if="item2.default.includes('insert')"></td>
                        <td><input @change="$custom.permission.checkUsable(item)" v-model="item2.usable" value="modify" class="form-check-input" type="checkbox" v-if="item2.default.includes('modify')"></td>
                        <td><input @change="$custom.permission.checkUsable(item)" v-model="item2.usable" value="execute" class="form-check-input" type="checkbox" v-if="item2.default.includes('execute')"></td>
                        <td><input @change="$custom.permission.checkUsable(item)" v-model="item2.usable" value="download" class="form-check-input" type="checkbox" v-if="item2.default.includes('download')"></td>
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
import service from '@/services/F/F2.service.js'
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
      viewForm: {},
      editModal: '',
      editForm: {},
      viewModal: '',
      defaultPermission: [],
      tooltipList: []
    }
  },
  methods: {
    // ? 取得 MainData 元件分頁資訊
    getPageInfo (PageInfo) {
      this.GroupDataPost = PageInfo
      this.getData()
    },
    async getData () {
      this.$store.commit('changeLoading', true)
      const result = await service.getGroupData(this.GroupDataPost)
      this.pageData = result.pageInfo // ? 傳送分頁資訊
      this.gridData = result.groupList
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
    async viewAuth (item) {
      this.viewForm = {
        groupNo: item.groupNo,
        groupName: item.groupName,
        description: item.description
      }
      this.defaultPermission = await this.$custom.permission.defaultPermissionUIprocess(item, 'F2')
      this.viewModal.show()
    },
    async openEditModal (item) {
      this.editForm = {
        groupNo: JSON.parse(JSON.stringify(item.groupNo)),
        groupName: JSON.parse(JSON.stringify(item.groupName)),
        description: JSON.parse(JSON.stringify(item.description))
      }
      this.defaultPermission = await this.$custom.permission.defaultPermissionUIprocess(item, 'F2')
      this.editModal.show()
    },
    async addGroup () {
      this.$store.commit('changeLoading', true)
      // ? 只帶入有勾選的權限
      let permissions = JSON.parse(JSON.stringify(this.defaultPermission))
      permissions.forEach((item1) => {
        item1.function = item1.function.filter(item2 => item2.usable.length !== 0)
      })
      permissions = permissions.filter(item => item.function.length !== 0)
      // ? 只帶入有勾選的權限 end
      const postData = {
        ...this.addForm,
        permissions: permissions
      }
      const result = await service.addGroup(postData)
      this.$store.commit('changeLoading', false)
      if (result) {
        this.addForm = {}
        this.addModal.hide()
        this.getData()
      }
    },
    async editGroup () {
      this.$store.commit('changeLoading', true)
      // ? 只帶入有勾選的權限
      let permissions = JSON.parse(JSON.stringify(this.defaultPermission))
      permissions.forEach((item1) => {
        item1.function = item1.function.filter(item2 => item2.usable.length !== 0)
      })
      permissions = permissions.filter(item => item.function.length !== 0)
      // ? 只帶入有勾選的權限 end
      const postData = {
        ...this.editForm,
        permissions: permissions
      }
      const result = await service.editGroup(postData)
      this.$store.commit('changeLoading', false)
      if (result) {
        this.editModal.hide()
        this.getData()
      }
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
            ...item
          }
          const result = await service.removeGroup(postData)
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
      a.download = '所有群組.xlsx'
      a.click()
      // 清除暫存
      a.href = ''
      window.URL.revokeObjectURL(url)
    }
  },
  mounted () {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    this.tooltipList = tooltipTriggerList.map(tooltipTriggerEl => {
      return (new this.$custom.bootstrap.Tooltip(tooltipTriggerEl))
    })
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
