// monacoFontPlugin.js

export default {
  install (app) {
    // 在安裝插件時，將公共路徑和字體文件名組合起來
    const fontPath = '/fonts/Monaco.ttf'

    // 註冊插件
    app.config.globalProperties.$monacoFontPath = fontPath
  }
}
