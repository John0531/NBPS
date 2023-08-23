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
  .gridjs-pagination .gridjs-pages button.gridjs-currentPage{
    background-color: rgba(27, 187, 187, 0.5)!important
  }
  .gridjs-pagination .gridjs-pages button:hover{
    background-color: rgba(27, 187, 187, 0.5)!important
  }

  .tbl-container{
    border-radius: 8px;
    box-shadow:0 1px 3px 0 rgb(0 0 0 / 10%), 0 1px 2px 0 rgb(0 0 0 / 26%);
    overflow: hidden;
  }
  .table{
    margin: 0!important;
    vertical-align: middle !important;
    text-align: center;
    /* table-layout:auto!important; */
  }
  .tbl-container thead{
    background-color: rgba(27, 187, 187)!important;
    color: #fff;
  }
</style>
