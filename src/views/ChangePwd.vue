<template>
  <div class="change-pwd bg-light">
    <div class="container" style="padding-top:200px;">
      <div class="row justify-content-center">
        <div class="col-lg-6">
          <Form
            v-slot="{ errors }"
            @submit="changePwd">
            <div class="card shadow">
              <div class="card-header">
                <h2 class="fw-bold mb-3">更改密碼</h2>
                <h6>使用者帳號修改自身密碼，僅適用非AD帳號人員</h6>
              </div>
              <div class="card-body">
                <div class="row py-3">
                  <div class="col-12 mb-4">
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
                  <button class="btn btn-primary px-4">更改密碼</button>
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
      changePwdForm: {}
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
      this.$store.commit('changeLoading', false)
      if (result) {
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
</script>

<style>
  .change-pwd{
    height: 100vh;
  }
</style>
