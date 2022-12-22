<template>
  <div class="position-relative">
    <Loading></Loading>
    <router-view/>
  </div>
</template>

<script>
import Loading from './components/Loading.vue'
export default {
  components: {
    Loading
  }
}
</script>

<style>
  th.gridjs-th{
    white-space: normal !important
  }
  table.gridjs-table{
    table-layout: auto !important
  }
  td.gridjs-td{
    padding: 5px !important
  }
  td.gridjs-td button{
    margin: 0 3px;
  }
  th.gridjs-th{
    padding: 5px !important
  }
  .table{
    vertical-align: middle !important
  }
  .gridjs-pagination .gridjs-pages button.gridjs-currentPage{
    background-color: rgba(27, 187, 187, 0.5)!important
  }
  .gridjs-pagination .gridjs-pages button:hover{
    background-color: rgba(27, 187, 187, 0.5)!important
  }
</style>
