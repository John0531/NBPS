import { required, length, email } from '@vee-validate/rules'

const Validate = {
  CheckPwd (pwd) {
    const pwdRule = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&.#^%+-/])[A-Za-z\d$@$!%*?&.#^%+-/]{8,}/
    return pwdRule.test(pwd) ? true : '至少8碼且要大小寫英數字符號混合'
  },
  CheckStoreId (storeId) {
    return storeId.length === 15 ? true : '特店代碼須為15碼'
  },
  radioRequired (value) {
    if (value !== false && value !== true) {
      return '此欄位為必填'
    }
    return true
  },
  // ? 驗證修改密碼:舊密碼與新密碼需不相同
  checkChangePwd (value, [target], ctx) {
    if (value === ctx.form['舊密碼']) {
      return '不可與舊密碼相同'
    }
    return true
  },
  // ? 驗證確認密碼:確認密碼與密碼需相同
  confirmPwd (value, [target], ctx) {
    if (value !== ctx.form['修改密碼']) {
      return '與修改密碼不相同'
    }
    return true
  },
  // ? 驗證信箱格式
  CheckEmailsArea (value, [emails]) {
    emails = emails.split(',')
    for (let i = 0; i < emails.length; i++) {
      if (!Validate.email(emails[i])) {
        return '信箱格式有誤'
      }
    }
    return true
  },
  // ? 只可以輸入數字
  // *搭配@keyup事件使用，直接過濾所有輸入字元必定為數字
  OnlyNumPress (value) {
    return value.replace(/[^\d]+/g, '')
  },
  required,
  length,
  email
}

export default Validate
