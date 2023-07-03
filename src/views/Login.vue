<template>
    <div class="login">
    <div class="container">
      <div class="row justify-content-center align-items-center" style="height:100vh;">
        <div class="col-md-8">
          <div class="d-flex shadow rounded">
            <img class="d-block loginbanner img-fluid rounded-start" src="~@/assets/img/loginbanner.jpg" alt="">
            <!-- <img class="d-block loginbanner img-fluid rounded-start" src="~@/assets/img/p08.jpg" alt=""> -->
            <Form class="px-5 w-50 pt-5" v-slot="{ errors }" @submit="login">
              <h2 class="mb-4 d-flex justify-content-center" style="letter-spacing:0.33em;">聯邦銀行</h2>
              <h3 class="mb-4">信用卡批次授權-BPS系統</h3>
              <div class="mb-4">
                <Field name="帳號" :class="{ 'is-invalid': errors['帳號'] }" class="form-control form-control-lg" type="text" placeholder="帳號" rules="required" v-model="user.userName"></Field>
                <ErrorMessage name="帳號" class="invalid-feedback"></ErrorMessage>
              </div>
              <div class="mb-4">
                <div class="position-relative">
                  <Field id="PwdInput" name="密碼" :class="{ 'is-invalid': errors['密碼'] }" class="form-control form-control-lg" type="password" placeholder="密碼" rules="CheckPwd" v-model="user.pd" style="background-image:none;"></Field>
                  <img v-if="PwdEyeOpen" @click.prevent="PwdEyeOpen=!PwdEyeOpen" class="position-absolute eye-open" src="@/assets/img/open_eye.svg" alt="">
                  <img v-else @click.prevent="PwdEyeOpen=!PwdEyeOpen" class="position-absolute eye-close" src="@/assets/img/close_eye.svg" alt="">
                  <ErrorMessage name="密碼" class="invalid-feedback"></ErrorMessage>
                </div>
              </div>
              <div class="mb-4 input-group">
                <Field name="驗證碼" :class="{ 'is-invalid': errors['驗證碼'] }" class="form-control form-control-lg" type="text" placeholder="驗證碼" rules="required" v-model="user.validateCode"></Field>
                <a href="#"><CaptchaCode v-model:captcha="CaptchaCode" style="border-top-right-radius:0.5rem;border-bottom-right-radius:0.5rem;height:100%"></CaptchaCode></a>
                <ErrorMessage name="驗證碼" class="invalid-feedback"></ErrorMessage>
              </div>
              <div class="d-flex justify-content-end">
                <button class="btn btn-primary px-4 py-2">登入</button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AuthService from '@/services/auth.service'
import CaptchaCode from 'vue-captcha-code'
export default {
  components: {
    CaptchaCode
  },
  data () {
    return {
      textColr1: 'blue',
      textColr2: 'teal',
      textColr3: 'red',
      CaptchaCode: '',
      user: {
        userName: '',
        pd: '',
        validateCode: ''
      },
      PwdEyeOpen: false
    }
  },
  watch: {
    PwdEyeOpen (n, o) {
      n ? document.querySelector('#PwdInput').type = 'text' : document.querySelector('#PwdInput').type = 'password'
    }
  },
  methods: {
    async login () {
      if (this.user.validateCode !== this.CaptchaCode) {
        this.$swal.fire('驗證碼有誤')
        return
      }
      this.$store.commit('changeLoading', true)
      const result = await AuthService.login(this.user)
      this.$store.commit('changeLoading', false)
      if (result.isSuccess) {
        this.$swal.fire({
          toast: true,
          position: 'center',
          icon: 'success',
          title: '登入成功！',
          showConfirmButton: false,
          timer: 1500,
          width: 500,
          background: '#F0F0F2',
          padding: 25,
          customClass: {
            container: 'z-10000'
          }
        })
        if (result.userData.user.isDefault) {
          this.$router.push(`${process.env.VUE_APP_BASE_ROUTE}/changePwd`)
          return
        }
        this.$router.push(`${process.env.VUE_APP_BASE_ROUTE}/nbps-system/${result.userData.envData.permissions[0].function[0].pageCode}`)
      } else {
        this.$swal.fire({
          title: `${result.msg}`,
          allowOutsideClick: false,
          confirmButtonColor: '#dc3545',
          confirmButtonText: '確認',
          backdrop: true,
          width: 400
        })
      }
    }
  },
  mounted () {
    // this.user.validateCode = this.CaptchaCode
  }
}
</script>

<style>
.loginbanner{
  height: 600px;
}
.z-10000{
  z-index: 10000;
}
.change-pwd{
  height: 100vh;
}
.eye-open{
  top:14px;
  right: 13px;
  cursor: pointer;
  width: 20px;
  height: 20px;
}
.eye-close{
  top:15px;
  right: 13px;
  cursor: pointer;
  width: 20px;
  height: 20px;
}
.image-container {
  display: flex;
  align-items: flex-end; /* 將右側圖片置底對齊 */
}
.left-align {
  margin-right: 10px; /* 調整左側圖片與右側圖片之間的間距 */
}

.right-align {
  margin-left: auto; /* 讓右側圖片靠右對齊 */
  margin-bottom: 20px;
}
.image-container2 {
  /* display: flex; */
  align-items: right; /* 垂直居中對齊圖片 */
  margin-left: 35px;
}
</style>
