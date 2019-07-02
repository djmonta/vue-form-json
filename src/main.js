import Vue from 'vue'
import VeeValidate, { Validator } from 'vee-validate'
import App from './App.vue'
import japanese from 'vee-validate/dist/locale/ja'

Vue.use(VeeValidate, { locale: 'ja' })
Validator.localize('ja', japanese)

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
