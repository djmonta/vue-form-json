<template lang="pug">
  .section.container
    form(:name="'inquery'")
      input(:type="'hidden'", :name="'_token'", :value="csrf")
      el-steps(:space="200", :active="active", finish-status="success", simple)
        el-step(description="注意事項")
        el-step(title="基本情報", icon="el-icon-user")
        el-step(title="店舗について", icon="el-icon-time")
        el-step(title="お申し込み", icon="el-icon-shopping-cart-2")
        el-step(title="広告掲載同意書", icon="el-icon-document-checked")
        el-step(title="確認", icon="el-icon-check")

      form0(:data-vv-scope="'step0'", v-show="active === 0",
            :formFields="fields0", :formName="'caution'")
        div(slot="cautionSlot")
          cautionSlot

      form1(:data-vv-scope="'step1'", v-show="active === 1",
            :formFields="fields1", :formName="'userProfile'")
        popup-map(slot="popupMap", :address="inputAddress")
      form2(:data-vv-scope="'step2'", v-show="active === 2",
            :formFields="fields2", :formName="'shopTime'")
      form3(:data-vv-scope="'step3'", v-show="active === 3",
            :formFields="fields3", :formName="'application'")
      form4(:data-vv-scope="'step4'", v-show="active === 4",
            :formFields="fields4", :formName="'advertiseAgent'")

      .field(v-if="active === 5")
        confirmView(v-bind:dataSet="dataSet", v-bind:position="position")
        
</template>

<script>
import Vue from 'vue'
import VeeValidate, { Validator } from 'vee-validate'
import japanese from 'vee-validate/dist/locale/ja'
import { DatePicker, TimePicker, TimeSelect, Switch, Steps, Step, Dialog, Button } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import lang from 'element-ui/lib/locale/lang/ja'
import locale from 'element-ui/lib/locale'
import PhoneNumber from 'awesome-phonenumber'
import * as VueGoogleMaps from 'vue2-google-maps'

import Form from '@/components/Form'
import cautionSlot from '@/components/CautionSlot'
import popupMap from '@/components/Dialog'
import Confirm from '@/components/Confirm'

import * as v from '../assets/version'

let version = v.default
let fields0 = require(`./assets/${version}/fields-0.json`)
let fields1 = require(`./assets/${version}/fields-1.json`)
let fields2 = require(`./assets/${version}/fields-2.json`)
let fields3 = require(`./assets/${version}/fields-3.json`)
let fields4 = require(`./assets/${version}/fields-4.json`)

Vue.use(VeeValidate, { locale: 'ja' })
Validator.localize('ja', japanese)
locale.use(lang)
Vue.component(DatePicker.name, DatePicker)
Vue.component(TimePicker.name, TimePicker)
Vue.component(TimeSelect.name, TimeSelect)
Vue.component(Switch.name, Switch)
Vue.component(Steps.name, Steps)
Vue.component(Step.name, Step)
Vue.component(Dialog.name, Dialog)
Vue.component(Button.name, Button)

Vue.use(VueGoogleMaps, {
  load: {
    key: '',
    libraries: 'places' // necessary for places input
  }
})

Vue.config.productionTip = false

const phoneNumber = {
  getMessage: field => `${field}のフォーマットが正しくありません`,
  validate (value) {
    return new Promise(resolve => {
      let phone = new PhoneNumber(value, 'JP')
      resolve({ valid: phone.isValid() })
    })
  }
}
Validator.extend('phoneNumber', phoneNumber)

export default {
  name: 'app',
  components: {
    form0: Form,
    form1: Form,
    form2: Form,
    form3: Form,
    form4: Form,
    confirmView: Confirm,
    cautionSlot: cautionSlot,
    popupMap: popupMap
  },
  data: () => ({
    version: version,
    active: 0,
    fields0,
    fieldsTest,
    fields1,
    fields2,
    fields3,
    fields4,
    dataSet: [],
    formValues: {},
    position: {},
    inputAddress: ''
  }),
  mounted () {
    this.$root.$on('addressInput', data => this.event(data))
    this.$root.$on('confirmPosition', position => this.position = position)
  },
  methods: {
    event (data) {
      this.inputAddress = data
    },
    backStep () {
      this.active--
    },
    process (formValues) {
      if (this.dataSet[this.active]) {
        this.dataSet[this.active] = formValues
      } else {
        this.dataSet.push({ ...formValues })
      }

      if (this.active === 5) {
        this.active = -1
      }
      this.active++
    },
    forcesUpdate () {
      window.location.href = window.location.href
    }
  }
}
</script>

<style lang="stylus">
  @require '../node_modules/bulma/css/bulma.min.css'
  @require '../node_modules/@fortawesome/fontawesome-free/css/all.min.css'

  .labelDefaultMb
    margin-bottom .5rem
</style>
