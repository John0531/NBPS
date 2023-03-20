<template>
  <div>
    <div class="row justify-content-center">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h2 class="fw-bold mb-3">帳號解鎖</h2>
            <h6>供經辦解鎖錯誤超過N次而被鎖之帳號(僅限非AD使用者帳號)</h6>
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
                <td><span v-if="item.isAd">是</span><span v-else>否</span></td>
                <td>{{item.groupName}}</td>
                <td>{{item.description}}</td>
                <td>
                  <button @click="openEditModal(item)" class="btn btn-success me-2 btn-sm" :disabled="!$store.state.pageBtnPermission.includes('modify')">解鎖</button>
                </td>
              </tr>
            </tbody>
          </template>
        </MainData>
      </div>
    </div>

    <!-- 解鎖 Modal -->
    <div class="modal fade" ref="editModal" tabindex="-1" aria-labelledby="editModal" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-success">
            <h5 class="modal-title text-white">解鎖帳號</h5>
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
              </div>
              <div class="d-flex justify-content-end">
                <button class="btn btn-success px-4">解鎖</button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import service from '@/services/F/F3.service.js'
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
    async getData () {
      this.$store.commit('changeLoading', true)
      const result = await service.getAccountData(this.GroupDataPost)
      this.$store.commit('changeLoading', false)
      this.pageData = result.pageInfo // ? 傳送分頁資訊
      this.gridData = result.users
    },
    openEditModal (item) {
      this.editForm = JSON.parse(JSON.stringify(item))
      this.editForm.pd = 'UBot123456!'
      this.editForm.groupList = this.defaultUserInfo.groupList
      this.editModal.show()
    },
    async editAccount () {
      this.$store.commit('changeLoading', true)
      const postData = JSON.parse(JSON.stringify(this.editForm))
      const result = await service.editAccount(postData)
      this.$store.commit('changeLoading', false)
      if (result) {
        this.editModal.hide()
        this.getData()
      }
    }
  },
  mounted () {
    this.editModal = new this.$custom.bootstrap.Modal(this.$refs.editModal, { backdrop: 'static' })
  }
}
</script>
