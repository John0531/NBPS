<template>
  <div>
    <div class="row justify-content-center">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h2 class="fw-bold mb-3">交易限流閥設定</h2>
            <h6>供網通經辦查詢/設定送往COSES交易之限流閥</h6>
            <h6><span class="fw-bold">交易時間範圍：</span> 以過去多少時間做為比對的區間。</h6>
            <h6><span class="fw-bold">交易間隔：</span> 單一通道每打完一筆須等多久才能再打下一筆。</h6>
            <h6><span class="fw-bold">交易平均時間標準差：</span> 單次交易的標準差設定，高於此設定則降速(最低為1);若低於此設定則提速(最高為該特店設定的 tid*10)。</h6>
          </div>
        </div>
        <MainData ref="ValveMainData" :Page="PageData" @ChangePageInfo="getPageInfo">
          <template #default>
            <thead>
              <tr>
                <th scope="col">設定名稱</th>
                <th scope="col">交易時間範圍(min)</th>
                <th scope="col">交易間隔(ms)</th>
                <th scope="col">交易平均時間標準差</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in ValveData.gridData" :key="item.id">
                <th scope="row">{{item.name}}</th>
                <td>{{item.minutes}}</td>
                <td>{{item.valveTime}}</td>
                <td>{{item.valveStanderd}}</td>
                <td>
                  <button @click="openEditModal(item)" class="btn btn-success me-2 btn-sm" :disabled="!$store.state.pageBtnPermission.includes('modify')">修改</button>
                </td>
              </tr>
            </tbody>
          </template>
        </MainData>
      </div>
    </div>

    <!-- 交易限流閥設定 Modal -->
    <div class="modal fade" ref="editModal" tabindex="-1" aria-labelledby="editModal" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-success">
            <h5 class="modal-title text-white">交易限流閥設定</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <Form
              v-slot="{ errors }"
              @submit="editValve"
            >
              <div class="row mb-3">
                <label for="name" class="col-sm-2 col-form-label">設定名稱</label>
                <div class="col-sm-10">
                  <Field
                    name="設定名稱"
                    type="text"
                    class="form-control"
                    rules="required"
                    :class="{ 'is-invalid': errors['設定名稱'] }"
                    id="name"
                    v-model="editForm.name"
                    disabled
                  />
                  <ErrorMessage
                    name="設定名稱"
                    class="invalid-feedback"
                  />
                </div>
              </div>
              <div class="row mb-3">
                <label for="minutes" class="col-sm-2 col-form-label">交易時間範圍(min)</label>
                <div class="col-sm-10">
                  <Field
                    name="交易時間範圍(min)"
                    type="number"
                    class="form-control"
                    rules="required"
                    :class="{ 'is-invalid': errors['交易時間範圍(min)'] }"
                    id="minutes"
                    v-model="editForm.minutes"
                  />
                  <ErrorMessage
                    name="交易時間範圍(min)"
                    class="invalid-feedback"
                  />
                </div>
              </div>
              <div class="row mb-3">
                <label for="valvetime" class="col-sm-2 col-form-label">交易間隔(ms)</label>
                <div class="col-sm-10">
                  <Field
                    name="交易間隔(ms)"
                    type="number"
                    class="form-control"
                    rules="required"
                    :class="{ 'is-invalid': errors['交易間隔(ms)'] }"
                    id="valvetime"
                    v-model="editForm.valvetime"
                  />
                  <ErrorMessage
                    name="交易間隔(ms)"
                    class="invalid-feedback"
                  />
                </div>
              </div>
              <div class="row mb-3">
                <label for="valveStanderd" class="col-sm-2 col-form-label">交易平均時間標準差</label>
                <div class="col-sm-10">
                  <Field
                    name="交易平均時間標準差"
                    type="number"
                    class="form-control"
                    rules="required"
                    :class="{ 'is-invalid': errors['交易平均時間標準差'] }"
                    id="valveStanderd"
                    v-model="editForm.valveStanderd"
                  />
                  <ErrorMessage
                    name="交易平均時間標準差"
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
import service from '@/services/I/I2.service.js'
import MainData from '@/components/MainData.vue'

export default {
  components: {
    MainData
  },
  data () {
    return {
      PageData: {}, // ?分頁資訊
      ValveData: {
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
        totalElements: this.ValveData.originData.length,
        currentPage: PageInfo.page,
        totalPages: Math.ceil(this.ValveData.originData.length / PageInfo.pageSize)
      }
      // * 前端取得分頁資料(不打api)
      this.ValveData.gridData = this.ValveData.originData.slice((PageInfo.page - 1) * PageInfo.pageSize, PageInfo.page * PageInfo.pageSize)
    },
    async getData () {
      this.$store.commit('changeLoading', true)
      const result = await service.getData()
      this.$store.commit('changeLoading', false)
      if (result) {
        // * 傳送分頁資訊(僅第一次打api取得所有資料)
        this.PageData = {
          totalElements: result.valveList.length,
          currentPage: 1,
          totalPages: Math.ceil(result.valveList.length / 10)
        }
        this.ValveData.originData = result.valveList
        this.ValveData.gridData = this.ValveData.originData.slice(0, 10)
        // * 傳送分頁資訊(僅第一次打api取得所有資料) end
        // * 將每頁資料數初始化
        this.$refs.ValveMainData.PageInfo.pageSize = 10
      }
    },
    openEditModal (item) {
      this.editForm = {
        name: JSON.parse(JSON.stringify(item.name)),
        minutes: JSON.parse(JSON.stringify(item.minutes)),
        valvetime: JSON.parse(JSON.stringify(item.valveTime)),
        valveStanderd: JSON.parse(JSON.stringify(item.valveStanderd))
      }
      this.editModal.show()
    },
    async editValve () {
      this.$store.commit('changeLoading', true)
      const result = await service.editValve(this.editForm)
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
