<template>
  <div class="space"></div>
  <div class="shadow pt-4 menu position-fixed">
    <h4 class="fw-bold text-center">聯邦銀行信用卡批次授權系統</h4>
    <ul class="list-unstyled mt-4 ms-3 mb-4">
      <li class="mb-3">
        <router-link to="/nbps-ui/nbps/A1" class="fs-5 text-dark text-decoration-none">批次交易檔上傳作業A1</router-link>
      </li>
      <li class="mb-3">
        <router-link to="/nbps-ui/nbps/A2" class="fs-5 text-dark text-decoration-none">批次交易查詢作業A2</router-link>
      </li>
      <li class="mb-3">
        <router-link to="/nbps-ui/nbps/A3" class="fs-5 text-dark text-decoration-none">批次交易取消作業A3</router-link>
      </li>
      <li class="mb-3">
        <router-link to="/nbps-ui/nbps/A4" class="fs-5 text-dark text-decoration-none">分析報表下載作業A4</router-link>
      </li>
      <li class="mb-3">
        <router-link to="/nbps-ui/nbps/B1" class="fs-5 text-dark text-decoration-none">批次交易檔上傳作業B1</router-link>
      </li>
      <li class="mb-3">
        <router-link to="/nbps-ui/nbps/B4" class="fs-5 text-dark text-decoration-none">請款對帳單B4</router-link>
      </li>
      <li class="mb-3">
        <router-link to="/nbps-ui/nbps/C1" class="fs-5 text-dark text-decoration-none">特店資料維護C1</router-link>
      </li>
      <li class="mb-3">
        <router-link to="/nbps-ui/nbps/C2" class="fs-5 text-dark text-decoration-none">特店帳號維護C2</router-link>
      </li>
      <li class="mb-3">
        <router-link to="/nbps-ui/nbps/C3" class="fs-5 text-dark text-decoration-none">特店群組權限維護C3</router-link>
      </li>
      <li class="mb-3">
        <router-link to="/nbps-ui/nbps/F2" class="fs-5 text-dark text-decoration-none">群組權限維護F2</router-link>
      </li>
    </ul>
    <div class="border-top border-1 border-secondary pt-3">
      <button class="btn btn-light" @click="logout">登出</button>
    </div>
  </div>
</template>

<script>
import AuthService from '../services/auth.service'
export default {
  data () {
    return {
      // roles: JSON.parse(localStorage.getItem('ELIXIR_USER')).roles
    }
  },
  methods: {
    logout () {
      this.$swal.fire({
        title: '是否登出?',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#4D4D4D',
        confirmButtonText: '登出',
        cancelButtonText: '取消',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          AuthService.logout()
          this.$router.push('/elixir-ui/login')
        }
      })
    }
  }
}
</script>

<style scoped>
.menu{
  width: 20%;
  max-width: 270px;
  height: 100%;
  box-sizing: border-box;
  padding: 0 20px;
  background-image: linear-gradient(105deg,rgba(27,187,187,0.5),rgba(238,238,238,0.7));
  backdrop-filter: blur(10px);
}
.space{
  width: 20%;
  max-width: 270px;
  height: 100vh;
}
li a:hover {
  color: rgb(27, 187, 187) !important;
  background-color: rgba(255,255,255,0.7);
  border-radius: 20px;
  padding: 10px;
  display: block;
  width: fit-content;
}
.router-link-active{
  color: rgb(27, 187, 187) !important;
  background-color: rgba(255,255,255,0.7);
  border-radius: 20px;
  padding: 10px;
  display: block;
  width: fit-content;
}
</style>
