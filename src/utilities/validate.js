const Validate = {
  CheckPwd (pwd) {
    const pwdRule = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&.#^%+-/])[A-Za-z\d$@$!%*?&.#^%+-/]{8,}/
    return pwdRule.test(pwd) ? true : '至少8碼且要大小寫英數字符號混合'
  },
  CheckStoreId (storeId) {
    return storeId.length === 15 ? true : '特店代碼須為15碼'
  }
}

export default Validate
