<template>
  <div class="d-flex justify-content-end pt-3">
      <Paginate
      v-model="page"
      :click-handler="clickCallback"
      :page-count="totalPage"
      :margin-pages="2"
      :page-range="5"
      :prev-text="'<'"
      :next-text="'>'"
      :container-class="'pagination'"
      :page-class="'page-item'"
      :page-link-class="'page-link pointer'"
      :prev-class="'prev-item'"
      :prev-link-class="'page-link prev-link-item pointer'"
      :next-class="'next-item'"
      :next-link-class="'page-link next-link-item pointer'"
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
      page: 1, // ? 當下頁面
      numPerPage: 20 // ? 每頁有幾筆資料
    }
  },
  props: ['dataNum'], // ? 資料總比數
  computed: {
    // ? 總頁面數
    totalPage () {
      return Math.ceil(this.dataNum / this.numPerPage)
    }
  },
  methods: {
    clickCallback (num) {
      this.$emit('PageNum', num)
    }
  },
  mounted () {
    this.$emit('numPerPage', this.numPerPage)
    this.$emit('PageNum', this.page)
  }
}
</script>
