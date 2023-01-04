<template>
  <div class="d-flex justify-content-end pt-3">
      <Paginate
      v-model="pageInfo.currentPage"
      :click-handler="clickCallback"
      :page-count="pageInfo.totalPages"
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
</template>

<script>
export default {
  data () {
    return {
      page: 1 // ? 當下頁面
    }
  },
  props: ['Page'], // ? 分頁資料
  computed: {
    pageInfo () {
      return this.Page
    }
  },
  methods: {
    clickCallback (num) {
      this.$emit('PageNum', num)
    }
  },
  mounted () {
    // this.$emit('numPerPage', this.numPerPage)
    // this.$emit('PageNum', this.page)
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
