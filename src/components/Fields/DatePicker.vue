<template lang="pug">
  .block.is-fullwidth(:class="[{ 'is-danger': !!error }, item.attr && item.attr.class]")
    el-date-picker(:id="item.label | slugify",
                  :name="item.name || item.label | slugify",
                  :placeholder="item.placeholder",
                  :format="defaultFormat",
                  :value-format="defaultFormat",
                  :required="item.isRequired !== false",
                  v-bind="item.attr",
                  :default-value="hasAllowDaysAfter ? defaultValue : undefined",
                  :picker-options="hasAllowDaysAfter ? pickerOptions : undefined",
                  :class="{ 'is-danger': !!error }",
                  v-model="value",
                  @input="updateValue",
                  @change="updateValue",
                  @blur="updateValue")
</template>

<script>
import fieldsMixin from '@/mixins/fields'

export default {
  name: 'Datepicker',
  mixins: [ fieldsMixin ],
  data: () => ({
    value: '',
    allowDaysAfter: 0
  }),
  methods: {
    updateValue () {
      this.$emit('input', this.value)
    }
  },
  mounted () {
    document.getElementById(this.item.label).setAttribute('autocomplete', 'none')
    this.value = this.item.value
    this.allowDaysAfter = this.item.allowDaysAfter
  },
  computed: {
    defaultFormat () {
      return this.$parent.$parent.defaultFormat
    },
    hasAllowDaysAfter () {
      return !!this.item.allowDaysAfter
    },
    defaultAllowDaysAfter () {
      return 0
    },
    defaultValue () {
      return new Date().getTime() + this.allowDaysAfter * 3600 * 1000 * 24
    },
    pickerOptions: function () {
      const dateFlag = this.allowDaysAfter
      return {
        disabledDate (time) {
          return time.getTime() < new Date().getTime() + dateFlag * 3600 * 1000 * 24
        }
      }
    }
  }
}
</script>
