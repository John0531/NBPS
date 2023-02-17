<template>
  <div class="change-pwd bg-light">
    <div class="container" style="padding-top:200px;">
      <div class="row justify-content-center">
        <div class="col-lg-6">
          <Form
            v-slot="{ errors }"
            @submit="changePwd">
            <div class="card shadow">
              <div class="card-header bg-secondary text-light">
                <h2 class="fw-bold mb-3">更改密碼</h2>
                <h6>使用者帳號修改自身密碼，僅適用非AD帳號人員</h6>
              </div>
              <div class="card-body">
                <div class="row pb-3">
                  <div class="col-12 mb-4">
                    <div v-if="isDefault" class="alert alert-info" role="alert">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="Warning:">
                        <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                      </svg>
                      首次登入，請先修改預設密碼
                    </div>
                    <h5 class="text-nowrap me-3" style="padding-top:0.375rem;">修改密碼 :</h5>
                    <Field v-model="changePwdForm.pd" :rules="$custom.validate.CheckPwd" name="修改密碼" :class="{ 'is-invalid': errors['修改密碼'] }" type="password" class="form-control"></Field>
                    <ErrorMessage name="修改密碼" class="invalid-feedback"></ErrorMessage>
                  </div>
                  <div class="col-12 mb-4">
                    <h5 class="text-nowrap me-3" style="padding-top:0.375rem;">確認密碼 :</h5>
                    <Field :rules="confirmPwd" name="確認密碼" :class="{ 'is-invalid': errors['確認密碼'] }" type="password" class="form-control"></Field>
                    <ErrorMessage name="確認密碼" class="invalid-feedback"></ErrorMessage>
                  </div>
                </div>
                <div class="d-flex justify-content-end">
                  <button class="btn btn-secondary px-4">更改密碼</button>
                </div>
              </div>
            </div>
          </Form>
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
      changePwdForm: {},
      isDefault: JSON.parse(localStorage.getItem('NBPS_USER')).user.isDefault
    }
  },
  methods: {
    confirmPwd (value) {
      if (!value) {
        return '確認密碼為必填'
      }
      if (value !== this.changePwdForm.pd) {
        return '與修改密碼不相同'
      } else {
        return true
      }
    },
    async changePwd () {
      this.$store.commit('changeLoading', true)
      const result = await AuthService.changePwd(this.changePwdForm)
      if (result) {
        // ? 再次登入
        const result2 = await AuthService.login({
          userName: this.$store.state.user.userName,
          pd: this.changePwdForm.pd
        })
        this.$store.commit('changeLoading', false)
        if (result2) {
          this.$swal.fire({
            toast: true,
            position: 'center',
            icon: 'success',
            title: '修改密碼成功！',
            showConfirmButton: false,
            timer: 1500,
            width: 500,
            background: '#F0F0F2',
            padding: 25,
            customClass: {
              container: 'z-10000'
            }
          })
          this.$router.push(`${process.env.VUE_APP_BASE_ROUTE}/nbps-system/${JSON.parse(localStorage.getItem('NBPS_USER')).envData.permissions[0].function[0].pageCode}`)
        }
      }
    }
  }
}
</script>

<style>
  .change-pwd{
    height: 100vh;
  }
</style>
