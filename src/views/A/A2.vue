<template>
  <div>
    <div class="row justify-content-center">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h2 class="fw-bold mb-3">批次交易查詢作業</h2>
            <h6>供<span class="text-primary">帳務科經辦</span>依起訖日、特店查詢批次交易結果</h6>
            <div v-if="this.timeOutBtn">
              <button class="btn btn-cutBtn btn-sm text-white text-nowrap">逾時交易重送</button> 用於下載<span class="text-danger">當日發生逾時交易</span>之資料，便於<span class="text-primary">帳務科經辦</span>下載後可<span class="text-primary">立即重新上傳</span>未完成之交易檔。(依需求使用)
            </div>
          </div>
          <div class="card-body">
            <div class="row py-3">
              <div class="col-xxl-8 d-flex mb-4">
                <h5 class="text-nowrap me-3" style="padding-top:0.375rem;">確認送出日期:</h5>
                <div class="input-group">
                  <span class="input-group-text" id="basic-addon1">起日</span>
                  <Datepicker auto-apply enable-seconds v-model="searchForm.startDate" model-type="yyyy-MM-dd" format="yyyy/MM/dd"></Datepicker>
                </div>
                <div class="input-group">
                  <span class="input-group-text" id="basic-addon1">迄日</span>
                  <Datepicker auto-apply enable-seconds v-model="searchForm.endDate" model-type="yyyy-MM-dd" format="yyyy/MM/dd"></Datepicker>
                </div>
              </div>
              <div class="col-xxl-4"></div>
              <div class="col-xxl-5 d-flex mb-4">
                <h5 class="text-nowrap me-3" style="padding-top:0.375rem;">交易處理狀態:</h5>
                <select class="form-select" v-model="searchForm.trxType">
                  <option selected value="">全部</option>
                  <option value="TRX_WAITING">等待交易中</option>
                  <option value="TRX_PROCESS">交易處理中</option>
                  <option value="TRX_FINISH_WITH_ERROR">交易處理完成但有異常</option>
                  <option value="TRX_FINISH">交易處理完成</option>
                  <option value="TRX_FINISH_REVERSAL">交易已取消</option>
                </select>
              </div>
              <div class="col-xxl-7"></div>
              <div class="col-xxl-5 d-flex mb-4">
                <h5 class="text-nowrap me-3" style="padding-top:0.375rem;">特店代碼:</h5>
                  <select class="form-select" v-model="searchForm.storeId">
                    <option value="" selected>請選擇</option>
                    <option v-for="item in defaultData" :key="item.id" :value="item.storeId">{{item.storeId}} ({{item.storeName}})</option>
                  </select>
                  <ErrorMessage
                    name="特店代碼"
                    class="invalid-feedback ms-2"
                  />
              </div>
            </div>
            <button @click="getData" class="btn btn-primary me-3 px-4" :disabled="!$store.state.pageBtnPermission.includes('view')">搜尋</button>
          </div>
        </div>
        <MainData :Page="pageData" @ChangePageInfo="getPageInfo" @updatePageInfo="getPageInfo">
          <template #default>
            <thead>
              <tr>
                <th scope="col">特店代碼</th>
                <th scope="col">特店名稱</th>
                <th scope="col">上傳批次交易檔名</th>
                <th scope="col">確認送出時間</th>
                <th scope="col">批次處理狀態</th>
                <th scope="col">交易處理狀態</th>
                <th scope="col">總筆數</th>
                <th scope="col">總金額 A-B</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in gridData" :key="item.batchId">
                <th scope="row">{{item.batchStoreId}}</th>
                <td>{{item.batchStoreName}}</td>
                <td>{{item.batchFileName}}</td>
                <td>{{item.submitTime}}</td>
                <td>
                  <span class="fw-bold" v-if="item.batchStatus==='UPLOAD_SUCCESS'">上傳成功</span>
                  <span class="fw-bold" v-if="item.batchStatus==='UPLAOD_FAIL'">上傳失敗</span>
                  <span class="fw-bold" v-if="item.batchStatus==='VALIDATING'">格式檢核中</span>
                  <span class="fw-bold text-success" v-if="item.batchStatus==='VALIDATE_SUCCESS'">格式檢核成功</span>
                  <span class="fw-bold text-danger" v-if="item.batchStatus==='VALIDATE_FAIL'">格式檢核失敗</span>
                  <span class="fw-bold" v-if="item.batchStatus==='SUBMISSION_AND_TRX_WAIT'">確認送出，等待交易中</span>
                  <span class="fw-bold" v-if="item.batchStatus==='TRX_WAIT'">等待交易中</span>
                  <span class="fw-bold" v-if="item.batchStatus==='TRX_PROCESS'">交易處理中</span>
                  <span class="fw-bold" v-if="item.batchStatus==='TRX_FINISH'">交易處理完成</span>
                  <span class="fw-bold" v-if="item.batchStatus==='REPLY_PROCESS'">回覆檔產製中</span>
                  <span class="fw-bold" v-if="item.batchStatus==='REPLY_SUCCESS'">已下傳回覆檔</span>
                  <span class="fw-bold" v-if="item.batchStatus==='REPLY_FAIL'">下傳回覆檔失敗</span>
                  <span class="fw-bold" v-if="item.batchStatus==='REPLY_UPLOAD_SUCCESS'">回覆檔上傳FTP成功</span>
                  <span class="fw-bold" v-if="item.batchStatus==='REPLY_UPLOAD_FAIL'">回覆檔上傳FTP失敗</span>
                  <span class="fw-bold" v-if="item.batchStatus==='DOWLOAD_REPLY'">特店已下載回覆檔</span>
                </td>
                <td>
                  <span v-if="item.trxStatus==='TRX_WAITING'">等待交易中</span>
                  <span v-if="item.trxStatus==='TRX_PROCESS'">交易處理中</span>
                  <span v-if="item.trxStatus==='TRX_FINISH_WITH_ERROR'">交易處理完成但有異常</span>
                  <span v-if="item.trxStatus==='TRX_ERROR_PROCESS'">異常交易取消中</span>
                  <span v-if="item.trxStatus==='TRX_ERROR_REVERSAL'">異常交易已取消</span>
                  <span v-if="item.trxStatus==='TRX_ERROR_FAIL'">異常交易取消錯誤</span>
                  <span v-if="item.trxStatus==='TRX_ALL_VOID_WAITING'">等待整批交易取消中</span>
                  <span v-if="item.trxStatus==='TRX_ALL_VOID_PROCESS'">交易整批取消中</span>
                  <span v-if="item.trxStatus==='TRX_ALL_VOID_FAIL'">交易整批取消錯誤</span>
                  <span v-if="item.trxStatus==='TRX_FINISH_REVERSAL'">交易已取消</span>
                  <span v-if="item.trxStatus==='TRX_FINISH'">交易處理完成</span>
                  <span v-if="item.trxStatus==='REPLY_PROCESS'">回覆檔產製中</span>
                  <span v-if="item.trxStatus==='REPLY_SUCCESS'">已下載回覆檔</span>
                  <span v-if="item.trxStatus==='REPLY_FAIL'">下傳回覆檔失敗</span>
                  <span v-if="item.trxStatus==='REPLY_UPLOAD_SUCCESS'">回覆檔上傳FTP成功</span>
                  <span v-if="item.trxStatus==='REPLY_DOWNLOAD_SUCCESS'">回覆檔FTP下載成功</span>
                </td>
                <td>{{item.totalCnt}}</td>
                <td>{{$custom.currency(item.totalAmt)}}</td>
                <td>
                  <button
                    @click="getDetail(item)" class="btn btn-primary me-2 btn-sm"
                    v-if="showBtn(item.batchStatus)"
                  >
                    檢視明細
                  </button>
                  <button
                    @click="downloadReply(item)"
                    v-if="item.batchStatus==='REPLY_SUCCESS'&&showDLbtn(item.trxStatus)"
                    class="btn btn-success me-2 btn-sm"
                    :disabled="!($store.state.pageBtnPermission.includes('download'))"
                  >
                    下載回覆檔
                  </button>
                  <button
                    @click="downloadExcel(item)"
                    class="btn btn-warning me-2 btn-sm"
                    v-if="item.batchStatus==='REPLY_SUCCESS'"
                    :disabled="!$store.state.pageBtnPermission.includes('download')"
                  >
                    下載總計EXCEL
                  </button>
                  <button
                    @click="downloadResendTrans(item)"
                    v-if="cutBtn(item.trxStatus)&&currentFormattedDate === item.submitTime.substr(0,10)"
                    class="btn btn-cutBtn btn-sm text-white text-nowrap"
                    :disabled="!$store.state.pageBtnPermission.includes('download')"
                  >
                    逾時交易重送
                  </button>
                  <div v-if="showTimeOutTxt(cutBtn(item.trxStatus)&&currentFormattedDate === item.submitTime.substr(0,10))"></div>
                </td>
              </tr>
            </tbody>
          </template>
        </MainData>
      </div>
    </div>

    <!-- 檢視明細 Modal -->
    <div class="modal fade" ref="detailModal" tabindex="-1" aria-labelledby="detailModal" aria-hidden="true">
      <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-success">
            <h5 class="modal-title text-white">檢視明細</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <h5 class="text-nowrap me-3" style="padding-top:0.375rem;">檔名: {{detailData.batchFileName}}</h5>
            <h5 class="text-nowrap me-3" style="padding-top:0.375rem;">特店名稱: {{detailData.batchStoreName}} </h5>
            <div class="col-xxl-4 me-3 d-flex align-items-center">
              <h5 class="text-nowrap me-3" style="padding-top:0.375rem;">卡號:</h5>
                <input v-model="detailDataPost.pan" type="text" class="form-control me-3">
                <button @click="
                detailDataPost.page = 1;
                detailDataPost.pageSize = 10;
                $refs.detailMainData.PageInfo.pageSize = 10;
                getDetail()" class="btn btn-primary col-xxl-2 me-3">查詢</button>
            </div>
            <MainData ref="detailMainData" :Page="detailPageData"  @ChangePageInfo="getDetailPageInfo" >
              <template #default>
                <thead>
                  <tr>
                    <th scope="col">卡號</th>
                    <th scope="col">交易類別</th>
                    <th scope="col">金額</th>
                    <th scope="col">帳單描述</th>
                    <th scope="col">回應碼</th>
                    <th scope="col">授權碼</th>
                    <th scope="col">交易請款結果</th>
                    <th v-if="(isVoidSettle||isVoidAuth)" scope="col">交易取消結果</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item,index) in detailData.gridData" :key="`A+${index}`">
                    <th scope="row">{{item.pan}}</th>
                    <td>
                      <span v-if="item.transType==='SALE'">(S)授權與請款</span>
                      <span v-if="item.transType==='AUTH'">(A)授權</span>
                      <span v-if="item.transType==='OFF_LINE_SALE'">(O)請款</span>
                      <span v-if="item.transType==='REFUND'">(R)退貨</span>
                    </td>
                    <td>{{$custom.currency(item.amt)}}</td>
                    <td>{{item.desc}}</td>
                    <td>{{item.codeH}}</td>
                    <td>{{item.authCode}}</td>
                    <td>
                      <span v-if="(item.replyCode==='00'&&item.statusCode==='0000')">請款成功</span>
                       <span v-if="(item.replyCode===''&&item.statusCode==='0000')">請款中</span>
                       <span v-if="(item.statusCode==='0000'&&item.replyCode!='00'&&item.replyCode!='')">請款失敗</span>
                    </td>
                    <td v-if="(isVoidSettle||isVoidAuth)">
                      <span v-if="((item.errCode!=null&&item.authVoidStatus==='00')||(item.authVoidStatus==='00'&&item.settleVoidStatus==='0000'))">取消成功</span>
                      <span v-if="(item.authVoidStatus==null&&item.settleVoidStatus==null)"></span>
                      <span v-if="((item.errCode!=null&&item.authVoidStatus!='00')||(item.errCode===null&&(item.authVoidStatus!='00'||item.settleVoidStatus!='0000')))">取消失敗</span>
                    </td>
                  </tr>
                </tbody>
              </template>
            </MainData>
            <div class="mt-3 d-flex justify-content-center" v-if="detailData.dtSummary">
              <table class="table table-borderless" style="width:auto;font-size:18px;">
                <thead class="text-center table-success">
                  <tr>
                    <th></th>
                    <th>加總</th>
                    <td v-if="(detailData.dtSummary.totalAuthCnt)!=0">(A)授權</td>
                    <td v-if="(detailData.dtSummary.totalRefundCnt)!=0">(R)退貨</td>
                    <td v-if="(detailData.dtSummary.totalSaleCnt)!=0">(S)銷售</td>
                    <!-- <td v-if="OffLineSale">(O)交易補登請款</td>
                    <td v-if="(detailData.dtSummary.voidAuthCnt)!=0">取消授權</td>
                    <td v-if="(detailData.dtSummary.voidRefundCnt)!=0">取消退貨</td>
                    <td v-if="(detailData.dtSummary.voidSaleCnt)!=0">取消銷售</td> -->
                  </tr>
                </thead>
                <tbody class="text-center">
                  <tr>
                    <th>
                      <div class="d-flex justify-content-between">
                        <span>交易總筆數</span>
                      </div>
                    </th>
                    <th><span>{{detailData.dtSummary.totalCnt}} =</span></th>
                    <td v-if="(detailData.dtSummary.totalAuthCnt)!=0">{{detailData.dtSummary.totalAuthCnt}} </td>
                    <td v-if="(detailData.dtSummary.totalRefundCnt)!=0">+{{detailData.dtSummary.totalRefundCnt}} </td>
                    <td v-if="(detailData.dtSummary.totalSaleCnt)!=0">+{{detailData.dtSummary.totalSaleCnt}} </td>
                    <!-- <td v-if="OffLineSale">0 </td>
                    <td v-if="(detailData.dtSummary.voidAuthCnt)!=0">+<span class="text-danger">({{detailData.dtSummary.voidAuthCnt}})</span> </td>
                    <td v-if="(detailData.dtSummary.voidRefundCnt)!=0">+<span class="text-danger">({{detailData.dtSummary.voidRefundCnt}})</span> </td>
                    <td v-if="(detailData.dtSummary.voidSaleCnt)!=0">+<span class="text-danger">({{detailData.dtSummary.voidSaleCnt}})</span></td> -->
                  </tr>
                  <tr>
                    <th>
                      <div class="d-flex justify-content-between">
                        <span>交易總金額</span>
                      </div>
                    </th>
                    <th><span class="ms-3">{{$custom.currency(detailData.dtSummary.totalAmt)}} =</span></th>
                    <td v-if="(detailData.dtSummary.totalAuthCnt)!=0">{{$custom.currency(detailData.dtSummary.totalAuthAmt)}} </td>
                    <td v-if="(detailData.dtSummary.totalRefundCnt)!=0">+<span class="text-danger">({{$custom.currency(detailData.dtSummary.totalRefundAmt)}})</span> </td>
                    <td v-if="(detailData.dtSummary.totalSaleCnt)!=0">+{{$custom.currency(detailData.dtSummary.totalSaleAmt)}} </td>
                    <!-- <td v-if="OffLineSale">+ 0 </td>
                    <td v-if="(detailData.dtSummary.voidAuthCnt)!=0">+<span class="text-danger"> ({{$custom.currency(detailData.dtSummary.voidAuthAmt)}})</span></td>
                    <td v-if="(detailData.dtSummary.voidRefundCnt)!=0"><span>+{{$custom.currency(detailData.dtSummary.voidRefundAmt)}}</span></td>
                    <td v-if="(detailData.dtSummary.voidSaleCnt)!=0">+<span class="text-danger"> ({{$custom.currency(detailData.dtSummary.voidSaleAmt)}})</span></td> -->
                  </tr>
                  <tr>
                    <th>
                      <div class="d-flex justify-content-between">
                        <span>交易核准筆數</span>
                      </div>
                    </th>
                    <th><span>{{detailData.dtSummary.successTransCnt}} =</span></th>
                    <td v-if="(detailData.dtSummary.totalAuthCnt)!=0">{{detailData.dtSummary.successAuthTransCnt}} </td>
                    <td v-if="(detailData.dtSummary.totalRefundCnt)!=0">+{{detailData.dtSummary.successRefundTransCnt}} </td>
                    <td v-if="(detailData.dtSummary.totalSaleCnt)!=0">+{{detailData.dtSummary.successSaleTransCnt}} </td>
                    <!-- <td v-if="OffLineSale">+ 0 </td>
                    <td v-if="(detailData.dtSummary.voidAuthCnt)!=0">+<span class="text-danger">({{+detailData.dtSummary.successVoidAuthCnt}})</span></td>
                    <td v-if="(detailData.dtSummary.voidRefundCnt)!=0">+<span class="text-danger">({{detailData.dtSummary.successVoidRefundCnt}})</span></td>
                    <td v-if="(detailData.dtSummary.voidSaleCnt)!=0">+<span class="text-danger">({{detailData.dtSummary.successVoidSaleCnt}})</span></td> -->
                  </tr>
                  <tr>
                    <th>
                      <div class="d-flex justify-content-between">
                        <span>交易核准金額</span>
                      </div>
                    </th>
                    <th><span class="ms-3">{{$custom.currency(detailData.dtSummary.successAmtSum)}} =</span></th>
                    <td v-if="(detailData.dtSummary.totalAuthCnt)!=0">{{$custom.currency(detailData.dtSummary.successAuthAmtSum)}} </td>
                    <td v-if="(detailData.dtSummary.totalRefundCnt)!=0">+<span class="text-danger">({{$custom.currency(detailData.dtSummary.successRefundAmtSum)}})</span> </td>
                    <td v-if="(detailData.dtSummary.totalSaleCnt)!=0"> + {{$custom.currency(detailData.dtSummary.successSaleAmtSum)}} </td>
                    <!-- <td v-if="OffLineSale">+0 </td>
                    <td v-if="(detailData.dtSummary.voidAuthCnt)!=0">+<span class="text-danger">({{$custom.currency(detailData.dtSummary.successVoidAuthAmt)}})</span>  </td>
                    <td v-if="(detailData.dtSummary.voidRefundCnt)!=0">+<span>{{$custom.currency(detailData.dtSummary.successVoidRefundAmt)}}</span>  </td>
                    <td v-if="(detailData.dtSummary.voidSaleCnt)!=0">+<span class="text-danger">({{$custom.currency(detailData.dtSummary.successVoidSaleAmt)}})</span> </td> -->
                  </tr>
                  <tr>
                    <th>
                      <div class="d-flex justify-content-between">
                        <span>交易拒絕筆數</span>
                      </div>
                    </th>
                    <th><span>{{detailData.dtSummary.failTransCnt}} =</span></th>
                    <td v-if="(detailData.dtSummary.totalAuthCnt)!=0">{{detailData.dtSummary.failAuthTransCnt}} </td>
                    <td v-if="(detailData.dtSummary.totalRefundCnt)!=0"> + {{detailData.dtSummary.failRefundTransCnt}} </td>
                    <td v-if="(detailData.dtSummary.totalSaleCnt)!=0"> + {{detailData.dtSummary.failSaleTransCnt}} </td>
                    <!-- <td v-if="OffLineSale">+0 </td>
                    <td v-if="(detailData.dtSummary.voidAuthCnt)!=0">+<span class="text-danger">({{detailData.dtSummary.failVoidAuthCnt}})</span> </td>
                    <td v-if="(detailData.dtSummary.voidRefundCnt)!=0">+<span class="text-danger">({{detailData.dtSummary.failVoidRefundCnt}})</span> </td>
                    <td v-if="(detailData.dtSummary.voidSaleCnt)!=0">+<span class="text-danger">({{detailData.dtSummary.failVoidSaleCnt}})</span></td> -->
                  </tr>
                  <tr>
                    <th>
                      <div class="d-flex justify-content-between">
                        <span>交易拒絕金額</span>
                      </div>
                    </th>
                    <th><span class="ms-3">{{$custom.currency(detailData.dtSummary.failAmtSum)}} =</span></th>
                    <td v-if="(detailData.dtSummary.totalAuthCnt)!=0">{{$custom.currency(detailData.dtSummary.failAuthAmtSum)}} </td>
                    <td v-if="(detailData.dtSummary.totalRefundCnt)!=0">+<span class="text-danger">({{$custom.currency(detailData.dtSummary.failRefundAmtSum)}})</span> </td>
                    <td v-if="(detailData.dtSummary.totalSaleCnt)!=0">+{{$custom.currency(detailData.dtSummary.failSaleAmtSum)}} </td>
                    <!-- <td v-if="OffLineSale">+0 </td>
                    <td v-if="(detailData.dtSummary.voidAuthCnt)!=0">+<span class="text-danger">({{$custom.currency(detailData.dtSummary.failVoidAuthAmt)}})</span></td>
                    <td v-if="(detailData.dtSummary.voidRefundCnt)!=0">+<span>{{$custom.currency(detailData.dtSummary.failVoidRefundAmt)}}</span></td>
                    <td v-if="(detailData.dtSummary.voidSaleCnt)!=0">+<span class="text-danger">+({{$custom.currency(detailData.dtSummary.failVoidSaleAmt)}})</span></td> -->
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import service from '@/services/A/A2.service.js'
import MainData from '@/components/MainData.vue'

export default {
  components: {
    MainData
  },
  data () {
    return {
      timeOutBtn: false,
      currentDate: null,
      batchList: [],
      OffLineSale: false,
      pageData: {}, // ?分頁資訊
      defaultData: [],
      searchForm: {
        startDate: `${this.$custom.moment().format('YYYY-MM-DD')}`,
        endDate: `${this.$custom.moment().format('YYYY-MM-DD')}`
      },
      gridData: [],
      detailModal: '',
      detailDataPost: {
        batchId: '',
        page: 1,
        pageSize: 10,
        pan: ''
      },
      detailData: {
        batchFileName: '',
        batchStoreName: '',
        dtSummary: {},
        gridData: []
      },
      detailPageData: {} // ?詳細分頁資訊
    }
  },
  computed: {
    isVoidSettle () {
      return this.batchList.some(item => 'settleVoidStatus' in item)
    },
    isVoidAuth () {
      return this.batchList.some(item => 'authVoidStatus' in item)
    },
    currentFormattedDate () {
      const now = new Date()
      const year = now.getFullYear()
      const month = ('0' + (now.getMonth() + 1)).slice(-2)
      const day = ('0' + now.getDate()).slice(-2)
      return `${year}-${month}-${day}`
    }
  },
  methods: {
    // ? 判斷是否顯示置頂"逾時交易重送"文字說明
    showTimeOutTxt (status) {
      if (status) {
        this.timeOutBtn = true
      }
    },
    // ? 判斷是否顯示檢係明細按鈕
    showBtn (status) {
      switch (status) {
        case 'TRX_FINISH':
          return true
        case 'REPLY_PROCESS':
          return true
        case 'REPLY_SUCCESS':
          return true
        case 'REPLY_FAIL':
          return true
        case 'REPLY_UPLOAD_SUCCESS':
          return true
        case 'REPLY_DOWNLOAD_SUCCESS':
          return true
        default:
          return false
      }
    },
    // ? 判斷是否顯示下載回覆檔按鈕
    showDLbtn (status) {
      switch (status) {
        case 'TRX_FINISH':
          return true
        case 'REPLY_PROCESS':
          return true
        case 'REPLY_SUCCESS':
          return true
        case 'REPLY_FAIL':
          return true
        case 'REPLY_UPLOAD_SUCCESS':
          return true
        case 'REPLY_DOWNLOAD_SUCCESS':
          return true
        case 'TRX_ERROR_REVERSAL':
          return true
        case 'TRX_ERROR_FAIL':
          return true
        default:
          return false
      }
    },
    // ? 判斷是否顯示異常切檔按鈕
    cutBtn (status) {
      switch (status) {
        case 'TRX_FINISH_WITH_ERROR':
          return true
        case 'TRX_ERROR_REVERSAL':
          return true
        case 'TRX_ERROR_FAIL':
          return true
        default:
          return false
      }
    },
    // ? 取得 MainData 元件分頁資訊
    getPageInfo (PageInfo) {
      this.searchForm.page = PageInfo.page
      this.searchForm.pageSize = PageInfo.pageSize
      this.getData()
    },
    // ? 取得 MainData 元件詳細分頁資訊
    getDetailPageInfo (PageInfo) {
      this.detailDataPost.page = PageInfo.page
      this.detailDataPost.pageSize = PageInfo.pageSize
      this.getDetail()
    },
    async getDefaultData () {
      this.$store.commit('changeLoading', true)
      const result = await service.getBatchDefault()
      this.defaultData = result.storeList
      this.$store.commit('changeLoading', false)
    },
    async getData () {
      if (this.searchForm.storeId === '') {
        this.searchForm.storeId = null
      }
      if (this.searchForm.trxType === '') {
        this.searchForm.trxType = null
      }
      this.$store.commit('changeLoading', true)
      const result = await service.getBatchData(this.searchForm)
      this.$store.commit('changeLoading', false)
      this.pageData = result.pageInfo // ? 傳送分頁資訊
      this.gridData = result.batchList
    },
    async getDetail (item) {
      if (item) {
        this.detailDataPost.batchId = item.batchId
        this.detailDataPost.page = 1
        this.detailDataPost.pageSize = 10
        this.detailDataPost.pan = ''
      }
      this.$store.commit('changeLoading', true)
      const result = await service.getBatchDetail(this.detailDataPost)
      this.$store.commit('changeLoading', false)
      if (result) {
        this.detailPageData = result.pageInfo // ? 傳送分頁資訊
        if (item) {
          this.detailData.batchFileName = item.batchFileName
          this.detailData.batchStoreName = item.batchStoreName
          this.detailData.dtSummary = result.dtSummary
          this.batchList = result.batchList
          // * 將每頁資料數初始化
          this.$refs.detailMainData.PageInfo.pageSize = 10
        }
        this.detailData.gridData = result.batchList
      }
      this.detailModal.show()
    },
    async downloadReply (item) {
      this.$store.commit('changeLoading', true)
      const result = await service.downloadReply(item.batchId)
      this.$store.commit('changeLoading', false)
      const a = document.createElement('a')
      const url = window.URL.createObjectURL(new Blob([result.data], { type: result.headers['content-type'] }))
      a.href = url
      a.style.display = 'none'
      a.download = `${item.batchStoreId}${item.batchFileName.substr(9)}`
      a.click()
      // 清除暫存
      a.href = ''
      window.URL.revokeObjectURL(url)
    },
    async downloadExcel (item) {
      this.$store.commit('changeLoading', true)
      const result = await service.downloadExcel(item.batchId)
      this.$store.commit('changeLoading', false)
      const a = document.createElement('a')
      const url = window.URL.createObjectURL(new Blob([result.data], { type: result.headers['content-type'] }))
      a.href = url
      a.style.display = 'none'
      a.download = '總計excel.xlsx'
      a.click()
      // 清除暫存
      a.href = ''
      window.URL.revokeObjectURL(url)
    },
    async downloadResendTrans (item) {
      this.$store.commit('changeLoading', true)
      const result = await service.downloadResendTrans({
        batchId: item.batchId,
        storeId: item.batchStoreId
      })
      this.$store.commit('changeLoading', false)
      const a = document.createElement('a')
      const url = window.URL.createObjectURL(new Blob([result.data], { type: result.headers['content-type'] }))
      const fileNameRT = result.headers.get('filename')
      a.href = url
      a.style.display = 'none'
      a.download = fileNameRT
      a.click()
      // 清除暫存
      a.href = ''
      window.URL.revokeObjectURL(url)
    }
  },
  mounted () {
    this.getDefaultData()
    this.currentDate = new Date()
    this.detailModal = new this.$custom.bootstrap.Modal(this.$refs.detailModal, { backdrop: 'static' })
  }
}
</script>

<style scoped>
.btn-cutBtn{
  background-color: rgb(245, 121, 50);
}

.btn-cutBtn:hover{
  background-color: rgb(245, 121, 50);
}
</style>
