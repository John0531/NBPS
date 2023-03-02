<template>
  <div>
    <div class="row justify-content-center">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h2 class="fw-bold mb-3">主檔異動紀錄查詢</h2>
            <h6>供帳務科經辦依起訖日、特店查詢批次交易結果</h6>
          </div>
          <div class="card-body">
            <div class="row py-3">
              <div class="col-xxl-5 d-flex mb-4">
                <h5 class="text-nowrap me-3" style="padding-top:0.375rem;">主檔名稱:</h5>
                <select class="form-select" v-model="searchForm.entityName">
                  <option selected value="">請選擇</option>
                  <option v-for="item in defaultEntity" :key="item.entityName" :value="item.entityName">{{item.name}}</option>
                </select>
              </div>
              <div class="col-xxl-7"></div>
              <div class="col-xxl-5 d-flex mb-4">
                <h5 class="text-nowrap me-3" style="padding-top:0.375rem;">KEY值:</h5>
                <input type="text" v-model="searchForm.keyValue" class="form-control" placeholder="">
              </div>
            </div>
            <button @click="getData" class="btn btn-primary me-3 px-4" :disabled="!$store.state.pageBtnPermission.includes('view')">搜尋</button>
          </div>
        </div>
        <MainData :Page="pageData" @ChangePageInfo="getPageInfo">
          <template #default>
            <thead>
              <tr>
                <th scope="col">msgId</th>
                <th scope="col">時間</th>
                <th scope="col">主檔名稱</th>
                <th scope="col">異動名稱</th>
                <th scope="col">執行帳號</th>
                <th scope="col">異動前資料</th>
                <th scope="col">異動後資料</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in gridData" :key="item.msgId">
                <th scope="row">{{item.msgId}}</th>
                <td>{{item.timestamp}}</td>
                <td>{{item.name}}</td>
                <td>{{item.typeStr}}</td>
                <td>{{item.userName}}</td>
                <td>
                  <button v-if="item.before" @click="getDetail(item,'before')" class="btn btn-success me-2 btn-sm">檢視</button>
                </td>
                <td>
                  <button v-if="item.after" @click="getDetail(item,'after')" class="btn btn-success me-2 btn-sm">檢視</button>
                </td>
              </tr>
            </tbody>
          </template>
        </MainData>
      </div>
    </div>

    <!-- 檢視明細 Modal -->
    <div class="modal fade" ref="detailModal" tabindex="-1" aria-labelledby="detailModal" aria-hidden="true">
      <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-success">
            <h5 class="modal-title text-white">檢視明細</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <h5>msgId: {{detailData.msgId}}</h5>
            <h5 v-html="detailData.content"></h5>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import service from '@/services/F/F5.service.js'
import MainData from '@/components/MainData.vue'

export default {
  components: {
    MainData
  },
  data () {
    return {
      pageData: {}, // ?分頁資訊
      searchForm: {
        page: 1,
        pageSize: 10,
        entityName: ''
      },
      defaultEntity: [],
      gridData: [],
      detailModal: '',
      detailData: {}
    }
  },
  methods: {
    // ? 取得 MainData 元件分頁資訊
    getPageInfo (PageInfo) {
      this.searchForm.page = PageInfo.page
      this.searchForm.pageSize = PageInfo.pageSize
      this.getData()
    },
    async getDefault () {
      this.$store.commit('changeLoading', true)
      const result = await service.getDefault()
      this.$store.commit('changeLoading', false)
      this.defaultEntity = result.f5DefaultEntity
    },
    async getData () {
      this.$store.commit('changeLoading', true)
      const result = await service.getData(this.searchForm)
      this.$store.commit('changeLoading', false)
      this.pageData = result.pageInfo // ? 傳送分頁資訊
      this.gridData = result.userLogList
    },
    getDetail (item, status) {
      this.detailData.msgId = item.msgId
      if (status === 'before') {
        this.detailData.content = item.before
      } else if (status === 'after') {
        this.detailData.content = item.after
      }
      this.detailData.content = this.detailData.content.replaceAll(',', ',<br>')
      this.detailModal.show()
    }
  },
  mounted () {
    this.getDefault()
    this.detailModal = new this.$custom.bootstrap.Modal(this.$refs.detailModal, { backdrop: 'static' })
  }
}
</script>
