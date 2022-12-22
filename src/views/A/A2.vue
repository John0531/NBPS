<template>
  <div>
    <div class="row justify-content-center">
      <div class="col-12">
        <div class="card">
          <div class="card-header bg-secondary text-white">
            <h3>批次交易查詢作業</h3>
            <h6>供帳務科經辦依起訖日、特店查詢批次交易結果</h6>
          </div>
          <div class="card-body">
            <div class="row py-3">
              <div class="col-xxl-8 d-flex mb-4">
                <h5 class="text-nowrap me-3" style="padding-top:0.375rem;">確認送出日期:</h5>
                <Datepicker class="w-xxl-50 w-100" v-model="date" range auto-apply multi-calendars multi-calendars-solo model-type="yyyy.MM.dd HH:mm" format="yyyy/MM/dd HH:mm"></Datepicker>
              </div>
              <div class="col-xxl-4"></div>
              <div class="col-xxl-5 d-flex mb-4">
                <h5 class="text-nowrap me-3" style="padding-top:0.375rem;">交易處理狀態:</h5>
                <select class="form-select">
                  <option selected>請選擇</option>
                  <option value="1">交易處理中</option>
                  <option value="2">交易處理完成</option>
                  <option value="3">交易處理完成但有異常</option>
                </select>
              </div>
              <div class="col-xxl-5 d-flex mb-4">
                <h5 class="text-nowrap me-3" style="padding-top:0.375rem;">特店代碼:</h5>
                <input type="text" class="form-control" placeholder="">
              </div>
            </div>
            <button class="btn btn-primary me-3 px-4">搜尋</button>
          </div>
        </div>
        <div ref="grid" class="mt-5"></div>
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
            <h5>檔名: </h5>
            <h5>特店名稱: </h5>
            <div ref="detailGrid" class="mt-3"></div>
            <div class="mt-3 d-flex justify-content-center">
              <table class="table table-borderless" style="width:auto;font-size:18px;">
                <thead class="text-center table-success">
                  <tr>
                    <th></th>
                    <td>授權</td>
                    <td>退貨</td>
                    <td>銷售</td>
                    <td>交易補登請款</td>
                    <td>取消授權</td>
                    <td>取消退貨</td>
                    <td>取消銷售</td>
                  </tr>
                </thead>
                <tbody class="text-center">
                  <tr>
                    <th>交易總筆數 200 = </th>
                    <td>0 +</td>
                    <td>2 +</td>
                    <td>198 +</td>
                    <td>0 +</td>
                    <td>0 +</td>
                    <td>0 +</td>
                    <td>0</td>
                  </tr>
                  <tr>
                    <th>交易總金額 196,000 = </th>
                    <td>0 +</td>
                    <td><span class="text-danger">(2000)</span> +</td>
                    <td>198,000 +</td>
                    <td>0 +</td>
                    <td>0 +</td>
                    <td>0 +</td>
                    <td>0</td>
                  </tr>
                  <tr>
                    <th>交易核准筆數 199 = </th>
                    <td>0 +</td>
                    <td>2 +</td>
                    <td>197 +</td>
                    <td>0 +</td>
                    <td>0 +</td>
                    <td>0 +</td>
                    <td>0</td>
                  </tr>
                  <tr>
                    <th>交易核准金額 195,000 = </th>
                    <td>0 +</td>
                    <td><span class="text-danger">(2000)</span> +</td>
                    <td>197,000 +</td>
                    <td>0 +</td>
                    <td>0 +</td>
                    <td>0 +</td>
                    <td>0</td>
                  </tr>
                  <tr>
                    <th>交易拒絕筆數 1 = </th>
                    <td>0 +</td>
                    <td>0 +</td>
                    <td>1 +</td>
                    <td>0 +</td>
                    <td>0 +</td>
                    <td>0 +</td>
                    <td>0</td>
                  </tr>
                  <tr>
                    <th>交易拒絕金額 2000 = </th>
                    <td>0 +</td>
                    <td>0 +</td>
                    <td>2000 +</td>
                    <td>0 +</td>
                    <td>0 +</td>
                    <td>0 +</td>
                    <td>0</td>
                  </tr>
                </tbody>
              </table>
            </div>
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

export default {
  data () {
    return {
      date: '',
      gridData: [],
      detailModal: '',
      detailData: {
        fileName: '',
        shopName: '',
        gridData: []
      }
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
            name: '特店代碼',
            id: 'id'
          },
          {
            name: '特店名稱',
            id: 'name'
          },
          {
            name: '上傳批次交易檔名',
            id: 'fileName'
          },
          {
            name: '確認送出時間',
            id: 'submitTime'
          },
          {
            name: '批次處理狀態',
            id: 'batchStatus'
          },
          {
            name: '交易處理狀態',
            id: 'tradeStatus'
          },
          {
            name: '總筆數',
            id: 'totalNum'
          },
          {
            name: '總金額',
            id: 'totalAmount'
          },
          {
            name: '執行',
            formatter: (cell, row) => {
              const buttons = []
              buttons.push(
                this.$grid.h('button', {
                  className: 'btn btn-success mr-3 btn-sm',
                  onClick: () => {
                    this.getDetail(row.cells)
                  }
                }, '檢視明細')
              )
              buttons.push(
                this.$grid.h('button', {
                  className: 'btn btn-primary mr-3 btn-sm',
                  onClick: () => {
                    // this.getDetail()
                  }
                }, '下載回覆檔')
              )
              buttons.push(
                this.$grid.h('button', {
                  className: 'btn btn-warning mr-3 btn-sm',
                  onClick: () => {
                    // this.getDetail()
                  }
                }, '下載總計EXCEL')
              )
              buttons.push(
                this.$grid.h('button', {
                  className: 'btn btn-danger mr-3 btn-sm',
                  onClick: () => {
                    // this.getDetail()
                  }
                }, '異常切檔')
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
    async getDetail (itemData) {
      this.$store.commit('changeLoading', true)
      const url = 'https://mocki.io/v1/d00c4cf2-caa4-48d0-98c8-4a201d2e21f2'
      const res = await this.axios.get(url)
      this.$store.commit('changeLoading', false)
      this.detailData.fileName = itemData[2].data
      this.detailData.shopName = itemData[1].data
      this.detailData.gridData = res.data
      this.buildDetailGrid()
      this.detailModal.show()
    },
    buildDetailGrid () {
      this.$refs.detailGrid.innerHTML = ''
      const grid = new this.$grid.Grid({
        columns: [
          {
            name: '卡號',
            id: 'cardId'
          },
          {
            name: '交易類別',
            id: 'tradeType'
          },
          {
            name: '金額',
            id: 'amount'
          },
          {
            name: '帳單描述',
            id: 'desc'
          },
          {
            name: '回應碼',
            id: 'rtnCode'
          },
          {
            name: '授權碼',
            id: 'authCode'
          }
        ],
        data: this.detailData.gridData,
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
      }).render(this.$refs.detailGrid)
      // 更新表格資料
      setTimeout(() => {
        grid.updateConfig({
          data: this.detailData.gridData
        }).forceRender()
      }, 100)
    }
  },
  mounted () {
    this.getData()
    this.detailModal = new this.$custom.bootstrap.Modal(this.$refs.detailModal, { backdrop: 'static' })
  }
}
</script>
