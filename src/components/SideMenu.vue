<template>
  <div class="space"></div>
  <div class="shadow pt-4 menu position-fixed">
    <h4 class="title fw-bold text-center">聯邦銀行信用卡批次授權系統</h4>
    <h5 class="user-name fw-bold text-danger ms-2">登入帳號: {{$store.state.user.userName}}</h5>
    <div class="accordion accordion-flush my-4" id="accordion">
      <div v-for="(item1) in permissions" :key="item1.code" class="accordion-item">
        <h2 class="accordion-header">
          <button :class="{'collapsed':item1.code!==$route.meta.group}" class="accordion-button" type="button" data-bs-toggle="collapse" :data-bs-target="`#${item1.code}`" aria-expanded="false" aria-controls="flush-collapseOne">
            {{item1.name}}
          </button>
        </h2>
        <div :id="item1.code" :class="{'show':item1.code===$route.meta.group}" class="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordion">
          <div class="accordion-body">
            <ul class="list-unstyled ms-4 mb-0">
              <li v-for="item2 in item1.function" :key="item2.pageCode" class="my-1">
                <router-link :to="`${$store.state.base_route}/nbps-system/${item2.pageCode}`" class="fs-6 text-dark text-decoration-none">{{item2.pageName}}</router-link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="mb-3">
      <router-link :to="`${$store.state.base_route}/nbps-system/B1`" class="fs-5 text-dark text-decoration-none">批次交易檔上傳作業B1</router-link>
    </div> -->
    <div class="border-top border-1 border-secondary py-3 d-flex justify-content-between">
      <button class="btn btn-light" @click="logout">登出</button>
      <router-link :to="`${$store.state.base_route}/changePwd`" class="btn btn-secondary">修改密碼</router-link>
    </div>
  </div>
</template>

<script>
import AuthService from '../services/auth.service'
import './vue-quill.snow.css'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import '@vueup/vue-quill'

export default {
  data () {
    return {
      permissions: JSON.parse(localStorage.getItem('NBPS_USER')).envData.permissions
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
          this.$swal.fire({
            toast: true,
            position: 'center',
            icon: 'success',
            title: '已登出！',
            showConfirmButton: false,
            timer: 1500,
            width: 500,
            background: '#F0F0F2',
            padding: 25
          })
          this.$router.push(`${process.env.VUE_APP_BASE_ROUTE}/login`)
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
  overflow-y: auto;
}

.menu::-webkit-scrollbar {
    width: 4px;
}

.menu::-webkit-scrollbar-track {
    background-color: #e4e4e4;
    border-radius: 100px;
}

.menu::-webkit-scrollbar-thumb {
    background-color: #b9b9b9;
    border-radius: 100px;
}

.space{
  width: 20%;
  max-width: 270px;
  height: 100vh;
}
li a{
  padding: 5px;
  display: block;
  width: fit-content;
}
li a:hover {
  color: rgb(27, 187, 187) !important;
  background-color: rgba(255,255,255,0.7);
  border-radius: 10px;
}
.router-link-active{
  color: rgb(27, 187, 187) !important;
  background-color: rgba(255,255,255,0.7);
  border-radius: 10px;
}
.accordion-item{
  background-color: transparent;
  border: none;
}
.accordion-button{
  background-color: transparent;
  box-shadow: none;
  padding: 10px;
  font-size: 18px;
}
.accordion-button:not(.collapsed){
  color: #000;
}
.accordion-button:not(.collapsed)::after{
  background-image: var(--bs-accordion-btn-icon);
}
.accordion-body{
  padding: 0;
}

@media (max-width: 1200px) {
  .space{
    width: 16%;
  }
  .menu{
    width: 16%;
    padding: 0 10px;
  }
  .title{
    font-size: 20px;
  }
  .user-name{
    font-size: 18px;
  }
  .accordion-button{
    font-size: 16px;
  }
  li a {
    font-size: 14px !important;
  }
}

</style>
