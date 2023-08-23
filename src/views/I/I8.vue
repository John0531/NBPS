<template>
  <div>
    <div class="row justify-content-center">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h2 class="fw-bold mb-3">系統公告設定</h2>
            <h6>供經辦設定公告事項</h6>
          </div>
          <Form
            v-slot="{ errors }"
            @submit="setAnnounce"
            ref="editForm"
          >
            <div class="card-body">
              <div class="row py-3">
                <div class="col-xxl-5 d-flex mb-4 align-items-center">
                  <h5 class="text-nowrap me-3" style="padding-top: 0.375rem">
                    公告標題:
                  </h5>
                  <Field
                    name="公告標題"
                    type="text"
                    class="form-control"
                    rules="required"
                    :class="{ 'is-invalid': errors['公告標題'] }"
                    v-model="editForm.title"
                  />
                  <ErrorMessage
                    name="公告標題"
                    class="invalid-feedback ms-2"
                  />
                </div>
                <div class="col-xxl-8 d-flex mb-4">
                  <h5 class="text-nowrap me-3" style="padding-top: 0.375rem">
                    確認送出日期:
                  </h5>
                  <div class="input-group">
                    <span class="input-group-text" id="basic-addon1">起日</span>
                    <Datepicker
                      auto-apply
                      enable-seconds
                      v-model="editForm.startDate"
                      model-type="yyyy-MM-dd HH:mm:ss"
                      format="yyyy/MM/dd HH:mm:ss"
                    ></Datepicker>
                  </div>
                  <div class="input-group">
                    <span class="input-group-text" id="basic-addon1">迄日</span>
                    <Datepicker
                      auto-apply
                      enable-seconds
                      v-model="editForm.endDate"
                      model-type="yyyy-MM-dd HH:mm:ss"
                      format="yyyy/MM/dd HH:mm:ss"
                    ></Datepicker>
                  </div>
                </div>
                <div class="col-xxl-12 h-100">
                  <h5 class="text-nowrap" style="padding-top: 0.375rem">
                    公告內容:
                  </h5>
                  <QuillEditor
                    theme="snow"
                    toolbar="full"
                    v-model:content="editForm.contents"
                    contentType="html"
                  />
                </div>
                <div class="col-xxl-6 d-flex mt-3">
                  <h5 class="text-nowrap me-3">
                    是否發佈:
                  </h5>
                  <div class="form-check form-check-inline">
                    <Field
                      rules="radioRequired"
                      :class="{ 'is-invalid': errors['是否發佈'] }"
                      v-model="editForm.ann"
                      :value="true"
                      class="form-check-input"
                      type="radio"
                      name="是否發佈"
                      id="yes"
                    />
                    <label class="form-check-label" for="yes">是</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <Field
                      rules="radioRequired"
                      :class="{ 'is-invalid': errors['是否發佈'] }"
                      v-model="editForm.ann"
                      :value="false"
                      class="form-check-input"
                      type="radio"
                      name="是否發佈"
                      id="no"
                    />
                    <label class="form-check-label" for="no">否</label>
                  </div>
                </div>
                <ErrorMessage
                  name="是否發佈"
                  class="text-danger"
                  style="font-size:0.875em"
                />
              </div>
              <button class="btn btn-primary me-3 px-4">儲存</button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import service from '@/services/I/I8.service.js'
import utilService from '@/services/utilities.service.js'

export default {
  components: {
    QuillEditor
  },
  data () {
    return {
      editForm: {
        title: '',
        startDate: `${this.$custom.moment().format('YYYY-MM-DD HH:mm:ss')}`,
        endDate: `${this.$custom.moment().format('YYYY-MM-DD HH:mm:ss')}`,
        contents: '',
        ann: ''
      }
    }
  },
  methods: {
    async getAnnounce () {
      const result = await utilService.getAnnounce()
      this.editForm = result.ann[0]
    },
    async setAnnounce () {
      const result = await service.setAnnounce(this.editForm)
      if (result === '成功') {
        this.$store.dispatch('getAnnounceInfo')
        this.$swal.fire({
          toast: true,
          position: 'center',
          icon: 'success',
          title: '修改成功！',
          showConfirmButton: false,
          timer: 1500,
          width: 500,
          background: '#F0F0F2',
          padding: 25,
          customClass: {
            container: 'z-10000'
          }
        })
      } else {
        this.$swal.fire({
          title: result
        })
      }
    }
  },
  mounted () {
    this.getAnnounce()
  }
}
</script>

<style scoped>
::v-deep(.ql-container .ql-editor) {
  min-height: 200px;
}
</style>
