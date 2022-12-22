<template>
  <div class="login">
    <div class="container">
      <div class="row justify-content-center align-items-center" style="height:100vh;">
        <div class="col-md-8">
          <div class="d-flex shadow rounded">
            <img class="d-block loginbanner img-fluid rounded-start" src="~@/assets/img/loginbanner.jpg" alt="">
            <Form class="px-5 w-50 pt-5" v-slot="{ errors }" @submit="login">
              <h3 class="mb-5">聯邦銀行信用卡批次授權</h3>
              <div class="mb-4">
                <Field name="帳號" :class="{ 'is-invalid': errors['帳號'] }" class="form-control form-control-lg" type="text" placeholder="帳號" rules="required" v-model="user.userName"></Field>
                <ErrorMessage name="帳號" class="invalid-feedback"></ErrorMessage>
              </div>
              <div class="mb-4">
                <Field name="密碼" :class="{ 'is-invalid': errors['密碼'] }" class="form-control form-control-lg" type="password" placeholder="密碼" rules="required" v-model="user.pd"></Field>
                <ErrorMessage name="密碼" class="invalid-feedback"></ErrorMessage>
              </div>
              <div class="d-flex justify-content-end">
                <button type="submit" class="btn btn-primary px-4 py-2">登入</button>
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
export default {
  data () {
    return {
      user: {
        userName: '',
        pd: ''
      }
    }
  },
  methods: {
    login () {
      this.$store.commit('changeLoading', true)
      AuthService.login(this.user).then((result) => {
        this.$store.commit('changeLoading', false)
        if (result.isSuccess) {
          console.log(result)
          this.$swal.fire({
            toast: true,
            position: 'center',
            icon: 'success',
            title: '登入成功！',
            showConfirmButton: false,
            timer: 1500,
            width: 500,
            background: '#F0F0F2',
            padding: 25
          })
          if (result.user.roles === 'ADMIN') {
            this.$router.push('/nbps-ui/nbps/A1')
          } else if (result.user.roles === 'API-USER') {
            this.$router.push('/nbps-ui/nbps/B1')
          }
        } else {
          this.$swal.fire({
            text: `${result.msg}`,
            allowOutsideClick: false,
            confirmButtonColor: '#0d6efd',
            confirmButtonText: '確認',
            width: 400
          })
        }
      })
    }
  }
}
</script>

<style>
.loginbanner{
  height: 600px;
}
</style>
