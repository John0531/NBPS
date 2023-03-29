<template>
  <div>
    <div class="row justify-content-center">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h2 class="fw-bold mb-3">特店資料維護</h2>
            <h6>供經辦新增、修改、查詢、刪除特店資料</h6>
          </div>
          <div class="card-body">
            <div class="row py-3">
              <div class="col-xxl-5 d-flex mb-4">
                <h5 class="text-nowrap me-3" style="padding-top:0.375rem;">特店代碼:</h5>
                <input v-model="GroupDataPost.storeId" type="text" class="form-control" placeholder="可不指定[特店代碼須為15碼]">
              </div>
            </div>
            <button class="btn btn-primary me-3 px-4" @click="getData" :disabled="!$store.state.pageBtnPermission.includes('view')">搜尋</button>
            <button class="btn btn-warning me-3 px-4" @click="addModal.show()" :disabled="!$store.state.pageBtnPermission.includes('insert')">新增</button>
          </div>
        </div>
        <MainData :Page="pageData" @ChangePageInfo="getPageInfo" @updatePageInfo="getPageInfo">
          <template #default>
            <thead>
              <tr>
                <th scope="col">特店代碼</th>
                <th scope="col">特店名稱</th>
                <th scope="col">建檔日期</th>
                <th scope="col">支援交易</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in gridData" :key="item.storeId">
                <th scope="row">{{item.storeId}}</th>
                <td>{{item.storeName}}</td>
                <td>{{$custom.moment(item.createDate).format('YYYY/MM/DD HH:mm')}}</td>
                <td>{{item.transTypeUI}}</td>
                <td>
                  <button v-if="$store.state.user.level!==item.level" @click="openEditModal(item)" class="btn btn-success me-2 btn-sm">檢視明細與編輯</button>
                  <button v-if="$store.state.user.level!==item.level" @click="removeStore(item)" class="btn btn-danger btn-sm" :disabled="!$store.state.pageBtnPermission.includes('modify')">刪除</button>
                </td>
              </tr>
            </tbody>
          </template>
        </MainData>
      </div>
    </div>

    <!-- 新增 Modal -->
    <div class="modal fade" ref="addModal" tabindex="-1" aria-labelledby="editModal" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-warning">
            <h5 class="modal-title text-dark">新增特店資料</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <Form
              v-slot="{ errors }"
              @submit="addStore"
              ref="addForm"
            >
              <div class="row mb-3">
                <label for="storeId" class="col-sm-2 col-form-label">特店代碼</label>
                <div class="col-sm-10">
                  <Field
                    maxlength="15"
                    name="特店代碼"
                    type="text"
                    class="form-control"
                    rules="required|CheckStoreId"
                    :class="{ 'is-invalid': errors['特店代碼'] }"
                    id="storeId"
                    v-model="addForm.storeId"
                  />
                  <ErrorMessage
                    name="特店代碼"
                    class="invalid-feedback"
                  />
                </div>
              </div>
              <div class="row mb-3">
                <label for="storeName" class="col-sm-2 col-form-label">特店名稱</label>
                <div class="col-sm-10">
                  <Field
                    name="特店名稱"
                    type="text"
                    class="form-control"
                    rules="required"
                    :class="{ 'is-invalid': errors['特店名稱'] }"
                    id="storeName"
                    v-model="addForm.storeName"
                  />
                  <ErrorMessage
                    name="特店名稱"
                    class="invalid-feedback"
                  />
                </div>
              </div>
              <div class="row mb-3">
                <label for="storeType" class="col-sm-2 col-form-label">特店作業類型</label>
                <div class="col-sm-10">
                  <Field
                    id="storeType"
                    class="form-select"
                    as="select"
                    rules="required"
                    :class="{ 'is-invalid': errors['特店作業類型'] }"
                    name="特店作業類型"
                    v-model="addForm.storeType"
                  >
                    <option value="" selected>請選擇</option>
                    <option value="ACQUIRING">自行上傳(收單流程)</option>
                    <option value="PUBLIC_UTILITIES">公共事業費(發卡公共事業費流程)</option>
                    <option value="MAIL_ORDER">郵購(發卡MO流程)</option>
                    <option value="ISSUE_CARD">新消貸(發卡新消貸流程)</option>
                  </Field>
                  <ErrorMessage
                    name="特店作業類型"
                    class="invalid-feedback"
                  />
                </div>
              </div>
              <div class="row mb-3">
                <span class="col-sm-2 col-form-label">支援交易方式</span>
                <div class="col-sm-10 d-flex align-items-center">
                  <div class="me-3">
                    <Field
                      rules="required"
                      :class="{ 'is-invalid': errors['支援交易方式'] }"
                      v-model="addForm.transType"
                      value="SALE"
                      class="form-check-input"
                      type="checkbox"
                      name="支援交易方式"
                      id="SALE"
                    />
                    <label class="form-check-label ms-2" for="SALE">
                      授權與請款
                    </label>
                  </div>
                  <div class="me-3">
                    <Field
                      rules="required"
                      :class="{ 'is-invalid': errors['支援交易方式'] }"
                      v-model="addForm.transType"
                      value="AUTH"
                      class="form-check-input"
                      type="checkbox"
                      name="支援交易方式"
                      id="AUTH"
                    />
                    <label class="form-check-label ms-2" for="AUTH">
                      授權
                    </label>
                  </div>
                  <div class="me-3">
                    <Field
                      rules="required"
                      :class="{ 'is-invalid': errors['支援交易方式'] }"
                      v-model="addForm.transType"
                      value="OFF_LINE_SALE"
                      class="form-check-input"
                      type="checkbox"
                      name="支援交易方式"
                      id="OFF_LINE_SALE"
                    />
                    <label class="form-check-label ms-2" for="OFF_LINE_SALE">
                      請款
                    </label>
                  </div>
                  <div>
                    <Field
                      rules="required"
                      :class="{ 'is-invalid': errors['支援交易方式'] }"
                      v-model="addForm.transType"
                      value="REFUND"
                      class="form-check-input"
                      type="checkbox"
                      name="支援交易方式"
                      id="REFUND"
                    />
                    <label class="form-check-label ms-2" for="REFUND">
                      退貨
                    </label>
                  </div>
                  <ErrorMessage
                    name="支援交易方式"
                    class="text-danger ms-3"
                    style="font-size:0.875em"
                  />
                </div>
              </div>
              <fieldset class="row mb-3">
                <legend class="col-form-label col-sm-2 pt-0">Call Bank</legend>
                <div class="col-sm-10 d-flex align-items-center">
                  <div class="form-check me-3">
                    <Field
                      rules="radioRequired"
                      :class="{ 'is-invalid': errors['CallBank'] }"
                      v-model="addForm.callBank"
                      :value="true"
                      class="form-check-input"
                      type="radio"
                      name="CallBank"
                      id="callBank1"
                    />
                    <label class="form-check-label" for="callBank1">
                      啟用
                    </label>
                  </div>
                  <div class="form-check">
                    <Field
                      rules="radioRequired"
                      :class="{ 'is-invalid': errors['CallBank'] }"
                      v-model="addForm.callBank"
                      :value="false"
                      class="form-check-input"
                      type="radio"
                      name="CallBank"
                      id="callBank2"
                    />
                    <label class="form-check-label" for="callBank2">
                      不啟用
                    </label>
                  </div>
                  <ErrorMessage
                    name="CallBank"
                    class="text-danger ms-3"
                    style="font-size:0.875em"
                  />
                </div>
              </fieldset>
              <div class="row mb-3">
                <label for="transTime" class="col-sm-2 col-form-label">作業時間:<small class="text-danger">(僅影響自行上傳作業類型)</small></label>
                <div class="col-sm-10">
                  <Field
                    id="transTime"
                    class="form-select"
                    as="select"
                    rules="required"
                    :class="{ 'is-invalid': errors['作業時間'] }"
                    name="作業時間"
                    v-model="addForm.transTime"
                  >
                    <option value="" selected>請選擇</option>
                    <option value="09:00-15:30">營業日09:00 - 15:30</option>
                    <option value="09:00-17:30">營業日09:00 - 17:30</option>
                  </Field>
                  <ErrorMessage
                    name="作業時間"
                    class="invalid-feedback"
                  />
                </div>
              </div>
              <div class="row mb-3">
                <label for="uploadPd" class="col-sm-2 col-form-label">上傳ZIP檔密碼:<small class="text-danger">(僅影響自行上傳作業類型)</small></label>
                <div class="col-sm-10">
                  <Field
                    name="上傳ZIP檔密碼"
                    type="text"
                    class="form-control"
                    rules="required"
                    :class="{ 'is-invalid': errors['上傳ZIP檔密碼'] }"
                    id="uploadPd"
                    v-model="addForm.uploadPd"
                    placeholder="密碼後需加當月月份"
                  />
                  <ErrorMessage
                    name="上傳ZIP檔密碼"
                    class="invalid-feedback"
                  />
                </div>
              </div>
              <div class="row mb-3">
                <label for="tidCnt" class="col-sm-2 col-form-label">TID數目:</label>
                <div class="col-sm-10">
                  <Field
                    name="TID數目"
                    type="number"
                    class="form-control"
                    rules="required"
                    :class="{ 'is-invalid': errors['TID數目'] }"
                    id="tidCnt"
                    v-model="addForm.tidCnt"
                  />
                  <ErrorMessage
                    name="TID數目"
                    class="invalid-feedback"
                  />
                </div>
              </div>
              <div class="row mb-3">
                <label for="status" class="col-sm-2 col-form-label">合作狀態:</label>
                <div class="col-sm-10">
                  <Field
                    id="status"
                    class="form-select"
                    as="select"
                    rules="required"
                    :class="{ 'is-invalid': errors['合作狀態'] }"
                    name="合作狀態"
                    v-model="addForm.status"
                  >
                    <option value="" selected>請選擇</option>
                    <option value="COLLABORATED">合作中</option>
                    <option value="DISABLED">停用(一經停用，該特店之帳號皆無法登入)</option>
                  </Field>
                  <ErrorMessage
                    name="合作狀態"
                    class="invalid-feedback"
                  />
                </div>
              </div>
              <div class="row mb-3">
                <label for="desc" class="col-sm-2 col-form-label">簡述<span class="text-danger"></span></label>
                <div class="col-sm-10">
                  <Field
                    as="textarea"
                    :rules="{required:addForm.transType&&addForm.transType.includes('SALE')?true:false}"
                    v-model="addForm.storeDesc"
                    class="form-control"
                    :class="{ 'is-invalid': errors['簡述'] }"
                    rows="3"
                    name="簡述"
                  >
                  </Field>
                  <ErrorMessage
                    name="簡述"
                    class="invalid-feedback"
                  />
                </div>
              </div>
              <div class="d-flex justify-content-end">
                <button type="submit" class="btn btn-warning px-4">新增</button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>

    <!-- 檢視明細與編輯 Modal -->
    <div class="modal fade" ref="editModal" tabindex="-1" aria-labelledby="editModal" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-success">
            <h5 class="modal-title text-white">檢視明細</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <Form
              v-slot="{ errors  }"
              @submit="editStore"
            >
              <div class="row mb-3">
                <label for="storeId2" class="col-sm-2 col-form-label">特店代碼</label>
                <div class="col-sm-10">
                  <Field
                    name="特店代碼"
                    type="text"
                    class="form-control"
                    rules="required"
                    :class="{ 'is-invalid': errors['特店代碼'] }"
                    id="storeId2"
                    v-model="editForm.storeId"
                    disabled
                  />
                  <ErrorMessage
                    name="特店代碼"
                    class="invalid-feedback"
                  />
                </div>
              </div>
              <div class="row mb-3">
                <label for="storeName2" class="col-sm-2 col-form-label">特店名稱</label>
                <div class="col-sm-10">
                  <Field
                    name="特店名稱"
                    type="text"
                    class="form-control"
                    rules="required"
                    :class="{ 'is-invalid': errors['特店名稱'] }"
                    id="storeName2"
                    v-model="editForm.storeName"
                  />
                  <ErrorMessage
                    name="特店名稱"
                    class="invalid-feedback"
                  />
                </div>
              </div>
              <div class="row mb-3">
                <label for="storeType2" class="col-sm-2 col-form-label">特店作業類型</label>
                <div class="col-sm-10">
                  <Field
                    id="storeType2"
                    class="form-select"
                    as="select"
                    rules="required"
                    :class="{ 'is-invalid': errors['特店作業類型'] }"
                    name="特店作業類型"
                    v-model="editForm.storeType"
                  >
                    <option value="" selected>請選擇</option>
                    <option value="ACQUIRING">自行上傳(收單流程)</option>
                    <option value="PUBLIC_UTILITIES">公共事業費(發卡公共事業費流程)</option>
                    <option value="MAIL_ORDER">郵購(發卡MO流程)</option>
                    <option value="ISSUE_CARD">新消貸(發卡新消貸流程)</option>
                  </Field>
                  <ErrorMessage
                    name="特店作業類型"
                    class="invalid-feedback"
                  />
                </div>
              </div>
              <div class="row mb-3">
                <span class="col-sm-2 col-form-label">支援交易方式</span>
                <div class="col-sm-10 d-flex align-items-center">
                  <div class="me-3">
                    <Field
                      rules="required"
                      :class="{ 'is-invalid': errors['支援交易方式'] }"
                      v-model="editForm.transType"
                      value="SALE"
                      class="form-check-input"
                      type="checkbox"
                      name="支援交易方式"
                      id="SALE2"
                    />
                    <label class="form-check-label ms-2" for="SALE2">
                      授權與請款
                    </label>
                  </div>
                  <div class="me-3">
                    <Field
                      rules="required"
                      :class="{ 'is-invalid': errors['支援交易方式'] }"
                      v-model="editForm.transType"
                      value="AUTH"
                      class="form-check-input"
                      type="checkbox"
                      name="支援交易方式"
                      id="AUTH2"
                    />
                    <label class="form-check-label ms-2" for="AUTH2">
                      授權
                    </label>
                  </div>
                  <div class="me-3">
                    <Field
                      rules="required"
                      :class="{ 'is-invalid': errors['支援交易方式'] }"
                      v-model="editForm.transType"
                      value="OFF_LINE_SALE"
                      class="form-check-input"
                      type="checkbox"
                      name="支援交易方式"
                      id="OFF_LINE_SALE2"
                    />
                    <label class="form-check-label ms-2" for="OFF_LINE_SALE2">
                      請款
                    </label>
                  </div>
                  <div>
                    <Field
                      rules="required"
                      :class="{ 'is-invalid': errors['支援交易方式'] }"
                      v-model="editForm.transType"
                      value="REFUND"
                      class="form-check-input"
                      type="checkbox"
                      name="支援交易方式"
                      id="REFUND2"
                    />
                    <label class="form-check-label ms-2" for="REFUND2">
                      退貨
                    </label>
                  </div>
                  <ErrorMessage
                    name="支援交易方式"
                    class="text-danger ms-3"
                    style="font-size:0.875em"
                  />
                </div>
              </div>
              <fieldset class="row mb-3">
                <legend class="col-form-label col-sm-2 pt-0">Call Bank</legend>
                <div class="col-sm-10 d-flex align-items-center">
                  <div class="form-check me-3">
                    <Field
                      rules="radioRequired"
                      :class="{ 'is-invalid': errors['CallBank'] }"
                      v-model="editForm.callBank"
                      :value="true"
                      class="form-check-input"
                      type="radio"
                      name="CallBank"
                      id="callBank1_2"
                    />
                    <label class="form-check-label" for="callBank1_2">
                      啟用
                    </label>
                  </div>
                  <div class="form-check">
                    <Field
                      rules="radioRequired"
                      :class="{ 'is-invalid': errors['CallBank'] }"
                      v-model="editForm.callBank"
                      :value="false"
                      class="form-check-input"
                      type="radio"
                      name="CallBank"
                      id="callBank2_2"
                    />
                    <label class="form-check-label" for="callBank2_2">
                      不啟用
                    </label>
                  </div>
                  <ErrorMessage
                    name="CallBank"
                    class="text-danger ms-3"
                    style="font-size:0.875em"
                  />
                </div>
              </fieldset>
              <div class="row mb-3">
                <label for="transTime2" class="col-sm-2 col-form-label">作業時間:<small class="text-danger">(僅影響自行上傳作業類型)</small></label>
                <div class="col-sm-10">
                  <Field
                    id="transTime2"
                    class="form-select"
                    as="select"
                    rules="required"
                    :class="{ 'is-invalid': errors['作業時間'] }"
                    name="作業時間"
                    v-model="editForm.transTime"
                  >
                    <option value="" selected>請選擇</option>
                    <option value="09:00-15:30">營業日09:00 - 15:30</option>
                    <option value="09:00-17:30">營業日09:00 - 17:30</option>
                  </Field>
                  <ErrorMessage
                    name="作業時間"
                    class="invalid-feedback"
                  />
                </div>
              </div>
              <div class="row mb-3">
                <label for="uploadPd2" class="col-sm-2 col-form-label">上傳ZIP檔密碼:<small class="text-danger">(僅影響自行上傳作業類型)</small></label>
                <div class="col-sm-10">
                  <Field
                    name="上傳ZIP檔密碼"
                    type="text"
                    class="form-control"
                    rules="required"
                    :class="{ 'is-invalid': errors['上傳ZIP檔密碼'] }"
                    id="uploadPd2"
                    v-model="editForm.uploadPd"
                    placeholder="密碼後需加當月月份"
                  />
                  <ErrorMessage
                    name="上傳ZIP檔密碼"
                    class="invalid-feedback"
                  />
                </div>
              </div>
              <div class="row mb-3">
                <label for="tidCnt2" class="col-sm-2 col-form-label">TID數目:</label>
                <div class="col-sm-10">
                  <Field
                    name="TID數目"
                    type="number"
                    class="form-control"
                    rules="required"
                    :class="{ 'is-invalid': errors['TID數目'] }"
                    id="tidCnt2"
                    v-model="editForm.tidCnt"
                  />
                  <ErrorMessage
                    name="TID數目"
                    class="invalid-feedback"
                  />
                </div>
              </div>
              <div class="row mb-3">
                <label for="status2" class="col-sm-2 col-form-label">合作狀態:</label>
                <div class="col-sm-10">
                  <Field
                    id="status2"
                    class="form-select"
                    as="select"
                    rules="required"
                    :class="{ 'is-invalid': errors['合作狀態'] }"
                    name="合作狀態"
                    v-model="editForm.status"
                  >
                    <option value="" selected>請選擇</option>
                    <option value="COLLABORATED">合作中</option>
                    <option value="DISABLED">停用(一經停用，該特店之帳號皆無法登入)</option>
                  </Field>
                  <ErrorMessage
                    name="合作狀態"
                    class="invalid-feedback"
                  />
                </div>
              </div>
              <div class="row mb-3">
                <label for="desc" class="col-sm-2 col-form-label">簡述<span class="text-danger"></span></label>
                <div class="col-sm-10">
                  <Field
                    as="textarea"
                    :rules="{required:editForm.transType&&editForm.transType.includes('SALE')?true:false}"
                    v-model="editForm.storeDesc"
                    class="form-control"
                    :class="{ 'is-invalid': errors['簡述'] }"
                    rows="3"
                    name="簡述"
                  >
                  </Field>
                  <ErrorMessage
                    name="簡述"
                    class="invalid-feedback"
                  />
                </div>
              </div>
              <div class="d-flex justify-content-end">
                <button type="submit" class="btn btn-success px-4" :disabled="!$store.state.pageBtnPermission.includes('modify')">儲存</button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import service from '@/services/C/C1.service.js'
import MainData from '@/components/MainData.vue'

export default {
  components: {
    MainData
  },
  data () {
    return {
      GroupDataPost: {
        storeId: '',
        page: 1,
        pageSize: 10
      },
      pageData: {}, // ?分頁資訊
      gridData: [],
      addModal: '',
      addForm: {},
      editModal: '',
      editForm: {}
    }
  },
  methods: {
    // ? 取得 MainData 元件分頁資訊
    getPageInfo (PageInfo) {
      this.GroupDataPost.page = PageInfo.page
      this.GroupDataPost.pageSize = PageInfo.pageSize
      this.getData()
    },
    async getData () {
      if (this.GroupDataPost.storeId) {
        this.GroupDataPost.page = 1
        this.GroupDataPost.pageSize = 10
      }
      this.$store.commit('changeLoading', true)
      const result = await service.getStoreData(this.GroupDataPost)
      this.$store.commit('changeLoading', false)
      this.pageData = result.pageInfo // ? 傳送分頁資訊
      this.gridData = result.storeList
      this.gridData.forEach((item1) => {
        item1.transTypeUI = []
        item1.transType.forEach((item2) => {
          if (item2 === 'SALE') {
            item1.transTypeUI.push('授權與請款')
          } else if (item2 === 'AUTH') {
            item1.transTypeUI.push('授權')
          } else if (item2 === 'OFF_LINE_SALE') {
            item1.transTypeUI.push('請款')
          } else if (item2 === 'REFUND') {
            item1.transTypeUI.push('退貨')
          }
        })
        item1.transTypeUI = item1.transTypeUI.join()
      })
    },
    openEditModal (item) {
      this.editForm = JSON.parse(JSON.stringify(item))
      this.editForm.uploadPd = '********'
      this.editModal.show()
    },
    async editStore () {
      this.$store.commit('changeLoading', true)
      const result = await service.editStore(this.editForm)
      this.$store.commit('changeLoading', false)
      if (result) {
        this.editModal.hide()
        this.getData()
      }
    },
    removeStore (item) {
      this.$swal.fire({
        title: '是否刪除?',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#4D4D4D',
        confirmButtonText: '刪除',
        cancelButtonText: '取消',
        reverseButtons: true
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.$store.commit('changeLoading', true)
          const result = await service.removeStore(item)
          this.$store.commit('changeLoading', false)
          if (result) {
            this.getData()
          }
        }
      })
    },
    async addStore () {
      this.$store.commit('changeLoading', true)
      const result = await service.addStore(this.addForm)
      this.$store.commit('changeLoading', false)
      if (result) {
        this.addModal.hide()
        this.GroupDataPost = {
          storeId: '',
          page: this.pageData.currentPage,
          pageSize: this.GroupDataPost.pageSize
        }
        this.addForm = {}
        this.$refs.addForm.resetForm()
        this.getData()
      }
    }
  },
  mounted () {
    this.getData()
    this.addModal = new this.$custom.bootstrap.Modal(this.$refs.addModal, { backdrop: 'static' })
    this.editModal = new this.$custom.bootstrap.Modal(this.$refs.editModal, { backdrop: 'static' })
  }
}
</script>
