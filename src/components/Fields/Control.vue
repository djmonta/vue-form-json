<template lang="pug">
  .control(:class="{'has-icons-left': item.iconLeft, 'has-icons-right': shouldShowErrorIcon}")
    component(v-if="item.value",
              v-model.lazy.trim="value",
              :is="`app-${getComponent}`"
              :item="item",
              :error="fieldError",
              :data-vv-name="item.label",
              v-validate.immediate="getValidation")
    component(v-else,
              v-model.lazy.trim="value",
              :is="`app-${getComponent}`"
              :item="item",
              :error="fieldError",
              :data-vv-name="item.label",
              v-validate="getValidation")

    span.icon.is-small.is-left(v-if="item.iconLeft")
      i.fas(:class="`fa-${item.iconLeft}`")
    span.icon.is-small.is-right(v-if="shouldShowErrorIcon")
      i.fas.fa-exclamation-triangle
    p.help.is-danger(v-if="fieldError") {{ fieldError.msg }}
</template>

<script>
import Input from '@/components/Fields/Input'
import Select from '@/components/Fields/Select'
import Textarea from '@/components/Fields/Textarea'
import Checkbox from '@/components/Fields/Checkbox'
import Radio from '@/components/Fields/Radio'
import Datepicker from '@/components/Fields/DatePicker'
import Timerange from '@/components/Fields/TimeRange'
import Timepicker from '@/components/Fields/TimePicker'
import BusinessHour from '@/components/Fields/BusinessHour'

const NOT_NORMAL_INPUT = ['textarea', 'select', 'checkbox', 'radio', 'datepicker', 'timerange', 'timepicker', 'businesshour']

export default {
  name: 'Control',
  components: {
    appInput: Input,
    appSelect: Select,
    appTextarea: Textarea,
    appCheckbox: Checkbox,
    appRadio: Radio,
    appDatepicker: Datepicker,
    appTimerange: Timerange,
    appTimepicker: Timepicker,
    appBusinesshour: BusinessHour
  },
  data: () => ({
    value: undefined
  }),
  watch: {
    value (val) {
      this.$parent.formValues[this.item.label] = val
    }
  },
  computed: {
    hasIcon () {
      return this.$parent.hasIcon
    },
    shouldShowErrorIcon () {
      return this.fieldError && this.item.type !== 'select' && this.hasIcon
    },
    fieldError () {
      return this.errors.items.find(
        ({ field }) => field === this.item.label
      )
    },
    isRequired () {
      return this.item.isRequired !== false
    },
    isNormalInput () {
      return !NOT_NORMAL_INPUT.includes(this.item.type)
    },
    getComponent () {
      return this.isNormalInput ? 'input' : this.item.type
    },
    getValidation () {
      if (this.item.name === 'shop_address') {
        this.$root.$emit('addressInput', this.value)
      }
      const { type, minLength, maxLength, min, max, pattern } = this.item
      const { defaultMinLength, defaultMaxLength, defaultMin, defaultMax } = this.$parent
      const isNormalInputOrTextarea = this.isNormalInput || type === 'textarea'
      const isInputNumber = type === 'number'
      let validation = { required: this.isRequired }

      pattern
        ? validation = { ...validation, regex: new RegExp(pattern) }
        : isNormalInputOrTextarea && (validation = {
          ...validation,
          email: type === 'email',
          min: !isInputNumber ? minLength || defaultMinLength : false,
          max: !isInputNumber ? maxLength || defaultMaxLength : false,
          min_value: isInputNumber ? min || defaultMin : false,
          max_value: isInputNumber ? max || defaultMax : false
        })

      return { ...validation, ...this.item.validation }
    }
  },
  props: {
    item: {
      type: Object,
      required: true
    }
  }
}
</script>
