<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <div class="error-template">
          <img
            :src="require('../assets/img/error.png')"
            alt="Error"
            class="img-fluid"
          />
          <h1>Oops!</h1>
          <div class="error-details fs-5">
            很抱歉！系統出現錯誤或是權限不足...<br />
            若嘗試多次仍無法操作，請洽詢相關人員<br />
            我們會盡快處理，謝謝！
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.error-template {
  padding: 40px 15px;
  text-align: center;
}
.error-actions {
  margin-top: 15px;
  margin-bottom: 15px;
}
.error-actions .btn {
  margin-right: 10px;
}
</style>
