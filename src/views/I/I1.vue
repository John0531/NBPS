<template>
  <div>
    <div class="row justify-content-center">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h2 class="fw-bold mb-3">系統批次停機作業</h2>
            <h6>供網通經辦查詢系統批次執行與否，與預告停止系統批次(非立即停止而是預告系統不再執行批次)</h6>
          </div>
        </div>
        <MainData :Page="serverPageData" @ChangePageInfo="getServerPageInfo" @updatePageInfo="getServerPageInfo">
          <template #default>
            <thead>
              <tr>
                <th scope="col">伺服器名稱</th>
                <th scope="col">IP</th>
                <th scope="col">批次停機狀態</th>
                <th scope="col">批次停機</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in serverGridData" :key="item.userName">
                <th scope="row">{{item.hostName}}</th>
                <td>{{item.ip}}</td>
                <td>
                  <span v-if="item.button==='ON'">啟動</span>
                  <span v-if="item.button==='OFF'">暫停</span>
                </td>
                <td>
                  <button v-if="item.button==='OFF'" @click="switchStatus(item)" class="btn btn-success me-2 btn-sm" :disabled="!$store.state.pageBtnPermission.includes('execute')">啟用</button>
                  <button v-if="item.button==='ON'" @click="switchStatus(item)" class="btn btn-danger me-2 btn-sm" :disabled="!$store.state.pageBtnPermission.includes('execute')">暫停</button>
                </td>
              </tr>
            </tbody>
          </template>
        </MainData>
        <MainData :Page="batchPageData" @ChangePageInfo="getBatchPageInfo" @updatePageInfo="getBatchPageInfo">
          <template #default>
            <thead>
              <tr>
                <th scope="col">批次名稱</th>
                <th scope="col">伺服器名稱</th>
                <th scope="col">IP</th>
                <th scope="col">批次處理狀態</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in batchGridData" :key="item.id">
                <th scope="row">{{item.jobName}}</th>
                <td>{{item.hostName}}</td>
                <td>{{item.ip}}</td>
                <td>
                  <span v-if="item.status==='PROCESS'">執行中</span>
                  <span v-if="item.status==='FINISH'">結束</span>
                </td>
              </tr>
            </tbody>
          </template>
        </MainData>
      </div>
    </div>
  </div>
</template>

<script>
import service from '@/services/I/I1.service.js'
import MainData from '@/components/MainData.vue'

export default {
  components: {
    MainData
  },
  data () {
    return {
      ServerDataPost: {
        page: 1,
        pageSize: 10
      },
      serverPageData: {}, // ?分頁資訊
      serverGridData: [],
      BatchDataPost: {
        page: 1,
        pageSize: 10
      },
      batchPageData: {}, // ?分頁資訊
      batchGridData: []
    }
  },
  methods: {
    // ? 取得 MainData 元件 server 分頁資訊
    getServerPageInfo (PageInfo) {
      this.ServerDataPost = PageInfo
      this.getServerData()
    },
    // ? 取得 MainData 元件 batch 分頁資訊
    getBatchPageInfo (PageInfo) {
      this.BatchDataPost = PageInfo
      this.getBatchData()
    },
    async getServerData () {
      this.$store.commit('changeLoading', true)
      const result = await service.getHostServer(this.ServerDataPost)
      this.$store.commit('changeLoading', false)
      this.serverPageData = result.pageInfo // ? 傳送分頁資訊
      this.serverGridData = result.switchList
    },
    async getBatchData () {
      this.$store.commit('changeLoading', true)
      const result = await service.getBatchHost(this.BatchDataPost)
      this.$store.commit('changeLoading', false)
      this.batchPageData = result.pageInfo // ? 傳送分頁資訊
      this.batchGridData = result.jobLogList
    },
    async switchStatus (item) {
      this.$store.commit('changeLoading', true)
      const result = await service.switchHostStatus({
        hostname: item.hostName,
        ip: item.ip
      })
      this.$store.commit('changeLoading', false)
      if (result) {
        this.getServerData()
      }
    }
  }
}
</script>
