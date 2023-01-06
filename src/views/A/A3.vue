<template>
  <div>
    <div class="row justify-content-center">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h2 class="fw-bold mb-3">批次交易取消作業</h2>
            <h6>供帳務科執行整批取消，或單筆取消，僅當日交易完成之批次才可執行取消，若原交易已跨日，請於隔日執行退貨。於營業日9點到五點半才可執行</h6>
          </div>
          <div class="card-body">
            <div class="row py-3">
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
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-success">
            <h5 class="modal-title text-white">檢視明細</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <h5>檔名: {{detailData.fileName}}</h5>
            <h5>特店名稱: {{detailData.shopName}}</h5>
            <div ref="detailGrid" class="mt-3"></div>
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
            name: '上傳時間',
            id: 'createTime'
          },
          {
            name: '交易處理狀態',
            id: 'tradeStatus'
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
            name: '授權成功金額',
            id: 'AuthAmount'
          },
          {
            name: '退貨成功金額',
            id: 'refundAmount'
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
                    this.delete(row.cells)
                  }
                }, '整批取消')
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
            name: '授權碼',
            id: 'authCode'
          },
          {
            name: '交易結果',
            id: 'tradeResult'
          },
          {
            name: '取消結果',
            formatter: (cell, row) => {
              const buttons = []
              buttons.push(
                this.$grid.h('button', {
                  className: 'btn btn-success mr-3 btn-sm',
                  onClick: () => {
                    this.delete(row.cells)
                  }
                }, '單筆取消')
              )
              return buttons
            }
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
    delete (data) {
      this.$swal.fire({
        title: '確認是否刪除?',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#4D4D4D',
        confirmButtonText: '刪除',
        cancelButtonText: '取消',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          this.$store.commit('changeLoading', true)
          // A1Service.delete(data)
            .then((result) => {
              this.$store.commit('changeLoading', false)
              if (result.isSuccess) {
                this.$swal.fire({
                  toast: true,
                  position: 'center',
                  icon: 'success',
                  title: '刪除成功！',
                  showConfirmButton: false,
                  timer: 1500,
                  width: 500,
                  background: '#F0F0F2',
                  padding: 25
                })
                setTimeout(() => {
                  this.getData()
                }, 500)
              } else {
                this.$swal.fire({
                  toast: true,
                  position: 'center',
                  icon: 'error',
                  title: '刪除失敗！',
                  showConfirmButton: false,
                  timer: 1500,
                  width: 500,
                  background: '#F0F0F2',
                  padding: 25
                })
              }
            })
        }
      })
    }
  },
  mounted () {
    this.getData()
    this.detailModal = new this.$custom.bootstrap.Modal(this.$refs.detailModal, { backdrop: 'static' })
  }
}
</script>
