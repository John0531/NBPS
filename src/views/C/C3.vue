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
            <button class="btn btn-warning me-3 px-4" @click="addModal.show()">新增群組</button>
            <button class="btn btn-primary me-3 px-4">匯出群組Excel</button>
          </div>
        </div>
        <div ref="grid" class="mt-5"></div>
      </div>
    </div>

    <!-- 新增 Modal -->
    <div class="modal fade" ref="addModal" tabindex="-1" aria-labelledby="editModal" aria-hidden="true">
      <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-warning">
            <h5 class="modal-title text-dark">新增特店群組權限</h5>
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
              <table class="table table-borderless text-center">
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
                  <template v-for="n in 5" :key="n">
                    <tr>
                      <th class="text-start">
                        <div class="d-flex align-items-center">
                          <input class="form-check-input" type="checkbox" id="B">
                          <label for="B" class="fs-5 ps-2">B-特店端作業</label>
                        </div>
                      </th>
                    </tr>
                    <tr v-for="m in 4" :key="m">
                      <th class="text-start">
                        <div class="d-flex align-items-center ms-3">
                          <input class="form-check-input" type="checkbox" id="B1">
                          <label for="B1" class="ps-2">B1-批次交易檔上傳作業</label>
                        </div>
                      </th>
                      <td><input class="form-check-input" type="checkbox"></td>
                      <td><input class="form-check-input" type="checkbox"></td>
                      <td></td>
                      <td></td>
                      <td><input class="form-check-input" type="checkbox"></td>
                    </tr>
                  </template>
                </tbody>
              </table>
              <div class="d-flex justify-content-end">
                <button class="btn btn-warning px-4">新增</button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>

    <!-- 檢視明細 Modal -->
    <div class="modal fade" ref="editModal" tabindex="-1" aria-labelledby="editModal" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-success">
            <h5 class="modal-title text-white">檢視與編輯</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      gridData: [],
      addModal: '',
      addForm: {},
      editModal: '',
      editForm: {}
    }
  },
  methods: {
    async getData () {
      this.$store.commit('changeLoading', true)
      const url = 'https://mocki.io/v1/f30e8467-7fad-48ba-bfd8-ca569d924a5e'
      const res = await this.axios.get(url)
      this.$store.commit('changeLoading', false)
      this.gridData = res.data
      this.buildGrid()
    },
    buildGrid () {
      this.$refs.grid.innerHTML = ''
      const grid = new this.$grid.Grid({
        columns: [
          {
            name: '群組代號',
            id: 'id'
          },
          {
            name: '群組名稱',
            id: 'name'
          },
          {
            name: '簡述',
            id: 'name'
          },
          {
            name: '是否為AD使用者',
            id: 'name'
          },
          {
            name: '權限',
            id: 'name'
          },
          {
            name: '執行',
            formatter: (cell, row) => {
              const buttons = []
              buttons.push(
                this.$grid.h('button', {
                  className: 'btn btn-success mr-3 btn-sm',
                  onClick: () => {
                    this.editModal.show()
                  }
                }, '檢視與編輯')
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
    addGroup () {
      console.log(123)
      this.addForm = {}
      this.addModal.hide()
    },
    editGroup () {

    }
  },
  mounted () {
    this.getData()
    this.addModal = new this.$custom.bootstrap.Modal(this.$refs.addModal, { backdrop: 'static' })
    this.editModal = new this.$custom.bootstrap.Modal(this.$refs.editModal, { backdrop: 'static' })
  }
}
</script>

<style  scoped>
.form-check-input{
  width:1.5rem;
  height:1.5rem;
  margin-top: 0;
}
</style>
