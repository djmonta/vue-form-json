<template lang="pug">
  .timepicker.is-fullwidth(:class="[{ 'is-danger': !!error }, item.attr && item.attr.class]")
    el-time-select(:id="item.name || item.label | slugify",
                  :name="item.name || item.label | slugify",
                  :placeholder="item.placeholder",
                  :required="item.isRequired !== false",
                  v-bind="item.attr",
                  :picker-options="hasPickerOptions ? pickerOptions : undefined",
                  :class="{ 'is-danger': !!error }",
                  v-model="value"
                  @input="updateValue",
                  @change="updateValue",
                  @blur="updateValue")
</template>

<script>
import fieldsMixin from '@/mixins/fields'

export default {
  name: 'Timepicker',
  mixins: [ fieldsMixin ],
  data: () => ({
    value: ''
  }),
  methods: {
    updateValue () {
      this.$emit('input', this.value)
    }
  },
  mounted () {
    document.getElementById(this.item.label).setAttribute('autocomplete', 'none')
    this.value = this.item.value
  },
  computed: {
    hasPickerOptions () {
      return !!this.item.pickerOptions
    },
    pickerOptions () {
      const option = {
        start: this.item.pickerOptions.start,
        end: this.item.pickerOptions.end,
        step: this.item.pickerOptions.step,
        minTime: this.item.pickerOptions.minTime,
        maxTime: this.item.pickerOptions.maxTime
      }
      return option
    }
  }
}
</script>
