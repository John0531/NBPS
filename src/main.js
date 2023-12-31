import { createApp } from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

import { Field, Form, ErrorMessage, defineRule, configure } from 'vee-validate'
import { localize, setLocale } from '@vee-validate/i18n'
import zhTW from '@vee-validate/i18n/dist/locale/zh_TW.json'

import App from './App.vue'
import router from './router'
import store from './store'

import VueSweetalert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.js'
import 'bootstrap/dist/css/bootstrap.css'

import { Grid, h, html } from 'gridjs'
import 'gridjs/dist/theme/mermaid.css'

import Paginate from 'vuejs-paginate-next'

import './axios.setting'
import validate from './utilities/validate'
import permission from './utilities/permission.js'

import moment from 'moment'

import { v4 as uuidv4 } from 'uuid'

// ?加入validate驗證規則
Object.keys(validate).forEach((rule) => {
  defineRule(rule, validate[rule])
})
configure({
  generateMessage: localize({ zh_TW: zhTW }),
  validateOnInput: true
})
setLocale('zh_TW')

// ? 千分號
function currency (num) {
  if (num === null) {
    return null
  }
  const n = parseInt(num, 10)
  const sign = n < 0 ? '-' : ''
  const absNum = Math.abs(n)
  const formattedNum = absNum.toFixed(0).replace(/./g, (c, i, a) =>
    i && c !== '.' && (a.length - i) % 3 === 0 ? `,${c}` : c
  )
  return `${sign}${formattedNum}`
}
const app = createApp(App)
// ?自訂全域屬性
app.config.globalProperties.$custom = {
  validate,
  bootstrap,
  moment,
  currency,
  uuidv4,
  permission
}

app.config.globalProperties.$grid = {
  Grid,
  h,
  html
}

app.use(store)
app.use(router)
app.use(VueAxios, axios)
app.use(VueSweetalert2)

app.component('Form', Form)
app.component('Field', Field)
app.component('ErrorMessage', ErrorMessage)
app.component('Datepicker', Datepicker)
app.component('Paginate', Paginate)

app.mount('#app')
