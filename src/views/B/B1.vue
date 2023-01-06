<template>
  <div>
    <div class="row justify-content-center">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h2 class="fw-bold mb-3">批次交易檔上傳作業</h2>
            <h6>供特店端上傳批次交易資料檔，上傳功能僅於營業日之作業時間開放(特店維護作業內可設定)，批次交易資料檔上傳且格式檢核成功後，按下確認並送出，系統隨開始發動交易。</h6>
            <h6>*檔名為: 商店代碼(自動帶出登入帳號所屬特店代碼)  + "." + YYYYMMDD(自動帶出今日日期) + "." + A(第一次上傳為A，第二次為B，以此類退)。上傳檔案均需依約定之密碼規則(兩碼當月月份 + 約定之加解密密碼)，以ZIP加密，若檔名或解密錯誤或總筆數及總金額不對，此檔直接剔退。</h6>
          </div>
          <div class="card-body">
            <div class="row py-3">
              <div class="col-xxl-6 d-flex mb-4">
                <input type="file" class="form-control" placeholder="" @change="getFile($event)">
              </div>
              <div class="col-xxl-6"></div>
              <div class="col-xxl-3 d-flex mb-4">
                <h5 class="text-nowrap me-3" style="padding-top:0.375rem;">總筆數:</h5>
                <input type="text" class="form-control" placeholder="">
              </div>
              <div class="col-xxl-5 d-flex mb-4">
                <h5 class="text-nowrap me-3" style="padding-top:0.375rem;">總金額(授權金額-退貨金額):</h5>
                <input type="text" class="form-control" placeholder="">
              </div>
            </div>
            <button class="btn btn-primary me-3 px-4">上傳</button>
            <button class="btn btn-warning me-3">下載範例EXCEL</button>
            <button class="btn btn-success">下載批次交易檔規格</button>
          </div>
        </div>
        <div ref="grid" class="mt-5"></div>
      </div>
    </div>

    <!-- 檢視明細 Modal -->
    <div class="modal fade" ref="detailModal" tabindex="-1" aria-labelledby="detailModal" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-success">
            <h5 class="modal-title text-white">檢視明細</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <h5>檔名: {{detailData.fileName}}</h5>
            <div ref="detailGrid" class="mt-3"></div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 檢視錯誤 Modal -->
    <div class="modal fade" ref="errorModal" tabindex="-1" aria-labelledby="errorModal" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-danger">
            <h5 class="modal-title text-white">檢視錯誤</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <h5>檔名: {{errorData.fileName}}</h5>
            <div ref="errorGrid" class="mt-3"></div>
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
      file: '',
      gridData: [],
      detailModal: '',
      detailData: {
        fileName: '',
        gridData: []
      },
      errorModal: '',
      errorData: {
        fileName: '',
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
            name: '上傳批次交易檔名',
            id: 'fileName'
          },
          {
            name: '上傳時間',
            id: 'createTime'
          },
          {
            name: '批次處理狀態', // ? 檢核中:0,成功:1,失敗:2
            id: 'status',
            formatter: (cell) => {
              if (cell === '0') {
                return this.$grid.html('<span class="text-warning fw-bold">格式檢核中</span>')
              } else if (cell === '1') {
                return this.$grid.html('<span class="text-success fw-bold">格式檢核成功</span>')
              } else if (cell === '2') {
                return this.$grid.html('<span class="text-danger fw-bold">格式檢核錯誤</span>')
              }
            }
          },
          {
            name: '總比數',
            id: 'totalNum'
          },
          {
            name: '總授權筆數',
            id: 'AuthNum'
          },
          {
            name: '總退貨筆數',
            id: 'returnNum'
          },
          {
            name: '總授權金額 A',
            id: 'AuthAmount'
          },
          {
            name: '總退貨金額 B',
            id: 'returnAmount'
          },
          {
            name: '總金額 A-B',
            id: 'totalAmount'
          },
          {
            name: '執行',
            formatter: (cell, row) => {
              const buttons = []
              if (row.cells[2].data === '1') {
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
                  }, '確認送出授權')
                )
              } else if (row.cells[2].data === '2') {
                buttons.push(
                  this.$grid.h('button', {
                    className: 'btn btn-danger mr-3 btn-sm',
                    onClick: () => {
                      this.getError(row.cells)
                    }
                  }, '檢視錯誤')
                )
              }
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
      this.detailData.fileName = itemData[0].data
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
          limit: 15,
          summary: true
        }
      }).render(this.$refs.detailGrid)
      // 更新表格資料
      setTimeout(() => {
        grid.updateConfig({
          data: this.detailData.gridData
        }).forceRender()
      }, 100)
    },
    async getError (itemData) {
      this.$store.commit('changeLoading', true)
      const url = 'https://mocki.io/v1/dcf652da-5138-45e4-8d13-6db5875ad86a'
      const res = await this.axios.get(url)
      this.$store.commit('changeLoading', false)
      this.errorData.fileName = itemData[0].data
      this.errorData.gridData = res.data
      this.buildErrorGrid()
      this.errorModal.show()
    },
    buildErrorGrid () {
      this.$refs.errorGrid.innerHTML = ''
      const grid = new this.$grid.Grid({
        columns: [
          {
            name: '筆數',
            id: 'number'
          },
          {
            name: '錯誤原因',
            id: 'desc'
          }
        ],
        data: this.errorData.gridData,
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
      }).render(this.$refs.errorGrid)
      // 更新表格資料
      setTimeout(() => {
        grid.updateConfig({
          data: this.errorData.gridData
        }).forceRender()
      }, 100)
    },
    getFile (file) {
      console.log(file)
    }
  },
  mounted () {
    this.getData()
    this.detailModal = new this.$custom.bootstrap.Modal(this.$refs.detailModal, { backdrop: 'static' })
    this.errorModal = new this.$custom.bootstrap.Modal(this.$refs.errorModal, { backdrop: 'static' })
  }
}
</script>

<style>
  .pointer {
    cursor: pointer !important;
  }
</style>
