<template lang="pug">
  .timerange.is-fullwidth(:class="[{ 'is-danger': !!error }, item.attr && item.attr.class]")
    el-time-select(:id="item.name || item.label | slugify",
                  :name="item.name || item.label | slugify",
                  :placeholder="item.placeholder || defaultStartPlaceholder",
                  :required="item.isRequired !== false",
                  v-bind="item.attr",
                  :picker-options="hasPickerOptions ? pickerOptionsStart : undefined",
                  :class="[{ 'is-danger': !!error }, 'starttime']",
                  v-model="value.startTime",
                  @input="updateStartTimeValue",
                  @change="updateStartTimeValue",
                  @blur="updateStartTimeValue")
    el-time-select(:id="item.name || item.label | slugify",
                  :name="item.name || item.label | slugify",
                  :placeholder="item.placeholder || defaultEndPlaceholder",
                  :required="item.isRequired !== false",
                  v-bind="item.attr",
                  :picker-options="hasPickerOptions ? pickerOptionsEnd : undefined",
                  :class="[{ 'is-danger': !!error }, 'endtime']",
                  v-model="value.endTime",
                  @input="updateEndTimeValue",
                  @change="updateEndTimeValue",
                  @blur="updateEndTimeValue")
</template>

<script>
import fieldsMixin from '@/mixins/fields'

export default {
  name: 'Timerange',
  mixins: [ fieldsMixin ],
  data: () => ({
    value: {
      startTime: '',
      endTime: ''
    }
  }),
  methods: {
    updateStartTimeValue () {
      this.$emit('input', this.value.startTime)
    },
    updateEndTimeValue () {
      this.$emit('input', this.value)
    }
  },
  mounted () {
    document.getElementById(this.item.label).setAttribute('autocomplete', 'none')
    this.value.startTime = this.item.startTime || ''
    this.value.endTime = this.item.endTime || ''
    this.$parent.value = [this.item.startTime, this.item.endTime]
  },
  computed: {
    hasPickerOptions () {
      return !!this.item.pickerOptions
    },
    pickerOptionsStart () {
      const option = {
        start: this.item.pickerOptions.start,
        end: this.item.pickerOptions.end,
        step: this.item.pickerOptions.step
      }
      return option
    },
    pickerOptionsEnd () {
      const option = {
        start: this.item.pickerOptions.start,
        end: this.item.pickerOptions.end,
        step: this.item.pickerOptions.step,
        minTime: this.value.startTime
      }
      return option
    },
    defaultStartPlaceholder () {
      return this.$parent.$parent.defaultStartPlaceholder
    },
    defaultEndPlaceholder () {
      return this.$parent.$parent.defaultEndPlaceholder
    }
  }
}
</script>

<style lang="stylus" scoped>
  .endtime
    margin-left 1rem

</style>
