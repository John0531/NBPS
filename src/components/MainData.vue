<template>
  <div class="mt-5 main-data">
    <div class="d-flex w-25 mb-3 align-items-center">
        <label for="" class="text-nowrap me-3 fs-5">每頁資料數 :</label>
        <select
        v-model="PageInfo.pageSize"
        @change="changePageElements" class="form-select" aria-label="Default select example">
          <option selected :value="10">10</option>
          <option :value="20">20</option>
          <option :value="50">50</option>
          <option :value="100">100</option>
        </select>
    </div>
    <div class="tbl-container">
      <table class="table table-striped table-bordered table-hover">
        <slot></slot>
      </table>
    </div>
    <div class="d-flex justify-content-end pt-3">
      <Paginate
      v-model="pageData.currentPage"
      :click-handler="clickCallback"
      :page-count="pageData.totalPages"
      :margin-pages="1"
      :page-range="3"
      :prev-text="'<'"
      :next-text="'>'"
      :container-class="'pagination'"
      :page-class="'page-item'"
      :page-link-class="'page-link'"
      :prev-class="'prev-item'"
      :prev-link-class="'page-link prev-link-item'"
      :next-class="'next-item'"
      :next-link-class="'page-link next-link-item'"
      :break-view-class="'break-view'"
      :break-view-link-class="'break-view-link'"
      >
      </Paginate>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      PageInfo: {
        page: 1,
        pageSize: 10
      }
    }
  },
  props: ['Page'], // ? 分頁資料
  computed: {
    pageData () {
      return this.Page
    }
  },
  watch: {
    pageData (n, o) {
      if (n.pageElements === 0 && this.PageInfo.page > 1) {
        this.PageInfo.page -= 1
        this.$emit('ChangePageInfo', this.PageInfo)
      }
    }
  },
  methods: {
    clickCallback (num) {
      this.PageInfo.page = num
      this.$emit('ChangePageInfo', this.PageInfo)
    },
    // ? 選擇每頁資料數
    changePageElements () {
      this.PageInfo.page = 1
      this.$emit('ChangePageInfo', this.PageInfo)
    }
  },
  mounted () {
    this.$emit('ChangePageInfo', this.PageInfo)
  }
}
</script>

<style scoped>
  ::v-deep(.page-link){
    cursor: pointer;
    color: #000;
  }
  ::v-deep(.prev-item .page-link){
    border-radius: 8px 0 0 8px;
  }
  ::v-deep(.next-item .page-link){
    border-radius: 0 8px 8px 0;
  }
  ::v-deep(.active > .page-link){
    background-color: rgba(27, 187, 187);
    border-color:rgba(27, 187, 187);
    color: aliceblue;
  }
</style>
