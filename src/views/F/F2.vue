<template>
  <div>
    <div class="row justify-content-center">
      <div class="col-12">
        <div class="card">
          <div class="card-header bg-secondary text-white">
            <h3>群組權限維護</h3>
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
            <button class="btn btn-warning me-3 px-4" @click="openAddModal">新增群組</button>
            <button class="btn btn-primary me-3 px-4">匯出群組Excel</button>
          </div>
        </div>
        <div ref="grid" class="mt-5"></div>
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
                    v-model="addForm.code"
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
                    v-model="addForm.name"
                  />
                  <ErrorMessage
                    name="群組名稱"
                    class="invalid-feedback"
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
                    v-model="editForm.code"
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
                    v-model="editForm.name"
                    disabled
                  />
                  <ErrorMessage
                    name="群組名稱"
                    class="invalid-feedback"
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
                    v-model="editForm.code"
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
                    v-model="editForm.name"
                  />
                  <ErrorMessage
                    name="群組名稱"
                    class="invalid-feedback"
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
                <button class="btn btn-success px-4">新增</button>
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

export default {
  data () {
    return {
      gridData: [],
      addModal: '',
      addForm: {},
      editModal: '',
      editForm: {},
      viewModal: '',
      defaultPermission: []
    }
  },
  methods: {
    async getData () {
      this.$store.commit('changeLoading', true)
      this.gridData = await service.getPermissionData()
      this.gridData.forEach((item1) => {
        item1.auth = []
        item1.permission.forEach((item2) => {
          item2.function.forEach((item3) => {
            if (item3.usable.length !== 0) {
              item1.auth.push(item3.pageCode)
            }
          })
        })
        item1.auth = item1.auth.toString()
      })
      this.$store.commit('changeLoading', false)
      this.buildGrid()
    },
    buildGrid () {
      this.$refs.grid.innerHTML = ''
      const grid = new this.$grid.Grid({
        columns: [
          {
            name: '群組代號',
            id: 'groupNo'
          },
          {
            name: '群組名稱',
            id: 'groupName'
          },
          {
            name: '簡述',
            id: 'desc'
          },
          {
            name: '權限',
            id: 'auth'
          },
          {
            id: 'permission',
            hidden: true
          },
          {
            name: '執行',
            formatter: (cell, row) => {
              const buttons = []
              buttons.push(
                this.$grid.h('button', {
                  className: 'btn btn-primary mr-3 btn-sm',
                  onClick: () => {
                    this.defaultPermission = row.cells[4].data
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
                  }
                }, '檢視權限')
              )
              buttons.push(
                this.$grid.h('button', {
                  className: 'btn btn-success mr-3 btn-sm',
                  onClick: () => {
                    this.defaultPermission = row.cells[4].data
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
                  }
                }, '編輯')
              )
              buttons.push(
                this.$grid.h('button', {
                  className: 'btn btn-danger mr-3 btn-sm',
                  onClick: () => {
                    // this.editModal.show()
                  }
                }, '刪除')
              )
              return buttons
            }
          }
        ],
        data: this.gridData,
        sort: true,
        search: true,
        className: {
          table: 'table table-hover table-bordered table-striped',
          th: 'text-center',
          td: 'text-center'
        },
        style: {
          th: {
            'background-color': '#1bbbbb',
            color: '#fff'
          }
        },
        language: {
          pagination: {
            previous: '<',
            next: '>',
            showing: '顯示',
            of: '共',
            to: '到',
            results: '筆'
          },
          noRecordsFound: '查無資訊'
        },
        pagination: {
          enabled: true,
          limit: 10,
          summary: true
        }
      }).render(this.$refs.grid)
      // 更新表格資料
      setTimeout(() => {
        grid.updateConfig({
          data: this.gridData
        }).forceRender()
      }, 100)
    },
    async openAddModal () {
      this.$store.commit('changeLoading', true)
      this.defaultPermission = await service.getDefaultPermission()
      this.$store.commit('changeLoading', false)
      this.addModal.show()
    },
    addGroup () {
      this.addForm = {}
      this.addModal.hide()
    },
    editGroup () {

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
    }
  },
  mounted () {
    this.getData()
    this.addModal = new this.$custom.bootstrap.Modal(this.$refs.addModal, { backdrop: 'static' })
    this.editModal = new this.$custom.bootstrap.Modal(this.$refs.editModal, { backdrop: 'static' })
    this.viewModal = new this.$custom.bootstrap.Modal(this.$refs.viewModal, { backdrop: 'static' })
    console.log(this.$custom.uuidv4())
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
  height: 600px;
  overflow-y: scroll;
}

.group-table thead {
  position: sticky;
  top: 0;
  z-index: 1;
  background: #fff;
}

</style>
