<template>
  <div>
    <div class="row justify-content-center">
      <div class="col-12">
        <div class="card">
          <div class="card-header bg-secondary text-white">
            <h3>帳號維護</h3>
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
            <button class="btn btn-warning me-3 px-4" @click="addModal.show()">新增帳號</button>
            <button class="btn btn-primary me-3 px-4">匯出帳號excel</button>
          </div>
        </div>
        <div ref="grid" class="mt-5"></div>
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
                    v-model="addForm.account"
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
                  <input type="text" class="form-control" id="type" value="特店使用" disabled>
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
                <label for="isAD" class="col-sm-2 col-form-label">是否為AD使用者</label>
                <div class="col-sm-10 d-flex align-items-center">
                  <div class="form-check form-check-inline">
                    <Field
                      rules="required"
                      :class="{ 'is-invalid': errors['是否為AD使用者'] }"
                      v-model="addForm.isAD"
                      :value="1"
                      class="form-check-input"
                      type="radio"
                      name="是否為AD使用者"
                      id="isAD1"
                    />
                    <label class="form-check-label" for="isAD1">是</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <Field
                      rules="required"
                      :class="{ 'is-invalid': errors['是否為AD使用者'] }"
                      v-model="addForm.isAD"
                      :value="0"
                      class="form-check-input"
                      type="radio"
                      name="是否為AD使用者"
                      id="isAD2"
                    />
                    <label class="form-check-label" for="isAD2">否</label>
                  </div>
                  <ErrorMessage
                    name="是否為AD使用者"
                    class="text-danger"
                    style="font-size:0.875em"
                  />
                </div>
              </div>
              <div class="row mb-3" v-if="addForm.isAD===0">
                <label for="pwd" class="col-sm-2 col-form-label">密碼</label>
                <div class="col-sm-7">
                  <Field
                    type="text"
                    class="form-control"
                    id="pwd"
                    :rules="$custom.validate.CheckPwd"
                    :class="{ 'is-invalid': errors['密碼'] }"
                    name="密碼"
                    v-model="addForm.pwd"
                  />
                  <ErrorMessage
                    name="密碼"
                    class="invalid-feedback"
                  />
                </div>
                <div class="col-sm-3">
                  <button @click.prevent="addForm.pwd='UBot123456!'" class="btn btn-primary">設為預設密碼</button>
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
                    v-model="addForm.group"
                  >
                    <option value="" selected>請選擇</option>
                    <option value="1">MERCH_1(特店群組1)</option>
                    <option value="2">MERCH_2(特店群組2)</option>
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
                  <textarea v-model="addForm.desc" class="form-control" id="desc" rows="3"></textarea>
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

    <!-- 檢視明細 Modal -->
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
                    v-model="editForm.account"
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
                  <input type="text" class="form-control" id="type" value="特店使用" disabled>
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
                <label for="isAD" class="col-sm-2 col-form-label">是否為AD使用者</label>
                <div class="col-sm-10 d-flex align-items-center">
                  <div class="form-check form-check-inline">
                    <Field
                      rules="required"
                      :class="{ 'is-invalid': errors['是否為AD使用者'] }"
                      v-model="editForm.isAD"
                      :value="1"
                      class="form-check-input"
                      type="radio"
                      name="是否為AD使用者"
                      id="isAD1"
                    />
                    <label class="form-check-label" for="isAD1">是</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <Field
                      rules="required"
                      :class="{ 'is-invalid': errors['是否為AD使用者'] }"
                      v-model="editForm.isAD"
                      :value="0"
                      class="form-check-input"
                      type="radio"
                      name="是否為AD使用者"
                      id="isAD2"
                    />
                    <label class="form-check-label" for="isAD2">否</label>
                  </div>
                  <ErrorMessage
                    name="是否為AD使用者"
                    class="text-danger"
                    style="font-size:0.875em"
                  />
                </div>
              </div>
              <div class="row mb-3" v-if="addForm.isAD===0">
                <label for="pwd" class="col-sm-2 col-form-label">密碼</label>
                <div class="col-sm-7">
                  <Field
                    type="text"
                    class="form-control"
                    id="pwd"
                    :rules="$custom.validate.CheckPwd"
                    :class="{ 'is-invalid': errors['密碼'] }"
                    name="密碼"
                    v-model="editForm.pwd"
                  />
                  <ErrorMessage
                    name="密碼"
                    class="invalid-feedback"
                  />
                </div>
                <div class="col-sm-3">
                  <button @click.prevent="addForm.pwd='UBot123456!'" class="btn btn-primary">設為預設密碼</button>
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
                    v-model="editForm.group"
                  >
                    <option value="" selected>請選擇</option>
                    <option value="1">MERCH_1(特店群組1)</option>
                    <option value="2">MERCH_2(特店群組2)</option>
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
                  <textarea v-model="editForm.desc" class="form-control" id="desc" rows="3"></textarea>
                </div>
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
            name: '帳號',
            id: 'id'
          },
          {
            name: '類別',
            id: 'name'
          },
          {
            name: '名稱',
            id: 'name'
          },
          {
            name: '是否為AD使用者',
            id: 'name'
          },
          {
            name: '群組',
            id: 'name'
          },
          {
            name: '簡述',
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
    addAccount () {
      console.log(123)
      this.addForm = {}
      this.addModal.hide()
    },
    editAccount () {

    },
    sendEmail () {
      this.$swal.fire({
        title: 'Email 已成功寄出!',
        icon: 'success'
      })
    }
  },
  mounted () {
    this.getData()
    this.addModal = new this.$custom.bootstrap.Modal(this.$refs.addModal, { backdrop: 'static' })
    this.editModal = new this.$custom.bootstrap.Modal(this.$refs.editModal, { backdrop: 'static' })
  }
}
</script>
