<template>
  <div>
    <div class="row justify-content-center">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h2 class="fw-bold mb-3">特店資料維護</h2>
            <h6>供經辦新增、修改、查詢、刪除特店資料</h6>
          </div>
          <div class="card-body">
            <div class="row py-3">
              <div class="col-xxl-5 d-flex mb-4">
                <h5 class="text-nowrap me-3" style="padding-top:0.375rem;">特店代碼:</h5>
                <input type="text" class="form-control" placeholder="">
              </div>
            </div>
            <button class="btn btn-primary me-3 px-4">搜尋</button>
            <button class="btn btn-warning me-3 px-4" @click="addModal.show()">新增</button>
          </div>
        </div>
        <div ref="grid" class="mt-5"></div>
      </div>
    </div>

    <!-- 新增 Modal -->
    <div class="modal fade" ref="addModal" tabindex="-1" aria-labelledby="detailModal" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-warning">
            <h5 class="modal-title text-dark">新增特店資料</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form>
              <div class="row mb-3">
                <label for="shopCode" class="col-sm-2 col-form-label">特店代碼</label>
                <div class="col-sm-10">
                  <input type="text" class="form-control" id="shopCode">
                </div>
              </div>
              <div class="row mb-3">
                <label for="shopName" class="col-sm-2 col-form-label">特店名稱</label>
                <div class="col-sm-10">
                  <input type="text" class="form-control" id="shopName">
                </div>
              </div>
              <div class="row mb-3">
                <label for="shopType" class="col-sm-2 col-form-label">特店作業類型</label>
                <div class="col-sm-10">
                  <select id="shopType" class="form-select">
                    <option selected>請選擇</option>
                    <option>自行上傳(收單流程)</option>
                    <option>公共事業費(發卡公共事業費流程)</option>
                    <option>郵購(發卡MO流程)</option>
                    <option>新消貸(發卡新消貸流程)</option>
                  </select>
                </div>
              </div>
              <div class="row mb-3">
                <span class="col-sm-2 col-form-label">支援交易方式</span>
                <div class="col-sm-10 d-flex align-items-center">
                  <div class="me-3">
                    <input class="form-check-input" type="checkbox" id="type1">
                    <label class="form-check-label ms-2" for="type1">
                      Sale
                    </label>
                  </div>
                  <div class="me-3">
                    <input class="form-check-input" type="checkbox" id="type2">
                    <label class="form-check-label ms-2" for="type2">
                      Auth
                    </label>
                  </div>
                  <div class="me-3">
                    <input class="form-check-input" type="checkbox" id="type3">
                    <label class="form-check-label ms-2" for="type3">
                      Off-line Sale
                    </label>
                  </div>
                  <div>
                    <input class="form-check-input" type="checkbox" id="type4">
                    <label class="form-check-label ms-2" for="type4">
                      Refund
                    </label>
                  </div>
                </div>
              </div>
              <fieldset class="row mb-3">
                <legend class="col-form-label col-sm-2 pt-0">Call Bank</legend>
                <div class="col-sm-10 d-flex">
                  <div class="form-check me-3">
                    <input class="form-check-input" type="radio" name="gridRadios" id="gridRadios1" value="option1">
                    <label class="form-check-label" for="gridRadios1">
                      啟用
                    </label>
                  </div>
                  <div class="form-check">
                    <input class="form-check-input" type="radio" name="gridRadios" id="gridRadios2" value="option2">
                    <label class="form-check-label" for="gridRadios2">
                      不啟用
                    </label>
                  </div>
                </div>
              </fieldset>
              <div class="row mb-3">
                <label for="priority" class="col-sm-2 col-form-label">優先權</label>
                <div class="col-sm-10">
                  <select id="priority" class="form-select">
                    <option selected>請選擇</option>
                    <option>一般</option>
                    <option>ASAP</option>
                  </select>
                </div>
              </div>
              <div class="row mb-3">
                <label for="priority" class="col-sm-2 col-form-label">作業時間:<small class="text-danger">(僅影響自行上傳作業類型)</small></label>
                <div class="col-sm-10">
                  <select id="priority" class="form-select">
                    <option selected>請選擇</option>
                    <option>營業日09:00 - 15:30</option>
                    <option>營業日09:00 - 17:30</option>
                  </select>
                </div>
              </div>
              <div class="row mb-3">
                <label for="ZipPwd" class="col-sm-2 col-form-label">上傳ZIP檔密碼:<small class="text-danger">(僅影響自行上傳作業類型)</small></label>
                <div class="col-sm-10">
                  <input type="text" class="form-control" id="ZipPwd">
                </div>
              </div>
              <div class="d-flex justify-content-end">
                <button type="submit" class="btn btn-warning px-4">新增</button>
              </div>
            </form>
          </div>
        </div>
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
            <form>
              <div class="row mb-3">
                <label for="shopCode" class="col-sm-2 col-form-label">特店代碼</label>
                <div class="col-sm-10">
                  <input type="text" class="form-control" id="shopCode">
                </div>
              </div>
              <div class="row mb-3">
                <label for="shopName" class="col-sm-2 col-form-label">特店名稱</label>
                <div class="col-sm-10">
                  <input type="text" class="form-control" id="shopName">
                </div>
              </div>
              <div class="row mb-3">
                <label for="shopType" class="col-sm-2 col-form-label">特店作業類型</label>
                <div class="col-sm-10">
                  <select id="shopType" class="form-select">
                    <option selected>請選擇</option>
                    <option>自行上傳(收單流程)</option>
                    <option>公共事業費(發卡公共事業費流程)</option>
                    <option>郵購(發卡MO流程)</option>
                    <option>新消貸(發卡新消貸流程)</option>
                  </select>
                </div>
              </div>
              <div class="row mb-3">
                <span class="col-sm-2 col-form-label">支援交易方式</span>
                <div class="col-sm-10 d-flex align-items-center">
                  <div class="me-3">
                    <input class="form-check-input" type="checkbox" id="type1">
                    <label class="form-check-label ms-2" for="type1">
                      Sale
                    </label>
                  </div>
                  <div class="me-3">
                    <input class="form-check-input" type="checkbox" id="type2">
                    <label class="form-check-label ms-2" for="type2">
                      Auth
                    </label>
                  </div>
                  <div class="me-3">
                    <input class="form-check-input" type="checkbox" id="type3">
                    <label class="form-check-label ms-2" for="type3">
                      Off-line Sale
                    </label>
                  </div>
                  <div>
                    <input class="form-check-input" type="checkbox" id="type4">
                    <label class="form-check-label ms-2" for="type4">
                      Refund
                    </label>
                  </div>
                </div>
              </div>
              <fieldset class="row mb-3">
                <legend class="col-form-label col-sm-2 pt-0">Call Bank</legend>
                <div class="col-sm-10 d-flex">
                  <div class="form-check me-3">
                    <input class="form-check-input" type="radio" name="gridRadios" id="gridRadios1" value="option1">
                    <label class="form-check-label" for="gridRadios1">
                      啟用
                    </label>
                  </div>
                  <div class="form-check">
                    <input class="form-check-input" type="radio" name="gridRadios" id="gridRadios2" value="option2">
                    <label class="form-check-label" for="gridRadios2">
                      不啟用
                    </label>
                  </div>
                </div>
              </fieldset>
              <div class="row mb-3">
                <label for="priority" class="col-sm-2 col-form-label">優先權</label>
                <div class="col-sm-10">
                  <select id="priority" class="form-select">
                    <option selected>請選擇</option>
                    <option>一般</option>
                    <option>ASAP</option>
                  </select>
                </div>
              </div>
              <div class="row mb-3">
                <label for="priority" class="col-sm-2 col-form-label">作業時間:<small class="text-danger">(僅影響自行上傳作業類型)</small></label>
                <div class="col-sm-10">
                  <select id="priority" class="form-select">
                    <option selected>請選擇</option>
                    <option>營業日09:00 - 15:30</option>
                    <option>營業日09:00 - 17:30</option>
                  </select>
                </div>
              </div>
              <div class="row mb-3">
                <label for="ZipPwd" class="col-sm-2 col-form-label">上傳ZIP檔密碼:<small class="text-danger">(僅影響自行上傳作業類型)</small></label>
                <div class="col-sm-10">
                  <input type="text" class="form-control" id="ZipPwd">
                </div>
              </div>
              <div class="d-flex justify-content-end">
                <button type="submit" class="btn btn-success px-4">修改</button>
              </div>
            </form>
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
      detailModal: ''
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
            name: '建檔日期',
            id: 'createTime'
          },
          {
            name: '支援交易',
            id: 'createTime'
          },
          {
            name: '執行',
            formatter: (cell, row) => {
              const buttons = []
              buttons.push(
                this.$grid.h('button', {
                  className: 'btn btn-success mr-3 btn-sm',
                  onClick: () => {
                    this.detailModal.show()
                  }
                }, '檢視')
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
    }
  },
  mounted () {
    this.getData()
    this.addModal = new this.$custom.bootstrap.Modal(this.$refs.addModal, { backdrop: 'static' })
    this.detailModal = new this.$custom.bootstrap.Modal(this.$refs.detailModal, { backdrop: 'static' })
  }
}
</script>
