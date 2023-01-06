<template>
  <div>
    <div class="row justify-content-center">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h2 class="fw-bold mb-3">請款對帳單</h2>
            <h6>供特店端下載每月請款總結及明細 Excel 檔，需將主機請款回覆檔回寫置資料庫後呈現</h6>
          </div>
          <div class="card-body">
            <div class="row py-3">
              <div class="col-xxl-6 d-flex mb-4">
                <h5 class="text-nowrap me-3" style="padding-top:0.375rem;">查詢方式:</h5>
                <select class="form-select" v-model="searchType">
                  <option value="" selected>請選擇</option>
                  <option value="month">依月分</option>
                  <option value="date">依日期</option>
                </select>
              </div>
              <div class="col-xxl-6"></div>
              <div class="col-xxl-6 d-flex mb-4" v-if="searchType==='month'">
                <h5 class="text-nowrap me-3" style="padding-top:0.375rem;">依月分:</h5>
                <Datepicker class="w-xxl-50 w-100" v-model="month" month-picker auto-apply format="yyyy年MM月"></Datepicker>
              </div>
              <div class="col-xxl-6 d-flex mb-4" v-if="searchType==='date'">
                <h5 class="text-nowrap me-3" style="padding-top:0.375rem;">依日期:</h5>
                <Datepicker :enable-time-picker="false" class="w-xxl-50 w-100" v-model="date" range auto-apply multi-calendars multi-calendars-solo model-type="yyyy.MM.dd" format="yyyy/MM/dd"></Datepicker>
              </div>
            </div>
            <button class="btn btn-primary me-3 px-4" @click="search">搜尋</button>
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
            <h5>特店代號: {{detailData.shopCode}}</h5>
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
      searchType: '',
      month: '',
      date: '',
      gridData: [],
      detailModal: '',
      detailData: {
        shopCode: '',
        shopName: '',
        gridData: []
      }
    }
  },
  methods: {
    search () {
      if (this.searchType === 'month') {
        if (!this.month) {
          this.$swal.fire('請選擇月份')
          return
        }
        this.getMonthData()
      } else if (this.searchType === 'date') {
        if (!this.date) {
          this.$swal.fire('請選擇日期')
          return
        }
        this.getDateData()
      }
    },
    async getMonthData () {
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
            name: '請款日期',
            id: 'createTime'
          },
          {
            name: '特店代碼',
            id: 'id'
          },
          {
            name: '特店名稱',
            id: 'name'
          },
          {
            name: '請款成功總筆數',
            id: 'totalNum'
          },
          {
            name: '請款成功總金額',
            id: 'AuthAmount'
          },
          {
            name: '請款失敗總筆數',
            id: 'totalNum'
          },
          {
            name: '請款失敗總金額',
            id: 'refundAmount'
          },
          {
            name: '執行',
            formatter: (cell, row) => {
              const buttons = []
              if (this.searchType === 'month') {
                buttons.push(
                  this.$grid.h('button', {
                    className: 'btn btn-success mr-3 btn-sm',
                    onClick: () => {
                      // this.getDetail(row.cells)
                    }
                  }, '下載')
                )
              } else if (this.searchType === 'date') {
                buttons.push(
                  this.$grid.h('button', {
                    className: 'btn btn-primary mr-3 btn-sm',
                    onClick: () => {
                      this.getDetail(row.cells)
                    }
                  }, '檢視失敗明細')
                )
                buttons.push(
                  this.$grid.h('button', {
                    className: 'btn btn-success mr-3 btn-sm',
                    onClick: () => {

                    }
                  }, '下載失敗明細')
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
      this.detailData.shopCode = itemData[1].data
      this.detailData.shopName = itemData[2].data
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
            name: '交易日',
            id: 'tradeType'
          },
          {
            name: '金額',
            id: 'amount'
          },
          {
            name: '授權碼',
            id: 'authCode'
          },
          {
            name: '帳單描述',
            id: 'desc'
          },
          {
            name: '請款失敗',
            id: 'tradeResult'
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
    async getDateData () {
      this.$store.commit('changeLoading', true)
      const url = 'https://mocki.io/v1/f30e8467-7fad-48ba-bfd8-ca569d924a5e'
      const res = await this.axios.get(url)
      this.$store.commit('changeLoading', false)
      this.gridData = res.data
      this.buildGrid()
    }
    // buildDateGrid () {

    // }
  },
  mounted () {
    this.detailModal = new this.$custom.bootstrap.Modal(this.$refs.detailModal, { backdrop: 'static' })
  }
}
</script>
