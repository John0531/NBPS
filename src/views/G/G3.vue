<template>
  <div>
    <div class="row justify-content-center">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h2 class="fw-bold mb-3">批次交易查詢作業</h2>
            <h6>供發卡業務經辦查詢批次交易進度</h6>
          </div>
          <div class="card-body">
            <div class="row py-3">
              <div class="col-xxl-8 d-flex mb-4">
                <h5 class="text-nowrap me-3" style="padding-top:0.375rem;">確認送出日期:</h5>
                <div class="input-group">
                  <span class="input-group-text" id="basic-addon1">起日</span>
                  <Datepicker auto-apply enable-seconds v-model="searchForm.startDate" model-type="yyyy-MM-dd HH:mm:ss" format="yyyy/MM/dd HH:mm:ss"></Datepicker>
                </div>
                <div class="input-group">
                  <span class="input-group-text" id="basic-addon1">迄日</span>
                  <Datepicker auto-apply enable-seconds v-model="searchForm.endDate" model-type="yyyy-MM-dd HH:mm:ss" format="yyyy/MM/dd HH:mm:ss"></Datepicker>
                </div>
              </div>
              <div class="col-xxl-4"></div>
              <div class="col-xxl-5 d-flex mb-4">
                <h5 class="text-nowrap me-3" style="padding-top:0.375rem;">卡號:</h5>
                <input v-model="searchForm.pan" type="text" class="form-control">
              </div>
              <div class="col-xxl-7"></div>
            </div>
            <button @click="getData" class="btn btn-primary me-3 px-4" :disabled="!$store.state.pageBtnPermission.includes('view')">搜尋</button>
          </div>
        </div>
        <MainData :Page="pageData" @ChangePageInfo="getPageInfo" @updatePageInfo="getPageInfo">
          <template #default>
            <thead>
              <tr>
                <th scope="col">上傳批次交易檔名</th>
                <th scope="col">確認送出時間</th>
                <th scope="col">作業類型</th>
                <th scope="col">卡號</th>
                <th scope="col">金額</th>
                <th scope="col">回應碼</th>
                <th scope="col">授權碼</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item,index) in gridData" :key="item.fileName+index">
                <th scope="row">{{item.fileName}}</th>
                <td>{{item.submitTime}}</td>
                <td>
                  <span v-if="item.storeType==='ACQUIRING'">收單</span>
                  <span v-if="item.storeType==='PUBLIC_UTILITIES'">公共事業</span>
                  <span v-if="item.storeType==='MAIL_ORDER'">郵購</span>
                  <span v-if="item.storeType==='ISSUE_CARD'">發卡新消貸</span>
                </td>
                <td>{{item.pan}}</td>
                <td>{{$custom.currency(item.amt)}}</td>
                <td>{{item.codeH}}</td>
                <td>{{item.authCode}}</td>
              </tr>
            </tbody>
          </template>
        </MainData>
      </div>
    </div>
  </div>
</template>

<script>
import service from '@/services/G/G3.service.js'
import MainData from '@/components/MainData.vue'

export default {
  components: {
    MainData
  },
  data () {
    return {
      pageData: {}, // ?分頁資訊
      searchForm: {
        startDate: `${this.$custom.moment().format('YYYY-MM-DD')} 00:00:00`,
        endDate: `${this.$custom.moment().format('YYYY-MM-DD')} 23:59:59`
      },
      gridData: []
    }
  },
  methods: {
    // ? 取得 MainData 元件分頁資訊
    getPageInfo (PageInfo) {
      this.searchForm.page = PageInfo.page
      this.searchForm.pageSize = PageInfo.pageSize
      this.getData()
    },
    async getData () {
      if (this.searchForm.trxType === '') {
        this.searchForm.trxType = null
      }
      this.$store.commit('changeLoading', true)
      const result = await service.getTxnAuth(this.searchForm)
      this.$store.commit('changeLoading', false)
      this.pageData = result.pageInfo // ? 傳送分頁資訊
      this.gridData = result.txnAuthList
    }
  }
}
</script>
