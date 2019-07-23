<template lang="pug">
  fieldset(:data-vv-scope="formName",
       @submit.prevent="beforeSubmit")

    div(v-for="(item, index) in formFields", :key="index")
      .field-body(v-if="Array.isArray(item)")
        .field(v-for="x in item",
              :key="x.label",
              v-bind="x.field && x.field.attr")
          app-label(:item="x")
          app-control(:item="x", ref="control")

      .field(v-else-if="Object.keys(item).includes('html')",
            v-html="Object.values(item)[0]",
            v-bind="item.attr",
            data-test="htmlContentFromFormFields")

      .field(v-else-if="Object.keys(item).includes('slot')",
            v-bind="item.attr",
            data-test="slot")
        slot(:name="Object.values(item)[0]")

      .field(v-else, v-bind="item.field && item.field.attr")
        app-label(:item="item")
        app-control(:item="item", ref="control")

    p.is-size-7.fieldRequiredLegend.my-2 {{ mandatoryAsteriskLegend }}

    .field.form-footer.is-grouped.is-opposed.mt-5
      input.button(:value="btnBackText", @click="back", readonly="true", :disabled="formName === 'caution'")
      input.button.is-info(@click="process",
                              :value="btnNextText",
                              :disabled="!isFormValid", readonly="true")

</template>

<script>
import flatten from 'ramda/src/flatten'
import pickAll from 'ramda/src/pickAll'
import pipe from 'ramda/src/pipe'
import map from 'ramda/src/map'

import Label from './Fields/Label'
import Control from './Fields/Control'

const getLabels = ({ label }) => label
const valueToProp = object => pickAll(object, {})

export default {
  name: 'Form',
  components: {
    appLabel: Label,
    appControl: Control
  },
  inject: ['$validator'],
  props: {
    formFields: {
      type: Array,
      required: true
    },
    formName: {
      type: String,
      required: true
    },
    mandatoryAsteriskLegend: {
      type: String,
      default: '* 印の欄は入力必須情報です'
    },
    btnSubmitText: {
      type: String,
      default: 'Next'
    },
    btnResetText: {
      type: String,
      default: 'Reset'
    },
    btnBackText: {
      type: String,
      default: 'Back'
    },
    resetFormAfterSubmit: {
      type: Boolean,
      default: false
    },
    defaultMinLength: {
      type: [Boolean, Number],
      default: false
    },
    defaultMaxLength: {
      type: [Boolean, Number],
      default: false
    },
    defaultMin: {
      type: [Boolean, Number],
      default: 0
    },
    defaultMax: {
      type: [Boolean, Number],
      default: false
    },
    hasIcon: {
      type: Boolean,
      default: true
    },
    defaultStartPlaceholder: {
      type: String,
      default: '開始時刻'
    },
    defaultEndPlaceholder: {
      type: String,
      default: '終了時刻'
    },
    defaultFormat: {
      type: String,
      default: 'yyyy/MM/dd'
    },
    btnNextText: {
      type: String,
      default: 'Next'
    }
  },
  data: () => ({
    formValues: undefined,
    allControls: []
  }),
  created () {
    this.formValues = pipe(flatten, map(getLabels), valueToProp)(this.formFields)
  },
  mounted () {
    this.allControls = this.$refs.control
  },
  computed: {
    isFormValid () {
      const allControlRequire = this.allControls.filter(({ item }) => item.isRequired !== false)
      const isAllControlRequireWithValue = allControlRequire.every(({ value }) => !!value)
      const isFormValuesEmpty = Object.values(this.formValues).every(x => x === undefined)
      const hasError = !!this.$validator.errors.items.length
      return isAllControlRequireWithValue && !isFormValuesEmpty && !hasError
    }
  },
  methods: {
    scroll () {
      // やむなくjQuery
      $('html,body').animate({ scrollTop: 0 }, 'fast')
    },
    back () {
      this.$parent.backStep()
    },
    async process () {
      this.scroll()

      let isValidated = false
      await this.$validator.validateAll(this.formName).then(result => {
        isValidated = result
      })

      if (isValidated && this.isFormValid) {
        // console.log(this.formValues);
        this.$parent.process(this.formValues)
      }
    },
    async beforeSubmit (ev) {
      let isValidated = false
      await this.$validator.validateAll(this.formName)
        .then(result => { isValidated = result })

      isValidated && this.isFormValid && this.emitValues({
        formName: this.formName,
        values: this.formValues
      })
      isValidated && this.resetFormAfterSubmit && this.resetForm(ev)
    },
    emitValues (data) {
      this.$root.$emit('formSubmitted', data)
    },
    clearValues () {
      this.allControls.map(x => { x.value = '' })

      const subValues = this.allControls.filter(x => x.$children[0].value)
      subValues.map(x => { x.$children[0].value = [] })
    },
    clearPrefillValues () {
      const inputsPrefilled = this.allControls.filter(x => x.item.value)
      inputsPrefilled.map(x => { x.item.value = undefined })

      const selects = this.allControls.filter(x => x.item.options)
      selects.map(select => {
        select.item.options.map(option => {
          option.selected && (option.selected = false)
        })
      })
    },
    resetFormValues () {
      this.clearValues()
      this.clearPrefillValues()
    },
    resetForm (ev) {
      this.resetFormValues()
      this.errors.clear(this.formName)

      try {
        ev.target.reset()
      } catch (err) {
        // eslint-disable-next-line
        ev && ev.target.reset
      }

      this.$validator.reset()
    }
  }
}
</script>

<style lang="stylus">
  $defaultMargin = .75rem
  $formWidth = 40rem
  $bp_mobile = 496px

  fieldset
    margin 2.5rem auto
    max-width $formWidth
    text-align left

  .field
  .field-body
    margin-bottom $defaultMargin

  .field-body
    display block

    @media (min-width: $bp_mobile)
      display flex
      justify-content space-between

    .field
      width 100%

      @media (min-width: $bp_mobile)
        width ($formWidth / 2 - $defaultMargin / 2)

  .form-footer
    margin 2rem auto 3rem
    .button:not(:last-child)
      margin-right $defaultMargin

  .fieldRequiredLegend
    margin-top $defaultMargin * 2

  .field
    &.is-grouped
      &.is-opposed
        display flex
        justify-content space-between

        .control
          line-height 36px
    &.htmlContentFromFormFields
      img
        max-width 80%

  .error-title
    margin-bottom 0
</style>
