<template lang="pug">
  #app.section
    app-form(:formFields="jsonFields",
             :formName="'userProfil'")
      div(slot="boxSlot")
        .box
          article
            .content
              p
                strong.has-text-info Info<br>
                | You can also use
                strong  named slot
                |  like this one
</template>

<script>
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
    appForm: Form
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
