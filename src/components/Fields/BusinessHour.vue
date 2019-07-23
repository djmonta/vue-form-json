<template lang="pug">
  .businesshour.is-fullwidth(:class="[{ 'is-danger': !!error }, item.attr && item.attr.class]")
    el-switch(:id="item.label + '_holiday' | slugify",
              :name="item.name + '_holiday' || item.label | slugify",
              :active-text="businessDayString",
              :inactive-text="holidayString",
              :active-value="false",
              :inactive-value="true"
              v-model="value.holiday",
              @change="updateHoliday")
    el-time-select(:id="item.label | slugify",
                  :name="item.name || item.label | slugify",
                  :placeholder="item.placeholder || defaultStartPlaceholder",
                  :required="item.isRequired !== false",
                  v-bind="item.attr",
                  :picker-options="hasPickerOptions ? pickerOptionsStart : undefined",
                  :class="[{ 'is-danger': !!error }, 'starttime', 'ml-5']",
                  :disabled="value.holiday ? true : false",
                  v-model="value.startTime",
                  @input="updateStartTimeValue",
                  @change="updateStartTimeValue",
                  @blur="updateStartTimeValue")
    el-time-select(:id="item.label | slugify",
                  :name="item.name || item.label | slugify",
                  :placeholder="item.placeholder || defaultEndPlaceholder",
                  :required="item.isRequired !== false",
                  v-bind="item.attr",
                  :picker-options="hasPickerOptions ? pickerOptionsEnd : undefined",
                  :class="[{ 'is-danger': !!error }, 'endtime']",
                  :disabled="value.holiday ? true : false",
                  v-model="value.endTime",
                  @input="updateEndTimeValue",
                  @change="updateEndTimeValue",
                  @blur="updateEndTimeValue")
</template>

<script>
import fieldsMixin from '@/mixins/fields'

export default {
  name: 'BusinessHour',
  mixins: [ fieldsMixin ],
  data: () => ({
    value: {
      'startTime': '',
      'endTime': '',
      'holiday': false
    }
  }),
  methods: {
    updateHoliday () {
      this.$emit('input', this.value)
    },
    updateStartTimeValue () {
      this.$emit('input', this.value)
    },
    updateEndTimeValue () {
      this.$emit('input', this.value)
    }
  },
  mounted () {
    document.getElementById(this.item.label).setAttribute('autocomplete', 'none')
    this.value.startTime = this.item.startTime || undefined
    this.value.endTime = this.item.endTime || undefined
    this.value.holiday = false
    this.$parent.value = {}
  },
  computed: {
    hasPickerOptions () {
      return !!this.item.pickerOptions
    },
    pickerOptionsStart () {
      const option = {
        start: this.item.pickerOptions.start,
        end: '24:00',
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
    },
    businessDayString () {
      return '営業日'
    },
    holidayString () {
      return '定休日'
    }
  }
}
</script>

<style lang="stylus" scoped>
  .endtime
    margin-left 1rem

  .el-switch__label
    color hsl(0, 0%, 71%)
</style>
