<template>
  <div>
    <div class="row justify-content-center">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h2 class="fw-bold mb-3">分析報表下載作業</h2>
            <h6>供帳務科經辦依年月下載分析報表 Excel 檔</h6>
          </div>
          <div class="card-body">
            <div class="row py-3">
              <div class="col-xxl-8 d-flex mb-4">
                <h5 class="text-nowrap me-3" style="padding-top:0.375rem;">日期:</h5>
                <Datepicker class="w-xxl-50 w-100" v-model="date" month-picker auto-apply format="yyyy年MM月"></Datepicker>
              </div>
            </div>
            <button class="btn btn-primary me-3 px-4">搜尋</button>
          </div>
        </div>
        <div ref="grid" class="mt-5"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      date: ''
    }
  }
}
</script>
